-- Seed data for Les Canotiers

-- Clear existing data
TRUNCATE TABLE public.parcels, public.vegetable_categories, public.vegetables, public.activities RESTART IDENTITY CASCADE;

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
INSERT INTO public.vegetables (name, category_id) VALUES
-- Légumes-racines (cat 1)
('Carotte', 1),
('Panais', 1),
('Radis', 1),
('Betterave', 1),
('Navet', 1),
-- Légumes-feuilles (cat 2)
('Laitue', 2),
('Épinard', 2),
('Blette', 2),
('Roquette', 2),
('Chou Kale', 2),
-- Légumes-fruits (cat 3)
('Tomate', 3),
('Courgette', 3),
('Aubergine', 3),
('Poivron', 3),
('Concombre', 3),
('Piment', 3),
-- Légumes-fleurs (cat 4)
('Brocoli', 4),
('Chou-fleur', 4),
('Artichaut', 4),
-- Légumes-bulbes (cat 5)
('Oignon', 5),
('Ail', 5),
('Échalote', 5),
('Poireau', 5),
-- Aromates (cat 6)
('Basilic', 6),
('Persil', 6),
('Ciboulette', 6),
('Menthe', 6),
('Thym', 6),
('Romarin', 6);

-- Seed Activities
INSERT INTO public.activities (name) VALUES
('Préparation du sol'),
('Semis'),
('Plantation'),
('Désherbage'),
('Arrosage'),
('Traitement'),
('Récolte'),
('Taille');

-- Note: Seeding for `profiles`, `cycles`, and `times` is more complex
-- as it requires user authentication data. This can be done via custom scripts
-- or by manually creating users and using their IDs.
