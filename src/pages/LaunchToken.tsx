import { useState } from "react";
import { Button } from "@/components/ui/button";
import BumblebeeGuide from "@/components/BumblebeeGuide";

const LaunchToken = () => {
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    totalSupply: "",
    bnbToRaise: "",
    lockDuration: "1",
    milestone1: "",
    milestone2: "",
    milestone3: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 flex flex-col items-center gap-6 text-center">
        <h1 className="font-display text-4xl font-black tracking-wider text-foreground lg:text-5xl">
          Launch Your <span className="text-primary text-glow">Token</span>
        </h1>
        <BumblebeeGuide
          message="Fill this out and I'll handle the rest! Bzzzt! ⚡"
          size="sm"
          position="left"
        />
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-display text-xs uppercase tracking-widest text-muted-foreground">
                  Token Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Biryani Coin"
                  className="w-full rounded-lg border border-border bg-input px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-2 block font-display text-xs uppercase tracking-widest text-muted-foreground">
                  Token Symbol
                </label>
                <input
                  type="text"
                  name="symbol"
                  value={form.symbol}
                  onChange={handleChange}
                  maxLength={5}
                  placeholder="e.g. BRYN"
                  className="w-full rounded-lg border border-border bg-input px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-display text-xs uppercase tracking-widest text-muted-foreground">
                  Total Supply
                </label>
                <input
                  type="number"
                  name="totalSupply"
                  value={form.totalSupply}
                  onChange={handleChange}
                  placeholder="e.g. 1000000"
                  className="w-full rounded-lg border border-border bg-input px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-2 block font-display text-xs uppercase tracking-widest text-muted-foreground">
                  BNB to Raise
                </label>
                <input
                  type="number"
                  name="bnbToRaise"
                  value={form.bnbToRaise}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  className="w-full rounded-lg border border-border bg-input px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-display text-xs uppercase tracking-widest text-muted-foreground">
                Lock Duration
              </label>
              <select
                name="lockDuration"
                value={form.lockDuration}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-input px-4 py-3 font-body text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="1">1 Month</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
              </select>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="mb-2 block font-display text-xs uppercase tracking-widest text-muted-foreground">
                  Milestone 1
                </label>
                <input
                  type="text"
                  name="milestone1"
                  value={form.milestone1}
                  onChange={handleChange}
                  placeholder="e.g. 200 holders"
                  className="w-full rounded-lg border border-border bg-input px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-2 block font-display text-xs uppercase tracking-widest text-muted-foreground">
                  Milestone 2
                </label>
                <input
                  type="text"
                  name="milestone2"
                  value={form.milestone2}
                  onChange={handleChange}
                  placeholder="e.g. Shop opens"
                  className="w-full rounded-lg border border-border bg-input px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-2 block font-display text-xs uppercase tracking-widest text-muted-foreground">
                  Milestone 3
                </label>
                <input
                  type="text"
                  name="milestone3"
                  value={form.milestone3}
                  onChange={handleChange}
                  placeholder="e.g. 1000 orders"
                  className="w-full rounded-lg border border-border bg-input px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-display text-xs uppercase tracking-widest text-muted-foreground">
                Token Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your token and project..."
                className="w-full rounded-lg border border-border bg-input px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-display text-xs uppercase tracking-widest text-muted-foreground">
                Upload Token Logo
              </label>
              <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-border bg-input transition-colors hover:border-primary/40 cursor-pointer">
                <span className="text-muted-foreground font-body">Click or drag to upload logo</span>
              </div>
            </div>

            <Button variant="hero" size="xl" className="w-full mt-4">
              Connect Wallet & Launch 🚀
            </Button>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <BumblebeeGuide
            message="Once you launch, your coins are LOCKED until you hit your goals. No cheating on my watch! 🤖"
            size="md"
            position="left"
          />
        </div>
      </div>
    </div>
  );
};

export default LaunchToken;
