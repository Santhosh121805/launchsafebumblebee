import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import BumblebeeGuide from "@/components/BumblebeeGuide";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useWallet } from "@/hooks/useWallet";

interface Token {
  _id?: string;
  address?: string;
  name: string;
  symbol: string;
  totalSupply: number;
  founder?: string;
  holders?: number;
  bnbRaised?: number;
  bnbToRaise?: number;
  nextMilestone?: number;
  logoUrl?: string;
}

const ExploreTokens = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useWallet();
  
  // Buy Modal State
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [bnbAmount, setBnbAmount] = useState("");
  const [buying, setBuying] = useState(false);

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
      setError("Cannot connect to backend. Make sure server is running!");
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

  const handleBuyClick = (token: Token) => {
    if (!window.ethereum) {
      toast.error("❌ MetaMask not installed! Install MetaMask to buy tokens.");
      return;
    }
    setSelectedToken(token);
    setBnbAmount("");
    setShowBuyModal(true);
  };

  const handleBuyNow = async () => {
    if (!selectedToken || !bnbAmount) {
      toast.error("❌ Please fill in all fields");
      return;
    }

    if (!address) {
      toast.error("❌ Connect wallet first!");
      return;
    }

    setBuying(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/buy`,
        {
          tokenAddress: selectedToken.address,
          buyerAddress: address,
          bnbAmount: parseFloat(bnbAmount).toString()
        }
      );

      if (response.data.success) {
        toast.success(
          `✅ Purchase successful!\nYou now own ${response.data.tokensReceived} ${selectedToken.symbol} tokens!\nBzzzt! ⚡`
        );
        setShowBuyModal(false);
        setBnbAmount("");
        fetchTokens(); // Refresh token data
      }
    } catch (err: any) {
      console.error("Buy error:", err);
      toast.error("❌ Purchase failed. Try again!");
    } finally {
      setBuying(false);
    }
  };

  const tokensReceived = selectedToken && bnbAmount 
    ? (parseFloat(bnbAmount) * (selectedToken.totalSupply || 0) / (selectedToken.bnbToRaise || 10)).toFixed(0)
    : 0;

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
          <span className="ml-3 font-body text-muted-foreground">Loading live tokens...</span>
        </div>
      ) : tokens.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-2xl mb-4">🚀</p>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">No Tokens Available Yet</h2>
          <p className="text-muted-foreground font-body">
            Check back soon for new token launches!
          </p>
        </div>
      ) : (
        <>
          {/* Token Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tokens.map((token) => {
              const goal = token.bnbToRaise || 10; // Default to 10 if not specified
              const progress = (token.bnbRaised || 0) / goal * 100;

              return (
                <div
                  key={token._id || `${token.symbol}-${token.founder}`}
                  className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:glow-primary"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary overflow-hidden border-2 border-primary/20 group-hover:border-primary/50 transition-colors">
                      {token.logoUrl ? (
                        <img 
                          src={token.logoUrl} 
                          alt={token.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">🐝</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground">
                        {token.name} <span className="text-muted-foreground text-sm">${token.symbol}</span>
                      </h3>
                      <p className="text-sm text-muted-foreground font-body">
                        {token.founder || "Community Project"}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="mb-1 flex justify-between text-sm font-body">
                      <span className="text-muted-foreground">Raised</span>
                      <span className="text-primary font-semibold">
                        {(token.bnbRaised || 0).toFixed(2)} / {goal.toFixed(1)} BNB
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-body">
                      👥 {token.holders || 0} holders
                    </span>
                    {progress >= 100 ? (
                      <span className="rounded-full bg-yellow-900/30 px-3 py-1 font-display text-xs tracking-wider text-yellow-400 border border-yellow-500/30 font-semibold">
                        GOAL REACHED! 🎉
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-900/30 px-3 py-1 font-display text-xs tracking-wider text-emerald-400 border border-emerald-500/30">
                        LOCKED 🔒
                      </span>
                    )}
                  </div>

                  <div className="mb-4 flex gap-2">
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="flex-1"
                      onClick={() => handleBuyClick(token)}
                    >
                      Buy Now
                    </Button>
                    <a
                      href="https://web.telegram.org/k/#-5199166513"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-500/40 hover:border-yellow-500/60 text-yellow-400 transition-colors flex items-center justify-center gap-2 font-display font-semibold text-sm"
                      title="Get live updates on this token"
                    >
                      📢 Telegram
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Buy Modal */}
      {showBuyModal && selectedToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border-2 border-primary bg-black p-8 text-foreground shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setShowBuyModal(false)}
              className="absolute right-4 top-4 rounded-lg bg-primary/20 p-2 text-primary hover:bg-primary/40"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Title */}
            <h2 className="font-display text-2xl font-black tracking-wider text-primary text-glow mb-6">
              Buy {selectedToken.symbol}
            </h2>

            {/* Token Info */}
            <div className="mb-6 space-y-3 rounded-xl bg-muted/30 p-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-body">Token Name:</span>
                <span className="font-semibold">{selectedToken.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-body">Symbol:</span>
                <span className="font-semibold text-primary">${selectedToken.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-body">Token Price:</span>
                <span className="font-semibold">
                  {selectedToken.totalSupply ? (10 / selectedToken.totalSupply).toFixed(8) : "0"} BNB
                </span>
              </div>
            </div>

            {/* BNB Input */}
            <div className="mb-4">
              <label className="mb-2 block font-display text-sm font-bold tracking-wider text-foreground">
                Enter BNB Amount:
              </label>
              <input
                type="number"
                step="0.01"
                value={bnbAmount}
                onChange={(e) => setBnbAmount(e.target.value)}
                placeholder="0.1"
                disabled={buying}
                className="w-full rounded-lg border-2 border-primary bg-muted/20 px-4 py-3 font-body text-foreground placeholder-muted-foreground focus:border-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              />
            </div>

            {/* Tokens Received */}
            {bnbAmount && (
              <div className="mb-6 rounded-lg border border-primary/40 bg-primary/10 p-4">
                <p className="text-center">
                  <span className="font-display text-sm text-muted-foreground">You will receive:</span>
                  <br />
                  <span className="font-display text-2xl font-black text-primary text-glow">
                    {tokensReceived} {selectedToken.symbol}
                  </span>
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setShowBuyModal(false)}
                disabled={buying}
              >
                Cancel
              </Button>
              <Button
                size="lg"
                className="flex-1"
                onClick={handleBuyNow}
                disabled={buying || !bnbAmount}
              >
                {buying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buying... Bzzzt! ⚡
                  </>
                ) : (
                  "CONFIRM BUY 🚀"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreTokens;
