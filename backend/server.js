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
app.use(express.json());

app.get('/api/pizzas', async (request, response) => {
  try {
    const result = await pool.query('SELECT * FROM pizzas ORDER BY id ASC;');
    response.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch pizzas:', error);
    response.status(500).json({ error: 'Failed to fetch pizzas.' });
  }
});

app.post('/api/orders', async (request, response) => {
  const {
    customer_name: customerName,
    delivery_address: deliveryAddress,
    items,
    total_price: totalPrice,
  } = request.body;

  if (!customerName || !deliveryAddress || !items || totalPrice === undefined || totalPrice === null) {
    return response.status(400).json({ error: 'Missing required fields' });
  }

  let parsedItems = items;

  if (typeof items === 'string') {
    try {
      parsedItems = JSON.parse(items);
    } catch (error) {
      return response.status(400).json({ error: 'Invalid items JSON' });
    }
  }

  try {
    const result = await pool.query(
      `INSERT INTO orders (customer_name, delivery_address, items, total_price)
       VALUES ($1, $2, $3, $4) RETURNING *;`,
      [customerName, deliveryAddress, JSON.stringify(parsedItems), totalPrice],
    );

    return response.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Failed to create order:', error);
    return response.status(500).json({ error: 'Failed to create order.' });
  }
});

app.listen(port, () => {
  console.log(`Backend API is running on port ${port}.`);
});
