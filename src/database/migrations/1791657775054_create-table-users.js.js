export const up = (pgm) => {
    pgm.sql(`
        CREATE TABLE users(
            id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            linkname VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            status VARCHAR(20) NOT NULL DEFAULT 'pending',
            is_super_admin BOOLEAN NOT NULL DEFAULT FALSE,
            address VARCHAR(255),
            zipcode VARCHAR(20),
            city VARCHAR(50),
            state VARCHAR(50),
            country VARCHAR(50),
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by BIGINT NOT NULL,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by BIGINT NOT NULL,

             CONSTRAINT users_linkname_tenant_domain_fk
                FOREIGN KEY (linkname)
                REFERENCES tenants(domain),

            CONSTRAINT users_linkname_email_unique
                UNIQUE (linkname, email)
        );
    `);
}

export const down = (pgm) => {
    pgm.sql(`
    DROP TABLE users;
  `);
};