-- Migration to move quantity from times to cycles
-- Date: 2026-01-27

-- 1. Add quantity column to cycles
ALTER TABLE cycles ADD COLUMN quantity NUMERIC(10, 2);

-- 2. Migrate data: sum quantities from times per cycle
-- We use a subquery to sum up all quantities associated with a cycle and update the cycle's quantity.
UPDATE cycles c
SET quantity = (
  SELECT SUM(t.quantity)
  FROM times t
  WHERE t.cycle_id = c.id
);

-- 3. Remove quantity column from times
ALTER TABLE times DROP COLUMN quantity;
