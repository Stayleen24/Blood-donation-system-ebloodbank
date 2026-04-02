import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ClipboardList, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { bloodGroups } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

import { useQuery } from "@tanstack/react-query";

const CampRegister = () => {
  const { campId } = useParams<{ campId: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [regId, setRegId] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    bloodGroup: "",
    medicalConditions: "",
    lastDonation: "",
    consent: false,
  });

  const { data: camp } = useQuery({
    queryKey: ["camp", campId],
    queryFn: async () => {
      const { data } = await api.get(`/blood-camps/${campId}`);
      return data;
    },
    enabled: !!campId,
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please login first", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!form.name || !form.email || !form.phone || !form.age || !form.bloodGroup || !form.consent) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    const age = parseInt(form.age);
    if (age < 18 || age > 65) {
      toast({ title: "Age must be between 18 and 65", variant: "destructive" });
      return;
    }

    setLoading(true);
    const certId = `CERT-${Date.now().toString(36).toUpperCase()}`;

    try {
      const { data } = await api.post("/camp-registrations", {
        campId: campId!,
        // user_id handled by token
        fullName: form.name,
        email: form.email,
        phone: form.phone,
        age,
        bloodGroup: form.bloodGroup,
        certificateId: certId,
        hasDonated: true,
        donatedAt: new Date().toISOString(),
      });

      setRegId(data.id);
      setSubmitted(true);
      toast({ title: "Registration successful!", description: "You have been registered for this camp." });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Registration failed", description: err.response?.data?.error || "Unknown error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };


  if (submitted && camp) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12">
        <div className="text-center animate-fade-in max-w-md">
          <CheckCircle className="h-20 w-20 text-success mx-auto mb-6" />
          <h2 className="text-3xl font-heading font-bold mb-3">Registration Successful!</h2>
          <p className="text-muted-foreground mb-6">
            You are registered for <strong>{camp.name}</strong>. After donating blood at the camp, you can download your certificate.
          </p>
          <div className="flex flex-col gap-3">
            <Link to={`/certificate/${regId}`}>
              <Button className="w-full gradient-primary text-primary-foreground hover:opacity-90">
                View Donation Certificate
              </Button>
            </Link>
            <Link to="/blood-camps">
              <Button variant="outline" className="w-full">Back to Camps</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="gradient-primary py-12">
        <div className="container text-primary-foreground">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Camp Registration</h1>
          <p className="text-primary-foreground/80">Fill in your details to participate in the blood donation camp</p>
        </div>
      </section>

      <section className="container py-8">
        <div className="max-w-2xl mx-auto bg-card rounded-xl shadow-card p-6 md:p-8 -mt-16 relative z-10">
          <Link to="/blood-camps" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Camps
          </Link>

          {camp && (
            <div className="mb-6 p-4 rounded-lg bg-secondary border border-border">
              <h3 className="font-heading font-semibold text-lg">{camp.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(camp.camp_date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                {" • "}{camp.start_time} - {camp.end_time} • {camp.district}, {camp.state}
              </p>
            </div>
          )}

          {!user && (
            <div className="mb-6 p-4 rounded-lg bg-warning/10 border border-warning/30 text-sm text-warning">
              ⚠️ You need to <a href="/login" className="font-semibold underline">login</a> or <a href="/register" className="font-semibold underline">create an account</a> to register for a camp.
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
              <ClipboardList className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-heading font-semibold">Participant Details</h2>
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
                <label className="text-sm font-medium mb-1.5 block">Last Donation Date</label>
                <Input type="date" value={form.lastDonation} onChange={(e) => setForm({ ...form, lastDonation: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Any Medical Conditions</label>
              <Input value={form.medicalConditions} onChange={(e) => setForm({ ...form, medicalConditions: e.target.value })} placeholder="e.g., Diabetes, BP (leave blank if none)" />
            </div>
            <div className="flex items-start gap-2">
              <Checkbox id="consent" checked={form.consent} onCheckedChange={(c) => setForm({ ...form, consent: c === true })} />
              <label htmlFor="consent" className="text-sm text-muted-foreground leading-snug cursor-pointer">
                I confirm that I am healthy, not on any medication, and eligible to donate blood. I understand that a medical screening will be done before donation. *
              </label>
            </div>
            <Button type="submit" size="lg" disabled={loading || !user} className="w-full gradient-primary text-primary-foreground hover:opacity-90 font-semibold">
              {loading ? "Registering..." : "Register & Confirm Donation"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default CampRegister;
