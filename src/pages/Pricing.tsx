import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Crown, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth, TIERS, TierKey } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const { user, subscribed, subscriptionTier } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setCheckoutLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      if (data?.url) {
        const link = document.createElement("a");
        link.href = data.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError("Could not start the checkout process. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) {
        const link = document.createElement("a");
        link.href = data.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err: any) {
      console.error("Portal error:", err);
      setError("Could not open subscription management. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Choose the plan that fits your needs. Cancel anytime.
          </p>
        </motion.div>

        {/* Active subscription banner */}
        {user && subscribed && subscriptionTier && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-8 max-w-md rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              <p className="text-sm font-semibold text-foreground">
                You're on the {TIERS[subscriptionTier].name} plan
              </p>
            </div>
            <button
              onClick={handleManageSubscription}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              Manage
            </button>
          </motion.div>
        )}

        {error && (
          <div className="mx-auto mt-6 max-w-md rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive text-center">
            {error}
          </div>
        )}

        {/* Plan cards */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {(Object.entries(TIERS) as [TierKey & string, typeof TIERS[keyof typeof TIERS]][]).map(
            ([key, tier], i) => {
              const isCurrentPlan = subscribed && subscriptionTier === key;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.15 }}
                  className={`relative rounded-2xl border p-8 transition-all ${
                    key === "premium"
                      ? "border-primary bg-primary/5 shadow-xl shadow-primary/10"
                      : "border-border bg-card shadow-lg"
                  } ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
                >
                  {key === "premium" && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                      Most Popular
                    </span>
                  )}
                  {isCurrentPlan && (
                    <span className="absolute top-4 right-4 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                      Your Plan
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                  <p className="mt-4 text-4xl font-bold text-foreground">
                    {tier.price}
                    <span className="text-base font-normal text-muted-foreground">/month</span>
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">{tier.description}</p>

                  <ul className="mt-8 space-y-3">
                    <li className="flex items-center gap-3 text-sm text-foreground">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      {tier.limit === Infinity ? "Unlimited" : tier.limit} translations per month
                    </li>
                    <li className="flex items-center gap-3 text-sm text-foreground">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      All 11 languages supported
                    </li>
                    <li className="flex items-center gap-3 text-sm text-foreground">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      Family member profiles
                    </li>
                    <li className="flex items-center gap-3 text-sm text-foreground">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      Report history & tracking
                    </li>
                    {key === "premium" && (
                      <li className="flex items-center gap-3 text-sm text-foreground">
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                        Priority support
                      </li>
                    )}
                  </ul>

                  {isCurrentPlan ? (
                    <button
                      onClick={handleManageSubscription}
                      className="mt-8 w-full rounded-xl border border-border px-4 py-3.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                    >
                      Manage Subscription
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(tier.price_id)}
                      disabled={checkoutLoading}
                      className={`mt-8 w-full rounded-xl px-4 py-3.5 text-sm font-semibold transition-all ${
                        key === "premium"
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {checkoutLoading ? "Redirecting…" : `Get ${tier.name}`}
                    </button>
                  )}
                </motion.div>
              );
            }
          )}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Not sure yet?{" "}
            <Link to="/translate?demo=true" className="font-medium text-primary hover:underline">
              Try a free demo
            </Link>{" "}
            to see how MedMind works.
          </p>
        </motion.div>
      </div>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 MedMind. Your report is processed securely and never stored without your permission.</p>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
