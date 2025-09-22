BEGIN;

-- ROLES
INSERT INTO roles (role_id, label) VALUES
(1, 'admin'),
(2, 'client');

-- USERS
INSERT INTO users (user_id, last_name, first_name, phone, email, password, role_id) VALUES
(1, 'Pierre', 'Thibaut', '0601000000', 'thibaut.pierre@example.com', 'hashedpassword1', 2),
(2, 'Dupont', 'Alice', '0602000000', 'alice.dupont@example.com', 'hashedpassword2', 2),
(3, 'Martin', 'Paul', '0603000000', 'paul.martin@example.com', 'hashedpassword3', 1);

-- ADDRESSES
INSERT INTO addresses (address_id, user_id, type, street_number, street_name, complement, zip_code, city, country, is_default) VALUES
(1, 1, 'shipping', '50', 'avenue de Delahaye', '', '37802', 'Bruneau', 'France', TRUE),
(2, 1, 'billing', '15', 'rue des Lilas', 'Appartement 4B', '75012', 'Paris', 'France', FALSE),
(3, 2, 'shipping', '10', 'rue de la Gare', '', '69001', 'Lyon', 'France', TRUE);

-- BRANDS
INSERT INTO brands (brand_id, name, logo) VALUES
(1, 'Babolat', '/brands/babolat.svg'),
(2, 'Wilson', '/brands/wilson.svg');

-- ARTICLES
INSERT INTO articles (article_id, type, name, description, reference, brand_id, price_ttc, stock_quantity, status, shipping_cost) VALUES
(1, 'racket', 'Babolat Pure Aero Rafa', 'Professional tennis racket designed with Rafael Nadal', 'PA-RAFA-2024', 1, 277.57, 157, 'available', 3.84),
(2, 'racket', 'Wilson Blade 98', 'Blade 98 racket for advanced players', 'WB-98-2024', 2, 249.99, 200, 'available', 4.50);

-- ARTICLE CHARACTERISTICS
INSERT INTO article_characteristics (characteristic_id, article_id, weight, color, shape, foam, surface, level, gender) VALUES
(1, 1, '106g', 'Medium Purple', 'diamond', 'EVA hard', 'carbon', 'advanced', 'unisex'),
(2, 2, '305g', 'Black/Green', 'rectangle', 'EVA soft', 'carbon', 'intermediate', 'unisex');

-- ARTICLE RATINGS
INSERT INTO article_ratings (rating_id, article_id, maneuverability, power, comfort, spin, forgiveness, control) VALUES
(1, 1, 6, 2, 6, 9, 5, 9),
(2, 2, 7, 5, 7, 6, 6, 8);

-- REVIEWS
INSERT INTO reviews (review_id, article_id, user_id, comment, rating) VALUES
(1, 1, 1, 'Excellent control and precision for advanced players.', 5),
(2, 2, 2, 'Good racket for intermediate players.', 4);

-- PROMOTIONS
INSERT INTO promotions (promo_id, article_id, label, discount_percent, start_date, end_date, status) VALUES
(1, 1, 'Summer Sale', 15, '2025-06-01', '2025-06-30', 'active');

-- ORDERS
INSERT INTO orders (order_id, reference, user_id, created_at, vat_rate, status) VALUES
(1, 'CMD-2025-0001', 1, '2025-01-05 10:30:00', 20, 'pending');

INSERT INTO order_lines (order_line_id, order_id, article_id, quantity) VALUES
(1, 1, 1, 1),
(2, 1, 2, 2);

INSERT INTO payments (payment_id, order_id, payment_method, paid_at) VALUES
(1, 1, 'Bank Transfer', '2025-01-05 11:00:00');

-- CARTS
INSERT INTO carts (cart_id, user_id) VALUES
(1, 2);

INSERT INTO cart_lines (cart_line_id, cart_id, article_id, quantity) VALUES
(1, 1, 1, 3),
(2, 1, 2, 1);

COMMIT;
