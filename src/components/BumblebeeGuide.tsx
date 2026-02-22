import bumblebeeMascot from "@/assets/bumblebee-mascot.png";

interface BumblebeeGuideProps {
  message: string;
  position?: "right" | "left";
  size?: "sm" | "md" | "lg";
}

const BumblebeeGuide = ({ message, position = "right", size = "md" }: BumblebeeGuideProps) => {
  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-28 h-28",
    lg: "w-36 h-36",
  };

  return (
    <div className={`flex items-end gap-4 ${position === "left" ? "flex-row" : "flex-row-reverse"}`}>
      <img
        src={bumblebeeMascot}
        alt="Bumblebee mascot"
        className={`${sizeClasses[size]} object-contain animate-float drop-shadow-[0_0_15px_hsl(48_100%_50%/0.3)]`}
      />
      <div className="relative max-w-sm animate-speech-pop">
        <div className="rounded-2xl border border-primary/30 bg-secondary px-5 py-4 text-secondary-foreground font-body text-base leading-relaxed">
          {message}
        </div>
        <div
          className={`absolute bottom-4 ${
            position === "left" ? "-left-2" : "-right-2"
          } h-4 w-4 rotate-45 border-b border-r border-primary/30 bg-secondary`}
        />
      </div>
    </div>
  );
};

export default BumblebeeGuide;
