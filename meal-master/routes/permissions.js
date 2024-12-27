const express = require('express');
const { getAllRecords, getRecordById, addRecord, updateRecord, deleteRecord, executeQuery } = require('../db/crudOnDb');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const permissions = await getAllRecords('permissions', ['id', 'roleId', 'resource', 'action']);
        res.json(permissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { permission, role } = await getPermissionDetails(id);
        res.json({ permission, role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { roleId, resource, action } = req.body;

    if (!roleId || !resource || !action) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const newPermission = { roleId, resource, action };
        await addRecord('permissions', newPermission);
        res.status(201).json({ message: 'Permission added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { roleId, resource, action } = req.body;

    if (!roleId || !resource || !action) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const updatedPermission = { roleId, resource, action };
        await updateRecord('permissions', id, updatedPermission);
        res.json({ message: 'Permission updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await deleteRecord('permissions', id);
        res.json({ message: 'Permission deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const getPermissionDetails = async (permissionId) => {
    const permissionQuery = `SELECT * FROM permissions WHERE id = ?`;
    const permission = await executeQuery(permissionQuery, [permissionId]);

    const rolesQuery = `
        SELECT r.name
        FROM permissions p
        JOIN roles r ON p.roleId = r.id
        WHERE p.id = ?`;
    const role = await executeQuery(rolesQuery, [permissionId]);

    return { permission, role };
};

module.exports = router;