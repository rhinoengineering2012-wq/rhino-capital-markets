/*
# Create portfolio holdings table

1. New Tables
- `portfolio_holdings`
  - `id` (uuid, primary key)
  - `user_id` (uuid, defaults to the signed-in user, owner of the row)
  - `symbol` (text, ticker such as AAPL or BTC)
  - `name` (text, display name of the asset)
  - `asset_class` (text, one of forex, crypto, stock)
  - `quantity` (numeric, units held, must be greater than 0)
  - `avg_cost` (numeric, average purchase price per unit, must be greater than 0)
  - `created_at` (timestamp)

2. Security
- Enable RLS on `portfolio_holdings`.
- Grant SELECT, INSERT, UPDATE, DELETE to `authenticated` only.
- Owner-scoped policies: each user can only read, create, change and remove their own holdings.

3. Notes
- Only signed-in users can reach this table; anonymous visitors see nothing.
- The owner column defaults to the signed-in user so inserts do not need to pass it.
*/

CREATE TABLE IF NOT EXISTS portfolio_holdings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol text NOT NULL,
  name text NOT NULL,
  asset_class text NOT NULL CHECK (asset_class IN ('forex', 'crypto', 'stock')),
  quantity numeric NOT NULL CHECK (quantity > 0),
  avg_cost numeric NOT NULL CHECK (avg_cost > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS portfolio_holdings_user_id_idx ON portfolio_holdings (user_id);

ALTER TABLE portfolio_holdings ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON portfolio_holdings TO authenticated;

DROP POLICY IF EXISTS "select_own_holdings" ON portfolio_holdings;
CREATE POLICY "select_own_holdings" ON portfolio_holdings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_holdings" ON portfolio_holdings;
CREATE POLICY "insert_own_holdings" ON portfolio_holdings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_holdings" ON portfolio_holdings;
CREATE POLICY "update_own_holdings" ON portfolio_holdings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_holdings" ON portfolio_holdings;
CREATE POLICY "delete_own_holdings" ON portfolio_holdings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
