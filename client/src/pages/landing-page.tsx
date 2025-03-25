import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, Video, Users, ShoppingBag, Calendar } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function LandingPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect authenticated users trying to access /auth to dashboard
  if (user) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#041D21]">
      {/* Hero Section with Video Background */}
      <div className="relative h-[90vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-background.mp4" type="video/mp4" />
        </video>

        <div className="relative z-20 h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
            Welcome to <span className="text-[#C4A44E]">QXT World</span>
          </h1>
          <p className="text-xl md:text-2xl text-center mb-8 max-w-2xl">
            Your Gateway to Professional Cue Sports Excellence
          </p>
          <div className="space-x-4">
            <Button 
              size="lg" 
              className="bg-[#C4A44E] hover:bg-[#D4C28A] text-white"
              onClick={() => setLocation("/auth")}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-[#C4A44E] text-[#C4A44E] hover:bg-[#C4A44E]/10"
              onClick={() => setLocation("/auth")}
            >
              View Tournaments
            </Button>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="py-20 px-4 bg-[#062128]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#C4A44E]">
            Experience Professional Cue Sports
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-[#041D21] border-[#C4A44E]/20">
              <CardHeader>
                <Video className="h-8 w-8 text-[#C4A44E] mb-2" />
                <CardTitle className="text-[#C4A44E]">Live Streaming</CardTitle>
                <CardDescription className="text-[#D4C28A]">
                  Watch live matches and exclusive content from top players
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-[#D4C28A]">
                  <li>• HD quality streams</li>
                  <li>• Multi-camera angles</li>
                  <li>• Expert commentary</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-[#041D21] border-[#C4A44E]/20">
              <CardHeader>
                <Trophy className="h-8 w-8 text-[#C4A44E] mb-2" />
                <CardTitle className="text-[#C4A44E]">Tournament Booking</CardTitle>
                <CardDescription className="text-[#D4C28A]">
                  Register for tournaments worldwide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-[#D4C28A]">
                  <li>• Easy registration</li>
                  <li>• Multiple roles available</li>
                  <li>• Real-time updates</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-[#041D21] border-[#C4A44E]/20">
              <CardHeader>
                <Calendar className="h-8 w-8 text-[#C4A44E] mb-2" />
                <CardTitle className="text-[#C4A44E]">Training Tools</CardTitle>
                <CardDescription className="text-[#D4C28A]">
                  Advanced training and analysis tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-[#D4C28A]">
                  <li>• AI-powered analysis</li>
                  <li>• Performance tracking</li>
                  <li>• Professional feedback</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-[#041D21] border-[#C4A44E]/20">
              <CardHeader>
                <Users className="h-8 w-8 text-[#C4A44E] mb-2" />
                <CardTitle className="text-[#C4A44E]">Community</CardTitle>
                <CardDescription className="text-[#D4C28A]">
                  Connect with players worldwide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-[#D4C28A]">
                  <li>• Discussion forums</li>
                  <li>• Player networking</li>
                  <li>• Event updates</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-[#041D21] border-[#C4A44E]/20">
              <CardHeader>
                <ShoppingBag className="h-8 w-8 text-[#C4A44E] mb-2" />
                <CardTitle className="text-[#C4A44E]">Pro Shop</CardTitle>
                <CardDescription className="text-[#D4C28A]">
                  Premium equipment and accessories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-[#D4C28A]">
                  <li>• Quality equipment</li>
                  <li>• Expert advice</li>
                  <li>• Worldwide shipping</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Partner Logos */}
      <div className="py-16 px-4 bg-[#041D21]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12 text-[#C4A44E]">
            Trusted by Leading Brands
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-32 h-16 bg-[#062128] rounded flex items-center justify-center"
              >
                <span className="text-[#C4A44E] opacity-50">Partner {i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}