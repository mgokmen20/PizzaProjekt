const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL connection error:', error);
});

app.use(cors());

app.get('/api/pizzas', async (request, response) => {
  try {
    const result = await pool.query('SELECT * FROM pizzas ORDER BY id ASC;');
    response.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch pizzas:', error);
    response.status(500).json({ error: 'Failed to fetch pizzas.' });
  }
});

app.listen(port, () => {
  console.log(`Backend API is running on port ${port}.`);
});
