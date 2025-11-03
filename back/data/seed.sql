BEGIN;

-- ROLES
INSERT INTO roles (role_id, label) VALUES
(1, 'super admin'),
(2, 'admin'),
(3, 'client');

-- USERS
INSERT INTO users (user_id, last_name, first_name, phone, email, password, role_id) VALUES
(1, 'DIMIER', 'Matthieu', '06.12.34.56.78', 'dimier.matt.dev@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$pB8YSq9atfPP+MANKgZJMw$NZQpoodO9GpTHZka7rvGkynhpRaMaRK+wZPkdSJjaHU', 1), -- Pa$$w0rd!
(2, 'DELAUNAY', 'Amaury', '06.12.34.56.78', 'amaury.delaunay@example.com', '$argon2id$v=19$m=65536,t=3,p=4$gGT/tj4XK/mbVtSL0oroyQ$EB5PNFHRiI/Jz2Zn5OA2Sy54+69zr2Tvvh6Q95+IlHo', 3),
(3, 'ROUSSELIN','Sébastien', '06.12.34.56.78', 'sebastien.rousselin@example.com', '$argon2id$v=19$m=65536,t=3,p=4$GDMpyYJEMBYBbbNtw0DC7g$YnkaPRtKpCZ3RY6zgMj7qjt4lj3uLBfcp9rgGeHG5Lo', 3),
(4, 'KESSLER', 'Yannick', '06.12.34.56.78', 'yannick.kessler@example.com', '$argon2id$v=19$m=65536,t=3,p=4$TtPQEo+BVWzFTfFYZgCzdg$ALMAIE45Uu0kRQpYkc4pq52LjBkX3dzloqDkbyhNcp0', 3),
(5, 'GIRAUDY', 'Solène', '06.12.34.56.78', 'solene.giraudy@example.com', '$argon2id$v=19$m=65536,t=3,p=4$kCs98RMXOFrHp7jLI/lpQA$4/k2YZIbAn7ahntl7FqBOShJs6/mPGIYVNtQwTnhX4Y', 3),
(6, 'NOLLET', 'Laurent', '06.12.34.56.78', 'laurent.nollet@example.com', '$argon2id$v=19$m=65536,t=3,p=4$FOJUDOamNJwhFW65S5sImg$Uth1Km8mdYJ55mjqrdpOahekGTsPwqa+osC+lnZhgGo', 3),
(7, 'GARNIER', 'Mathieu', '06.12.34.56.78', 'mathieu.garnier@example.com', '$argon2id$v=19$m=65536,t=3,p=4$KUgZH9mQVkW+QGenDhAR8g$SZmdZ+Fdgm3EhRKoSLzsuCqjffLgRjizWyyIptAC2FU', 3),
(8, 'RAVEL', 'Tom', '06.12.34.56.78', 'tom.ravel@example.com', '$argon2id$v=19$m=65536,t=3,p=4$IOS08D3lOf5nNvRQFg9sRg$zWZfAu/QPyMl0M/t65jabc92BsI5VineU2/cOjw1Gdc', 3),
(9, 'MERVILLE', 'Charly', '06.12.34.56.78', 'charly.merville@example.com', '$argon2id$v=19$m=65536,t=3,p=4$VjtYPwJa1kXzTG7C6tk/Rw$Pt4a4UjUntZA+e2sECP+n7QgHw/VkWjPRVXi7vuIP7w', 3),
(10, 'STARK', 'Tony', '06.12.34.56.78', 'tony.stark@example.com', '$argon2id$v=19$m=65536,t=3,p=4$885lkUnDGOF0W9SBbgLrkA$DJO7y9/ATU0WXYI94fPUtZUWl2n6qiWAXqP7HP7SqvQ', 2);

-- ADDRESSES
INSERT INTO addresses (address_id, user_id, type, street_number, street_name, complement, zip_code, city, country, is_default) VALUES
(1, 1, 'shipping', '50', 'avenue des balles jaunes', '', '77777', 'Padel City', 'France', TRUE),
(2, 2, 'shipping', '15', 'Rue de Rivoli', '', '75001', 'Paris', 'France', TRUE), 
(3, 3, 'shipping', '8', 'Rue Saint-Georges', '', '35000', 'Rennes', 'France', TRUE), 
(4, 4, 'shipping', '27', 'Avenue de la Forêt-Noire', '', '67100', 'Strasbourg', 'France', TRUE), 
(5, 5, 'shipping', '12', 'Promenade des Anglais', '', '06000', 'Nice', 'France', TRUE), 
(6, 6, 'shipping', '5', 'Chemin des Montagnes', 'Résidence Alpina', '74300', 'Chamonix', 'France', TRUE), 
(7, 7, 'shipping', '42', 'Rue des ecoles', '', '13001', 'Marseille', 'France', TRUE), 
(8, 8, 'shipping', '19', 'Route des Sommets', '', '05200', 'Briançon', 'France', TRUE), 
(9, 9, 'shipping', '3', 'Rue de la Monnaie', '', '59000', 'Lille', 'France', TRUE), 
(10, 10, 'shipping', '108', 'Stark Tower Avenue', 'Apt 42', '75008', 'Paris', 'France', TRUE);

-- BRANDS
INSERT INTO brands (brand_id, name, logo) VALUES
(1, 'Adidas', '/uploads/Adidas.svg'), 
(2, 'Babolat', '/uploads/Babolat.svg'),  
(3, 'Black Crown', '/uploads/Black-Crown.svg'),  
(4, 'Bullpadel', '/uploads/Bullpadel.svg'), 
(5, 'Cork', '/uploads/Cork.svg'),  
(6, 'Head', '/uploads/Head.svg'), 
(7, 'Nike', '/uploads/Nike.svg'),
(8, 'Nox', '/uploads/Nox.svg'), 
(9, 'Oxdog', '/uploads/Oxdog.svg'),  
(10, 'Puma', '/uploads/Puma.svg'), 
(11, 'Starvie', '/uploads/Starvie.svg'), 
(12, 'Tecnifibre', '/uploads/Tecnifibre.svg'), 
(13, 'Wilson', '/uploads/Wilson.svg');

-- ARTICLES
INSERT INTO articles (article_id, type, name, description, reference, brand_id, price_ttc, stock_quantity, status, shipping_cost, tech_characteristics, created_at) VALUES

(1, 'racket', 'Babolat Air Veron 2025', 'La raquette de padel « Babolat Air Veron 2025 » incarne l’équilibre parfait entre puissance explosive et maniabilité raffinée. Dotée d’une forme goutte d’eau/diamant avec équilibre haut, elle est conçue pour les joueurs intermédiaires à avancés qui cherchent à dominer le jeu. Elle embarque la technologie X-EVA (mousse à double densité pour un amorti et un retour optimal), la surface Carbon Flex qui combine fibre de verre et carbone pour optimiser puissance + confort, ainsi que la finition rugueuse 3D Spin+ pour maximiser les effets. Le cadre Vibrasorb System Powered by SMAC atténue les vibrations pour soulager les bras lors des échanges intensifs. Son design noir/bleu évoque légèreté et agressivité. Parfaite pour monter au filet ou frapper fort depuis la base.', 'REF-498351', 2, 289.90, 8, 'available', 9.99, '{"weight":"355","color":"Noir / Bleu","shape":"diamond","foam":"X-EVA medium","surface":"Carbone / Fibre de verre","level":"intermediate","gender":"unisex"}', '2025-09-12'),

(2, 'racket', 'Bullpadel Indiga PWR 2024', 'La « Bullpadel Indiga PWR 2024 » est une raquette très orientée puissance pour joueurs débutants à intermédiaires qui souhaitent progresser rapidement. Grâce à sa forme diamant et un équilibre haut, elle facilite les frappes explosives. Le noyau est en Soft EVA pour un toucher doux tandis que la face en Polyglass renforce la tolérance et la maniabilité. Le cadre CarbonTube assure une structure réactive. Avec un poids situé entre 360-370 g et profil 38 mm, cette raquette combine puissance et confort. Idéale pour jouer avec agressivité sans sacrifier le plaisir de jeu.', 'REF-278372', 4, 34.95, 25, 'available', 9.99, '{"foam": "Soft EVA", "color": "Rouge", "level": "beginner", "shape": "diamond", "gender": "unisex", "weight": "365", "surface": "Polyglass"}', '2025-10-05'),

(3, 'racket', 'Babolat Technical Viper 2025', 'Découvrez la raquette de padel Babolat Technical Viper 2025, conçue pour les joueurs avancés qui exigent puissance et précision. Sa forme goutte d’eau (diamond) combinée à un équilibre “tête lourde” offre un sweet-spot optimisé pour les smashs et frappes puissantes. Elle intègre les technologies 3D Spin+ pour des effets explosifs, X-EVA pour amorti et tolérance, et surface 12k carbone pour rigidité maximale. Le design noir/rouge fumé lui donne un look haut de gamme tandis que sa construction rappelle l’expertise de Babolat dans le monde du padel. Parfaite pour dominer les échanges.','REF-496586', 2, 239.90, 7, 'available', 9.99, '{"weight":"365","color":"Noir / Rouge","shape":"diamond","foam":"X-EVA hard","surface":"12K carbon","level":"advanced","gender":"unisex"}','2025-09-15'),

(4, 'racket', 'Adidas Adipower CTRL MTW 3.4 Pro 2025', 'La raquette Adidas Adipower CTRL MTW 3.4 Pro 2025 est une édition premium pensée pour les joueurs qui exigent un contrôle absolu. Signée du champion Álex Ruiz, elle arbore une forme ronde qui centralise le poids près du manche pour une maniabilité accrue lors des phases défensives et volées fines. Le cadre en carbone 3K associé à la technologie Dual Exoskeleton renforce la structure, tandis que la mousse EVA High Memory offre une excellente restitution d’énergie et un amorti confortable dans les échanges rapides. Le système Weight & Balance (MTW = Multi-Weight) permet d’ajuster le poids et l’équilibre selon vos préférences : privilégiez la précision ou la frappe. Avec ses faces texturées Spin Blade Decal et son design bleu signature, cette raquette allie élégance, performance et technicité. Convient particulièrement aux joueurs avancés ou experts qui placent le contrôle et l’effet au premier plan.', 'REF-274872', 1, 319.90, 3, 'available', 9.99, '{"foam": "EVA High Memory", "color": "Rouge foncé", "level": "advanced", "shape": "teardrop", "gender": "unisex", "weight": "360 - 370", "surface": "Carbon 3K"}', '2025-11-03'),

(5, 'racket', 'Nox AT10 Genius 18K 2025', 'La « Nox AT10 Genius 18K Alum 2025 » est la raquette signature d’Agustín Tapia, conçue pour offrir une combinaison parfaite entre puissance et contrôle. Sa surface en carbone aluminisé 18K garantit une frappe explosive et une grande précision, tandis que le noyau HR3 Core (mousse haute densité) assure un excellent rebond et un confort supérieur. Sa forme hybride (entre rond et goutte d’eau) optimise la maniabilité et la tolérance, idéale pour les joueurs offensifs exigeants. Le système AVS réduit les vibrations pour plus de confort articulaire. Son design noir/rouge métallisé avec finition mate inspire élégance et performance.', 'REF-583427', 8, 329.90, 10, 'available', 9.99, '{"weight":"365","color":"Noir / Gris","shape":"hybrid","foam":"HR3 Core","surface":"Carbone 18K aluminisé","level":"advanced","gender":"unisex"}', '2025-09-12'),

(6,'bag', 'StarVie Padel Bag Luxury Silver 2025', 'Le sac de padel « StarVie Luxury Silver 2025 » offre un design élégant et une grande capacité pour transporter tout votre équipement. Fabriqué à partir de matériaux résistants et imperméables, il dispose de plusieurs compartiments pour vos raquettes, chaussures et effets personnels. Son compartiment principal spacieux est accompagné de deux poches latérales thermo-isolées pour protéger les raquettes des variations de température. Le sac comprend également une poche ventilée pour les chaussures et des bretelles rembourrées pour un port confortable. Idéal pour les joueurs réguliers recherchant style, confort et praticité.', 'REF-146245', 11, 69.90, 54, 'available', 6.99, '{"type":"Thermo Bag","color":"Noir / Argent","volume":"45 L","weight":"950 g","material":"Polyester + PVC renforcé","dimensions":"60 x 30 x 35 cm","compartment":"2 latéraux thermo, 1 central, 1 chaussures"}', '2025-10-12'),

(7, 'bag', 'Puma Nova Elite Noir', 'Le sac « Puma Nova Elite Noir » combine style, robustesse et praticité pour les joueurs de padel exigeants. Conçu avec des matériaux premium et une finition soignée, il offre une excellente capacité de rangement pour transporter vos raquettes, vos chaussures et vos accessoires. Son grand compartiment principal est complété par deux poches latérales thermo-isolées pour protéger les raquettes de la chaleur et du froid. Une poche ventilée est dédiée aux chaussures, tandis que les bretelles ergonomiques et le dos matelassé garantissent un confort optimal lors du transport. Son design noir mat et orange vif reflète parfaitement la performance et l’énergie de la marque Puma.', 'REF-871675', 10, 51.99, 34, 'available', 5.99, '{"type":"Thermo Bag","color":"Noir / Orange","volume":"42 L","weight":"900 g","material":"Polyester 600D + renfort PVC","dimensions":"58 x 30 x 32 cm","compartment":"2 latéraux thermo, 1 central, 1 chaussures ventilé"}', '2025-09-21'),

(8, 'bag', 'Nox AT10 Team Gris 2024', 'Le sac de padel « Nox AT10 Team Gris 2024 » est le modèle officiel d’Agustín Tapia, pensé pour les joueurs à la recherche d’un équilibre parfait entre espace, confort et élégance. Ce sac au design moderne et sobre gris/vert offre une grande capacité de rangement avec un compartiment principal spacieux, deux compartiments thermo-isolés pour protéger les raquettes des variations de température, et une poche indépendante ventilée pour les chaussures. Sa structure rigide garantit une meilleure durabilité, tandis que ses bretelles ergonomiques et son dos rembourré assurent un transport confortable même lors des déplacements prolongés. Résistant, pratique et stylé, le Nox AT10 Team est le choix idéal des joueurs réguliers et compétiteurs.', 'REF-150455', 8, 45.90, 37, 'available', 5.99, '{"type":"Thermo Bag","color":"Gris / Vert","volume":"42 L","weight":"950 g","material":"Polyester haute résistance + renfort thermo","dimensions":"60 x 30 x 35 cm","compartment":"2 compartiments thermo, 1 central, 1 chaussures ventilé, 1 poche accessoires"}','2025-11-01'),

(9, 'ball', 'Head Padel Pro+', 'Les balles de padel « Head Padel Pro+ » sont le choix officiel de nombreux tournois professionnels, dont le World Padel Tour. Reconnues pour leur durabilité et leur constance, elles offrent un excellent équilibre entre vitesse, contrôle et confort de jeu. Grâce à une pression interne optimisée et un feutre premium plus dense, elles conservent leurs performances plus longtemps, même sur les surfaces abrasives. Idéales pour les joueurs exigeants et les compétiteurs qui recherchent une trajectoire stable, un rebond régulier et un toucher précis. Livrées en tube pressurisé de 3 balles, elles garantissent une expérience de jeu haut de gamme à chaque échange.', 'REF-368995', 6, 5.50, 77, 'available', 3.99, '{"type":"Balles pressurisées","color":"Jaune vif","weight":"58 g (±0.5 g)","rebound":"135 – 145 cm","diameter":"6.8 cm","material":"Caoutchouc naturel + feutre premium","pressure":"10 – 12 psi"}', '2025-09-08'),

(10, 'ball', 'Tecnifibre Tour', 'Les balles de padel « Tecnifibre Tour » offrent un excellent compromis entre durabilité et performance. Conçues pour les joueurs intermédiaires et confirmés, elles assurent un rebond constant et un toucher précis grâce à leur feutre haute densité et leur pression optimale. Idéales pour l’entraînement et les matchs, elles garantissent des échanges fluides et une trajectoire stable à chaque impact.', 'REF-123487', 12, 5.95, 22, 'available', 3.99, '{"type":"Balles pressurisées","color":"Jaune vif","weight":"57 – 59 g","rebound":"135 – 145 cm","diameter":"6.7 cm","material":"Caoutchouc naturel + feutre dense","pressure":"10 – 12 psi"}', '2025-09-08'),

(11, 'ball', 'Wilson Pack X3 Tubes Premiere Padel', 'Pack de 3 tubes de balles de padel Wilson Premiere Padel, conçues pour un usage régulier et intensif. Ces balles offrent un toucher agréable et un rebond homogène, parfaites pour les joueurs débutants à avancés. Le feutre de haute qualité et la pression calibrée garantissent une excellente performance, une durée de vie prolongée et des échanges fiables sur toutes les surfaces.', 'REF-190029', 13, 14.95, 37, 'available', 3.99, '{"type":"Balles pressurisées","color":"Jaune vif","weight":"58 g","rebound":"135 – 145 cm","diameter":"6.8 cm","material":"Caoutchouc naturel + feutre premium","pressure":"10 – 12 psi"}', '2025-09-08'),

(12, 'clothing', 'Head Robe Spirit', 'La jupe de padel « Head Robe Spirit » allie confort, élégance et performance. Conçue spécialement pour les joueuses exigeantes, elle est fabriquée dans un tissu extensible et respirant pour garantir une liberté de mouvement totale sur le court. Sa ceinture élastique offre un maintien parfait sans comprimer, tandis que son shorty intégré assure confort et couverture optimale. Idéale pour les entraînements comme pour la compétition, cette robe combine style sportif et finition haut de gamme. Son design bleu marine sobre et raffiné s’accorde facilement avec toute tenue Head.', 'REF-878527', 6, 69.90, 1, 'available', 4.99, '{"fit":"XS:12,S:18,M:8,L:5,XL:3,2XL:0,3XL:0,4XL:0","type":"robe","color":"Bleu marine","gender":"woman","material":"Polyester 92% / Élasthanne 8% respirant"}', '2025-09-23'),

(13, 'clothing', 'Adidas Club Pleat', 'La jupe de padel « Adidas Club Pleat » associe légèreté, respirabilité et élégance. Conçue pour les joueuses recherchant à la fois performance et style, elle est dotée d’un tissu en polyester recyclé AEROREADY qui évacue efficacement la transpiration pour rester au sec pendant l’effort. Sa coupe plissée classique offre une grande liberté de mouvement, tandis que le shorty intégré assure confort et confiance sur le court. Parfaite pour les matchs comme pour l’entraînement, cette jupe blanche au design intemporel s’accorde facilement avec tout haut Adidas.', 'REF-575980', 1, 42.90, 1, 'available', 4.99, '{"fit":"XS:8,S:14,M:20,L:12,XL:6,2XL:3,3XL:0,4XL:0","type":"skirt","color":"Blanc","gender":"woman","material":"Polyester recyclé AEROREADY / Élasthanne"}', '2025-09-29'),

(14, 'clothing', 'Babolat Padel Jupe 2025', 'La jupe de padel « Babolat Padel Jupe 2025 » combine féminité, technicité et confort. Conçue pour les joueuses dynamiques, elle est fabriquée en tissu léger et extensible 360 Motion pour accompagner parfaitement tous les déplacements sur le court. La technologie FiberDry de Babolat assure une excellente évacuation de l’humidité et un séchage rapide, même lors des matchs les plus intenses. Le shorty intégré procure maintien et liberté de mouvement, tandis que la taille élastique garantit un ajustement optimal. Avec sa couleur rose vive et son design moderne, cette jupe allie performance et style pour briller sur le terrain.', 'REF-367300', 2, 32.90, 1, 'available', 4.99, '{"fit":"XS:27,S:18,M:29,L:12,XL:9,2XL:2,3XL:0,4XL:0","type":"skirt","color":"Rose","gender":"woman","material":"Tissu 360 Motion / Technologie FiberDry (Polyester 92% - Élasthanne 8%)"}', '2025-10-06'),

(15, 'clothing', 'Tecnifibre Team', 'Le short « Tecnifibre Team » est conçu pour les joueurs recherchant confort, performance et liberté de mouvement sur le court. Fabriqué en polyester léger et respirant, il intègre la technologie DryFiber qui favorise une évacuation rapide de la transpiration pour rester au sec durant tout l’effort. Sa coupe ergonomique et son tissu extensible garantissent une aisance totale dans les déplacements latéraux et les courses rapides. La taille élastique avec cordon de serrage assure un maintien parfait, tandis que les poches latérales profondes permettent de garder facilement les balles. Son design rouge vif, sobre et sportif, en fait un choix idéal pour les compétitions ou les entraînements intensifs.', 'REF-12935', 12, 29.90, 1, 'available', 4.99, '{"fit":"XS:3,S:5,M:31,L:49,XL:19,2XL:15,3XL:7,4XL:7","type":"short","color":"Rouge","gender":"men","material":"Polyester 100% avec technologie DryFiber respirante"}', '2025-10-06'),

(16, 'clothing', 'Bullpadel Replica Brea Brete', 'Le t-shirt « Bullpadel Replica Brea Brete » est le modèle porté par la joueuse professionnelle Delfi Brea sur le circuit World Padel Tour. Conçu pour offrir performance et style, il associe un tissu en polyester technique à séchage rapide et des zones micro-perforées pour une meilleure respirabilité. Sa coupe ajustée met en valeur la silhouette tout en garantissant une liberté de mouvement optimale. Léger, extensible et doux au toucher, il intègre la technologie QuickDry qui évacue efficacement la transpiration pendant les échanges les plus intenses. Son design noir élégant avec des détails contrastés apporte une touche de modernité et de puissance à votre tenue de jeu.', 'REF-523729', 4, 54.90, 1, 'available', 4.99, '{"fit":"XS:31,S:45,M:42,L:27,XL:14,2XL:11,3XL:0,4XL:0","type":"t-shirt","color":"Noir","gender":"woman","material":"Polyester 92% / Élasthanne 8% avec technologie QuickDry respirante"}', '2025-10-30'),

(17, 'clothing', 'Adidas Club Tee Climacool', 'Le t-shirt « Adidas Club Tee Climacool » est conçu pour les joueuses de padel recherchant confort et performance. Fabriqué en tissu léger et respirant, il intègre la technologie AEROREADY qui évacue efficacement la transpiration pour rester au sec tout au long du match. Sa coupe féminine légèrement cintrée assure une grande liberté de mouvement, tandis que ses empiècements en mesh sous les bras favorisent une meilleure ventilation. Idéal pour les entraînements comme pour la compétition, ce modèle allie style et technicité avec son coloris rose dynamique et ses finitions sportives typiques d’Adidas.', 'REF-809006', 1, 35.90, 1, 'available', 4.99, '{"fit":"XS:37,S:44,M:39,L:28,XL:21,2XL:3,3XL:0,4XL:0","type":"t-shirt","color":"Rose","gender":"woman","material":"Polyester 100% recyclé avec technologie AEROREADY et inserts en mesh respirant"}', '2025-10-30'),

(18, 'clothing', 'Adidas Club Tee', 'Le t-shirt « Adidas Club Tee » allie confort, respirabilité et style pour les joueuses de padel. Conçu avec la technologie AEROREADY, il évacue efficacement la transpiration pour rester au sec pendant les entraînements et les matchs. Sa coupe féminine et légèrement cintrée assure une liberté de mouvement optimale, tandis que les empiècements en mesh sur les côtés et au dos améliorent la ventilation. Polyvalent et élégant, il se porte facilement avec d’autres vêtements Adidas pour un look sportif complet.', 'REF-241658', 1, 44.50, 1, 'available', 4.99, '{"fit":"XS:48,S:73,M:45,L:35,XL:22,2XL:12,3XL:3,4XL:0","type":"t-shirt","color":"Blanc","gender":"woman","material":"Polyester 100% recyclé avec technologie AEROREADY et inserts en mesh respirant"}', '2025-10-30'),

(19, 'clothing', 'Tecnifibre Team Tech Tee', 'Le t-shirt « Tecnifibre Team Tech Tee » est conçu pour les joueurs exigeants qui recherchent performance et confort sur le court. Fabriqué en polyester léger et respirant avec zones de ventilation stratégiques, il évacue efficacement la transpiration et assure une grande liberté de mouvement grâce à sa coupe ergonomique. Idéal pour l’entraînement quotidien et les matchs intenses, ce tee-shirt offre un style sobre et professionnel, parfaitement adapté aux couleurs de l’équipe.', 'REF-307480', 12, 29.90, 1, 'available', 4.99, '{"fit":"XS:5,S:32,M:56,L:54,XL:38,2XL:39,3XL:12,4XL:12","type":"t-shirt","color":"Bleu marine","gender":"men","material":"Polyester 100% respirant avec zones mesh pour ventilation"}', '2025-10-30'),

(20, 'clothing', 'Tecnifibre Training Tee', 'Le t-shirt « Tecnifibre Training Tee » est parfait pour l’entraînement intensif. Conçu avec un tissu doux et léger en polyester, il assure un confort optimal tout en évacuant l’humidité pour rester sec même pendant les sessions les plus longues. Sa coupe classique et son design épuré blanc permettent une grande liberté de mouvement et une parfaite combinaison avec tous les shorts et pantalons Tecnifibre.', 'REF-123045', 12, 24.90, 1, 'available', 4.99, '{"fit":"XS:12,S:27,M:55,L:45,XL:56,2XL:42,3XL:9,4XL:0","type":"t-shirt","color":"Blanc","gender":"men","material":"Polyester 100% léger et respirant avec finition anti-transpiration"}', '2025-10-30'),

(21, 'shoes', 'Babolat Jet Viva 2025', 'Les Babolat Jet Viva 2025 sont des chaussures de padel hautement performantes pour hommes, offrant stabilité et légèreté sur tous les types de terrains. Conçues avec une semelle Michelin all-court pour un grip optimal et une durabilité maximale, elles intègrent une tige en mesh respirant et renforts latéraux pour un maintien parfait du pied. La semelle intermédiaire en EVA offre un excellent amorti, tandis que le design blanc avec accents bleus assure un look moderne et élégant sur le court.', 'REF-831581', 2, 79.90, 1, 'available', 4.99, '{"fit":"36:0,37:0,38:12,39:15,40:15,41:23,42:35,43:35,44:40,45:45,46:38","sole":"all-court Michelin","color":"Blanc / Bleu","gender":"men","weight":"315g (taille 42)"}', '2025-10-30'),

(22, 'shoes', 'Bullpadel Pearl Vibram 25I', 'Les Bullpadel Pearl Vibram 25I pour femmes combinent confort, style et performance sur le court. La semelle Vibram all-court offre une adhérence optimale et une excellente résistance à l’usure. La tige légère et respirante soutient le pied tout en assurant une bonne ventilation. Le rembourrage talon et les renforts latéraux améliorent le confort et la stabilité lors des mouvements rapides et changements de direction. Le design noir et rose apporte élégance et dynamisme.', 'REF-205841', 4, 124.90, 1, 'available', 4.99, '{"fit":"36:38,37:32,38:28,39:13,40:18,41:12,42:16,43:3,44:2,45:0,46:0","sole":"all-court Vibram","color":"Noir / Rose","gender":"woman","weight":"285g (taille 40)"}', '2025-10-30'),

(23, 'shoes', 'Wilson Hurakn Pro', 'Les Wilson Hurakn Pro pour femmes sont des chaussures de padel alliant confort et performance. Elles disposent d’une semelle all-court résistante et adhérente pour des déplacements rapides et stables sur tous types de terrains. La tige légère et respirante offre un maintien optimal du pied avec des renforts latéraux pour sécuriser les appuis. La semelle intermédiaire en EVA garantit un amorti efficace lors des sauts et changements de direction. Le design gris et vert apporte modernité et dynamisme sur le court.', 'REF-425955', 13, 89.90, 1, 'available', 4.99, '{"fit":"36:0,37:0,38:2,39:8,40:13,41:2,42:0,43:0,44:0,45:0,46:0","sole":"all-court","color":"Gris / Vert","gender":"woman","weight":"290g (taille 40)"}', '2025-09-30'),

(24, 'accessory', 'Tecnifibre Bracelet 2023 Silver', 'Le bracelet de padel Tecnifibre 2023 Silver est conçu pour absorber la transpiration et améliorer la prise en main de la raquette lors des échanges rapides. Son tissu élastique et respirant garantit un confort optimal tout en restant léger et discret sur le poignet. Idéal pour les joueurs qui souhaitent garder leurs mains au sec et éviter les glissements.', 'REF-37763', 12, 4.90, 121, 'available', 1.99, '{"type":"bracelet","color":"Argent","material":"Coton/Élasthanne","weight":"10g"}', '2025-11-03'),

(25, 'accessory', 'Black-Crown Protection de cadre Vibranium Noir', 'La protection de cadre Black-Crown Vibranium Noir protège efficacement votre raquette de padel contre les impacts et les rayures lors des matchs et entraînements. Facile à installer et à retirer, elle épouse parfaitement le contour du cadre. Fabriquée en matériau résistant et flexible, elle absorbe les chocs tout en maintenant le design élégant de votre raquette.', 'REF-465619', 3, 6.90, 86, 'available', 1.99, '{"type":"frame protector","color":"Noir","material":"PVC haute résistance","weight":"15g"}', '2025-11-03');




-- ARTICLES IMAGES
INSERT INTO article_images (article_id, url, created_at)
VALUES
  (1, '/uploads/1.5-Babolat-air-veron-25.webp', '2025-09-12'),
  (1, '/uploads/1.4-Babolat-air-veron-25.webp', '2025-09-12'),
  (1, '/uploads/1.3-Babolat-air-veron-25.webp', '2025-09-12'),
  (1, '/uploads/1.2-Babolat-air-veron-25.webp', '2025-09-12'),
  (1, '/uploads/1.1-Babolat-air-veron-25.webp', '2025-09-12'),

  (2, '/uploads/2.7-Bullpadel-indiga-power-23.webp', '2025-10-05'),
  (2, '/uploads/2.6-Bullpadel-indiga-power-23.webp', '2025-10-05'),
  (2, '/uploads/2.5-Bullpadel-indiga-power-23.webp', '2025-10-05'),
  (2, '/uploads/2.4-Bullpadel-indiga-power-23.webp', '2025-10-05'),
  (2, '/uploads/2.3-Bullpadel-indiga-power-23.webp', '2025-10-05'),
  (2, '/uploads/2.2-Bullpadel-indiga-power-23.webp', '2025-10-05'),
  (2, '/uploads/2.1-Bullpadel-indiga-power-23.webp', '2025-10-05'),

  (3, '/uploads/3.4-Babolat-technical-viper-25.webp', '2025-09-15'),
  (3, '/uploads/3.3-Babolat-technical-viper-25.webp', '2025-09-15'),
  (3, '/uploads/3.2-Babolat-technical-viper-25.webp', '2025-09-15'),
  (3, '/uploads/3.1-Babolat-technical-viper-25.webp', '2025-09-15'),

  (4, '/uploads/4.10-Adidas-adipower-mtw-25.webp', '2025-11-03'),
  (4, '/uploads/4.9-Adidas-adipower-mtw-25.webp', '2025-11-03'),
  (4, '/uploads/4.8-Adidas-adipower-mtw-25.webp', '2025-11-03'),
  (4, '/uploads/4.7-Adidas-adipower-mtw-25.webp', '2025-11-03'),
  (4, '/uploads/4.6-Adidas-adipower-mtw-25.webp', '2025-11-03'),
  (4, '/uploads/4.5-Adidas-adipower-mtw-25.webp', '2025-11-03'),
  (4, '/uploads/4.4-Adidas-adipower-mtw-25.webp', '2025-11-03'),
  (4, '/uploads/4.3-Adidas-adipower-mtw-25.webp', '2025-11-03'),
  (4, '/uploads/4.2-Adidas-adipower-mtw-25.webp', '2025-11-03'),
  (4, '/uploads/4.1-Adidas-adipower-mtw-25.webp', '2025-11-03'),
  
  (5, '/uploads/5.8-Nox-at10-genius-18k-25.webp', '2025-09-12'),
  (5, '/uploads/5.7-Nox-at10-genius-18k-25.webp', '2025-09-12'),
  (5, '/uploads/5.6-Nox-at10-genius-18k-25.webp', '2025-09-12'),
  (5, '/uploads/5.5-Nox-at10-genius-18k-25.webp', '2025-09-12'),
  (5, '/uploads/5.4-Nox-at10-genius-18k-25.webp', '2025-09-12'),
  (5, '/uploads/5.3-Nox-at10-genius-18k-25.webp', '2025-09-12'),
  (5, '/uploads/5.2-Nox-at10-genius-18k-25.webp', '2025-09-12'),
  (5, '/uploads/5.1-Nox-at10-genius-18k-25.webp', '2025-09-12'),

  (6, '/uploads/6.3-Starvie-luxury-silver-25.webp', '2025-10-12'),
  (6, '/uploads/6.2-Starvie-luxury-silver-25.webp', '2025-10-12'),
  (6, '/uploads/6.1-Starvie-luxury-silver-25.webp', '2025-10-12'),

  (7, '/uploads/7.2-Puma-nova-elite-noir.webp', '2025-10-12'),
  (7, '/uploads/7.1-Puma-nova-elite-noir.webp', '2025-10-12'),

  (8, '/uploads/8.5-Nox-at10-team-gris-24.webp', '2025-09-12'),
  (8, '/uploads/8.4-Nox-at10-team-gris-24.webp', '2025-09-12'),
  (8, '/uploads/8.3-Nox-at10-team-gris-24.webp', '2025-09-12'),
  (8, '/uploads/8.2-Nox-at10-team-gris-24.webp', '2025-09-12'),
  (8, '/uploads/8.1-Nox-at10-team-gris-24.webp', '2025-09-12'),

  (9, '/uploads/9.1-Head-padel-pro+.webp', '2025-09-08'),

  (10, '/uploads/10.1-Tecnifibre-tour.webp', '2025-09-08'),

  (11, '/uploads/11.1-Wilson-Pack-X-3-premiere-padel.webp', '2025-09-08'),

  (12, '/uploads/12.3-Head-robe-spirit.webp', '2025-09-23'),
  (12, '/uploads/12.2-Head-robe-spirit.webp', '2025-09-23'),
  (12, '/uploads/12.1-Head-robe-spirit.webp', '2025-09-23'),

  (13, '/uploads/13.3-Adidas-club-pleat.webp', '2025-09-29'),
  (13, '/uploads/13.2-Adidas-club-pleat.webp', '2025-09-29'),
  (13, '/uploads/13.1-Adidas-club-pleat.webp', '2025-09-29'),

  (14, '/uploads/14.3-Babolat-padel-jupe-25.webp', '2025-10-06'),
  (14, '/uploads/14.2-Babolat-padel-jupe-25.webp', '2025-10-06'),
  (14, '/uploads/14.1-Babolat-padel-jupe-25.webp', '2025-10-06'),

  (15, '/uploads/15.2-Tecnifibre-team-rouge.webp', '2025-10-06'),
  (15, '/uploads/15.1-Tecnifibre-team-rouge.webp', '2025-10-06'),

  (16, '/uploads/16.2-Bullpadel-replica-brea-brete.webp', '2025-10-30'),
  (16, '/uploads/16.1-Bullpadel-replica-brea-brete.webp', '2025-10-30'),
  
  (17, '/uploads/17.2-Adidas-club-tee-climacool.webp', '2025-10-30'),
  (17, '/uploads/17.1-Adidas-club-tee-climacool.webp', '2025-10-30'),

  (18, '/uploads/18.1-Adidas-club-tee-blanc.webp', '2025-10-30'),

  (19, '/uploads/19.2-Tecnifibre-team-tech-tee.webp', '2025-10-30'),
  (19, '/uploads/19.1-Tecnifibre-team-tech-tee.webp', '2025-10-30'),

  (20, '/uploads/20.3-Tecnifibre-training-tee-blanc.webp', '2025-10-30'),
  (20, '/uploads/20.2-Tecnifibre-training-tee-blanc.webp', '2025-10-30'),
  (20, '/uploads/20.1-Tecnifibre-training-tee-blanc.webp', '2025-10-30'),

  (21, '/uploads/21.5-Babolat-jet-viva-25.webp', '2025-10-30'),
  (21, '/uploads/21.4-Babolat-jet-viva-25.webp', '2025-10-30'),
  (21, '/uploads/21.3-Babolat-jet-viva-25.webp', '2025-10-30'),
  (21, '/uploads/21.2-Babolat-jet-viva-25.webp', '2025-10-30'),
  (21, '/uploads/21.1-Babolat-jet-viva-25.webp', '2025-10-30'),

  (22, '/uploads/22.4-Bullpadel-pearl-vibram-25I.webp', '2025-10-30'),
  (22, '/uploads/22.3-Bullpadel-pearl-vibram-25I.webp', '2025-10-30'),
  (22, '/uploads/22.2-Bullpadel-pearl-vibram-25I.webp', '2025-10-30'),
  (22, '/uploads/22.1-Bullpadel-pearl-vibram-25I.webp', '2025-10-30'),

  (23, '/uploads/23.6-Wilson-hurakn-pro.webp', '2025-09-30'),
  (23, '/uploads/23.5-Wilson-hurakn-pro.webp', '2025-09-30'),
  (23, '/uploads/23.4-Wilson-hurakn-pro.webp', '2025-09-30'),
  (23, '/uploads/23.3-Wilson-hurakn-pro.webp', '2025-09-30'),
  (23, '/uploads/23.2-Wilson-hurakn-pro.webp', '2025-09-30'),
  (23, '/uploads/23.1-Wilson-hurakn-pro.webp', '2025-09-30'), 

  (24, '/uploads/24.2-Tecnifibre-bracelet-silver-23.webp', '2025-09-30'),
  (24, '/uploads/24.1-Tecnifibre-bracelet-silver-23.webp', '2025-09-30'),

  (25, '/uploads/25.1-Black-Crown-protection-de-raquette-noir.webp', '2025-09-30');


-- ARTICLE RATINGS
INSERT INTO article_ratings (rating_id, article_id, maneuverability, power, comfort, spin, tolerance, control) VALUES
(1, 1, 9, 7, 8, 8, 9, 7),
(2, 2, 5, 8, 8, 6, 8, 8),
(3, 3, 8, 10, 8, 7, 8, 8),
(4, 4, 9, 7, 8, 8, 9, 10),
(5, 5, 9, 8, 7, 9, 8, 9);

-- REVIEWS
-- INSERT INTO reviews (review_id, article_id, user_id, comment, rating) VALUES
-- (1, 1, 1, 'Excellent control and precision for advanced players.', 5),
-- (2, 2, 2, 'Good racket for intermediate players.', 4);

-- PROMOTIONS
INSERT INTO promotions (promo_id, article_id, name, description, discount_type, discount_value, start_date, end_date, status, created_at, updated_at) VALUES
(1, 2, '🖤 Black November', '🖤 Black November – Un mois entier de bonnes affaires ! Le mois de novembre s’annonce explosif avec des réductions exceptionnelles chaque semaine. Raquettes, vêtements, accessoires… tout y passe à prix mini pour un maximum de plaisir sur le terrain. 🔥 Ce qu’il ne faut pas manquer : - Jusqu’à -50 % sur une sélection d’articles exclusifs. - Offres flash et nouveautés chaque semaine. - Aucune manipulation : les réductions s’appliquent automatiquement au panier. Conditions générales : - Offres valables du 1er au 30 novembre 2025 inclus. - Dans la limite des stocks disponibles. - Non cumulable avec d’autres promotions ou codes de réduction. - Promotion disponible sur la boutique en ligne et en magasin. Préparez vos cadeaux de fin d’année et faites le plein de bonnes affaires avant tout le monde. Le Black November n’attend pas ! 🛍️', '€', 5.00, '2025-11-01', '2025-11-30', 'active', '2025-11-03 20:41:33.39', '2025-11-03 20:41:33.39');


-- PROMOTION
INSERT INTO promotion (promo_id, name, description, start_date, end_date, status) VALUES
(1, '🐓 French Day''s', 'C’est le moment parfait pour bien commencer l’année avec style !  
La Promo Rentrée 2025 est là, avec des réductions exceptionnelles sur une large sélection d’articles pour vous remettre en forme ou simplement vous faire plaisir.  

💥 Points forts de l’offre :  
- Jusqu’à -40 % sur les raquettes, tenues et accessoires.  
- Sélection spéciale “Made in France” à prix mini.  
- Remises appliquées automatiquement au panier, sans code nécessaire.  

Conditions générales :  
- Offres valables du 1er septembre au 15 octobre 2025 inclus.  
- Dans la limite des stocks disponibles.  
- Non cumulable avec d’autres promotions ou codes de réduction.  
- Valable en ligne et en magasin.  

Ne manquez pas cette occasion pour vous équiper et attaquer la rentrée du bon pied ! 🏸', '2025-09-01', '2025-10-15', 'active'),

(2, '⚡ Black Friday', '⚡ Black Friday 2025 – Les Offres Immanquables chez Padel Club Shop !  
C’est LE rendez-vous shopping de l’année : des réductions spectaculaires sur tout ce que vous aimez — raquettes, chaussures, sacs et bien plus encore !  

🔥 Pourquoi attendre Noël ?  
- Jusqu’à -60 % sur les plus grandes marques.  
- Offres limitées dans le temps et renouvelées chaque jour.  
- Aucun code promo à saisir : tout est automatique dans votre panier.  

Conditions générales :  
- Offres valables du 25 au 30 novembre 2025 inclus.  
- Dans la limite des stocks disponibles.  
- Non cumulable avec d’autres promotions ou codes de réduction.  
- Disponible sur notre boutique en ligne et en magasin.  

⚡ Dépêchez-vous : les stocks fondent plus vite qu’un revers gagnant ! 🏃‍♂️💨', '2025-11-25', '2025-11-30', 'active'),

(3, '🎄 Noël', '🎄 Noël 2025 – Des Offres Magiques pour des Fêtes Sportives !  
Célébrez la magie de Noël avec Padel Club Shop et découvrez des promotions féériques sur nos produits stars. 🎁  
Du 1er au 31 décembre, profitez de remises exclusives pour préparer vos cadeaux ou vous offrir ce dont vous rêviez toute l’année.  

✨ Au programme :  
- Jusqu’à -50 % sur une sélection spéciale “Noël”.  
- Nouveaux packs raquette + sac à prix cadeau.  
- Offres automatiques, sans code promo à entrer.  

Conditions générales :  
- Offres valables du 1er au 31 décembre 2025 inclus.  
- Dans la limite des stocks disponibles.  
- Non cumulable avec d’autres promotions ou codes de réduction.  
- Valable en ligne et en magasin.  

Offrez (ou offrez-vous) le plaisir du jeu, et faites de ce Noël un moment inoubliable sur le court ! 🌟', '2025-12-01', '2025-12-31', 'active'),

(4, '🖤 Black November', '🖤 Black November – Un mois entier de bonnes affaires !  
Le mois de novembre s’annonce explosif avec des réductions exceptionnelles chaque semaine.  
Raquettes, vêtements, accessoires… tout y passe à prix mini pour un maximum de plaisir sur le terrain.  

🔥 Ce qu’il ne faut pas manquer :  
- Jusqu’à -50 % sur une sélection d’articles exclusifs.  
- Offres flash et nouveautés chaque semaine.  
- Aucune manipulation : les réductions s’appliquent automatiquement au panier.  

Conditions générales :  
- Offres valables du 1er au 30 novembre 2025 inclus.  
- Dans la limite des stocks disponibles.  
- Non cumulable avec d’autres promotions ou codes de réduction.  
- Promotion disponible sur la boutique en ligne et en magasin.  

Préparez vos cadeaux de fin d’année et faites le plein de bonnes affaires avant tout le monde. Le Black November n’attend pas ! 🛍️', '2025-11-01', '2025-11-30', 'active'),

(5, '💻 Cyber Monday', '💻 Cyber Monday 2025 – Les Offres 100 % en Ligne !  
Une journée unique pour faire le plein de bonnes affaires depuis chez vous 🛋️ !  
Découvrez nos remises exclusives sur les produits connectés, accessoires high-tech et textiles techniques de padel.  
C''est le moment idéal pour vous offrir le meilleur du matériel sans bouger de votre canapé !  

🔥 Points forts :  
- Réductions automatiques et immédiates, uniquement sur la boutique en ligne.  
- Offres exclusives sur une sélection high-tech (raquettes connectées, capteurs, accessoires).  
- Offres limitées dans la journée : surveillez les ventes flash !  

Conditions générales :  
- Offre valable le lundi suivant le Black Friday (1 jour).  
- Dans la limite des stocks disponibles.  
- Non cumulable avec d''autres promotions.  

Faites vos achats confortablement depuis chez vous et profitez d''économies exclusives !', '2025-12-01', '2025-12-01', 'active'),

(6, '🎆 Nouvel An', '🎆 Nouvel An 2026 – De bonnes résolutions à prix réduits !  
Démarrez l''année avec énergie : des remises spéciales pour tous ceux qui veulent se remettre au sport ou améliorer leur équipement.  
Du 1er au 10 janvier 2026, profitez d''offres sur une sélection d''articles parfaitement choisie pour vos objectifs.  

✨ Ce que vous trouverez :  
- Remises ciblées sur packs raquette+accessoire pour bien démarrer l''année.  
- Offres “boost motivation” : vêtements techniques et chaussures à prix réduits.  
- Réductions appliquées automatiquement, sans code.  

Conditions générales :  
- Valable du 01/01/2026 au 10/01/2026 inclus.  
- Dans la limite des stocks disponibles.  
- Non cumulable avec d''autres promotions.  

Nouvelle année, nouveaux objectifs : c''est le moment de se fixer de vrais challenges et de s''équiper malin !', '2026-01-01', '2026-01-10', 'active'),

(7, '❄️ Soldes d''hiver', '❄️ Soldes d''hiver 2026 – Des remises glaciales qui réchauffent le cœur !  
Les soldes d''hiver arrivent avec des remises massives pour vous permettre de vous équiper sans vous ruiner.  
Profitez d''une sélection à prix cassés : raquettes, chaussures, vêtements et accessoires jusqu''à -50%.  

🔥 Points forts :  
- Jusqu''à -50 % sur une sélection d''articles.  
- Offres automatiques au panier, pas de code nécessaire.  
- Packs exclusifs et fins de série à saisir rapidement.  

Conditions générales :  
- Valable du 08/01/2026 au 04/02/2026 inclus.  
- Dans la limite des stocks disponibles.  
- Non cumulable avec d''autres promotions.  

Restez au chaud et boostez votre équipement pour la saison : les meilleures affaires partent vite, soyez au rendez-vous !', '2026-01-08', '2026-02-04', 'active');

-- ORDERS
-- INSERT INTO orders (order_id, reference, user_id, created_at, vat_rate, status) VALUES
-- (1, 'CMD-2025-0001', 1, '2025-01-05 10:30:00', 20, 'pending');

-- INSERT INTO order_lines (order_line_id, order_id, article_id, quantity) VALUES
-- (1, 1, 1, 1),
-- (2, 1, 2, 2);

-- INSERT INTO payments (payment_id, order_id, payment_method, paid_at) VALUES
-- (1, 1, 'Bank Transfer', '2025-01-05 11:00:00');

-- CARTS
-- INSERT INTO carts (cart_id, user_id) VALUES
-- (1, 2);

-- INSERT INTO cart_lines (cart_line_id, cart_id, article_id, quantity) VALUES
-- (1, 1, 1, 3),
-- (2, 1, 2, 1);

COMMIT;

-- À exécuter après votre seed pour réinitialiser toutes les séquences
SELECT setval('roles_role_id_seq', (SELECT MAX(role_id) FROM roles));
SELECT setval('users_user_id_seq', (SELECT MAX(user_id) FROM users));
SELECT setval('addresses_address_id_seq', (SELECT MAX(address_id) FROM addresses));
SELECT setval('brands_brand_id_seq', (SELECT MAX(brand_id) FROM brands));
SELECT setval('articles_article_id_seq', (SELECT MAX(article_id) FROM articles));
SELECT setval('article_images_image_id_seq', (SELECT MAX(image_id) FROM article_images));
-- SELECT setval('article_characteristics_characteristic_id_seq', (SELECT MAX(characteristic_id) FROM article_characteristics));
SELECT setval('article_ratings_rating_id_seq', (SELECT MAX(rating_id) FROM article_ratings));
SELECT setval('promotions_promo_id_seq', (SELECT MAX(promo_id) FROM promotions));
SELECT setval('promotion_promo_id_seq', (SELECT MAX(promo_id) FROM promotion));
SELECT setval('reviews_review_id_seq', (SELECT MAX(review_id) FROM reviews));
SELECT setval('orders_order_id_seq', (SELECT MAX(order_id) FROM orders));
SELECT setval('order_lines_order_line_id_seq', (SELECT MAX(order_line_id) FROM order_lines));
SELECT setval('payments_payment_id_seq', (SELECT MAX(payment_id) FROM payments));
SELECT setval('carts_cart_id_seq', (SELECT MAX(cart_id) FROM carts));
SELECT setval('cart_lines_cart_line_id_seq', (SELECT MAX(cart_line_id) FROM cart_lines));