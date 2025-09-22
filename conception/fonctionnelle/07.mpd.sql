BEGIN;

DROP TABLE IF EXISTS 
    cart_lines,
    carts,
    order_lines,
    payments,
    orders,
    reviews,
    promotions,
    article_ratings,
    article_characteristics,
    article_images,
    articles,
    brands,
    addresses,
    users,
    roles
CASCADE;

-- ROLES

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    label TEXT NOT NULL UNIQUE
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    last_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    phone TEXT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role_id INT NOT NULL REFERENCES roles(role_id) ON DELETE RESTRICT
);

CREATE TABLE addresses (
    address_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('shipping','billing')),
    street_number TEXT,
    street_name TEXT,
    complement TEXT,
    zip_code TEXT,
    city TEXT,
    country TEXT,
    is_default BOOLEAN DEFAULT FALSE
);

CREATE TABLE brands (
    brand_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    logo TEXT
);

-- ARTICLES

CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    type TEXT,
    name TEXT NOT NULL,
    description TEXT,
    reference TEXT UNIQUE,
    brand_id INT REFERENCES brands(brand_id) ON DELETE SET NULL,
    price_ttc NUMERIC(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    status TEXT CHECK (status IN ('available','unavailable','out_of_stock')),
    shipping_cost NUMERIC(10,2)
);

CREATE TABLE article_images (
    image_id SERIAL PRIMARY KEY,
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    url TEXT NOT NULL
);

CREATE TABLE article_characteristics (
    characteristic_id SERIAL PRIMARY KEY,
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    weight TEXT,
    color TEXT,
    shape TEXT,
    foam TEXT,
    surface TEXT,
    level TEXT,
    gender TEXT
);

CREATE TABLE article_ratings (
    rating_id SERIAL PRIMARY KEY,
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    maneuverability INT,
    power INT,
    comfort INT,
    spin INT,
    forgiveness INT,
    control INT
);

CREATE TABLE promotions (
    promo_id SERIAL PRIMARY KEY,
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    label TEXT,
    discount_percent NUMERIC(5,2),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    status TEXT CHECK (status IN ('active','upcoming','expired'))
);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    comment TEXT,
    rating INT CHECK (rating BETWEEN 1 AND 5)
);

-- ORDERS

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    reference TEXT UNIQUE NOT NULL,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vat_rate NUMERIC(5,2) DEFAULT 20,
    status TEXT CHECK (status IN ('pending','paid','cancelled','shipped'))
);

CREATE TABLE order_lines (
    order_line_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0)
);

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL UNIQUE REFERENCES orders(order_id) ON DELETE CASCADE,
    payment_method TEXT NOT NULL,
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CARTS

CREATE TABLE carts (
    cart_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE cart_lines (
    cart_line_id SERIAL PRIMARY KEY,
    cart_id INT NOT NULL REFERENCES carts(cart_id) ON DELETE CASCADE,
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0)
);

COMMIT;
