import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Trophy, Monitor, ShoppingBag, LogOut, User } from "lucide-react";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();

  if (!user) return null;

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link href="/">
            <a className="text-2xl font-bold">QXT World</a>
          </Link>

          <NavigationMenu>
            <NavigationMenuList className="flex gap-6">
              <NavigationMenuItem>
                <Link href="/tournaments">
                  <NavigationMenuLink className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Tournaments
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {user.role === 'referee' && (
                <NavigationMenuItem>
                  <Link href="/live-scoring">
                    <NavigationMenuLink className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      Live Scoring
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}

              <NavigationMenuItem>
                <Link href="/shop">
                  <NavigationMenuLink className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Shop
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