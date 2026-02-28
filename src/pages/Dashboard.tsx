import { useEffect, useState } from "react";
import axios from "axios";
import BumblebeeGuide from "@/components/BumblebeeGuide";
import { Loader2 } from "lucide-react";

const aiActivity = [
  { text: "Sent milestone update to 450 holders", time: "2 hrs ago" },
  { text: "Re-engaged 80 inactive holders with reward alert", time: "5 hrs ago" },
  { text: "Answered 12 community questions automatically", time: "1 day ago" },
  { text: "Posted weekly performance report", time: "2 days ago" },
  { text: "Onboarded 25 new holders with welcome sequence", time: "3 days ago" },
];

interface Token {
  _id?: string;
  name: string;
  symbol: string;
  totalSupply: number;
  founder?: string;
  logoUrl?: string;
}

const Dashboard = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = async () => {
    try {
      setError(null);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/tokens`
      );
      if (response.data.success) {
        setTokens(response.data.tokens || []);
      }
    } catch (err: any) {
      console.error("Error fetching tokens:", err);
      const errorMsg = err.message || "Cannot connect to backend. Make sure server is running!";
      setError(errorMsg);
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchTokens, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate stats from tokens
  const totalTokens = tokens.length;
  const totalHolders = tokens.reduce((sum, token) => sum + (token.holders || 0), 0);
  const totalLockedCoins = tokens.reduce((sum, token) => sum + (token.totalSupply || 0), 0);

  const statsCards = [
    { icon: "🚀", label: "Tokens Launched", value: totalTokens },
    { icon: "👥", label: "Total Holders", value: totalHolders },
    { icon: "🔒", label: "Locked Coins", value: totalLockedCoins.toLocaleString() },
    { icon: "⚡", label: "AI Status", value: "Active" },
  ];
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 flex flex-col items-center gap-6 text-center">
        <h1 className="font-display text-4xl font-black tracking-wider text-foreground lg:text-5xl">
          Your Token <span className="text-primary text-glow">Dashboard</span>
        </h1>
        <BumblebeeGuide
          message="Here's your mission report, Commander! Bzzzt! 📊"
          size="sm"
          position="left"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-body">
            ❌ {error}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 font-body text-muted-foreground">Loading your tokens...</span>
        </div>
      ) : tokens.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-2xl mb-4">🚀</p>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">No Tokens Launched Yet</h2>
          <p className="text-muted-foreground font-body mb-6">
            Launch your first token and watch it grow!
          </p>
          <a 
            href="/launch"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-display font-bold hover:bg-primary/90"
          >
            Launch Your First Token 🚀
          </a>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {statsCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-primary/40"
              >
                <div className="text-3xl mb-2">{card.icon}</div>
                <div className="font-display text-2xl font-black text-primary text-glow">
                  {typeof card.value === 'number' ? (card.value > 999 ? (card.value / 1000).toFixed(1) + 'k' : card.value) : card.value}
                </div>
                <div className="mt-1 font-display text-xs uppercase tracking-widest text-muted-foreground">
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          {/* Join Community Card */}
          <a
            href="https://web.telegram.org/k/#-5199166513"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-10 rounded-2xl border-2 border-yellow-500/40 bg-gradientto-r from-yellow-500/10 to-yellow-500/5 p-6 hover:border-yellow-500/60 hover:bg-yellow-500/15 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl group-hover:scale-110 transition-transform">🤖</div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold text-yellow-400 tracking-wider mb-1">
                  Bumblebee is Watching 24/7
                </h3>
                <p className="text-sm text-yellow-400/70 font-body">
                  Get live token alerts, milestone updates, and community engagement stats in Telegram
                </p>
              </div>
              <span className="font-display font-bold text-yellow-400 whitespace-nowrap ml-4">JOIN →</span>
            </div>
          </a>

          {/* Token Cards */}
          <div className="mb-10 rounded-2xl border border-border bg-card p-8">
            <h2 className="mb-6 font-display text-xl font-bold tracking-wider text-foreground">
              🎯 Your Launched Tokens
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {tokens.map((token) => (
                <div
                  key={token._id || token.symbol}
                  className="rounded-xl border border-border bg-muted/50 p-6 hover:border-primary/40"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary overflow-hidden border-2 border-primary/20">
                        {token.logoUrl ? (
                          <img 
                            src={token.logoUrl} 
                            alt={token.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl">🐝</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-foreground">
                          {token.name}
                        </h3>
                        <p className="text-sm text-muted-foreground font-body">
                          ${token.symbol}
                        </p>
                      </div>
                    </div>
                    {(() => {
                      const goal = token.bnbToRaise || 10;
                      const progress = (token.bnbRaised || 0) / goal * 100;
                      return progress >= 100 ? (
                        <span className="rounded-full bg-red-900/30 px-3 py-1 font-display text-xs tracking-wider text-red-400 border border-red-500/30 font-semibold">
                          SOLD OUT
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-900/30 px-3 py-1 font-display text-xs tracking-wider text-emerald-400 border border-emerald-500/30">
                          LOCKED 🔒
                        </span>
                      );
                    })()}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between font-body">
                      <span className="text-muted-foreground">Total Supply:</span>
                      <span className="text-foreground font-semibold">
                        {(token.totalSupply || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between font-body">
                      <span className="text-muted-foreground">Holder Count:</span>
                      <span className="text-foreground font-semibold">
                        {token.holders || 0}
                      </span>
                    </div>
                    <div className="flex justify-between font-body">
                      <span className="text-muted-foreground">Next Milestone:</span>
                      <span className="text-primary font-semibold">{token.nextMilestone || 100} holders</span>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${((token.holders || 0) / (token.nextMilestone || 100) * 100).toFixed(0)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {((token.holders || 0) / (token.nextMilestone || 100) * 100).toFixed(0)}% to next unlock
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* AI Agent Activity */}
      <div className="mb-10 rounded-2xl border border-border bg-card p-8">
        <h2 className="mb-6 font-display text-xl font-bold tracking-wider text-foreground">
          🤖 Bumblebee AI Agent Activity
        </h2>
        <div className="space-y-3">
          {aiActivity.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-border bg-muted/50 px-5 py-4"
            >
              <span className="text-foreground font-body">{item.text}</span>
              <span className="text-sm text-muted-foreground font-body whitespace-nowrap ml-4">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Suggestion */}
      <div className="rounded-2xl border border-primary/40 bg-secondary p-8 glow-primary">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="font-display text-lg font-bold tracking-wider text-primary mb-2">
              Bumblebee Tip
            </h3>
            <p className="text-secondary-foreground font-body text-lg">
              Post a video of your product today — tokens with video updates get 3x more engagement! 
              Your community is waiting, Commander! 🎬
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
