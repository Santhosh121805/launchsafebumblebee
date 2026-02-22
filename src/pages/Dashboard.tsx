import BumblebeeGuide from "@/components/BumblebeeGuide";

const statsCards = [
  { icon: "👥", label: "Holders", value: "450" },
  { icon: "📈", label: "Price Change", value: "+12%" },
  { icon: "🔒", label: "Locked Coins", value: "400,000" },
  { icon: "🔓", label: "Next Unlock", value: "12 days" },
];

const milestones = [
  { status: "completed", icon: "✅", title: "200 holders", detail: "COMPLETED — 20% unlocked" },
  { status: "progress", icon: "⏳", title: "Shop opens", detail: "IN PROGRESS — 30% locked" },
  { status: "locked", icon: "🔒", title: "1000 orders", detail: "NOT STARTED — 50% locked" },
];

const aiActivity = [
  { text: "Sent milestone update to 450 holders", time: "2 hrs ago" },
  { text: "Re-engaged 80 inactive holders with reward alert", time: "5 hrs ago" },
  { text: "Answered 12 community questions automatically", time: "1 day ago" },
  { text: "Posted weekly performance report", time: "2 days ago" },
  { text: "Onboarded 25 new holders with welcome sequence", time: "3 days ago" },
];

const Dashboard = () => {
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

      {/* Stats */}
      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statsCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-primary/40"
          >
            <div className="text-3xl mb-2">{card.icon}</div>
            <div className="font-display text-2xl font-black text-primary text-glow">
              {card.value}
            </div>
            <div className="mt-1 font-display text-xs uppercase tracking-widest text-muted-foreground">
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Milestones */}
      <div className="mb-10 rounded-2xl border border-border bg-card p-8">
        <h2 className="mb-6 font-display text-xl font-bold tracking-wider text-foreground">
          Milestone Progress
        </h2>
        <div className="space-y-4">
          {milestones.map((m) => (
            <div
              key={m.title}
              className={`flex items-center gap-4 rounded-xl border p-5 ${
                m.status === "completed"
                  ? "border-green-500/30 bg-green-900/10"
                  : m.status === "progress"
                  ? "border-primary/30 bg-secondary"
                  : "border-border bg-muted/50"
              }`}
            >
              <span className="text-2xl">{m.icon}</span>
              <div>
                <div className="font-display text-sm font-bold tracking-wider text-foreground">
                  {m.title}
                </div>
                <div className="text-sm text-muted-foreground font-body">{m.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
