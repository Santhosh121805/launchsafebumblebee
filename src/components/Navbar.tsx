import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import bumblebeeMascot from "@/assets/bumblebee-mascot.png";
import { useWalletContext } from "@/context/useWalletContext";
import { Button } from "@/components/ui/button";
import { AlertCircle, Wallet, MessageCircle, ChevronDown, LogOut } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Navbar = () => {
  const location = useLocation();
  const { address, isConnected, error, balance, connectWallet, disconnectWallet, formatAddress, isLoading } = useWalletContext();
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAccountDropdown(false);
      }
    };

    if (showAccountDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showAccountDropdown]);

  // Generate avatar color based on address
  const getAvatarColor = (addr: string) => {
    const colors = [
      "bg-yellow-500",
      "bg-amber-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-pink-500",
      "bg-purple-500",
      "bg-blue-500",
      "bg-cyan-500",
    ];
    const hash = addr.charCodeAt(2) + addr.charCodeAt(3);
    return colors[hash % colors.length];
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/launch", label: "Launch" },
    { to: "/explore", label: "Explore" },
    { to: "/dashboard", label: "Dashboard" },
  ];

  return (
    <>
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

          {/* Wallet Connection Button */}
          <div className="flex items-center gap-3">
            {isConnected ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  className="flex items-center gap-2 rounded-lg bg-yellow-500/15 hover:bg-yellow-500/25 px-4 py-2 border border-yellow-500/30 hover:border-yellow-500/50 transition-all font-orbitron"
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${getAvatarColor(address!)}`} />
                  <span className="font-mono text-xs font-semibold text-yellow-500">
                    {formatAddress(address!)}
                  </span>
                  <span className="text-xs text-yellow-600/70">|</span>
                  <span className="font-mono text-xs text-yellow-500/80">
                    {balance || "0.00"} tBNB
                  </span>
                  <ChevronDown className="h-3 w-3 text-yellow-500 transition-transform" style={{ transform: showAccountDropdown ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>

                {/* Account Dropdown */}
                {showAccountDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-black/90 border border-yellow-500/30 rounded-lg shadow-lg z-50 backdrop-blur-sm">
                    <div className="p-4 space-y-3">
                      {/* Account Info */}
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${getAvatarColor(address!)} flex items-center justify-center`}>
                          <span className="text-white text-xs font-bold">1</span>
                        </div>
                        <div>
                          <p className="text-xs text-yellow-500/70">Account</p>
                          <p className="font-mono text-sm text-yellow-500 font-bold">{formatAddress(address!)}</p>
                        </div>
                      </div>

                      {/* Balance Display */}
                      <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
                        <p className="text-xs text-yellow-500/70 mb-1">Balance</p>
                        <p className="font-mono text-sm font-bold text-yellow-500">{balance || "0.00"} tBNB</p>
                      </div>

                      {/* Note */}
                      <p className="text-xs text-yellow-500/50 italic">
                        💡 Switch account in MetaMask to change wallet
                      </p>

                      {/* Disconnect Button */}
                      <button
                        onClick={() => {
                          console.log('🔌 Disconnecting wallet...');
                          disconnectWallet();
                          // Reset dropdown after a tiny delay to ensure state updates
                          setTimeout(() => {
                            setShowAccountDropdown(false);
                            console.log('✅ Dropdown closed, ready to reconnect');
                          }, 50);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 text-red-500 font-orbitron py-2 rounded-lg transition-all text-xs font-semibold"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        DISCONNECT
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={() => {
                  console.log('🐝 Connect wallet button clicked');
                  connectWallet();
                }}
                disabled={isLoading}
                className="flex items-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-500 font-orbitron"
              >
                <Wallet className="h-4 w-4" />
                {isLoading ? "🔄 CONNECTING..." : "🐝 CONNECT WALLET"}
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="fixed top-20 left-4 right-4 z-50 max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default Navbar;
