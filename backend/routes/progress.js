import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/init.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Get current user's progress
router.get('/me', authenticate, (req, res) => {
    try {
        const progress = db.prepare(`
      SELECT week_index, step_index, completed, completed_at
      FROM user_progress WHERE user_id = ? ORDER BY week_index, step_index
    `).all(req.user.id);

        const inputs = db.prepare(`
      SELECT input_key, input_value, updated_at
      FROM user_inputs WHERE user_id = ?
    `).all(req.user.id);

        const checklists = db.prepare(`
      SELECT step_id, item_key, checked, checked_at
      FROM checklist_progress WHERE user_id = ?
    `).all(req.user.id);

        // Calculate overall progress
        const completedSteps = progress.filter(p => p.completed).length;

        res.json({
            progress,
            inputs: inputs.reduce((acc, i) => ({ ...acc, [i.input_key]: i.input_value }), {}),
            checklists,
            completedSteps
        });
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
});

// Update step completion
router.post('/step', authenticate, (req, res) => {
    try {
        const { weekIndex, stepIndex, completed } = req.body;

        if (weekIndex === undefined || stepIndex === undefined) {
            return res.status(400).json({ error: 'Week and step index required' });
        }

        const id = uuidv4();
        const completedAt = completed ? new Date().toISOString() : null;

        db.prepare(`
      INSERT INTO user_progress (id, user_id, week_index, step_index, completed, completed_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, week_index, step_index) DO UPDATE SET
        completed = excluded.completed,
        completed_at = excluded.completed_at
    `).run(id, req.user.id, weekIndex, stepIndex, completed ? 1 : 0, completedAt);

        res.json({ message: 'Progress updated' });
    } catch (error) {
        console.error('Update progress error:', error);
        res.status(500).json({ error: 'Failed to update progress' });
    }
});

// Save user input
router.post('/input', authenticate, (req, res) => {
    try {
        const { key, value } = req.body;

        if (!key) {
            return res.status(400).json({ error: 'Input key required' });
        }

        const id = uuidv4();

        db.prepare(`
      INSERT INTO user_inputs (id, user_id, input_key, input_value)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, input_key) DO UPDATE SET
        input_value = excluded.input_value,
        updated_at = CURRENT_TIMESTAMP
    `).run(id, req.user.id, key, value || '');

        // Also save to AI aggregation for admin analysis
        db.prepare(`
      INSERT INTO ai_aggregation_inputs (id, user_id, input_key, input_value)
      VALUES (?, ?, ?, ?)
    `).run(uuidv4(), req.user.id, key, value || '');

        res.json({ message: 'Input saved' });
    } catch (error) {
        console.error('Save input error:', error);
        res.status(500).json({ error: 'Failed to save input' });
    }
});

// Save checklist item
router.post('/checklist', authenticate, (req, res) => {
    try {
        const { stepId, itemKey, checked } = req.body;

        if (!stepId || !itemKey) {
            return res.status(400).json({ error: 'Step ID and item key required' });
        }

        const id = uuidv4();
        const checkedAt = checked ? new Date().toISOString() : null;

        db.prepare(`
      INSERT INTO checklist_progress (id, user_id, step_id, item_key, checked, checked_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, step_id, item_key) DO UPDATE SET
        checked = excluded.checked,
        checked_at = excluded.checked_at
    `).run(id, req.user.id, stepId, itemKey, checked ? 1 : 0, checkedAt);

        res.json({ message: 'Checklist updated' });
    } catch (error) {
        console.error('Save checklist error:', error);
        res.status(500).json({ error: 'Failed to update checklist' });
    }
});

// Get all users' progress (admin only)
router.get('/all', authenticate, requireAdmin, (req, res) => {
    try {
        const { weekIndex, cohort } = req.query;

        let query = `
      SELECT 
        u.id, u.name, u.email, u.cohort, u.role,
        COUNT(DISTINCT CASE WHEN up.completed = 1 THEN up.week_index || '-' || up.step_index END) as completed_steps,
        MAX(up.completed_at) as last_activity
      FROM users u
      LEFT JOIN user_progress up ON u.id = up.user_id
      WHERE u.role != 'admin'
    `;

        const params = [];

        if (cohort) {
            query += ' AND u.cohort = ?';
            params.push(cohort);
        }

        query += ' GROUP BY u.id ORDER BY completed_steps DESC, last_activity DESC';

        const usersProgress = db.prepare(query).all(...params);

        res.json({ usersProgress });
    } catch (error) {
        console.error('Get all progress error:', error);
        res.status(500).json({ error: 'Failed to fetch progress data' });
    }
});

// Get week completion stats (admin only)
router.get('/stats/weeks', authenticate, requireAdmin, (req, res) => {
    try {
        const weekStats = db.prepare(`
      SELECT 
        week_index,
        COUNT(DISTINCT user_id) as users_started,
        SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as steps_completed
      FROM user_progress
      GROUP BY week_index
      ORDER BY week_index
    `).all();

        res.json({ weekStats });
    } catch (error) {
        console.error('Get week stats error:', error);
        res.status(500).json({ error: 'Failed to fetch week statistics' });
    }
});

export default router;
