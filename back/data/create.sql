BEGIN;

DROP TABLE IF EXISTS 
    cart_lines,
    carts,
    payments,
    order_lines,
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
    label TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    last_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    phone VARCHAR(20),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role_id INT NOT NULL REFERENCES roles(role_id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
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
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE brands (
    brand_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    logo TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
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
    status TEXT CHECK (status IN ('available','preorder','out_of_stock')),
    shipping_cost NUMERIC(10,2),
    tech_characteristics JSONB,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE article_images (
    image_id SERIAL PRIMARY KEY,
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    is_main BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE article_ratings (
    rating_id SERIAL PRIMARY KEY,
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    maneuverability INT,
    power INT,
    comfort INT,
    spin INT,
    tolerance INT,
    control INT
);

CREATE TABLE promotions (
    promo_id SERIAL PRIMARY KEY,
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    name TEXT,
    description TEXT,
    discount_type TEXT,
    discount_value NUMERIC(5,2),
    start_date DATE,
    end_date DATE,
    status TEXT CHECK (status IN ('active','upcoming','expired')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_promo_per_article UNIQUE (article_id)
);

-- pour pré remplissage de promotionS
CREATE TABLE promotion (
    promo_id SERIAL PRIMARY KEY,
    name TEXT,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT CHECK (status IN ('active','upcoming','expired')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    comment TEXT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ORDERS
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    reference TEXT UNIQUE NOT NULL,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    vat_rate NUMERIC(5,2) DEFAULT 20,
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,    
    status TEXT CHECK (status IN ('paid','processing','ready','shipped', 'cancelled')),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_lines (
    order_line_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE RESTRICT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    size TEXT,
    quantity INT NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL UNIQUE REFERENCES orders(order_id) ON DELETE CASCADE,
    payment_method TEXT NOT NULL,
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- CARTS
CREATE TABLE carts (
    cart_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cart_lines (
    cart_line_id SERIAL PRIMARY KEY,
    cart_id INT NOT NULL REFERENCES carts(cart_id) ON DELETE CASCADE,
    article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- MESSAGES
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone VARCHAR(20),
    order_number VARCHAR(17),
    is_read BOOLEAN DEFAULT FALSE,
    response TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    subject TEXT CHECK (subject IN ('general', 'order', 'product', 'complaint', 'partnership', 'other')) NOT NULL,
    message TEXT NOT NULL,
    status TEXT CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')) DEFAULT 'new',
    responded_at TIMESTAMP NULL,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMIT;
