-- Win The Hour! — Sponsored Days Schema
-- Run this in your Supabase SQL editor.

CREATE TABLE IF NOT EXISTS sponsored_days (
  id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  date                date        NOT NULL UNIQUE,          -- The calendar date being sponsored (YYYY-MM-DD)
  brand_name          text        NOT NULL,                 -- Display name shown across all placements
  brand_logo_url      text,                                 -- Optional logo URL (future: Image component)
  tagline             text,                                 -- Short brand line, e.g. "Fuel your focus"
  cta_text            text,                                 -- Button label, e.g. "Claim your offer"
  cta_url             text,                                 -- Destination URL for CTA button
  morning_message     text,                                 -- Shown on Morning Flow card
  evening_message     text,                                 -- Shown on Evening Flow card
  mission_title       text,                                 -- Title of sponsored daily mission
  mission_description text,                                 -- Description of sponsored daily mission
  mission_xp          integer     NOT NULL DEFAULT 200,     -- XP reward for completing sponsored mission
  coupon_code         text,                                 -- Promo/discount code
  coupon_description  text,                                 -- What the coupon is for
  coupon_url          text,                                 -- Redemption URL
  is_active           boolean     NOT NULL DEFAULT true,    -- Set false to suppress without deleting
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE sponsored_days ENABLE ROW LEVEL SECURITY;

-- Allow public read access (sponsor content is not user-specific)
CREATE POLICY "Public read sponsored_days"
  ON sponsored_days
  FOR SELECT
  USING (true);

-- Only service role can insert/update/delete (managed via Supabase dashboard or backend)
-- No additional insert/update policies needed for client-side app.

-- Example insert (replace values before running):
-- INSERT INTO sponsored_days (date, brand_name, tagline, morning_message, evening_message, mission_title, mission_description, mission_xp, coupon_code, coupon_description, coupon_url, cta_text, cta_url)
-- VALUES (
--   '2026-02-21',
--   'Notion',
--   'Your second brain. Built for winners.',
--   'Today''s flow is powered by Notion — organize your North Star.',
--   'Tonight''s reflection powered by Notion. Document your wins.',
--   'Try Notion for Free',
--   'Sign up for Notion and capture your first big idea.',
--   200,
--   'WINTHEHOUR',
--   'Get 3 months of Notion Plus free.',
--   'https://notion.so',
--   'Claim Free Trial',
--   'https://notion.so/signup'
-- );
