const express = require('express');
const { getAllRecords, getRecordById, addRecord, updateRecord, deleteRecord, executeQuery } = require('../db/crudOnDb');
const router = express.Router();

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

    try {
        const newTranslation = { translationKey, languageCode, text };
        await addRecord('translations', newTranslation);
        res.status(201).json({ message: 'Translation added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { translationKey, languageCode, text } = req.body;

    if (!translationKey || !languageCode || !text) {
        return res.status(400).json({ error: 'Missing required fields' });
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

    try {
        await deleteRecord('translations', id);
        res.json({ message: 'Translation deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;