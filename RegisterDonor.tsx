import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { bloodGroups, states } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";


const RegisterDonor = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    bloodGroup: "",
    state: "",
    district: "",
    address: "",
    consent: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please login first", description: "You need to be logged in to register as a donor.", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!form.name || !form.email || !form.phone || !form.age || !form.bloodGroup || !form.state || !form.consent) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    const age = parseInt(form.age);
    if (age < 18 || age > 65) {
      toast({ title: "Age must be between 18 and 65", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      await api.post("/donors", {
        // user_id is handled by token in backend
        fullName: form.name,
        email: form.email,
        phone: form.phone,
        age,
        bloodGroup: form.bloodGroup,
        state: form.state,
        district: form.district || "",
        address: form.address || "",
      });

      setSubmitted(true);
      toast({ title: "Registration successful!", description: "Thank you for registering as a blood donor." });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Registration failed", description: err.response?.data?.error || "Unknown error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };


  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <CheckCircle className="h-20 w-20 text-success mx-auto mb-6" />
          <h2 className="text-3xl font-heading font-bold mb-3">Registration Successful!</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Thank you for registering as a blood donor, <strong>{form.name}</strong>. Your willingness to donate can save lives.
          </p>
          <Button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", age: "", bloodGroup: "", state: "", district: "", address: "", consent: false }); }} className="gradient-primary text-primary-foreground">
            Register Another Donor
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="gradient-primary py-12">
        <div className="container text-primary-foreground">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Donor Registration</h1>
          <p className="text-primary-foreground/80">Register as a voluntary blood donor and help save lives</p>
        </div>
      </section>

      <section className="container py-8">
        <div className="max-w-2xl mx-auto bg-card rounded-xl shadow-card p-6 md:p-8 -mt-16 relative z-10">
          {!user && (
            <div className="mb-6 p-4 rounded-lg bg-warning/10 border border-warning/30 text-sm text-warning">
              ⚠️ You need to <a href="/login" className="font-semibold underline">login</a> or <a href="/register" className="font-semibold underline">create an account</a> before registering as a donor.
            </div>
          )}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
              <UserPlus className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-heading font-semibold">Personal Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Full Name *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter your full name" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email *</label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Enter your email" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Phone *</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Enter phone number" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Age *</label>
                <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="18-65" min={18} max={65} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Blood Group *</label>
                <Select value={form.bloodGroup} onValueChange={(v) => setForm({ ...form, bloodGroup: v })}>
                  <SelectTrigger><SelectValue placeholder="Select Blood Group" /></SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map((bg) => (<SelectItem key={bg} value={bg}>{bg}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">State *</label>
                <Select value={form.state} onValueChange={(v) => setForm({ ...form, state: v })}>
                  <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                  <SelectContent>
                    {states.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">District</label>
              <Input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} placeholder="Enter district" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Address</label>
              <Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Enter your address" />
            </div>
            <div className="flex items-start gap-2">
              <Checkbox id="consent" checked={form.consent} onCheckedChange={(c) => setForm({ ...form, consent: c === true })} />
              <label htmlFor="consent" className="text-sm text-muted-foreground leading-snug cursor-pointer">
                I confirm that I am healthy and eligible to donate blood. I consent to being contacted for blood donation requests. *
              </label>
            </div>
            <Button type="submit" size="lg" disabled={loading || !user} className="w-full gradient-primary text-primary-foreground hover:opacity-90 font-semibold">
              {loading ? "Registering..." : "Register as Donor"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default RegisterDonor;
