
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Users } from "lucide-react";

interface LoginFormProps {
  onLogin: (role: string, credentials: any) => Promise<void>;
  allowedRoles?: string[];
}

export function LoginForm({ onLogin, allowedRoles }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      await onLogin(role || 'staff', { email, password });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRoles = allowedRoles || ["admin", "staff"];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {filteredRoles.length > 1 && (
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
      )}

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
        disabled={!email || !password || isLoading}
      >
        {isLoading ? 'Logging in...' : 'Login'}
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
