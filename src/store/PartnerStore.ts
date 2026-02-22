/**
 * PartnerStore — Centralized partner/sponsor data model
 *
 * Single source of truth for all placement types:
 *   'hour'   — per-hour sponsor line (WTH check-in flow)
 *   'day'    — full-day sponsor (flows, TODAY banner, missions)
 *   'coupon' — partner deals (Coupons screen)
 *
 * Tier visibility controls whether a user sees a placement.
 * Priority resolves conflicts (lower number = higher priority).
 *
 * Phase 2: Replace PARTNERS mock array with Supabase fetch via SponsorContext.
 */

// ── Types ────────────────────────────────────────────────────────────────────

export type PlacementType = 'hour' | 'day' | 'coupon';

// Tier visibility — governs which users see a placement
// 'all'           → everyone including Freshman (free)
// 'paid_only'     → Varsity and above ($12+/mo)
// 'varsity_plus'  → Varsity and above (same as paid_only, semantic alias)
// 'crucible_plus' → Crucible and above ($29+/mo)
export type TierVisibility = 'all' | 'paid_only' | 'varsity_plus' | 'crucible_plus';

export type CouponPayload = {
  code: string;
  description: string;
  url?: string;
  cta_text?: string;
};

export type Partner = {
  partner_id: string;
  brand_name: string;
  tagline?: string;

  placement_type: PlacementType;
  tier_visibility: TierVisibility;

  // 'hour' placements — which hours to appear in (undefined = all waking hours)
  hour_scope?: { start: number; end: number };

  // 'day' placements
  morning_message?: string;
  evening_message?: string;
  mission_title?: string;
  mission_description?: string;
  mission_xp?: number;

  // 'coupon' placements
  coupon_payload?: CouponPayload;

  // Conflict resolution — lower number wins
  priority: number;
};

// ── Tier resolution ──────────────────────────────────────────────────────────

const TIER_RANK: Record<string, number> = {
  Freshman: 0,
  Varsity:  1,
  Crucible: 2,
  Elite:    3,
  Legendary: 4,
};

function isVisibleForTier(visibility: TierVisibility, tier: string): boolean {
  const rank = TIER_RANK[tier] ?? 0;
  switch (visibility) {
    case 'all':           return true;
    case 'paid_only':
    case 'varsity_plus':  return rank >= 1;
    case 'crucible_plus': return rank >= 2;
    default:              return false;
  }
}

// ── Mock data — replace with Supabase fetch in Phase 2 ──────────────────────
// Add Partner objects here for local development/testing.
// Example:
// {
//   partner_id: 'notion-001',
//   brand_name: 'Notion',
//   tagline: 'Your second brain.',
//   placement_type: 'day',
//   tier_visibility: 'all',
//   morning_message: 'Today\'s flow powered by Notion.',
//   mission_title: 'Capture Your North Star in Notion',
//   mission_description: 'Open Notion and write down your one big goal for today.',
//   mission_xp: 200,
//   coupon_payload: {
//     code: 'WINTHEHOUR',
//     description: '3 months of Notion Plus free.',
//     url: 'https://notion.so',
//     cta_text: 'Claim Free Trial',
//   },
//   priority: 1,
// }
const PARTNERS: Partner[] = [];

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the highest-priority partner for a given hour and user tier.
 * Used by: CheckInsScreen (sponsor line)
 */
export function getPartnerForHour(hour: number, tier: string): Partner | null {
  return PARTNERS
    .filter((p) =>
      p.placement_type === 'hour' &&
      isVisibleForTier(p.tier_visibility, tier) &&
      (!p.hour_scope || (hour >= p.hour_scope.start && hour <= p.hour_scope.end))
    )
    .sort((a, b) => a.priority - b.priority)[0] ?? null;
}

/**
 * Returns the highest-priority day sponsor for a user tier.
 * Used by: FlowsScreen, TodayScreen, MissionsScreen
 */
export function getDailySponsor(tier: string): Partner | null {
  return PARTNERS
    .filter((p) =>
      p.placement_type === 'day' &&
      isVisibleForTier(p.tier_visibility, tier)
    )
    .sort((a, b) => a.priority - b.priority)[0] ?? null;
}

/**
 * Returns all coupon partners visible to a user tier, sorted by priority.
 * Used by: CouponsScreen
 */
export function getAvailableCoupons(tier: string): Partner[] {
  return PARTNERS
    .filter((p) =>
      p.placement_type === 'coupon' &&
      p.coupon_payload != null &&
      isVisibleForTier(p.tier_visibility, tier)
    )
    .sort((a, b) => a.priority - b.priority);
}
