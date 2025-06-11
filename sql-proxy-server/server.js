const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3001; // Using a different port to avoid conflicts with mdbook

// Middleware
// Allow all origins for simplicity. 
// In a production environment, you should restrict this to your book's domain.
app.use(cors()); 
app.use(express.json());

// PostgreSQL connection pool.
// Connection details are taken from your request.
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5551,
    ssl: {
        rejectUnauthorized: false // Equivalent to sslmode=disable. Use with caution.
    }
});

// Endpoint to execute SQL queries
app.post('/api/sql', async (req, res) => {
    const { sql } = req.body;

    if (!sql) {
        return res.status(400).json({ error: 'SQL query is missing.' });
    }

    try {
        const result = await pool.query(sql);
        // The pg driver returns a result object.
        // result.rows is an array of data objects.
        // result.fields contains metadata about columns (like names).
        res.json({
            columns: result.fields.map(field => field.name),
            rows: result.rows,
        });
    } catch (err) {
        console.error('Error executing query:', err);
        // Send a structured error message to the frontend.
        res.status(500).json({
            error: err.message,
            details: {
                code: err.code,
                position: err.position,
            }
        });
    }
});

app.listen(port, () => {
    console.log(`SQL Proxy Server listening at http://localhost:${port}`);
    console.log('Ready to accept POST requests at /api/sql');
}); 