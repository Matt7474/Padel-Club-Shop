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
(1, 'Babolat', '/uploads/1758788398194-104430331.svg'),
(2, 'Black Crown', '/uploads/1758788492175-608532080.svg'),
(3, 'Bullpadel', '/uploads/1758792413739-727727601.svg'),
(4, 'Cork', '/uploads/1758790519831-339248359.svg'),
(5, 'Head', '/uploads/1758790541801-478573725.svg'),
(6, 'Nox', '/uploads/1758790550263-221428642.svg'),
(7, 'Oxdog', '/uploads/1758790648944-644975055.svg'),
(8, 'Starvie', '/uploads/1758790665510-298929789.svg'),
(9, 'Tecnifibre', '/uploads/1758789033640-302168640.svg'),
(10, 'Wilson', '/uploads/1758788451323-577782163.svg');



-- ARTICLES
INSERT INTO articles (article_id, type, name, description, reference, brand_id, price_ttc, stock_quantity, status, shipping_cost) VALUES
(1, 'racket', 'BABOLAT AIR VERON 2025', 'Raquette de padel Babolat Air Veron 2025 avec une forme en goutte d''eau et un équilibre uniforme avec le Carbon Flex et les plans 3D Spin pour frapper la balle avec des effets, de la puissance et de la précision.', '115740-P', 1, 240, 8, 'available', 9.99),
(2, 'racket', 'BULLPADEL INDIGA PWR 2024', 'Bullpadel Indiga Pwr 2024, raquette de padel en diamant pour joueurs débutants ou occasionnels. Raquette padel diamant au toucher doux.', '32437-P', 3, 79.95, 12, 'available', 9.99);

-- ARTICLES IMAGES
INSERT INTO article_images (article_id, url, created_at, updated_at)
VALUES
  (1, '/uploads/1758790983087-931480952.webp', NOW(), NOW()),
  (1, '/uploads/1758790983086-50298030.webp', NOW(), NOW()),
  (1, '/uploads/1758790983086-451548494.webp', NOW(), NOW()),
  (1, '/uploads/1758790983085-42889195.webp', NOW(), NOW()),
  (1, '/uploads/1758790983085-218437368.webp', NOW(), NOW()),

  (2, '/uploads/1758793256223-543504207.webp', NOW(), NOW()),
  (2, '/uploads/1758793256223-631774720.webp', NOW(), NOW()),
  (2, '/uploads/1758793256223-586930899.webp', NOW(), NOW()),
  (2, '/uploads/1758793256223-310619342.webp', NOW(), NOW()),
  (2, '/uploads/1758793256223-586930899.webp', NOW(), NOW()),
  (2, '/uploads/1758793256222-298638441.webp', NOW(), NOW()),
  (2, '/uploads/1758793256222-294483690.webp', NOW(), NOW());

-- ARTICLE CHARACTERISTICS
INSERT INTO article_characteristics (characteristic_id, article_id, weight, color, shape, foam, surface, level, gender) VALUES
(1, 1, '106g', 'Medium Purple', 'diamond', 'EVA hard', 'carbon', 'advanced', 'unisex'),
(2, 2, '305g', 'Black/Green', 'rectangle', 'EVA soft', 'carbon', 'intermediate', 'unisex');

-- ARTICLE RATINGS
INSERT INTO article_ratings (rating_id, article_id, maneuverability, power, comfort, spin, tolerance, control) VALUES
(1, 1, 6, 2, 6, 9, 5, 9),
(2, 2, 7, 5, 7, 6, 6, 8);

-- REVIEWS
INSERT INTO reviews (review_id, article_id, user_id, comment, rating) VALUES
(1, 1, 1, 'Excellent control and precision for advanced players.', 5),
(2, 2, 2, 'Good racket for intermediate players.', 4);

-- PROMOTIONS
INSERT INTO promotions (promo_id, article_id, name, description, discount_type, discount_value, start_date, end_date, status) VALUES
(1, 1, 'Summer Sale', 'sous reserve de blablabla', 'amount', 15, '2025-06-01', '2025-12-30', 'active');

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

-- À exécuter après votre seed pour réinitialiser toutes les séquences
SELECT setval('roles_role_id_seq', (SELECT MAX(role_id) FROM roles));
SELECT setval('users_user_id_seq', (SELECT MAX(user_id) FROM users));
SELECT setval('addresses_address_id_seq', (SELECT MAX(address_id) FROM addresses));
SELECT setval('brands_brand_id_seq', (SELECT MAX(brand_id) FROM brands));
SELECT setval('articles_article_id_seq', (SELECT MAX(article_id) FROM articles));
SELECT setval('article_images_image_id_seq', (SELECT MAX(image_id) FROM article_images));
SELECT setval('article_characteristics_characteristic_id_seq', (SELECT MAX(characteristic_id) FROM article_characteristics));
SELECT setval('article_ratings_rating_id_seq', (SELECT MAX(rating_id) FROM article_ratings));
SELECT setval('promotions_promo_id_seq', (SELECT MAX(promo_id) FROM promotions));
SELECT setval('reviews_review_id_seq', (SELECT MAX(review_id) FROM reviews));
SELECT setval('orders_order_id_seq', (SELECT MAX(order_id) FROM orders));
SELECT setval('order_lines_order_line_id_seq', (SELECT MAX(order_line_id) FROM order_lines));
SELECT setval('payments_payment_id_seq', (SELECT MAX(payment_id) FROM payments));
SELECT setval('carts_cart_id_seq', (SELECT MAX(cart_id) FROM carts));
SELECT setval('cart_lines_cart_line_id_seq', (SELECT MAX(cart_line_id) FROM cart_lines));