import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BumblebeeGuide from "@/components/BumblebeeGuide";

const featureCards = [
  {
    icon: "🔒",
    title: "Anti-Rug Lock",
    description: "Coins locked until milestones hit",
  },
  {
    icon: "💧",
    title: "Smart Liquidity",
    description: "No whale can crash your price",
  },
  {
    icon: "🤖",
    title: "AI Community Agent",
    description: "Robot manages your community 24/7",
  },
];

const stats = [
  { value: "1,200", label: "Tokens Launched" },
  { value: "$4.2M", label: "Protected" },
  { value: "0", label: "Rug Pulls" },
];

const Index = () => {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden">
        <div className="container mx-auto grid grid-cols-1 gap-12 px-4 lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="font-display text-5xl font-black leading-tight tracking-wider text-foreground lg:text-7xl">
              Launch Tokens.{" "}
              <span className="text-primary text-glow">Safe.</span>{" "}
              <span className="text-primary text-glow">Fast.</span>{" "}
              <span className="text-primary text-glow">Smart.</span>
            </h1>
            <p className="max-w-lg text-xl text-muted-foreground font-body">
              The only launchpad on BNB Chain where rug pulls are impossible
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/launch">
                <Button variant="hero" size="xl">
                  Launch Your Token 🚀
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="outline" size="xl">
                  Explore Tokens
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <BumblebeeGuide
              message="Bzzzt! Ready to launch your token, Autobot? I'll make sure nobody runs away with your BNB! 🤖"
              size="lg"
            />
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featureCards.map((card) => (
              <div
                key={card.title}
                className="group rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/40 hover:glow-primary"
              >
                <div className="mb-4 text-5xl">{card.icon}</div>
                <h3 className="mb-2 font-display text-xl font-bold tracking-wider text-primary">
                  {card.title}
                </h3>
                <p className="text-muted-foreground font-body text-lg">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-card py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-4xl font-black text-primary text-glow">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm uppercase tracking-widest text-muted-foreground font-display">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
