CREATE TABLE IF NOT EXISTS pizzas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT NOT NULL
);

INSERT INTO pizzas (name, description, price, image_url) VALUES
    ('Pizza Margherita', 'Tomatensauce, Mozzarella, Oregano und frisches Basilikum.', 15.00, '/images/pizza-margherita.jpg'),
    ('Pizza Salami', 'Tomatensauce, Mozzarella, Salami und Oregano.', 18.00, '/images/pizza-salami.jpg'),
    ('Pizza Prosciutto e Funghi', 'Tomatensauce, Mozzarella, Schinken, Champignons und Oregano.', 19.00, '/images/pizza-prosciutto-e-funghi.jpg'),
    ('Pizza Vegetariana', 'Tomatensauce, Mozzarella, Peperoni, Champignons, Zucchini und Oliven.', 20.00, '/images/pizza-vegetariana.jpg'),
    ('Pizza Quattro Formaggi', 'Tomatensauce, Mozzarella, Gorgonzola, Parmesan und Emmentaler.', 21.00, '/images/pizza-quattro-formaggi.jpg');

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    delivery_address TEXT NOT NULL,
    items JSONB NOT NULL,
    total_price NUMERIC(6, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Received'
        CHECK (status IN ('Received', 'Preparing', 'Delivered', 'Cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
