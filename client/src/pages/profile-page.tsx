import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { toast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user } = useAuth();

  const updateRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      const response = await apiRequest("PATCH", `/api/users/${user!.id}`, { role });
      return response.json();
    },
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(["/api/user"], updatedUser);
      toast({
        title: "Role Updated",
        description: "Your role has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Profile Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>User Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.role === 'admin' ? (
                <div className="text-sm text-muted-foreground">
                  You are an administrator. This role has special privileges for managing the platform.
                </div>
              ) : (
                <>
                  <p className="text-muted-foreground">
                    Select your primary role in the platform. This will determine your access and capabilities.
                  </p>

                  <Select
                    defaultValue={user.role}
                    onValueChange={(value) => updateRoleMutation.mutate(value)}
                    disabled={updateRoleMutation.isPending}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="player">Player</SelectItem>
                      <SelectItem value="coach">Coach</SelectItem>
                      <SelectItem value="referee">Referee</SelectItem>
                    </SelectContent>
                  </Select>

                  {updateRoleMutation.isPending && (
                    <p className="text-sm text-muted-foreground">Updating role...</p>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {user.role === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle>Administration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  As an administrator, you have access to:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>Creating and managing tournaments</li>
                  <li>Managing user roles and permissions</li>
                  <li>Approving tournament registrations</li>
                  <li>System-wide settings and configurations</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}