import { useState, useEffect } from "react";
import { Search, Droplets, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bloodGroups, states, componentTypes } from "@/data/mockData";
import api from "@/lib/api";


interface BloodBankResult {
  id: string;
  name: string;
  state: string;
  district: string;
  address: string;
  phone: string;
  email: string;
  category: string;
  inventory: { blood_group: string; units_available: number }[];
}

const SearchBlood = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("");
  const [results, setResults] = useState<BloodBankResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);

    try {
      const params: any = {};
      if (selectedState && selectedState !== 'all') params.state = selectedState;

      // First get banks
      const { data: banks } = await api.get("/blood-banks");

      // Filter banks by state if selected
      const filteredBanks = selectedState
        ? banks.filter((b: any) => b.state === selectedState)
        : banks;

      if (filteredBanks.length === 0) {
        setResults([]);
        setSearched(true);
        setLoading(false);
        return;
      }

      // Then get inventory
      const invParams: any = {};
      if (selectedBloodGroup) invParams.bloodGroup = selectedBloodGroup;
      if (selectedComponent) invParams.componentType = selectedComponent;

      const { data: inventory } = await api.get("/blood-inventory", { params: invParams });

      const mapped: BloodBankResult[] = filteredBanks
        .map((bank: any) => ({
          ...bank,
          inventory: (inventory || []).filter((inv: any) => inv.blood_bank === bank._id || inv.blood_bank === bank.id),
        }))
        .filter((bank: BloodBankResult) => !selectedBloodGroup || bank.inventory.length > 0);

      setResults(mapped);
      setSearched(true);
    } catch (err) {
      console.error("Failed to search blood", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div>
      <section className="gradient-primary py-12">
        <div className="container text-primary-foreground">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Search Blood Availability</h1>
          <p className="text-primary-foreground/80">Find available blood units across registered blood banks</p>
        </div>
      </section>

      <section className="container py-8">
        <div className="bg-card rounded-xl shadow-card p-6 md:p-8 -mt-16 relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-heading font-semibold">Filter Options</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">State</label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                <SelectContent>
                  {states.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Blood Group</label>
              <Select value={selectedBloodGroup} onValueChange={setSelectedBloodGroup}>
                <SelectTrigger><SelectValue placeholder="Select Blood Group" /></SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((bg) => (<SelectItem key={bg} value={bg}>{bg}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Component Type</label>
              <Select value={selectedComponent} onValueChange={setSelectedComponent}>
                <SelectTrigger><SelectValue placeholder="Select Component" /></SelectTrigger>
                <SelectContent>
                  {componentTypes.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleSearch} disabled={loading} className="gradient-primary text-primary-foreground hover:opacity-90 gap-2">
            <Search className="h-4 w-4" /> {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </section>

      <section className="container pb-16">
        {searched && <p className="text-sm text-muted-foreground mb-4">{results.length} blood bank(s) found</p>}
        <div className="grid gap-4">
          {results.map((bank) => (
            <div key={bank.id} className="bg-card rounded-xl shadow-card p-6 hover:shadow-card-hover transition-all">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-heading font-semibold text-primary">{bank.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{bank.address}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                    <span>📞 {bank.phone}</span>
                    <span>📧 {bank.email}</span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">{bank.category}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {bank.inventory.map((inv) => (
                    <div key={inv.blood_group} className={`flex flex-col items-center px-3 py-2 rounded-lg border text-xs font-medium ${inv.units_available > 20 ? "border-success/30 bg-success/10 text-success"
                      : inv.units_available > 5 ? "border-warning/30 bg-warning/10 text-warning"
                        : "border-destructive/30 bg-destructive/10 text-destructive"
                      }`}>
                      <Droplets className="h-3 w-3 mb-0.5" />
                      <span className="font-bold">{inv.blood_group}</span>
                      <span>{inv.units_available} units</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SearchBlood;
