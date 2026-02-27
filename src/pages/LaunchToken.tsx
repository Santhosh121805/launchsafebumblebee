import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import BumblebeeGuide from "@/components/BumblebeeGuide";
import { useWalletContext } from "@/context/useWalletContext";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const LaunchToken = () => {
  const { address, isConnected } = useWalletContext();
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    totalSupply: "",
    bnbToRaise: "1",
    lockDuration: "1",
    milestone1: "",
    milestone2: "",
    milestone3: "",
    description: "",
  });

  // Reset form on component mount to ensure fresh 1 BNB default
  useEffect(() => {
    setForm({
      name: "",
      symbol: "",
      totalSupply: "",
      bnbToRaise: "1",
      lockDuration: "1",
      milestone1: "",
      milestone2: "",
      milestone3: "",
      description: "",
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    setLogoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    toast.success(`Logo ready: ${file.name}`);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Token name is required");
      return false;
    }
    if (!form.symbol.trim()) {
      toast.error("Token symbol is required");
      return false;
    }
    if (!form.totalSupply || parseInt(form.totalSupply) <= 0) {
      toast.error("Total supply must be greater than 0");
      return false;
    }
    return true;
  };

  const handleLaunch = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("symbol", form.symbol.toUpperCase());
      formData.append("supply", parseInt(form.totalSupply).toString());
      formData.append("bnbToRaise", form.bnbToRaise || "1");
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      console.log("Sending launch request...");
      
      // Use toast.promise for async operations
      await toast.promise(
        axios.post(
          `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/launch`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        ),
        {
          loading: "Launching Token... Bzzzt! ⚡",
          success: (response) => {
            console.log("Response received:", response.data);

            if (response.data && response.data.success) {
              const txHash = response.data.txHash || "";
              
              // Reset form
              setForm({
                name: "",
                symbol: "",
                totalSupply: "",
                bnbToRaise: "1",
                lockDuration: "1",
                milestone1: "",
                milestone2: "",
                milestone3: "",
                description: "",
              });
              removeLogo();

              // Show success with optional tx link
              if (txHash) {
                return `✅ Token Launched! Tx: ${txHash.substring(0, 10)}...`;
              }
              return "✅ Token Launched Successfully!";
            }
            throw new Error("No success response from server");
          },
          error: (error: any) => {
            let errorMsg = "Failed to launch token";
            if (error.response?.data?.error) {
              errorMsg = error.response.data.error;
            } else if (error.message) {
              errorMsg = error.message;
            }
            return `Launch failed: ${errorMsg.substring(0, 80)}`;
          },
        }
      );
    } catch (error: any) {
      console.error("Launch error:", error);
      // Error is already shown in toast.promise
    } finally {
      setIsLoading(false);
    }
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
                  disabled={isLoading}
                  placeholder="e.g. Biryani Coin"
                  className="w-full rounded-lg border border-border bg-input px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
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
                  disabled={isLoading}
                  maxLength={5}
                  placeholder="e.g. BRYN"
                  className="w-full rounded-lg border border-border bg-input px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
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
                  disabled={isLoading}
                  placeholder="e.g. 1000000"
                  className="w-full rounded-lg border border-border bg-input px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
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
                  disabled={isLoading}
                  placeholder="e.g. 1"
                  autoComplete="off"
                  className="w-full rounded-lg border border-border bg-input px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
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
                disabled={isLoading}
                className="w-full rounded-lg border border-border bg-input px-4 py-3 font-body text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
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
                  disabled={isLoading}
                  placeholder="e.g. 200 holders"
                  className="w-full rounded-lg border border-border bg-input px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
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
                  disabled={isLoading}
                  placeholder="e.g. Shop opens"
                  className="w-full rounded-lg border border-border bg-input px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
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
                  disabled={isLoading}
                  placeholder="e.g. 1000 orders"
                  className="w-full rounded-lg border border-border bg-input px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
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
                disabled={isLoading}
                rows={4}
                placeholder="Describe your token and project..."
                className="w-full rounded-lg border border-border bg-input px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="mb-2 block font-display text-xs uppercase tracking-widest text-muted-foreground">
                Upload Token Logo
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={isLoading}
              />
              {logoPreview ? (
                <div className="relative flex h-24 items-center justify-center rounded-lg border-2 border-primary bg-primary/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-20 w-20 rounded object-contain"
                    />
                    <div className="flex flex-col gap-2">
                      <p className="font-body text-sm text-foreground">{logoFile?.name}</p>
                      <button
                        type="button"
                        onClick={removeLogo}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 disabled:opacity-50"
                      >
                        <X className="h-3 w-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex h-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-all ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-border bg-input hover:border-primary/40 hover:bg-input/50"
                  } disabled:opacity-50`}
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                    <span className="font-body text-sm text-muted-foreground">
                      Click or drag to upload logo
                    </span>
                    <p className="font-body text-xs text-muted-foreground/70 mt-1">
                      PNG, JPG, GIF (max 2MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button 
              variant="hero" 
              size="xl" 
              className="w-full mt-4" 
              disabled={isLoading || !isConnected}
              onClick={handleLaunch}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Launching... Bzzzt! ⚡
                </>
              ) : !isConnected ? (
                "Connect Wallet First"
              ) : (
                "Launch Token 🚀"
              )}
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
