const { Pool } = require('pg');

class Database {
    constructor() {
        if (!Database.instance) {
            this.pool = new Pool({
                user: 'postgres',
                host: 'localhost',
                database: 'turnos',
                password: '1234',
                port: 5432, // Puerto predeterminado de PostgreSQL
            });
            Database.instance = this;
        }
        return Database.instance;
    }

    async query(sql, params) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(sql, params);
            return result.rows;
        } catch (err) {
            console.error('Error ejecutando la consulta:', err);
            throw err;
        } finally {
            client.release();
        }
    }
    async testConnection() {
        try {
            const result = await this.query('SELECT 1');
            console.log('Conexión exitosa:', result);
            return true;
        } catch (err) {
            console.error('Error al probar la conexión:', err);
            return false;
        }
    }
}

const instance = new Database();
Object.freeze(instance); // Evita que la instancia sea modificada

module.exports = instance;