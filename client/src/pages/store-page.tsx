import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cog, Table2, Shirt, Star } from "lucide-react";

export default function StorePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Equipment Store</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cog className="h-5 w-5 text-primary" />
              Cues & Accessories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Professional cues and accessories coming soon.
            </p>
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
            <p className="text-muted-foreground">
              Tournament-grade tables and equipment coming soon.
            </p>
          </CardContent>
        </Card>

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
              <Star className="h-5 w-5 text-primary" />
              Featured Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              AI-recommended products based on your style coming soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
