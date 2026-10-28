const pool = require("../../infrastructure/database/postgres.db.js");

const USERS_TABLE_NAME = 'users';
const TENANTS_TABLE_NAME = 'tenants';

async function createTenantAndUser({ domain, name, email, status, is_super_admin, address, zipcode, city, state, country }) {
    const client = await pool.connect(); // getting temp pool connection only for this transaction. as they need same session.
    try {
        await client.query("BEGIN"); // starting of transaction
        const tenantQuery = `INSERT INTO ${TENANTS_TABLE_NAME} (domain, is_active) VALUES ($1, $2) RETURNING id, domain, is_active, created_at;`;
        const tenantResult = await client.query(tenantQuery, [domain, false]);
        const tenant = tenantResult.rows[0];
        const userQuery = `
            INSERT INTO ${USERS_TABLE_NAME} (linkname, name, email, status, is_super_admin,
             address, zipcode, city, state, country, created_by, updated_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11)
            RETURNING
                id, linkname, name, email, status, address, zipcode, city, state, country, created_at, updated_at;
        `;
        const userResult = await client.query(userQuery, [domain, name, email, status, is_super_admin, address ?? null,
            zipcode ?? null, city ?? null, state ?? null, country ?? null, 0,
        ]);
        await client.query("COMMIT"); // on successful completion of transaction we commit it in DB.
        return {
            tenant,
            user: userResult.rows[0],
        };
    } catch (error) {
        await client.query("ROLLBACK"); // it any error accurred at any stage rollback and start again.
        throw error;
    } finally {
        client.release(); // releasing the pool connection and making it available for other queries.
    }
}

async function getTenentByDomain({ domain }) {
    const tenantQuery = `SELECT * FROM ${TENANTS_TABLE_NAME} WHERE domain=$1;`;
    const tenantResult = await pool.query(tenantQuery, [domain]);
    return tenantResult.rows[0] ?? null;
}

async function updateUserStatus({ status, id }) {
    const whereCondition = `id = $2`;
    let setCondition = `status = $1`;
    const values = [status, id];
    const query = `UPDATE ${USERS_TABLE_NAME} SET ${setCondition} WHERE ${whereCondition}`;
    const result = await pool.query(
        query,
        values,
    );
    return result.rows[0];
}

async function getUserByDomain({ domain, email }) {
    let whereClause = `linkname=$1`;
    const values = [domain];
    if (email) {
        whereClause += ` AND email=$2`;
        values.push(email);
    }
    const tenantQuery = `SELECT * FROM ${USERS_TABLE_NAME} WHERE ${whereClause};`;
    const tenantResult = await pool.query(tenantQuery, values);
    return tenantResult.rows[0] ?? null;
}

async function getUserById({ id, linkname }) {
    const query = `
        SELECT
            id,
            linkname,
            name,
            email,
            status,
            is_super_admin,
            address,
            zipcode,
            city,
            state,
            country,
            created_at,
            updated_at
        FROM ${USERS_TABLE_NAME}
        WHERE id = $1 AND linkname = $2;
    `;

    const result = await pool.query(query, [id, linkname]);

    return result.rows[0] ?? null;
}


async function updateUser({
    id,
    linkname,
    updatedBy,
    ...fields
}) {
    const allowedFields = {
        name: "name",
        address: "address",
        zipcode: "zipcode",
        city: "city",
        state: "state",
        country: "country",
    };

    const setClauses = [];
    const values = [];

    for (const [field, value] of Object.entries(fields)) {
        if (Object.hasOwn(allowedFields, field)) {
            values.push(value);
            setClauses.push(
                `${allowedFields[field]} = $${values.length}`
            );
        }
    }

    if (setClauses.length === 0) {
        const error = new Error("No valid fields provided for update");
        error.statusCode = 400;
        throw error;
    }

    values.push(updatedBy);
    setClauses.push(`updated_by = $${values.length}`);

    setClauses.push("updated_at = CURRENT_TIMESTAMP");

    values.push(id);
    const idPlaceholder = values.length;

    values.push(linkname);
    const linknamePlaceholder = values.length;

    const query = `
        UPDATE ${USERS_TABLE_NAME}
        SET ${setClauses.join(", ")}
        WHERE id = $${idPlaceholder}
          AND linkname = $${linknamePlaceholder}
        RETURNING
            id, linkname, name, email, status,
            is_super_admin, address, zipcode, city,
            state, country, created_at, updated_at;
    `;

    const result = await pool.query(query, values);

    return result.rows[0] ?? null;
}


async function deleteUser({ id, linkname }) {
    const query = `
        DELETE FROM ${USERS_TABLE_NAME}
        WHERE id = $1
          AND linkname = $2
        RETURNING id, linkname, name, email;
    `;

    const result = await pool.query(query, [id, linkname]);

    return result.rows[0] ?? null;
}


async function createUser({
    linkname,
    name,
    email,
    address,
    zipcode,
    city,
    state,
    country,
    createdBy,
}) {
    const query = `
        INSERT INTO users (
            linkname,
            name,
            email,
            status,
            is_super_admin,
            address,
            zipcode,
            city,
            state,
            country,
            created_by,
            updated_by
        )
        VALUES (
            $1, $2, $3, 'pending', FALSE,
            $4, $5, $6, $7, $8, $9, $9
        )
        RETURNING *;
    `;

    const values = [
        linkname,
        name,
        email,
        address ?? null,
        zipcode ?? null,
        city ?? null,
        state ?? null,
        country ?? null,
        createdBy,
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
}




module.exports = Object.freeze({
    createTenantAndUser,
    getTenentByDomain,
    updateUserStatus,
    getUserByDomain,
    getUserById,
    updateUser,
    deleteUser,
});
