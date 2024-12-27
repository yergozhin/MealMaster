const express = require('express');
const { getAllRecords, getRecordById, addRecord, updateRecord, deleteRecord, executeQuery } = require('../db/crudOnDb');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await getAllRecords('users', ['id', 'name', 'email', 'roleId']);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getRecordById('users', id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { name, email, passwordHash, roleId } = req.body;

    if (!name || !email || !passwordHash || !roleId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const newUser = { name, email, passwordHash, roleId };
        await addRecord('users', newUser);
        res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, passwordHash, roleId } = req.body;

    if (!name || !email || !passwordHash || !roleId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const updatedUser = { name, email, passwordHash, roleId };
        await updateRecord('users', id, updatedUser);
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await deleteRecord('users', id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;