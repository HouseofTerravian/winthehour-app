import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export type SponsoredDay = {
  id: string;
  date: string;
  brand_name: string;
  brand_logo_url: string | null;
  tagline: string | null;
  cta_text: string | null;
  cta_url: string | null;
  morning_message: string | null;
  evening_message: string | null;
  mission_title: string | null;
  mission_description: string | null;
  mission_xp: number;
  coupon_code: string | null;
  coupon_description: string | null;
  coupon_url: string | null;
};

type SponsorContextValue = {
  sponsor: SponsoredDay | null;
  loading: boolean;
};

const SponsorContext = createContext<SponsorContextValue>({ sponsor: null, loading: false });

export function SponsorProvider({ children }: { children: React.ReactNode }) {
  const [sponsor, setSponsor] = useState<SponsoredDay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    supabase
      .from('sponsored_days')
      .select('*')
      .eq('date', today)
      .eq('is_active', true)
      .maybeSingle()
      .then(({ data }) => {
        setSponsor(data ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <SponsorContext.Provider value={{ sponsor, loading }}>
      {children}
    </SponsorContext.Provider>
  );
}

export function useSponsor() {
  return useContext(SponsorContext);
}
