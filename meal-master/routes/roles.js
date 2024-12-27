const express = require('express');
const { getAllRecords, getRecordById, addRecord, updateRecord, deleteRecord, executeQuery } = require('../db/crudOnDb');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const roles = await getAllRecords('roles', ['id', 'name']);
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const role = await getRecordById('roles', id);
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const name = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const newRole = name;
        await addRecord('roles', newRole);
        res.status(201).json({ message: 'Role added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const name = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const updatedRole = name;
        await updateRecord('roles', id, updatedRole);
        res.json({ message: 'Role updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await deleteRecord('roles', id);
        res.json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;