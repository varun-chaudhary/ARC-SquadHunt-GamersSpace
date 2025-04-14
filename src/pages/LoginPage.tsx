
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@arc.com');
  const [password, setPassword] = useState('admin123');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to admin
  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Sample credentials for demo
  const sampleUsers = [
    { role: 'admin', email: 'admin@arc.com', password: 'admin123' },
    { role: 'organizer', email: 'organizer@arc.com', password: 'organizer123' },
    { role: 'player', email: 'player@arc.com', password: 'player123' },
  ];

  const setDemoCredentials = (role: string) => {
    const user = sampleUsers.find(u => u.role === role);
    if (user) {
      setEmail(user.email);
      setPassword(user.password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-admin-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">ARC Admin Panel</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@arc.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">Demo accounts:</p>
              <div className="flex flex-wrap gap-2">
                {sampleUsers.map(user => (
                  <Button
                    key={user.role}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDemoCredentials(user.role)}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-admin-primary hover:bg-admin-primary/90 mt-4" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-center w-full text-muted-foreground">
            This is a demo panel for ARC. Different roles have different levels of access.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
