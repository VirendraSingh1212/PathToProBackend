import { Pool } from 'pg';
import env from '../config/env';

/**
 * PostgreSQL connection pool for direct SQL queries
 * Used for progress tracking and other custom queries
 */
export const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test connection on startup
pool.on('connect', () => {
    console.log('✅ Database pool connected');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected database pool error:', err);
    process.exit(-1);
});

export default pool;
