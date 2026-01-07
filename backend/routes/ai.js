import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/init.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Get aggregated inputs for analysis (admin only)
router.get('/inputs', authenticate, requireAdmin, (req, res) => {
    try {
        const { inputKey, weekIndex, limit = 100 } = req.query;
        let query = `
      SELECT ai.id, ai.input_key, ai.input_value, ai.week_index, ai.created_at,
        u.name as user_name, u.email as user_email
      FROM ai_aggregation_inputs ai
      JOIN users u ON ai.user_id = u.id WHERE 1=1
    `;
        const params = [];
        if (inputKey) { query += ' AND ai.input_key = ?'; params.push(inputKey); }
        if (weekIndex !== undefined) { query += ' AND ai.week_index = ?'; params.push(parseInt(weekIndex)); }
        query += ` ORDER BY ai.created_at DESC LIMIT ?`;
        params.push(parseInt(limit));
        const inputs = db.prepare(query).all(...params);
        res.json({ inputs });
    } catch (error) {
        console.error('Get AI inputs error:', error);
        res.status(500).json({ error: 'Failed to fetch inputs' });
    }
});

// Get input statistics (admin only)
router.get('/inputs/stats', authenticate, requireAdmin, (req, res) => {
    try {
        const byKey = db.prepare(`SELECT input_key, COUNT(*) as count FROM ai_aggregation_inputs GROUP BY input_key ORDER BY count DESC`).all();
        const byWeek = db.prepare(`SELECT week_index, COUNT(*) as count FROM ai_aggregation_inputs WHERE week_index IS NOT NULL GROUP BY week_index ORDER BY week_index`).all();
        const timeline = db.prepare(`SELECT DATE(created_at) as date, COUNT(*) as count FROM ai_aggregation_inputs GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30`).all();
        res.json({ byKey, byWeek, timeline });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch input statistics' });
    }
});

// Generate AI insight summary (admin only)
router.post('/insights', authenticate, requireAdmin, (req, res) => {
    try {
        const { title, summary, insightType, weekIndex } = req.body;
        if (!title || !summary) return res.status(400).json({ error: 'Title and summary required' });

        let countQuery = 'SELECT COUNT(*) as count FROM ai_aggregation_inputs WHERE analyzed = 0';
        const params = [];
        if (weekIndex !== undefined) { countQuery += ' AND week_index = ?'; params.push(weekIndex); }
        const inputCount = db.prepare(countQuery).get(...params).count;

        const id = uuidv4();
        db.prepare(`INSERT INTO ai_insights (id, title, summary, insight_type, week_index, input_count, generated_by) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(id, title, summary, insightType || 'weekly_summary', weekIndex, inputCount, req.user.id);

        let updateQuery = 'UPDATE ai_aggregation_inputs SET analyzed = 1 WHERE analyzed = 0';
        if (weekIndex !== undefined) { updateQuery += ' AND week_index = ?'; db.prepare(updateQuery).run(weekIndex); }
        else { db.prepare(updateQuery).run(); }

        res.status(201).json({ message: 'Insight created', id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create insight' });
    }
});

// Get saved insights (admin only)
router.get('/insights', authenticate, requireAdmin, (req, res) => {
    try {
        const { insightType, weekIndex } = req.query;
        let query = `SELECT i.*, u.name as author_name FROM ai_insights i JOIN users u ON i.generated_by = u.id WHERE 1=1`;
        const params = [];
        if (insightType) { query += ' AND i.insight_type = ?'; params.push(insightType); }
        if (weekIndex !== undefined) { query += ' AND i.week_index = ?'; params.push(parseInt(weekIndex)); }
        query += ' ORDER BY i.generated_at DESC';
        const insights = db.prepare(query).all(...params);
        res.json({ insights });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch insights' });
    }
});

// Aggregate inputs with optional OpenAI (admin only)
router.post('/aggregate', authenticate, requireAdmin, async (req, res) => {
    try {
        const { inputKey, weekIndex } = req.body;
        let query = `SELECT input_value FROM ai_aggregation_inputs WHERE input_key = ? AND analyzed = 0`;
        const params = [inputKey];
        if (weekIndex !== undefined) { query += ' AND week_index = ?'; params.push(weekIndex); }
        query += ' LIMIT 500';
        const inputs = db.prepare(query).all(...params);
        if (inputs.length === 0) return res.status(400).json({ error: 'No inputs found' });

        const inputTexts = inputs.map(i => i.input_value).filter(Boolean);
        const wordFrequency = {};
        inputTexts.forEach(text => {
            text.toLowerCase().split(/\W+/).filter(w => w.length > 4).forEach(word => {
                wordFrequency[word] = (wordFrequency[word] || 0) + 1;
            });
        });
        const topWords = Object.entries(wordFrequency).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([word, count]) => ({ word, count }));

        res.json({ summary: `Aggregated ${inputs.length} responses for "${inputKey}"`, inputCount: inputs.length, topKeywords: topWords, sampleResponses: inputTexts.slice(0, 5) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to aggregate inputs' });
    }
});

export default router;
