const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
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

function requireAdminKey(request, response, next) {
  const configuredKey = process.env.ADMIN_SECRET_KEY;
  const providedKey = request.get('x-admin-key');

  if (!configuredKey || !providedKey) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  const configuredKeyBuffer = Buffer.from(configuredKey);
  const providedKeyBuffer = Buffer.from(providedKey);
  const keysMatch = configuredKeyBuffer.length === providedKeyBuffer.length
    && crypto.timingSafeEqual(configuredKeyBuffer, providedKeyBuffer);

  if (!keysMatch) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  return next();
}

function parsePizzaInput(body = {}) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const imageUrl = typeof body.image_url === 'string' ? body.image_url.trim() : '';
  const price = Number(body.price);

  if (!name || !description || !imageUrl || !Number.isFinite(price) || price < 0) {
    return null;
  }

  return {
    name,
    description,
    imageUrl,
    price,
  };
}

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

app.get('/api/admin/orders', requireAdminKey, async (request, response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC, id DESC;',
    );

    return response.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return response.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

app.patch('/api/admin/orders/:id', requireAdminKey, async (request, response) => {
  const allowedStatuses = ['Received', 'Preparing', 'Delivered', 'Cancelled'];
  const orderId = Number.parseInt(request.params.id, 10);
  const { status } = request.body || {};

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return response.status(400).json({ error: 'Invalid order ID' });
  }

  if (!allowedStatuses.includes(status)) {
    return response.status(400).json({ error: 'Invalid order status' });
  }

  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *;',
      [status, orderId],
    );

    if (result.rows.length === 0) {
      return response.status(404).json({ error: 'Order not found' });
    }

    return response.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to update order status:', error);
    return response.status(500).json({ error: 'Failed to update order status.' });
  }
});

app.delete('/api/admin/orders/:id', requireAdminKey, async (request, response) => {
  const orderId = Number.parseInt(request.params.id, 10);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return response.status(400).json({ error: 'Invalid order ID' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM orders WHERE id = $1 RETURNING id;',
      [orderId],
    );

    if (result.rows.length === 0) {
      return response.status(404).json({ error: 'Order not found' });
    }

    return response.json({ deleted_order_id: result.rows[0].id });
  } catch (error) {
    console.error('Failed to delete order:', error);
    return response.status(500).json({ error: 'Failed to delete order.' });
  }
});

app.delete('/api/admin/orders', requireAdminKey, async (request, response) => {
  try {
    const result = await pool.query('DELETE FROM orders;');
    return response.json({ deleted_count: result.rowCount });
  } catch (error) {
    console.error('Failed to delete all orders:', error);
    return response.status(500).json({ error: 'Failed to delete all orders.' });
  }
});

app.get('/api/admin/pizzas', requireAdminKey, async (request, response) => {
  try {
    const result = await pool.query('SELECT * FROM pizzas ORDER BY id ASC;');
    return response.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch pizzas:', error);
    return response.status(500).json({ error: 'Failed to fetch pizzas.' });
  }
});

app.post('/api/admin/pizzas', requireAdminKey, async (request, response) => {
  const pizza = parsePizzaInput(request.body);

  if (!pizza) {
    return response.status(400).json({ error: 'Invalid pizza data' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO pizzas (name, description, price, image_url)
       VALUES ($1, $2, $3, $4) RETURNING *;`,
      [pizza.name, pizza.description, pizza.price, pizza.imageUrl],
    );

    return response.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Failed to create pizza:', error);
    return response.status(500).json({ error: 'Failed to create pizza.' });
  }
});

app.patch('/api/admin/pizzas/:id', requireAdminKey, async (request, response) => {
  const pizzaId = Number.parseInt(request.params.id, 10);
  const pizza = parsePizzaInput(request.body);

  if (!Number.isInteger(pizzaId) || pizzaId <= 0) {
    return response.status(400).json({ error: 'Invalid pizza ID' });
  }

  if (!pizza) {
    return response.status(400).json({ error: 'Invalid pizza data' });
  }

  try {
    const result = await pool.query(
      `UPDATE pizzas
       SET name = $1, description = $2, price = $3, image_url = $4
       WHERE id = $5
       RETURNING *;`,
      [pizza.name, pizza.description, pizza.price, pizza.imageUrl, pizzaId],
    );

    if (result.rows.length === 0) {
      return response.status(404).json({ error: 'Pizza not found' });
    }

    return response.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to update pizza:', error);
    return response.status(500).json({ error: 'Failed to update pizza.' });
  }
});

app.delete('/api/admin/pizzas/:id', requireAdminKey, async (request, response) => {
  const pizzaId = Number.parseInt(request.params.id, 10);

  if (!Number.isInteger(pizzaId) || pizzaId <= 0) {
    return response.status(400).json({ error: 'Invalid pizza ID' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM pizzas WHERE id = $1 RETURNING id;',
      [pizzaId],
    );

    if (result.rows.length === 0) {
      return response.status(404).json({ error: 'Pizza not found' });
    }

    return response.json({ deleted_pizza_id: result.rows[0].id });
  } catch (error) {
    console.error('Failed to delete pizza:', error);
    return response.status(500).json({ error: 'Failed to delete pizza.' });
  }
});

app.listen(port, () => {
  console.log(`Backend API is running on port ${port}.`);
});
