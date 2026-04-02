import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Droplets, Phone, User, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Search Blood", path: "/search" },
  { label: "Find Donors", path: "/find-donors" },
  { label: "Blood Banks", path: "/blood-banks" },
  { label: "Blood Camps", path: "/blood-camps" },
  { label: "Donor Registration", path: "/register-donor" },
  { label: "About", path: "/about" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Signed out successfully" });
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="gradient-primary">
        <div className="container flex items-center justify-between py-2 text-primary-foreground">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span className="hidden sm:inline">Helpline:</span> 90966-14688
            </span>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-dark/50 gap-1">
                      <LayoutDashboard className="h-4 w-4" />
                      <span className="hidden sm:inline">Admin Dashboard</span>
                    </Button>
                  </Link>
                )}
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-dark/50 gap-1">
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">User Dashboard</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-dark/50 gap-1" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-dark/50 gap-1">
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Register</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-card shadow-card border-b border-border">
        <div className="container flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2">
            <div>
              <span className="text-xl font-heading font-bold text-primary">eBloodBank</span>
              <p className="text-[10px] text-muted-foreground leading-tight">Blood Donation Management System</p>
            </div>
          </Link>

          <ul className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary hover:text-secondary-foreground"
                    }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <button className="xl:hidden p-2 rounded-md hover:bg-muted" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="xl:hidden border-t border-border bg-card animate-fade-in">
            <ul className="container py-4 space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} onClick={() => setMobileOpen(false)} className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"}`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
