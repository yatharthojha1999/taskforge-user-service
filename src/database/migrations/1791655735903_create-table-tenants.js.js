export const up = (pgm) => {
    pgm.sql(`
    CREATE TABLE tenants (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      domain VARCHAR(255) NOT NULL UNIQUE,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const down = (pgm) => {
    pgm.sql(`
    DROP TABLE tenants;
  `);
};