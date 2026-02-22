import { useState } from "react";
import { Button } from "@/components/ui/button";
import BumblebeeGuide from "@/components/BumblebeeGuide";

const filters = ["All", "Food", "Tech", "Gaming", "AI"];

const tokens = [
  {
    name: "BIRYANI",
    symbol: "BRYN",
    emoji: "🍛",
    project: "Raju's Cloud Kitchen",
    raised: 6.2,
    goal: 10,
    holders: 312,
    category: "Food",
  },
  {
    name: "CHAI",
    symbol: "CHAI",
    emoji: "☕",
    project: "Indian Tea Chain",
    raised: 8.5,
    goal: 12,
    holders: 580,
    category: "Food",
  },
  {
    name: "DOSA",
    symbol: "DOSA",
    emoji: "🫓",
    project: "South Indian Food Network",
    raised: 3.8,
    goal: 8,
    holders: 198,
    category: "Food",
  },
];

const ExploreTokens = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredTokens = activeFilter === "All" 
    ? tokens 
    : tokens.filter(t => t.category === activeFilter);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 flex flex-col items-center gap-6 text-center">
        <h1 className="font-display text-4xl font-black tracking-wider text-foreground lg:text-5xl">
          Live Tokens on <span className="text-primary text-glow">BNB Chain</span>
        </h1>
        <BumblebeeGuide
          message="These projects passed my safety check! Bzzzt! ✅"
          size="sm"
          position="left"
        />
      </div>

      {/* Filters */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`rounded-lg px-5 py-2 font-display text-xs tracking-widest uppercase transition-all ${
              activeFilter === filter
                ? "bg-primary text-primary-foreground glow-primary"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Token Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTokens.map((token) => {
          const progress = (token.raised / token.goal) * 100;
          return (
            <div
              key={token.symbol}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:glow-primary"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-3xl">
                  {token.emoji}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {token.name} <span className="text-muted-foreground text-sm">${token.symbol}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground font-body">{token.project}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="mb-1 flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Raised</span>
                  <span className="text-primary font-semibold">
                    {token.raised} / {token.goal} BNB
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-body">
                  👥 {token.holders} holders
                </span>
                <span className="rounded-full bg-emerald-900/30 px-3 py-1 font-display text-xs tracking-wider text-emerald-400 border border-emerald-500/30">
                  LOCKED 🔒
                </span>
              </div>

              <Button variant="default" size="lg" className="w-full">
                Buy Now
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreTokens;
