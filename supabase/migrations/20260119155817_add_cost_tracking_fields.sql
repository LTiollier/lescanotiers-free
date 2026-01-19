ALTER TABLE public.cycles
ADD COLUMN utility_costs_in_cents INTEGER DEFAULT NULL,
ADD COLUMN seedling_cost_in_cents INTEGER DEFAULT NULL;

ALTER TABLE public.profiles
ADD COLUMN hourly_rate_in_cents INTEGER DEFAULT NULL;
