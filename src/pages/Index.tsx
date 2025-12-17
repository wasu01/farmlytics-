import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, ShoppingCart, ScanLine } from "lucide-react";
import heroImage from "@/assets/hero-agriculture.jpg";
const Index = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen">
    {/* Hero Section */}
    <div className="relative h-screen">
      <img src={heroImage} alt="Agriculture" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary/70" />
      <div className="relative h-full flex items-center justify-center text-center px-4">
        <div className="max-w-4xl space-y-4 md:space-y-6 animate-harvest text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">Farmlytics</h1>
          <p className="text-xl sm:text-2xl md:text-3xl">Your Smart Agriculture Ecosystem</p>
          <p className="text-base sm:text-lg md:text-xl opacity-90">Connecting Farmers, Users, and Wholesalers</p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-4 md:pt-8">
            <Button size="lg" variant="secondary" onClick={() => navigate("/auth")} className="text-base md:text-lg w-full sm:w-auto">
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-base md:text-lg border-white hover:bg-white/20 text-slate-950 w-full sm:w-auto">
              Sign In
            </Button>
            <Button size="lg" variant="ghost" onClick={() => navigate("/about")} className="text-base md:text-lg border-white hover:bg-white/10 text-white w-full sm:w-auto">
              About Us
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Features Section */}
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="text-center space-y-3 md:space-y-4 p-4 md:p-6 rounded-lg bg-card hover:shadow-lg transition-all">
            <ScanLine className="w-12 h-12 md:w-16 md:h-16 mx-auto text-primary" />
            <h3 className="text-xl md:text-2xl font-bold">Plant Diagnosis</h3>
            <p className="text-muted-foreground text-sm md:text-base">AI-powered disease detection for your crops</p>
          </div>
          <div className="text-center space-y-3 md:space-y-4 p-4 md:p-6 rounded-lg bg-card hover:shadow-lg transition-all">
            <ShoppingCart className="w-12 h-12 md:w-16 md:h-16 mx-auto text-primary" />
            <h3 className="text-xl md:text-2xl font-bold">Marketplace</h3>
            <p className="text-muted-foreground text-sm md:text-base">Buy and sell fresh produce directly</p>
          </div>
          <div className="text-center space-y-3 md:space-y-4 p-4 md:p-6 rounded-lg bg-card hover:shadow-lg transition-all">
            <Leaf className="w-12 h-12 md:w-16 md:h-16 mx-auto text-primary" />
            <h3 className="text-xl md:text-2xl font-bold">Community</h3>
            <p className="text-muted-foreground text-sm md:text-base">Connect with farmers and wholesalers</p>
          </div>
        </div>
      </div>
    </section>
  </div>;
};
export default Index;
