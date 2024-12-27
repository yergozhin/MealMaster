const db = require('./config');

const executeQuery = async (query, params = []) => {
    try {
        const [results] = await db.query(query, params);
        return results;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getAllRecords = async (tableName, columns) => {
    const query = `SELECT ${columns.join(', ')} FROM ${tableName}`;
    return await executeQuery(query);
};

const getRecordById = async (tableName, id) => {
    const query = `SELECT * FROM ${tableName} WHERE id = ?`;
    return await executeQuery(query, [id]);
};

const addRecord = async (tableName, data) => {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(', ');
    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    return await executeQuery(query, values);
};

const updateRecord = async (tableName, id, data) => {
    const updates = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];
    const query = `UPDATE ${tableName} SET ${updates} WHERE id = ?`;
    return await executeQuery(query, values);
};

const deleteRecord = async (tableName, id) => {
    const query = `DELETE FROM ${tableName} WHERE id = ?`;
    return await executeQuery(query, [id]);
};

module.exports = {
    getAllRecords,
    getRecordById,
    addRecord,
    updateRecord,
    deleteRecord,
    executeQuery
};