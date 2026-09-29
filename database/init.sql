CREATE TABLE IF NOT EXISTS pizzas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT NOT NULL
);

INSERT INTO pizzas (name, price, image_url) VALUES
    ('Margherita', 14.90, 'https://example.com/images/margherita.jpg'),
    ('Prosciutto', 18.50, 'https://example.com/images/prosciutto.jpg'),
    ('Quattro Formaggi', 19.90, 'https://example.com/images/quattro-formaggi.jpg'),
    ('Diavola', 20.50, 'https://example.com/images/diavola.jpg');
