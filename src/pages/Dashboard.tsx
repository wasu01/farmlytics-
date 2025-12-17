import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Leaf, ShoppingCart, ScanLine, TrendingUp, Users, MessageSquare, UserSearch, Bell, BarChart2, Settings } from "lucide-react";
import plantDiagnosisIcon from "@/assets/plant-diagnosis-icon.png";
import marketplaceIcon from "@/assets/marketplace-icon.png";
// import { VoiceSaathiAI } from "@/components/VoiceSaathiAI";
import { SaathiAI } from "@/components/SaathiAI";
interface Profile {
  role: "farmer" | "user" | "wholesaler";
  full_name: string;
}
const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  useEffect(() => {
    fetchProfile();
  }, []);
  const fetchProfile = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const {
        data,
        error
      } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single();
      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading profile",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }
  const getDashboardContent = () => {
    switch (profile?.role) {
      case "farmer":
        return {
          title: "Farmer Dashboard",
          subtitle: "Manage your crops and sell products",
          features: [
            {
              title: "Farmlytics ID",
              description: "Generate and manage your permanent Farmlytics ID. Secure, digital, and always accessible.",
              icon: BarChart2,
              action: () => navigate("/farmlytics-id")
            },
            {
              title: "Plant Diagnosis",
              description: "AI-powered disease detection for your crops",
              icon: ScanLine,
              image: plantDiagnosisIcon,
              action: () => navigate("/diagnosis")
            },
            {
              title: "My Products",
              description: "List and manage your products for sale",
              icon: Leaf,
              image: marketplaceIcon,
              action: () => navigate("/marketplace")
            },
            {
              title: "Community Forum",
              description: "Connect with other farmers and wholesalers",
              icon: MessageSquare,
              action: () => navigate("/community")
            },
            {
              title: "User Directory",
              description: "Find and connect with farmers and wholesalers",
              icon: UserSearch,
              action: () => navigate("/directory")
            },
            {
              title: "Market Analysis",
              description: "View real-time market trends and prices",
              icon: TrendingUp,
              action: () => navigate("/market-analysis")
            }
          ]
        };
      case "wholesaler":
        return {
          title: "Wholesaler Dashboard",
          subtitle: "Source products in bulk from farmers",
          features: [{
            title: "Browse Products",
            description: "Find quality products from local farmers",
            icon: ShoppingCart,
            image: marketplaceIcon,
            action: () => navigate("/marketplace")
          }, {
            title: "Community Forum",
            description: "Connect with farmers",
            icon: MessageSquare,
            action: () => navigate("/community")
          }, {
            title: "Find Farmers",
            description: "Search and connect with suppliers",
            icon: UserSearch,
            action: () => navigate("/directory")
          }, {
            title: "Market Analysis",
            description: "Analyze supply and demand trends",
            icon: TrendingUp,
            action: () => navigate("/market-analysis")
          }]
        };
      default:
        return {
          title: "User Dashboard",
          subtitle: "Discover fresh produce from local farmers",
          features: [{
            title: "Marketplace",
            description: "Browse and purchase fresh produce",
            icon: ShoppingCart,
            image: marketplaceIcon,
            action: () => navigate("/marketplace")
          }, {
            title: "Plant Diagnosis",
            description: "Get help identifying plant issues",
            icon: ScanLine,
            image: plantDiagnosisIcon,
            action: () => navigate("/diagnosis")
          }, {
            title: "Community Forum",
            description: "Connect with farmers and learn",
            icon: MessageSquare,
            action: () => navigate("/community")
          }, {
            title: "Find Farmers",
            description: "Search and connect with local farmers",
            icon: UserSearch,
            action: () => navigate("/directory")
          }]
        };
    }
  };
  const content = getDashboardContent();
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#e8ffe8] via-[#f6fff6] to-[#d0ffd0] relative overflow-x-hidden">
      {/* Decorative background blobs and farming elements - Hidden on mobile to prevent overflow */}
      <div className="hidden md:block absolute -top-32 -left-32 w-96 h-96 bg-[#00FF75]/30 rounded-full blur-3xl z-0" />
      <div className="hidden md:block absolute top-1/2 right-0 w-80 h-80 bg-[#0D1F0F]/10 rounded-full blur-2xl z-0" />
      <div className="hidden md:block absolute bottom-0 left-1/4 w-72 h-72 bg-[#FFD700]/20 rounded-full blur-2xl z-0" />
      <div className="hidden md:block absolute top-0 right-1/4 w-60 h-60 bg-[#00E66A]/20 rounded-full blur-2xl z-0" />
      {/* SVG Leaves - Hidden on mobile */}
      <svg className="hidden md:block absolute left-10 top-10 w-24 h-24 z-0 opacity-70" viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="32" rx="32" ry="16" fill="#00FF75" fillOpacity="0.3" /><path d="M32 8C36 24 56 32 56 32C56 32 36 40 32 56C28 40 8 32 8 32C8 32 28 24 32 8Z" fill="#0D1F0F" fillOpacity="0.15" /></svg>
      {/* SVG Tree - Hidden on mobile */}
      <svg className="hidden md:block absolute right-10 bottom-10 w-28 h-32 z-0 opacity-80" viewBox="0 0 80 100" fill="none"><rect x="36" y="60" width="8" height="30" rx="4" fill="#8B5C2A" /><ellipse cx="40" cy="50" rx="30" ry="20" fill="#00FF75" fillOpacity="0.5" /><ellipse cx="40" cy="40" rx="20" ry="14" fill="#00E66A" fillOpacity="0.7" /></svg>
      {/* Abstract farming shapes - Hidden on mobile */}
      <svg className="hidden md:block absolute left-1/2 top-1/3 w-40 h-20 z-0 opacity-40" style={{ transform: 'translateX(-50%)' }} viewBox="0 0 160 80" fill="none"><ellipse cx="80" cy="40" rx="80" ry="20" fill="#FFD700" fillOpacity="0.15" /></svg>
      <svg className="hidden md:block absolute left-16 bottom-24 w-24 h-16 z-0 opacity-30" viewBox="0 0 96 48" fill="none"><ellipse cx="48" cy="24" rx="48" ry="12" fill="#00FF75" fillOpacity="0.12" /></svg>
      <svg className="hidden md:block absolute right-24 top-24 w-20 h-20 z-0 opacity-20" viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="32" rx="32" ry="16" fill="#FFD700" fillOpacity="0.12" /></svg>
      {/* Main Layout */}
      <div className="relative z-10 flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-24 bg-[#0D1F0F] text-white py-8 px-2 items-center gap-8 shadow-2xl rounded-tr-3xl rounded-br-3xl">
          <div className="mb-10">
            <img src="/logo192.png" alt="Farmlytics" className="w-12 h-12 rounded-full border-2 border-[#00FF75] shadow-lg" />
          </div>
          {/* Navigation Items */}
          {[
            {
              label: "Dashboard",
              icon: BarChart2,
              path: "/dashboard",
              active: true
            },
            {
              label: "Plant Diagnosis",
              icon: ScanLine,
              path: "/diagnosis"
            },
            {
              label: "My Products",
              icon: Leaf,
              path: "/marketplace"
            },
            {
              label: "Market Analysis",
              icon: TrendingUp,
              path: "/market-analysis"
            },
            {
              label: "Community",
              icon: MessageSquare,
              path: "/community"
            },
            {
              label: "Directory",
              icon: UserSearch,
              path: "/directory"
            },
            {
              label: "Settings",
              icon: Settings,
              path: "/settings"
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            const isActive = window.location.pathname === item.path || (item.label === "Dashboard" && window.location.pathname === "/dashboard");
            return (
              <button
                key={item.label}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl w-16 h-20 mb-1 transition-all font-semibold tracking-wide text-xs focus:outline-none focus:ring-2 focus:ring-[#00FF75] focus:ring-offset-2 focus:ring-offset-[#0D1F0F] 
                  ${isActive ? "bg-[#00FF75]/30 text-[#00FF75] shadow-lg" : "hover:bg-[#00FF75]/10 hover:text-[#00FF75] text-white/80"}`}
                onClick={() => navigate(item.path)}
                aria-label={item.label}
              >
                <span className="text-2xl mb-1"><Icon /></span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Hero Section with SaathiAI in header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-3 md:px-6 pt-4 md:pt-8 pb-4 gap-3 md:gap-6">
            <div className="flex-1 flex items-center w-full md:w-auto">
              <div className="scale-100 md:scale-150 lg:scale-175 transition-transform origin-left">
                <SaathiAI />
              </div>
            </div>
            {/* Top-right Widgets */}
            <div className="flex items-center gap-2 md:gap-5 w-full md:w-auto justify-end flex-wrap">
              {/* Weather Widget - Hidden on small mobile */}
              <div className="hidden sm:flex flex-col items-center px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#e0ffe0] via-[#f0fff0] to-[#d0ffd0] shadow-lg border border-[#00FF75]/30 min-w-[80px] md:min-w-[90px]">
                <span className="text-base md:text-xl font-extrabold text-[#0D1F0F] flex items-center gap-1">
                  28°C <span className="text-lg md:text-2xl">☀️</span>
                </span>
                <span className="text-[10px] md:text-xs text-[#0D1F0F]/60 mt-1">Rainfall: 2mm</span>
              </div>
              {/* Notifications Bell */}
              <button className="relative p-2 md:p-3 rounded-full bg-gradient-to-br from-[#e0ffe0] to-[#d0ffd0] shadow-lg border border-[#00FF75]/30 hover:bg-[#00FF75]/20 transition group focus:outline-none focus:ring-2 focus:ring-[#00FF75]">
                <Bell className="w-5 h-5 md:w-6 md:h-6 text-[#0D1F0F] group-hover:text-[#00FF75] transition" />
                <span className="absolute top-1 right-1 md:top-2 md:right-2 w-2 h-2 md:w-2.5 md:h-2.5 bg-[#00FF75] rounded-full border-2 border-white animate-pulse" />
              </button>
              {/* Profile Mini-Card */}
              <div className="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#e0ffe0] via-[#f0fff0] to-[#d0ffd0] shadow-lg border border-[#00FF75]/30">
                <span className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-[#0D1F0F] flex items-center justify-center text-white font-extrabold text-sm md:text-lg border-2 border-[#00FF75]">
                  {profile?.full_name?.[0] || 'F'}
                </span>
                <span className="hidden sm:inline text-[#0D1F0F] font-bold text-sm md:text-base truncate max-w-[60px] md:max-w-[90px]">{profile?.full_name || 'Farmer'}</span>
                <button onClick={handleSignOut} className="ml-1 md:ml-2 text-[#0D1F0F]/60 hover:text-red-600 transition" title="Sign Out">
                  <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
          {/* Section Divider */}
          <div className="w-full h-1 bg-gradient-to-r from-[#00FF75]/0 via-[#00FF75]/40 to-[#FFD700]/0 rounded-full mb-4 md:mb-8 shadow-md" />
          {/* Dashboard Cards (to be refactored in next step) */}
          <main className="container mx-auto px-3 md:px-4 py-4 md:py-8">
            {/* Welcome Back Section (centered) */}
            <div className="mb-6 md:mb-8 animate-fade-in flex flex-col items-center justify-center">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0D1F0F] mb-2 text-center">Namaste, {profile?.full_name || "Farmer"} 👋</h1>
              <div className="flex gap-2 md:gap-4 flex-wrap justify-center">
                <div className="px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl shadow-md bg-white/80 flex flex-col items-center border-l-4 border-[#00FF75]">
                  <span className="text-[10px] md:text-xs text-[#0D1F0F]/60 font-semibold">Weather</span>
                  <span className="text-sm md:text-lg font-bold text-[#0D1F0F]">28°C, ☀️</span>
                </div>
                <div className="px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl shadow-md bg-white/80 flex flex-col items-center">
                  <span className="text-[10px] md:text-xs text-[#0D1F0F]/60 font-semibold">My Crops</span>
                  <span className="text-sm md:text-lg font-bold text-[#0D1F0F]">12</span>
                </div>
                <div className="px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl shadow-md bg-white/80 flex flex-col items-center">
                  <span className="text-[10px] md:text-xs text-[#0D1F0F]/60 font-semibold">Price Alerts</span>
                  <span className="text-sm md:text-lg font-bold text-[#0D1F0F]">3</span>
                </div>
              </div>
            </div>
            {/* About Us Section */}
            <div className="mb-6 md:mb-10 animate-fade-in">
              <div className="bg-gradient-to-br from-[#e0ffe0] via-[#f0fff0] to-[#d0ffd0] rounded-2xl md:rounded-3xl shadow-lg border border-[#00FF75]/30 p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6">
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-[#0D1F0F] mb-2 flex items-center gap-2">
                    <span role="img" aria-label="leaf">🌱</span> About Us
                  </h2>
                  <p className="text-[#0D1F0F]/80 text-sm md:text-base lg:text-lg mb-2">
                    We are <span className="font-semibold text-[#00FF75]">The Farmer's Stand</span>, a mission-driven platform revolutionizing how food moves from the farm to your table. We partner with government bodies to create secure, verified market spaces that empower farmers to completely bypass the middleman. Our app provides every farmer with a secure <span className="font-semibold text-[#00FF75]">Farmlytics ID</span> for guaranteed access, coupled with smart tools like the <span className="font-semibold text-[#00FF75]">Saathi AI</span> and live pricing to boost their yield and their earnings. We're here to guarantee farmers higher profits and give consumers the freshest produce—all through a trustworthy, efficient, and transparent digital system.
                  </p>
                  <Button variant="link" className="text-[#00FF75] font-bold px-0 text-sm md:text-base" onClick={() => navigate('/about')}>
                    Learn more about us &rarr;
                  </Button>
                </div>
                <img src="/assets/about-farming.svg" alt="About Farming" className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain hidden md:block" />
              </div>
            </div>
            {/* Dashboard Section */}
            <div className="mb-6 md:mb-8 animate-harvest">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{content.title}</h2>
              <p className="text-muted-foreground text-sm md:text-base">{content.subtitle}</p>
            </div>
            <div className="grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {content.features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="relative group cursor-pointer rounded-2xl md:rounded-3xl p-1 bg-gradient-to-br from-[#e0ffe0] via-[#f0fff0] to-[#d0ffd0] shadow-xl hover:shadow-2xl transition-all hover:scale-105 animate-grow"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={feature.action}
                  >
                    <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-white/60 backdrop-blur-xl border border-[#00FF75]/30 group-hover:bg-white/80 transition" />
                    <div className="relative z-10 flex flex-col items-center p-4 md:p-8">
                      <div className="mb-3 md:mb-4 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-gradient-to-tr from-[#00FF75]/30 to-[#FFD700]/20 shadow-inner">
                        {feature.image ? (
                          <img src={feature.image} alt={feature.title} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                        ) : (
                          <Icon className="w-10 h-10 md:w-12 md:h-12 text-[#00FF75]" />
                        )}
                      </div>
                      <h3 className="text-lg md:text-xl font-extrabold text-[#0D1F0F] mb-1 text-center drop-shadow-sm">
                        {feature.title}
                      </h3>
                      <p className="text-sm md:text-base text-[#0D1F0F]/70 text-center mb-3 md:mb-4 min-h-[40px] md:min-h-[48px]">
                        {feature.description}
                      </p>
                      <Button className="w-full bg-gradient-to-r from-[#00FF75] to-[#FFD700] text-[#0D1F0F] font-bold shadow-md hover:from-[#FFD700] hover:to-[#00FF75] transition text-sm md:text-base">
                        Get Started
                      </Button>
                    </div>
                    {/* Glassmorphism shine effect */}
                    <div className="absolute left-4 top-4 w-1/2 h-1/4 bg-white/40 rounded-full blur-lg opacity-60 pointer-events-none" />
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
