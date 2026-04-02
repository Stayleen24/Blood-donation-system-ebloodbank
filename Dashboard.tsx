import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Droplets, Calendar, MapPin, Heart, Edit2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";


const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [donorRecord, setDonorRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    if (user) {
      fetchData();
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      const [profileRes, donorRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/donors/me"),
      ]);
      setProfile(profileRes.data);
      setDonorRecord(donorRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    if (!donorRecord) return;
    try {
      const { data } = await api.put("/donors/status");
      setDonorRecord({ ...donorRecord, is_available: data.is_available });
      toast({ title: data.is_available ? "Marked as available" : "Marked as unavailable" });
    } catch (err) {
      console.error("Failed to update status", err);
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };


  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <section className="gradient-primary py-12">
        <div className="container text-primary-foreground">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">My Dashboard</h1>
          <p className="text-primary-foreground/80">Manage your profile and donor information</p>
        </div>
      </section>

      <section className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 -mt-16 relative z-10">
          {/* Profile Card */}
          <div className="bg-card rounded-xl shadow-card p-6 animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-primary">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-semibold">{profile?.full_name || "User"}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-muted-foreground">Member since</span>
                <span className="font-medium">{new Date(user?.created_at || "").toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{profile?.phone || "Not set"}</span>
              </div>
            </div>
          </div>

          {/* Donor Status Card */}
          <div className="lg:col-span-2 bg-card rounded-xl shadow-card p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            {donorRecord ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading font-semibold flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" /> Donor Profile
                  </h2>
                  <Button
                    size="sm"
                    variant={donorRecord.is_available ? "default" : "outline"}
                    onClick={toggleAvailability}
                    className={donorRecord.is_available ? "bg-success hover:bg-success/90 text-success-foreground" : ""}
                  >
                    {donorRecord.is_available ? (
                      <><CheckCircle className="h-4 w-4 mr-1" /> Available</>
                    ) : (
                      <><XCircle className="h-4 w-4 mr-1" /> Unavailable</>
                    )}
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <InfoItem icon={Droplets} label="Blood Group" value={donorRecord.blood_group} highlight />
                  <InfoItem icon={User} label="Full Name" value={donorRecord.full_name} />
                  <InfoItem icon={Calendar} label="Age" value={`${donorRecord.age} years`} />
                  <InfoItem icon={MapPin} label="State" value={donorRecord.state} />
                  <InfoItem icon={MapPin} label="District" value={donorRecord.district || "N/A"} />
                  <InfoItem icon={Calendar} label="Last Donation" value={donorRecord.last_donation_date ? new Date(donorRecord.last_donation_date).toLocaleDateString("en-IN") : "Never"} />
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="h-16 w-16 text-primary/20 mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-2">Not registered as a donor</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Register as a blood donor to help save lives. Your information will be available to those in need.
                </p>
                <Button onClick={() => navigate("/register-donor")} className="gradient-primary text-primary-foreground hover:opacity-90">
                  Register as Donor
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <QuickStat title="Blood Banks" value="14+" desc="Registered blood banks in the network" color="primary" />
          <QuickStat title="Donor Status" value={donorRecord ? "Active" : "Inactive"} desc={donorRecord ? "You're part of our donor community" : "Register as a donor to contribute"} color={donorRecord ? "success" : "muted"} />
          <QuickStat title="Blood Groups" value="8" desc="All major blood groups covered" color="accent" />
        </div>
      </section>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value, highlight }: { icon: any; label: string; value: string; highlight?: boolean }) => (
  <div className="p-3 rounded-lg bg-secondary">
    <div className="flex items-center gap-2 mb-1">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <span className={`text-sm font-semibold ${highlight ? "text-primary text-lg" : ""}`}>{value}</span>
  </div>
);

const QuickStat = ({ title, value, desc, color }: { title: string; value: string; desc: string; color: string }) => (
  <div className="bg-card rounded-xl shadow-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
    <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
    <p className={`text-2xl font-heading font-bold ${color === "success" ? "text-success" : color === "accent" ? "text-accent" : "text-primary"}`}>{value}</p>
    <p className="text-xs text-muted-foreground mt-1">{desc}</p>
  </div>
);

export default Dashboard;
