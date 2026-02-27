import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import BumblebeeGuide from "@/components/BumblebeeGuide";
import { motion } from "framer-motion";

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

// Floating hex particles
const HexParticle = ({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) => (
  <motion.div
    className="absolute border border-primary/20 rotate-45"
    style={{ left: x, top: y, width: size, height: size }}
    animate={{
      y: [0, -30, 0],
      opacity: [0.15, 0.4, 0.15],
      rotate: [45, 90, 45],
    }}
    transition={{ duration: 6, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

// Glowing orb
const GlowOrb = ({ x, y, size, delay }: { x: string; y: string; size: number; delay: number }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      left: x,
      top: y,
      width: size,
      height: size,
      background: "radial-gradient(circle, hsl(48 100% 50% / 0.15), transparent 70%)",
    }}
    animate={{
      scale: [1, 1.4, 1],
      opacity: [0.3, 0.7, 0.3],
    }}
    transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

// Circuit line
const CircuitLine = ({ d, delay }: { d: string; delay: number }) => (
  <motion.svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 1440 900"
    preserveAspectRatio="none"
  >
    <motion.path
      d={d}
      fill="none"
      stroke="hsl(48 100% 50% / 0.08)"
      strokeWidth="1"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 3, delay, ease: "easeInOut" }}
    />
    <motion.circle
      r="3"
      fill="hsl(48 100% 50% / 0.5)"
      initial={{ offsetDistance: "0%" }}
      animate={{ offsetDistance: "100%" }}
      transition={{ duration: 4, delay: delay + 1, repeat: Infinity, ease: "linear" }}
    >
      <animateMotion dur="4s" begin={`${delay + 1}s`} repeatCount="indefinite" path={d} />
    </motion.circle>
  </motion.svg>
);

const Index = () => {
  const [stats, setStats] = useState([
    { value: "0", label: "Tokens Launched" },
    { value: "0", label: "Holders" },
    { value: "0", label: "Rug Pulls" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/tokens`
        );
        if (response.data.success && response.data.tokens) {
          const tokens = response.data.tokens;
          const totalTokens = tokens.length;
          const totalHolders = tokens.reduce((sum: number, token: any) => sum + (token.holders || 0), 0);
          
          setStats([
            { value: totalTokens.toString(), label: "Tokens Launched" },
            { value: totalHolders.toString(), label: "Holders" },
            { value: "0", label: "Rug Pulls" },
          ]);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col overflow-hidden">
      {/* === HERO === */}
      <section className="relative flex min-h-screen items-center">
        {/* Ambient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />

        {/* Radial glow behind hero */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsl(48 100% 50% / 0.06) 0%, transparent 60%)",
          }}
        />

        {/* Floating particles */}
        <HexParticle delay={0} x="10%" y="20%" size={20} />
        <HexParticle delay={1.5} x="80%" y="15%" size={14} />
        <HexParticle delay={0.8} x="70%" y="70%" size={18} />
        <HexParticle delay={2} x="15%" y="75%" size={12} />
        <HexParticle delay={3} x="50%" y="10%" size={16} />
        <HexParticle delay={1} x="90%" y="50%" size={10} />
        <HexParticle delay={2.5} x="30%" y="85%" size={22} />

        {/* Glow orbs */}
        <GlowOrb x="5%" y="30%" size={200} delay={0} />
        <GlowOrb x="75%" y="60%" size={300} delay={2} />
        <GlowOrb x="40%" y="10%" size={150} delay={1} />

        {/* Circuit lines */}
        <CircuitLine d="M 0 450 Q 200 400 400 450 T 800 420 T 1200 460 T 1440 440" delay={0} />
        <CircuitLine d="M 0 300 Q 300 250 600 300 T 1000 280 T 1440 310" delay={1.5} />
        <CircuitLine d="M 0 600 Q 250 550 500 600 T 900 580 T 1440 610" delay={0.7} />

        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, hsl(48 100% 50% / 0.15), transparent)" }}
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid opacity-50" />

        {/* Content */}
        <div className="container relative mx-auto grid grid-cols-1 gap-12 px-4 lg:grid-cols-2">
          <motion.div
            className="flex flex-col justify-center gap-8"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-display text-5xl font-black leading-tight tracking-wider text-foreground lg:text-7xl">
              Launch Tokens.{" "}
              <motion.span
                className="text-primary text-glow inline-block"
                animate={{ textShadow: ["0 0 20px hsl(48 100% 50% / 0.5)", "0 0 40px hsl(48 100% 50% / 0.8)", "0 0 20px hsl(48 100% 50% / 0.5)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Safe.
              </motion.span>{" "}
              <motion.span
                className="text-primary text-glow inline-block"
                animate={{ textShadow: ["0 0 20px hsl(48 100% 50% / 0.5)", "0 0 40px hsl(48 100% 50% / 0.8)", "0 0 20px hsl(48 100% 50% / 0.5)"] }}
                transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
              >
                Fast.
              </motion.span>{" "}
              <motion.span
                className="text-primary text-glow inline-block"
                animate={{ textShadow: ["0 0 20px hsl(48 100% 50% / 0.5)", "0 0 40px hsl(48 100% 50% / 0.8)", "0 0 20px hsl(48 100% 50% / 0.5)"] }}
                transition={{ duration: 2, delay: 1, repeat: Infinity }}
              >
                Smart.
              </motion.span>
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

            {/* Mini stat ticker */}
            <motion.div
              className="flex gap-6 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span className="font-display text-lg font-bold text-primary">{stat.value}</span>
                  <span className="text-xs text-muted-foreground font-display uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Join Community Banner */}
            <motion.a
              href="https://web.telegram.org/k/#-5199166513"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 rounded-2xl border-2 border-yellow-500/50 bg-yellow-500/10 p-4 hover:border-yellow-500/80 hover:bg-yellow-500/20 transition-all group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl group-hover:scale-110 transition-transform">🐝</span>
                <div className="flex-1">
                  <p className="font-display font-bold text-yellow-400 tracking-wider">📢 Join 100+ Autobots</p>
                  <p className="text-sm text-yellow-400/70 font-body">Get live token updates & milestone alerts in Telegram</p>
                </div>
                <span className="font-display font-bold text-yellow-400 whitespace-nowrap">JOIN NOW →</span>
              </div>
            </motion.a>
          </motion.div>

          <motion.div
            className="flex items-center justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            {/* Rings around Bumblebee */}
            <div className="relative">
              <motion.div
                className="absolute inset-[-60px] rounded-full border border-primary/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-[-100px] rounded-full border border-dashed border-primary/5"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              {/* Orbiting dot */}
              <motion.div
                className="absolute inset-[-60px]"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary glow-primary" />
              </motion.div>

              <BumblebeeGuide
                message="Bzzzt! Ready to launch your token, Autobot? I'll make sure nobody runs away with your BNB! 🤖"
                size="lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* === FEATURE CARDS === */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-card via-background to-background" />
        <div className="container relative mx-auto px-4">
          <motion.h2
            className="text-center font-display text-3xl font-bold tracking-wider text-foreground mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Built for <span className="text-primary text-glow">Autobots</span>
          </motion.h2>
          <motion.p
            className="text-center text-muted-foreground font-body text-lg mb-14 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Every feature designed to protect your mission
          </motion.p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featureCards.map((card, i) => (
              <motion.div
                key={card.title}
                className="group relative rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/40 hover:glow-primary overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4 }}
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                  <div className="absolute top-0 right-0 w-px h-8 bg-gradient-to-b from-primary/40 to-transparent" />
                  <div className="absolute top-0 right-0 h-px w-8 bg-gradient-to-l from-primary/40 to-transparent" />
                </div>

                <div className="mb-4 text-5xl">{card.icon}</div>
                <h3 className="mb-2 font-display text-xl font-bold tracking-wider text-primary">
                  {card.title}
                </h3>
                <p className="text-muted-foreground font-body text-lg">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === STATS BAR === */}
      <section className="relative border-y border-border bg-card py-14">
        {/* Horizontal line accents */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="font-display text-4xl font-black text-primary text-glow">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm uppercase tracking-widest text-muted-foreground font-display">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA === */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-t from-card to-background" />
        <GlowOrb x="50%" y="50%" size={400} delay={0} />
        <div className="container relative mx-auto px-4 text-center">
          <motion.h2
            className="font-display text-4xl font-black tracking-wider text-foreground mb-4 lg:text-5xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to <span className="text-primary text-glow">Roll Out</span>?
          </motion.h2>
          <motion.p
            className="text-muted-foreground font-body text-lg mb-8 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Join the safest token launchpad on BNB Chain. Bumblebee's got your back.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/launch">
              <Button variant="hero" size="xl">
                Launch Now ⚡
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
