const pool = require("../../infrastructure/database/postgres.db.js");

const TABLE_NAME = 'tenants';

async function updateTenantStatus({ status, id }) {
    const whereCondition = `id = $2`;
    let setCondition = `is_active = $1`;
    const values = [true, id];
    const query = `UPDATE ${TABLE_NAME} SET ${setCondition} WHERE ${whereCondition}`;
    const result = await pool.query(
        query,
        values,
    );
    return result.rows[0];
}

async function getTenentByDomain({ domain }) {
    const tenantQuery = `SELECT * FROM ${TABLE_NAME} WHERE domain=$1;`;
    const tenantResult = await pool.query(tenantQuery, [domain]);
    return tenantResult.rows[0] ?? null;
}

module.exports = Object.freeze({
    updateTenantStatus,
    getTenentByDomain,
});