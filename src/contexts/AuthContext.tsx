import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const TIERS = {
  basic: {
    price_id: "price_1T8llFLGhXIcOwIWkZQBwwlc",
    product_id: "prod_U6zkbUzk7EPdb3",
    name: "Basic",
    price: "€3",
    limit: 5,
    description: "5 report translations per month",
  },
  premium: {
    price_id: "price_1T8llrLGhXIcOwIW4NxjJHAO",
    product_id: "prod_U6zl6XE2WtG0gj",
    name: "Premium",
    price: "€8",
    limit: Infinity,
    description: "Unlimited report translations per month",
  },
} as const;

export type TierKey = keyof typeof TIERS | null;

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  subscribed: boolean;
  subscriptionTier: TierKey;
  subscriptionEnd: string | null;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  subscribed: false,
  subscriptionTier: null,
  subscriptionEnd: null,
  refreshSubscription: async () => {},
});

export const useAuth = () => useContext(AuthContext);

function getTierKey(productId: string | null): TierKey {
  if (!productId) return null;
  for (const [key, tier] of Object.entries(TIERS)) {
    if (tier.product_id === productId) return key as TierKey;
  }
  return null;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<TierKey>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  const refreshSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      setSubscribed(data?.subscribed ?? false);
      setSubscriptionTier(getTierKey(data?.product_id ?? null));
      setSubscriptionEnd(data?.subscription_end ?? null);
    } catch (err) {
      console.error("Failed to check subscription:", err);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check subscription when session changes
  useEffect(() => {
    if (session?.user) {
      refreshSubscription();
    } else {
      setSubscribed(false);
      setSubscriptionTier(null);
      setSubscriptionEnd(null);
    }
  }, [session?.user?.id]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user ?? null,
      loading,
      signOut,
      subscribed,
      subscriptionTier,
      subscriptionEnd,
      refreshSubscription,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
