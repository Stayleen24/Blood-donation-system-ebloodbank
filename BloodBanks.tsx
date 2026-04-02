import { useState, useEffect } from "react";
import { Building2, Search, MapPin, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { states } from "@/data/mockData";
import api from "@/lib/api";

const BloodBanks = () => {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [banks, setBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const { data } = await api.get("/blood-banks");
        setBanks(data || []);
      } catch (err) {
        console.error("Failed to fetch blood banks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanks();
  }, []);


  const filtered = banks.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.district.toLowerCase().includes(search.toLowerCase());
    const matchesState = !stateFilter || stateFilter === "all" || b.state === stateFilter;
    return matchesSearch && matchesState;
  });

  return (
    <div>
      <section className="gradient-primary py-12">
        <div className="container text-primary-foreground">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Blood Banks Directory</h1>
          <p className="text-primary-foreground/80">Find registered blood banks near you</p>
        </div>
      </section>

      <section className="container py-8">
        <div className="bg-card rounded-xl shadow-card p-6 -mt-16 relative z-10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name or district..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">State</label>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger><SelectValue placeholder="All States" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {states.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading blood banks...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-16">
            {filtered.map((bank, i) => (
              <div key={bank.id} className="bg-card rounded-xl shadow-card p-6 hover:shadow-card-hover transition-all duration-300 border-l-4 border-primary opacity-0 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary flex-shrink-0">
                    <Building2 className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-heading font-semibold truncate">{bank.name}</h3>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mt-1">{bank.category}</span>
                    <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {bank.address}</p>
                      <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> {bank.phone}</p>
                      <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> {bank.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No blood banks found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default BloodBanks;
