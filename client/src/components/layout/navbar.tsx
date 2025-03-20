import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/ui/logo";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Monitor,
  ShoppingBag,
  LogOut,
  User,
  Home,
  Award,
  Users,
  GraduationCap,
  BarChart,
  Dumbbell
} from "lucide-react";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();

  if (!user) return null;

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-24 items-center"> {/* Increased height to accommodate logo shift */}
          <div className="absolute top-20 left-6"> {/* Adjusted top position */}
            <Logo />
          </div>

          <NavigationMenu>
            <NavigationMenuList className="flex gap-4">
              <NavigationMenuItem>
                <Link href="/dashboard">
                  <NavigationMenuLink className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/tournaments">
                  <NavigationMenuLink className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Tournaments
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/training">
                  <NavigationMenuLink className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4" />
                    Training
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/leaderboards">
                  <NavigationMenuLink className="flex items-center gap-2">
                    <BarChart className="h-4 w-4" />
                    Leaderboards
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/community">
                  <NavigationMenuLink className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Community
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/academy">
                  <NavigationMenuLink className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Academy
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/store">
                  <NavigationMenuLink className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Store
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/live-streaming">
                  <NavigationMenuLink className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Live
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                {user.fullName}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}