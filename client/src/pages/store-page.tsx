import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cog, Table2, Shirt, Star, ShoppingBag, ThumbsUp, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function StorePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Equipment Store</h1>

      {/* Main Categories */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cog className="h-5 w-5 text-primary" />
              Cues & Accessories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Professional cues and accessories from top manufacturers.
            </p>
            <Button>Browse Collection</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Table2 className="h-5 w-5 text-primary" />
              Tables & Equipment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Tournament-grade tables and professional equipment.
            </p>
            <Button>View Equipment</Button>
          </CardContent>
        </Card>
      </div>

      {/* Used Equipment Marketplace */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Used Equipment Marketplace</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Professional Cue Set</CardTitle>
              <Badge className="w-fit">Excellent Condition</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-square bg-accent rounded-lg"></div>
                <div>
                  <p className="text-sm text-muted-foreground">Listed by John D.</p>
                  <p className="text-lg font-bold mt-2">$450</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Seller Rating: 4.8/5</span>
                  </div>
                </div>
                <Button className="w-full">Contact Seller</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tournament Break Cue</CardTitle>
              <Badge className="w-fit">Good Condition</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-square bg-accent rounded-lg"></div>
                <div>
                  <p className="text-sm text-muted-foreground">Listed by Sarah W.</p>
                  <p className="text-lg font-bold mt-2">$280</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Seller Rating: 4.9/5</span>
                  </div>
                </div>
                <Button className="w-full">Contact Seller</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mini Practice Table</CardTitle>
              <Badge className="w-fit">Like New</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-square bg-accent rounded-lg"></div>
                <div>
                  <p className="text-sm text-muted-foreground">Listed by Mike R.</p>
                  <p className="text-lg font-bold mt-2">$750</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Seller Rating: 4.7/5</span>
                  </div>
                </div>
                <Button className="w-full">Contact Seller</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pro Recommendations */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Pro Recommendations</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-primary" />
                Based on Your Style
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-accent rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">Pro Break Cue Series X</p>
                      <p className="text-sm text-muted-foreground">
                        Perfect for power break players
                      </p>
                    </div>
                    <Badge variant="outline">98% Match</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      47 players with similar style use this
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-accent rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">Custom Tip Selection</p>
                      <p className="text-sm text-muted-foreground">
                        Based on your spin control preference
                      </p>
                    </div>
                    <Badge variant="outline">95% Match</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Pro player endorsed
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Featured Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-accent rounded-lg">
                  <p className="font-medium">AI-Recommended Equipment</p>
                  <ul className="list-disc list-inside mt-2 space-y-2 text-sm text-muted-foreground">
                    <li>Custom cue weight suggestions</li>
                    <li>Tip hardness recommendations</li>
                    <li>Shaft flexibility analysis</li>
                    <li>Grip style matching</li>
                  </ul>
                </div>
                <Button className="w-full">Get Personalized Recommendations</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Categories */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shirt className="h-5 w-5 text-primary" />
              Apparel & Merchandise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Official QXT World merchandise coming soon.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Bundle Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Special equipment packages coming soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}