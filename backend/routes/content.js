import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/init.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Get content release schedule
router.get('/schedule', authenticate, (req, res) => {
    try {
        const schedule = db.prepare(`
      SELECT week_index, release_date, is_released, released_by, updated_at
      FROM content_schedule ORDER BY week_index
    `).all();

        res.json({ schedule });
    } catch (error) {
        console.error('Get schedule error:', error);
        res.status(500).json({ error: 'Failed to fetch schedule' });
    }
});

// Set/update content release schedule (admin only)
router.post('/schedule', authenticate, requireAdmin, (req, res) => {
    try {
        const { weekIndex, releaseDate } = req.body;

        if (weekIndex === undefined || !releaseDate) {
            return res.status(400).json({ error: 'Week index and release date required' });
        }

        const id = uuidv4();

        db.prepare(`
      INSERT INTO content_schedule (id, week_index, release_date)
      VALUES (?, ?, ?)
      ON CONFLICT(week_index) DO UPDATE SET
        release_date = excluded.release_date,
        updated_at = CURRENT_TIMESTAMP
    `).run(id, weekIndex, releaseDate);

        res.json({ message: 'Schedule updated' });
    } catch (error) {
        console.error('Update schedule error:', error);
        res.status(500).json({ error: 'Failed to update schedule' });
    }
});

// Set up weekly release schedule for all 12 weeks (admin only)
router.post('/schedule/bulk', authenticate, requireAdmin, (req, res) => {
    try {
        const { startDate, intervalDays = 7 } = req.body;

        if (!startDate) {
            return res.status(400).json({ error: 'Start date required' });
        }

        const insertStmt = db.prepare(`
      INSERT INTO content_schedule (id, week_index, release_date)
      VALUES (?, ?, ?)
      ON CONFLICT(week_index) DO UPDATE SET
        release_date = excluded.release_date,
        updated_at = CURRENT_TIMESTAMP
    `);

        const start = new Date(startDate);

        db.transaction(() => {
            for (let week = 0; week < 12; week++) {
                const releaseDate = new Date(start);
                releaseDate.setDate(releaseDate.getDate() + (week * intervalDays));
                insertStmt.run(uuidv4(), week, releaseDate.toISOString());
            }
        })();

        res.json({ message: 'Bulk schedule created for 12 weeks' });
    } catch (error) {
        console.error('Bulk schedule error:', error);
        res.status(500).json({ error: 'Failed to create bulk schedule' });
    }
});

// Release a week immediately (admin only)
router.post('/release/:weekIndex', authenticate, requireAdmin, (req, res) => {
    try {
        const weekIndex = parseInt(req.params.weekIndex);

        // Update as released
        db.prepare(`
      INSERT INTO content_schedule (id, week_index, release_date, is_released, released_by)
      VALUES (?, ?, CURRENT_TIMESTAMP, 1, ?)
      ON CONFLICT(week_index) DO UPDATE SET
        is_released = 1,
        released_by = excluded.released_by,
        updated_at = CURRENT_TIMESTAMP
    `).run(uuidv4(), weekIndex, req.user.id);

        res.json({ message: `Week ${weekIndex + 1} has been released` });
    } catch (error) {
        console.error('Release week error:', error);
        res.status(500).json({ error: 'Failed to release week' });
    }
});

// Get which weeks are available for current user
router.get('/available', authenticate, (req, res) => {
    try {
        const now = new Date().toISOString();

        // For admin, all weeks are available
        if (req.user.role === 'admin') {
            const allWeeks = Array.from({ length: 12 }, (_, i) => ({
                weekIndex: i,
                available: true,
                releasedAt: null
            }));
            return res.json({ availableWeeks: allWeeks });
        }

        // For students, check the schedule
        const schedule = db.prepare(`
      SELECT week_index, release_date, is_released
      FROM content_schedule
      WHERE is_released = 1 OR release_date <= ?
      ORDER BY week_index
    `).all(now);

        const availableWeeks = schedule.map(s => ({
            weekIndex: s.week_index,
            available: true,
            releasedAt: s.release_date
        }));

        // Week 0 is always available
        if (!availableWeeks.find(w => w.weekIndex === 0)) {
            availableWeeks.unshift({ weekIndex: 0, available: true, releasedAt: null });
        }

        res.json({ availableWeeks });
    } catch (error) {
        console.error('Get available weeks error:', error);
        res.status(500).json({ error: 'Failed to fetch available weeks' });
    }
});

// Add custom content (admin only)
router.post('/custom', authenticate, requireAdmin, (req, res) => {
    try {
        const { title, content, weekIndex, contentType, isPublished } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content required' });
        }

        const id = uuidv4();
        const publishedAt = isPublished ? new Date().toISOString() : null;

        db.prepare(`
      INSERT INTO custom_content (id, title, content, week_index, content_type, is_published, published_at, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, content, weekIndex, contentType || 'announcement', isPublished ? 1 : 0, publishedAt, req.user.id);

        res.status(201).json({ message: 'Content created', id });
    } catch (error) {
        console.error('Create content error:', error);
        res.status(500).json({ error: 'Failed to create content' });
    }
});

// Get custom content
router.get('/custom', authenticate, (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin';

        let query = `
      SELECT c.*, u.name as author_name
      FROM custom_content c
      JOIN users u ON c.created_by = u.id
    `;

        if (!isAdmin) {
            query += ' WHERE c.is_published = 1';
        }

        query += ' ORDER BY c.created_at DESC';

        const content = db.prepare(query).all();

        res.json({ content });
    } catch (error) {
        console.error('Get custom content error:', error);
        res.status(500).json({ error: 'Failed to fetch content' });
    }
});

// Update custom content (admin only)
router.put('/custom/:id', authenticate, requireAdmin, (req, res) => {
    try {
        const { title, content, weekIndex, contentType, isPublished } = req.body;

        const existing = db.prepare('SELECT id FROM custom_content WHERE id = ?').get(req.params.id);
        if (!existing) {
            return res.status(404).json({ error: 'Content not found' });
        }

        const publishedAt = isPublished ? new Date().toISOString() : null;

        db.prepare(`
      UPDATE custom_content 
      SET title = ?, content = ?, week_index = ?, content_type = ?, 
          is_published = ?, published_at = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, content, weekIndex, contentType, isPublished ? 1 : 0, publishedAt, req.params.id);

        res.json({ message: 'Content updated' });
    } catch (error) {
        console.error('Update content error:', error);
        res.status(500).json({ error: 'Failed to update content' });
    }
});

// Delete custom content (admin only)
router.delete('/custom/:id', authenticate, requireAdmin, (req, res) => {
    try {
        db.prepare('DELETE FROM custom_content WHERE id = ?').run(req.params.id);
        res.json({ message: 'Content deleted' });
    } catch (error) {
        console.error('Delete content error:', error);
        res.status(500).json({ error: 'Failed to delete content' });
    }
});

export default router;
