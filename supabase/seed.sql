-- Drop tables if they exist to allow re-running
DROP TABLE IF EXISTS public.pricing_tiers CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;

-- Categories
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    short_description TEXT,
    full_specifications JSONB,
    images TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on category_id for faster joins
CREATE INDEX idx_products_category_id ON public.products(category_id);

-- Pricing Tiers
CREATE TABLE public.pricing_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    min_qty INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on product_id for faster joins
CREATE INDEX idx_pricing_tiers_product_id ON public.pricing_tiers(product_id);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;

-- Public read-only policies (catalogue is public)
CREATE POLICY "Allow public read on categories" ON public.categories
    FOR SELECT USING (true);
CREATE POLICY "Allow public read on products" ON public.products
    FOR SELECT USING (true);
CREATE POLICY "Allow public read on pricing_tiers" ON public.pricing_tiers
    FOR SELECT USING (true);

-- Seed data with static UUIDs
-- Categories
INSERT INTO public.categories (id, name, slug) VALUES 
('11111111-1111-1111-1111-111111111111', 'Kettles', 'kettles'),
('22222222-2222-2222-2222-222222222222', 'Hair Dryers', 'hair-dryers'),
('33333333-3333-3333-3333-333333333333', 'Mini Bar Fridges', 'mini-bar-fridges'),
('44444444-4444-4444-4444-444444444444', 'Safe Boxes', 'safe-boxes'),
('55555555-5555-5555-5555-555555555555', 'Housekeeping Trolleys', 'housekeeping-trolleys');

-- Products (images point to local /products/ directory)
INSERT INTO public.products (id, category_id, name, short_description, full_specifications, images) VALUES 
('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Budget Hotel Kettle', '1.2L capacity, basic white kettle perfect for budget rooms.', '{"capacity": "1.2L", "power": "1500W", "material": "Plastic", "color": "White"}', ARRAY['/products/budget-hotel-kettle/1.png', '/products/budget-hotel-kettle/2.png', '/products/budget-hotel-kettle/3.png']),
('aaaaaaaa-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Premium Stainless Kettle', '1.5L brushed stainless steel, fast boil.', '{"capacity": "1.5L", "power": "2200W", "material": "Stainless Steel", "color": "Silver"}', ARRAY['/products/premium-kettle/1.png', '/products/premium-kettle/2.png', '/products/premium-kettle/3.png']),
('aaaaaaaa-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Gooseneck Pour-Over Kettle', '0.8L matte black precision kettle for artisanal coffee setups in luxury suites.', '{"capacity": "0.8L", "power": "1200W", "material": "Stainless Steel", "color": "Matte Black", "heating": "Precision Gooseneck"}', ARRAY['/products/gooseneck-kettle/1.png', '/products/gooseneck-kettle/2.png', '/products/gooseneck-kettle/3.png']),
('bbbbbbbb-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Compact Wall-Mount Hair Dryer', '1200W wall-mounted dryer for bathrooms.', '{"power": "1200W", "mounting": "Wall", "settings": "2 Speed", "color": "White"}', ARRAY['/products/wall-hair-dryer/1.png', '/products/wall-hair-dryer/2.png', '/products/wall-hair-dryer/3.png']),
('bbbbbbbb-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Professional Ionic Hair Dryer', '2000W salon-grade dryer with magnetic attachments for premium guest bathrooms.', '{"power": "2000W", "motor": "Brushless Turbo", "attachments": "Magnetic Nozzle", "color": "Dark Grey"}', ARRAY['/products/pro-hair-dryer/1.png', '/products/pro-hair-dryer/2.png', '/products/pro-hair-dryer/3.png']),
('bbbbbbbb-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'Folding Travel Hair Dryer', '1600W compact foldable design, perfect for space-saving vanity drawers.', '{"power": "1600W", "design": "Foldable", "weight": "400g", "color": "White"}', ARRAY['/products/folding-hair-dryer/1.png', '/products/folding-hair-dryer/2.png', '/products/folding-hair-dryer/3.png']),
('cccccccc-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'Silent Mini Bar Fridge', '40L thermoelectric fridge, auto-defrost.', '{"capacity": "40L", "cooling": "Thermoelectric", "noise": "0dB", "color": "Black"}', ARRAY['/products/mini-fridge/1.png', '/products/mini-fridge/2.png', '/products/mini-fridge/3.png']),
('cccccccc-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'Glass Door Display Fridge', '50L illuminated front-glass fridge for modern, enticing minibar presentations.', '{"capacity": "50L", "door": "Tempered Glass", "lighting": "Interior LED", "cooling": "Compressor"}', ARRAY['/products/glass-minibar/1.png', '/products/glass-minibar/2.png', '/products/glass-minibar/3.png']),
('cccccccc-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'Smart Sensor Minibar', '45L IoT-enabled fridge with automated billing sensors and sleek handle-less design.', '{"capacity": "45L", "sensors": "Optical & Weight", "connectivity": "WiFi/Ethernet", "color": "Matte Black"}', ARRAY['/products/smart-minibar/1.png', '/products/smart-minibar/2.png', '/products/smart-minibar/3.png']),
('dddddddd-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 'In-Room Security Safe', 'Electronic keypad safe with laptop-size capacity.', '{"capacity": "Laptop 15-inch", "lock": "Electronic Keypad", "battery_backup": "Yes", "color": "Charcoal"}', ARRAY['/products/hotel-safe/1.png', '/products/hotel-safe/2.png', '/products/hotel-safe/3.png']),
('dddddddd-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'Biometric Fingerprint Safe', 'Heavy-duty steel safe with instant smart fingerprint access for executive suites.', '{"lock": "Biometric Fingerprint", "memory": "Up to 5 prints", "material": "Heavy Steel", "color": "Brushed Steel"}', ARRAY['/products/biometric-safe/1.png', '/products/biometric-safe/2.png', '/products/biometric-safe/3.png']),
('dddddddd-0000-0000-0000-000000000003', '44444444-4444-4444-4444-444444444444', 'Motorized Drawer Safe', 'Top-opening compact drawer safe engineered for seamless desk integrations.', '{"deployment": "Motorized Top-Open", "installation": "Integrated Drawer", "finish": "Premium Silver"}', ARRAY['/products/drawer-safe/1.png', '/products/drawer-safe/2.png', '/products/drawer-safe/3.png']),
('eeeeeeee-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555', 'Premium Housekeeping Cart', 'Durable, silent-wheel housekeeping trolley with linen compartments.', '{"wheels": "Silent Rubber 6-inch", "compartments": "3 Tiers", "laundry_bag": "Included", "material": "High-Grade Polymer"}', ARRAY['/products/housekeeping-cart/1.png', '/products/housekeeping-cart/2.png', '/products/housekeeping-cart/3.png']),
('eeeeeeee-0000-0000-0000-000000000002', '55555555-5555-5555-5555-555555555555', 'Compact Room Service Cart', 'Folding wooden sides, silent wheels, optimized for tight resort corridors.', '{"material": "Mahogany Wood Finish", "folding": "Dual Sides", "wheels": "Silent Caster", "capacity": "Medium"}', ARRAY['/products/compact-cart/1.png', '/products/compact-cart/2.png', '/products/compact-cart/3.png']),
('eeeeeeee-0000-0000-0000-000000000003', '55555555-5555-5555-5555-555555555555', 'Heavy-Duty Linen Trolley', 'Large capacity X-frame foldable trolley specifically designed for high-turnover laundry.', '{"frame": "Stainless Steel X-Frame", "bag": "Heavy-Duty Canvas 200L", "structural": "Foldable Design"}', ARRAY['/products/linen-trolley/1.png', '/products/linen-trolley/2.png', '/products/linen-trolley/3.png']);

-- Pricing Tiers
-- Pricing Tiers
INSERT INTO public.pricing_tiers (product_id, min_qty, unit_price) VALUES 
-- Budget Kettle (Base: $15)
('aaaaaaaa-0000-0000-0000-000000000001', 1, 15.00),
('aaaaaaaa-0000-0000-0000-000000000001', 50, 13.50),
('aaaaaaaa-0000-0000-0000-000000000001', 200, 12.00),

-- Premium Kettle (Base: $30)
('aaaaaaaa-0000-0000-0000-000000000002', 1, 30.00),
('aaaaaaaa-0000-0000-0000-000000000002', 50, 27.00),
('aaaaaaaa-0000-0000-0000-000000000002', 200, 25.00),

-- Gooseneck Kettle (Base: $45)
('aaaaaaaa-0000-0000-0000-000000000003', 1, 45.00),
('aaaaaaaa-0000-0000-0000-000000000003', 50, 40.00),
('aaaaaaaa-0000-0000-0000-000000000003', 200, 35.00),

-- Compact Wall-Mount Hair Dryer (Base: $25)
('bbbbbbbb-0000-0000-0000-000000000001', 1, 25.00),
('bbbbbbbb-0000-0000-0000-000000000001', 50, 22.00),
('bbbbbbbb-0000-0000-0000-000000000001', 200, 18.00),

-- Professional Ionic Hair Dryer (Base: $85)
('bbbbbbbb-0000-0000-0000-000000000002', 1, 85.00),
('bbbbbbbb-0000-0000-0000-000000000002', 25, 75.00),
('bbbbbbbb-0000-0000-0000-000000000002', 100, 65.00),

-- Folding Travel Hair Dryer (Base: $35)
('bbbbbbbb-0000-0000-0000-000000000003', 1, 35.00),
('bbbbbbbb-0000-0000-0000-000000000003', 50, 30.00),
('bbbbbbbb-0000-0000-0000-000000000003', 200, 25.00),

-- Silent Mini Bar Fridge (Base: $120)
('cccccccc-0000-0000-0000-000000000001', 1, 120.00),
('cccccccc-0000-0000-0000-000000000001', 20, 110.00),
('cccccccc-0000-0000-0000-000000000001', 100, 95.00),

-- Glass Door Display Fridge (Base: $165)
('cccccccc-0000-0000-0000-000000000002', 1, 165.00),
('cccccccc-0000-0000-0000-000000000002', 25, 145.00),
('cccccccc-0000-0000-0000-000000000002', 100, 125.00),

-- Smart Sensor Minibar (Base: $380)
('cccccccc-0000-0000-0000-000000000003', 1, 380.00),
('cccccccc-0000-0000-0000-000000000003', 50, 320.00),
('cccccccc-0000-0000-0000-000000000003', 200, 280.00),

-- In-Room Security Safe (Base: $85)
('dddddddd-0000-0000-0000-000000000001', 1, 85.00),
('dddddddd-0000-0000-0000-000000000001', 50, 78.00),
('dddddddd-0000-0000-0000-000000000001', 150, 72.00),

-- Biometric Fingerprint Safe (Base: $140)
('dddddddd-0000-0000-0000-000000000002', 1, 140.00),
('dddddddd-0000-0000-0000-000000000002', 50, 125.00),
('dddddddd-0000-0000-0000-000000000002', 200, 110.00),

-- Motorized Drawer Safe (Base: $160)
('dddddddd-0000-0000-0000-000000000003', 1, 160.00),
('dddddddd-0000-0000-0000-000000000003', 50, 135.00),
('dddddddd-0000-0000-0000-000000000003', 200, 115.00),

-- Premium Housekeeping Cart (Base: $350)
('eeeeeeee-0000-0000-0000-000000000001', 1, 350.00),
('eeeeeeee-0000-0000-0000-000000000001', 10, 320.00),
('eeeeeeee-0000-0000-0000-000000000001', 25, 290.00),

-- Compact Room Service Cart (Base: $420)
('eeeeeeee-0000-0000-0000-000000000002', 1, 420.00),
('eeeeeeee-0000-0000-0000-000000000002', 10, 380.00),
('eeeeeeee-0000-0000-0000-000000000002', 50, 340.00),

-- Heavy-Duty Linen Trolley (Base: $125)
('eeeeeeee-0000-0000-0000-000000000003', 1, 125.00),
('eeeeeeee-0000-0000-0000-000000000003', 25, 105.00),
('eeeeeeee-0000-0000-0000-000000000003', 100, 90.00);
