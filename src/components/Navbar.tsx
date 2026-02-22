import { Link, useLocation } from "react-router-dom";
import bumblebeeMascot from "@/assets/bumblebee-mascot.png";

const Navbar = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/launch", label: "Launch" },
    { to: "/explore", label: "Explore" },
    { to: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={bumblebeeMascot} alt="LaunchSafe" className="h-10 w-10 object-contain" />
          <span className="font-display text-xl font-bold tracking-wider text-primary">
            LAUNCHSAFE
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-lg px-4 py-2 font-display text-xs tracking-widest uppercase transition-all duration-200 ${
                location.pathname === link.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
