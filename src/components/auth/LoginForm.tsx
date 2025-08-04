import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, UserCheck, Users } from "lucide-react";

interface LoginFormProps {
  onLogin: (role: string, credentials: any) => void;
  allowedRoles?: string[];
}

export function LoginForm({ onLogin, allowedRoles }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role && email && password) {
      onLogin(role, { email, password });
    }
  };

  const filteredRoles = allowedRoles || ["admin", "staff"];

  const roleIcons = {
    admin: Shield,
    staff: Users,
    verification: UserCheck,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="role">Access Level</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            {filteredRoles.includes("admin") && (
              <SelectItem value="admin">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Administrator
                </div>
              </SelectItem>
            )}
            {filteredRoles.includes("staff") && (
              <SelectItem value="staff">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Staff Member
                </div>
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={!role || !email || !password}
      >
        Login to {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'System'}
      </Button>

      {/* Demo Credentials */}
      <div className="mt-4 p-3 bg-muted/50 rounded-lg border">
        <p className="text-xs font-medium text-muted-foreground mb-2">Demo Credentials:</p>
        <div className="text-xs space-y-1">
          {filteredRoles.includes("admin") && <div>Admin: admin@demo.com / admin123</div>}
          {filteredRoles.includes("staff") && <div>Staff: staff@demo.com / staff123</div>}
        </div>
      </div>
    </form>
  );
}