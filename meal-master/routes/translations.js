const express = require('express');
const { getAllRecords, getRecordById, addRecord, updateRecord, deleteRecord, executeQuery } = require('../db/crudOnDb');
const router = express.Router();
const db = require('../db/config');

router.get('/', async (req, res) => {
    try {
        const translations = await getAllRecords('translations', ['id', 'translationKey', 'languageCode', 'text']);
        res.json(translations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id) || parseInt(id) <= 0 || !Number.isInteger(Number(id))) {
        return res.status(400).json({ error: 'ID must be a positive integer.' });
    }
    try {
        const translation = await getRecordById('translations', id);
        res.json(translation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { translationKey, languageCode, text } = req.body;

    if (!translationKey || !languageCode || !text) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if (typeof translationKey !== 'string' || translationKey.trim().length < 3) {
        return res.status(400).json({ error: 'Translation key must be a string with at least 3 characters.' });
    }

    if (typeof languageCode !== 'string' || languageCode.trim().length !== 2) {
        return res.status(400).json({ error: 'Language code must be a string with exactly 2 characters.' });
    }

    if (typeof text !== 'string' || text.trim().length < 1) {
        return res.status(400).json({ error: 'Text must be a non-empty string.' });
    }

    if (languageCode !== 'en' && languageCode !== 'es') {
        return res.status(400).json({ error: 'For now we can use only english or spanish translation.' });
    }
    try {
        const mainExists = await db.query(
            'SELECT * FROM translations WHERE text = ? AND translationKey = ? LIMIT 1',
            [text, translationKey]
        );
        if (!mainExists.length) {
            const newTranslation = { translationKey, languageCode, text };
            await addRecord('translations', newTranslation);
        }
        const reverseExists = await db.query(
            'SELECT * FROM translations WHERE text = ? AND translationKey = ? LIMIT 1',
            [text, translationKey]
        );
        if (!reverseExists.length) {
            if (languageCode == 'en') {
                const reverseLang = 'es';
                const reverseTranslation = { text, reverseLang, translationKey };
                await addRecord('translations', reverseTranslation);
            } else {
                const reverseLang = 'en';
                const reverseTranslation = { text, reverseLang, translationKey };
                await addRecord('translations', reverseTranslation);
            }
        }
        res.status(201).json({ message: 'Translation added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { translationKey, languageCode, text } = req.body;

    if (!id || isNaN(id) || parseInt(id) <= 0 || !Number.isInteger(Number(id))) {
        return res.status(400).json({ error: 'ID must be a positive integer.' });
    }

    if (!translationKey || !languageCode || !text) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (typeof translationKey !== 'string' || translationKey.trim().length < 3) {
        return res.status(400).json({ error: 'Translation key must be a string with at least 3 characters.' });
    }

    if (typeof languageCode !== 'string' || languageCode.trim().length !== 2) {
        return res.status(400).json({ error: 'Language code must be a string with exactly 2 characters.' });
    }
    if (typeof text !== 'string' || text.trim().length < 1) {
        return res.status(400).json({ error: 'Text must be a non-empty string.' });
    }
    try {
        const updatedTranslation = { translationKey, languageCode, text };
        await updateRecord('translations', id, updatedTranslation);
        res.json({ message: 'Translation updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id) || parseInt(id) <= 0 || !Number.isInteger(Number(id))) {
        return res.status(400).json({ error: 'ID must be a positive integer.' });
    }
    try {
        await deleteRecord('translations', id);
        res.json({ message: 'Translation deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/translate', async (req, res) => {
    const { word, lang } = req.body;

    if (!word || typeof word !== 'string' || word.trim().length < 1) {
        return res.status(400).json({ error: 'Word must be a non-empty string.' });
    }
    const language = lang || 'en';
    if (typeof language !== 'string' || language.trim().length !== 2) {
        return res.status(400).json({ error: 'Language code must be a string with exactly 2 characters.' });
    }
    try {
        const [rows] = await db.query(
            'SELECT text FROM translations WHERE translationKey = ? AND languageCode = ?',
            [word, language]
        );
        if (rows.length === 0) {
            res.json({ translation: word });
        } else {
            res.json({ translation: rows[0].text });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;