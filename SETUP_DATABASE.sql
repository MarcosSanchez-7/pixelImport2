-- ============================================================
-- PIXELL IMPORT — Database Setup & Fix
-- Run this entire script in your Supabase SQL Editor
-- Dashboard → SQL Editor → New query → Paste → Run
-- ============================================================

-- ── 1. Fix products table RLS (allows admin writes) ──────────
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read" ON products;
DROP POLICY IF EXISTS "Allow all insert" ON products;
DROP POLICY IF EXISTS "Allow all update" ON products;
DROP POLICY IF EXISTS "Allow all delete" ON products;
DROP POLICY IF EXISTS "Allow all operations" ON products;

CREATE POLICY "Allow public read"   ON products FOR SELECT USING (true);
CREATE POLICY "Allow all insert"    ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update"    ON products FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete"    ON products FOR DELETE USING (true);

-- ── 2. Add missing columns to products ───────────────────────
ALTER TABLE products ADD COLUMN IF NOT EXISTS specs       JSONB        DEFAULT '[]';
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id UUID;        -- FK added after categories table
ALTER TABLE products ADD COLUMN IF NOT EXISTS images      TEXT[]       DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS sale_price  NUMERIC      DEFAULT NULL;

-- ── 3. Create hierarchical categories table ──────────────────
CREATE TABLE IF NOT EXISTS categories (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL,
  parent_id  UUID        REFERENCES categories(id) ON DELETE CASCADE,
  sort_order INTEGER     DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. RLS for categories ─────────────────────────────────────
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read" ON categories;
DROP POLICY IF EXISTS "Allow all insert" ON categories;
DROP POLICY IF EXISTS "Allow all update" ON categories;
DROP POLICY IF EXISTS "Allow all delete" ON categories;

CREATE POLICY "Allow public read"   ON categories FOR SELECT USING (true);
CREATE POLICY "Allow all insert"    ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update"    ON categories FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete"    ON categories FOR DELETE USING (true);

-- ── 5. Add FK from products → categories ─────────────────────
ALTER TABLE products
  DROP CONSTRAINT IF EXISTS products_category_id_fkey;

ALTER TABLE products
  ADD CONSTRAINT products_category_id_fkey
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- ── 6. Index for fast category lookups ───────────────────────
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Done! ✓
