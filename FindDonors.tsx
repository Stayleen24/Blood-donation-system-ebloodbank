import { useState, useEffect } from "react";
import { Search, User, Droplets, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bloodGroups, states } from "@/data/mockData";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const FindDonors = () => {
  const { user } = useAuth();
  const [bloodGroup, setBloodGroup] = useState("");
  const [state, setState] = useState("");
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const params: any = {};
      if (bloodGroup) params.bloodGroup = bloodGroup;
      if (state) params.state = state;

      const { data } = await api.get("/donors", { params });
      setDonors(data || []);
      setSearched(true);
    } catch (err) {
      console.error("Failed to search donors", err);
    } finally {
      setLoading(false);
    }
  };


  if (!user) {
    return (
      <div>
        <section className="gradient-primary py-12">
          <div className="container text-primary-foreground">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Find Blood Donors</h1>
            <p className="text-primary-foreground/80">Connect with voluntary blood donors near you</p>
          </div>
        </section>
        <div className="container py-16 text-center">
          <User className="h-16 w-16 text-primary/20 mx-auto mb-4" />
          <h2 className="text-xl font-heading font-semibold mb-2">Login Required</h2>
          <p className="text-muted-foreground mb-6">You need to be logged in to search for donors.</p>
          <Link to="/login"><Button className="gradient-primary text-primary-foreground">Login to Continue</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="gradient-primary py-12">
        <div className="container text-primary-foreground">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Find Blood Donors</h1>
          <p className="text-primary-foreground/80">Connect with voluntary blood donors near you</p>
        </div>
      </section>

      <section className="container py-8">
        <div className="bg-card rounded-xl shadow-card p-6 md:p-8 -mt-16 relative z-10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Blood Group</label>
              <Select value={bloodGroup} onValueChange={setBloodGroup}>
                <SelectTrigger><SelectValue placeholder="Select Blood Group" /></SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((bg) => (<SelectItem key={bg} value={bg}>{bg}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">State</label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                <SelectContent>
                  {states.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={loading} className="w-full gradient-primary text-primary-foreground hover:opacity-90 gap-2">
                <Search className="h-4 w-4" /> {loading ? "Searching..." : "Search Donors"}
              </Button>
            </div>
          </div>
        </div>

        {searched && <p className="text-sm text-muted-foreground mb-4">{donors.length} donor(s) found</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-16">
          {donors.map((donor, i) => (
            <div
              key={donor.id}
              className="bg-card rounded-xl shadow-card p-5 hover:shadow-card-hover transition-all border-t-4 border-primary opacity-0 animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary">
                  <Droplets className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <span className="text-2xl font-heading font-bold text-primary">{donor.blood_group}</span>
                </div>
              </div>
              <h3 className="font-heading font-semibold mb-2">{donor.full_name}</h3>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {donor.district ? `${donor.district}, ` : ""}{donor.state}</p>
                <p className="flex items-center gap-2"><User className="h-3.5 w-3.5" /> Age: {donor.age} years</p>
                <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> {donor.phone}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                  ✓ Available
                </span>
              </div>
            </div>
          ))}
          {searched && donors.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No donors found. Try different filters or check back later.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FindDonors;
