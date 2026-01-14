-- Admin      : b29875c2-cd3c-4ea5-9921-ca398ec966f5
-- Employee 1 : 04cf927d-d5e0-4147-8d84-3b968c07eff6
-- Employee 2 : 471758fa-07ba-47a5-a972-240b7078b7c9

-- Seed data for Les Canotiers

-- Clear existing data
TRUNCATE TABLE 
    public.times,
    public.cycles,
    public.profiles,
    public.parcels, 
    public.vegetable_categories, 
    public.vegetables, 
    public.activities 
RESTART IDENTITY CASCADE;

-- Seed Parcels
INSERT INTO public.parcels (name) VALUES
('P1 - Serre Tomates'),
('P2 - Serre Courgettes'),
('P3 - Plein Champ Ouest'),
('P4 - Plein Champ Est'),
('P5 - Zone de Test'),
('Jardin des Aromates'),
('Butte A'),
('Butte B'),
('Planche 1'),
('Planche 2'),
('Planche 3'),
('Planche 4');

-- Seed Vegetable Categories
INSERT INTO public.vegetable_categories (name) VALUES
('Légume-racine'),
('Légume-feuille'),
('Légume-fruit'),
('Légume-fleur'),
('Légume-bulbe'),
('Aromate');

-- Seed Vegetables
INSERT INTO public.vegetables (id, name, category_id) VALUES
(1, 'Carotte', 1),
(2, 'Panais', 1),
(3, 'Radis', 1),
(4, 'Betterave', 1),
(5, 'Navet', 1),
(6, 'Laitue', 2),
(7, 'Épinard', 2),
(8, 'Blette', 2),
(9, 'Roquette', 2),
(10, 'Chou Kale', 2),
(11, 'Tomate', 3),
(12, 'Courgette', 3),
(13, 'Aubergine', 3),
(14, 'Poivron', 3),
(15, 'Concombre', 3),
(16, 'Piment', 3),
(17, 'Brocoli', 4),
(18, 'Chou-fleur', 4),
(19, 'Artichaut', 4),
(20, 'Oignon', 5),
(21, 'Ail', 5),
(22, 'Échalote', 5),
(23, 'Poireau', 5),
(24, 'Basilic', 6),
(25, 'Persil', 6),
(26, 'Ciboulette', 6),
(27, 'Menthe', 6),
(28, 'Thym', 6),
(29, 'Romarin', 6);

-- Seed Activities
INSERT INTO public.activities (id, name) VALUES
(1, 'Préparation du sol'),
(2, 'Semis'),
(3, 'Plantation'),
(4, 'Désherbage'),
(5, 'Arrosage'),
(6, 'Traitement'),
(7, 'Récolte'),
(8, 'Taille');

-- Seed Cycles
-- Past Cycles
INSERT INTO public.cycles (id, vegetable_id, parcel_id, starts_at, ends_at) VALUES
(1, 11, 1, '2025-04-15', '2025-09-30'), -- Tomate en P1
(2, 1, 3, '2025-05-10', '2025-08-15');  -- Carotte en P3

-- Current/Future Cycles (Today is 2026-01-14)
INSERT INTO public.cycles (id, vegetable_id, parcel_id, starts_at, ends_at) VALUES
(3, 12, 2, '2025-12-10', '2026-05-20'), -- Courgette en P2 (En cours)
(4, 6, 9, '2026-01-05', '2026-03-15');   -- Laitue en Planche 1 (En cours)

-- Seed Times
-- For Cycle 1 (Tomates - Passé)
INSERT INTO public.times (user_id, cycle_id, activity_id, date, minutes) VALUES
('b29875c2-cd3c-4ea5-9921-ca398ec966f5', 1, 1, '2025-04-15', 120), -- Préparation
('04cf927d-d5e0-4147-8d84-3b968c07eff6', 1, 3, '2025-04-20', 180), -- Plantation
('471758fa-07ba-47a5-a972-240b7078b7c9', 1, 4, '2025-05-15', 240), -- Désherbage
('04cf927d-d5e0-4147-8d84-3b968c07eff6', 1, 8, '2025-06-10', 120), -- Taille
('b29875c2-cd3c-4ea5-9921-ca398ec966f5', 1, 7, '2025-08-20', 300), -- Récolte
('471758fa-07ba-47a5-a972-240b7078b7c9', 1, 7, '2025-08-21', 300); -- Récolte

-- For Cycle 2 (Carottes - Passé)
INSERT INTO public.times (user_id, cycle_id, activity_id, date, minutes) VALUES
('04cf927d-d5e0-4147-8d84-3b968c07eff6', 2, 2, '2025-05-10', 90),  -- Semis
('471758fa-07ba-47a5-a972-240b7078b7c9', 2, 4, '2025-06-05', 360), -- Désherbage
('b29875c2-cd3c-4ea5-9921-ca398ec966f5', 2, 7, '2025-08-10', 180); -- Récolte

-- For Cycle 3 (Courgettes - En cours)
INSERT INTO public.times (user_id, cycle_id, activity_id, date, minutes) VALUES
('b29875c2-cd3c-4ea5-9921-ca398ec966f5', 3, 1, '2025-12-10', 150), -- Préparation
('04cf927d-d5e0-4147-8d84-3b968c07eff6', 3, 3, '2025-12-15', 200), -- Plantation
('471758fa-07ba-47a5-a972-240b7078b7c9', 3, 5, '2026-01-05', 60),  -- Arrosage
('04cf927d-d5e0-4147-8d84-3b968c07eff6', 3, 4, '2026-01-10', 180); -- Désherbage

-- For Cycle 4 (Laitue - En cours)
INSERT INTO public.times (user_id, cycle_id, activity_id, date, minutes) VALUES
('471758fa-07ba-47a5-a972-240b7078b7c9', 4, 1, '2026-01-05', 60),  -- Préparation
('04cf927d-d5e0-4147-8d84-3b968c07eff6', 4, 3, '2026-01-06', 120), -- Plantation
('b29875c2-cd3c-4ea5-9921-ca398ec966f5', 4, 4, '2026-01-12', 45);  -- Désherbage
