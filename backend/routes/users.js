import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/init.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Get all users (admin only)
router.get('/', authenticate, requireAdmin, (req, res) => {
    try {
        const { role, cohort, search } = req.query;

        let query = 'SELECT id, email, name, role, cohort, avatar_url, enrolled_at, completed_at, last_login, created_at FROM users WHERE 1=1';
        const params = [];

        if (role) {
            query += ' AND role = ?';
            params.push(role);
        }

        if (cohort) {
            query += ' AND cohort = ?';
            params.push(cohort);
        }

        if (search) {
            query += ' AND (name LIKE ? OR email LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY created_at DESC';

        const users = db.prepare(query).all(...params);

        res.json({ users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get user by ID (admin only)
router.get('/:id', authenticate, requireAdmin, (req, res) => {
    try {
        const user = db.prepare(`
      SELECT id, email, name, role, cohort, avatar_url, enrolled_at, completed_at, last_login, created_at
      FROM users WHERE id = ?
    `).get(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get user's progress
        const progress = db.prepare(`
      SELECT week_index, step_index, completed, completed_at
      FROM user_progress WHERE user_id = ?
      ORDER BY week_index, step_index
    `).all(req.params.id);

        // Get user's inputs
        const inputs = db.prepare(`
      SELECT input_key, input_value, updated_at
      FROM user_inputs WHERE user_id = ?
    `).all(req.params.id);

        res.json({ user, progress, inputs });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Create user (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
    try {
        const { email, password, name, role, cohort } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password, and name are required' });
        }

        const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        const validRole = ['admin', 'active_student', 'completed_student'].includes(role) ? role : 'active_student';

        db.prepare(`
      INSERT INTO users (id, email, password_hash, name, role, cohort)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, email, passwordHash, name, validRole, cohort || null);

        res.status(201).json({
            message: 'User created',
            user: { id: userId, email, name, role: validRole, cohort }
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Update user role (admin only)
router.put('/:id/role', authenticate, requireAdmin, (req, res) => {
    try {
        const { role } = req.body;

        if (!['admin', 'active_student', 'completed_student'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const user = db.prepare('SELECT id FROM users WHERE id = ?').get(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const completedAt = role === 'completed_student' ? new Date().toISOString() : null;

        db.prepare(`
      UPDATE users SET role = ?, completed_at = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(role, completedAt, req.params.id);

        res.json({ message: 'User role updated' });
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({ error: 'Failed to update role' });
    }
});

// Delete user (admin only)
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
    try {
        const user = db.prepare('SELECT id, role FROM users WHERE id = ?').get(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prevent deleting yourself
        if (user.id === req.user.id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);

        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Get user statistics (admin only)
router.get('/stats/overview', authenticate, requireAdmin, (req, res) => {
    try {
        const stats = {
            totalUsers: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
            admins: db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").get().count,
            activeStudents: db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'active_student'").get().count,
            completedStudents: db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'completed_student'").get().count,
            recentLogins: db.prepare(`
        SELECT COUNT(*) as count FROM users 
        WHERE last_login > datetime('now', '-7 days')
      `).get().count
        };

        // Get cohort breakdown
        const cohorts = db.prepare(`
      SELECT cohort, COUNT(*) as count FROM users 
      WHERE cohort IS NOT NULL 
      GROUP BY cohort ORDER BY cohort DESC
    `).all();

        res.json({ stats, cohorts });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

export default router;
