const express = require('express');
const { getAllRecords, getRecordById, addRecord, updateRecord, deleteRecord, executeQuery } = require('../db/crudOnDb');
const router = express.Router();
const db = require('../db/config');

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

    if (!id || isNaN(id) || parseInt(id) <= 0 || !Number.isInteger(Number(id))) {
        return res.status(400).json({ error: "ID must be a positive integer." });
    }

    try {
        const user = await getRecordById('users', id);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { name, email, passwordHash, roleId } = req.body;

    if (!name || !email || !passwordHash) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    let newRoleId = 3;
    if(roleId){
        newRoleId = roleId;
    }
    if (typeof name !== 'string' || name.trim().length < 3) {
        return res.status(400).json({ error: 'Name must be a string with at least 3 characters.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== 'string' || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }
    if (typeof passwordHash !== 'string' || passwordHash.trim().length < 6) {
        return res.status(400).json({ error: 'Password hash must be a string with at least 6 characters.' });
    }
    if (isNaN(newRoleId) || parseInt(newRoleId) <= 0 || !Number.isInteger(Number(newRoleId))) {
        return res.status(400).json({ error: 'Role ID must be a positive integer.' });
    }
    
    if(newRoleId !== 1 && newRoleId !== 2 && newRoleId !== 3){
        newRoleId = 3;
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

    if (!id || isNaN(id) || parseInt(id) <= 0 || !Number.isInteger(Number(id))) {
        return res.status(400).json({ error: 'ID must be a positive integer.' });
    }

    if (!name || typeof name !== 'string' || name.trim().length < 3) {
        return res.status(400).json({ error: 'Name must be a string with at least 3 characters.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (!passwordHash || typeof passwordHash !== 'string' || passwordHash.trim().length < 6) {
        return res.status(400).json({ error: 'Password hash must be a string with at least 6 characters.' });
    }

    if (roleId && (isNaN(roleId) || parseInt(roleId) <= 0 || !Number.isInteger(Number(roleId)))) {
        return res.status(400).json({ error: 'Role ID must be a positive integer.' });
    }

    try {
        const updatedUser = {
            name,
            email,
            passwordHash,
            roleId: roleId || 3 
        };

        await updateRecord('users', id, updatedUser);
        res.json({ message: 'User updated successfully' });
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
        const deleteRecipesQuery = 'DELETE FROM recipes WHERE userId = ?';
        await db.query(deleteRecipesQuery, [id]);
        await deleteRecord('users', id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;