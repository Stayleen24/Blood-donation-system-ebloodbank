import { Link } from "react-router-dom";
import { Search, Droplets, Building2, UserPlus, Heart, Users, Building, Activity, ArrowRight, ClipboardList, UserCheck, Stethoscope, Tent } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import heroImage from "@/assets/hero-blood-donation.jpg";

const Index = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Blood donation" className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-hero opacity-80" />
        </div>
        <div className="container relative z-10 py-20 md:py-32">
          <div className="max-w-2xl text-primary-foreground">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6 animate-fade-in">
              Donate Blood, <br />
              <span className="text-accent">Save Lives</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
              eBloodBank connects blood donors with those in need. Search for blood availability, find nearby blood banks, or register as a donor today.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <Link to="/search">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold gap-2 shadow-primary">
                  <Search className="h-5 w-5" /> Search Blood
                </Button>
              </Link>
              <Link to="/register-donor">
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 font-semibold gap-2">
                  <UserPlus className="h-5 w-5" /> Become a Donor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container py-16 -mt-12 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard icon={Droplets} value="10,000+" label="Blood Units Available" delay={0} />
          <StatCard icon={Users} value="50,000+" label="Registered Donors" delay={100} />
          <StatCard icon={Building} value="3,000+" label="Blood Banks" delay={200} />
          <StatCard icon={Activity} value="1,00,000+" label="Lives Saved" delay={300} />
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-16">
        <h2 className="text-3xl font-heading font-bold text-center mb-3">How It Works</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Our platform makes blood donation simple and accessible in just a few steps
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: ClipboardList, step: "01", title: "Register", desc: "Create your free account on eBloodBank in under a minute" },
            { icon: UserCheck, step: "02", title: "Complete Profile", desc: "Register as a donor with your blood group and location details" },
            { icon: Search, step: "03", title: "Search & Connect", desc: "Search for blood availability or find donors in your area" },
            { icon: Stethoscope, step: "04", title: "Donate & Save", desc: "Visit a blood bank, donate blood, and help save up to 3 lives" },
          ].map((item, i) => (
            <div key={item.step} className="relative text-center opacity-0 animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary mx-auto mb-4 shadow-primary">
                <item.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <span className="text-xs font-bold text-accent tracking-widest">STEP {item.step}</span>
              <h3 className="text-lg font-heading font-semibold mt-1 mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
              {i < 3 && (
                <ArrowRight className="hidden md:block absolute top-8 -right-3 h-6 w-6 text-border" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-secondary py-16">
        <div className="container">
          <h2 className="text-3xl font-heading font-bold text-center mb-3">Services</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Access blood donation services quickly and easily through our platform
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Search, title: "Search Blood", desc: "Find blood availability by group and location.", link: "/search", cta: "Search Now" },
              { icon: Users, title: "Find Donors", desc: "Connect with voluntary donors near you.", link: "/find-donors", cta: "Find Donors" },
              { icon: Building2, title: "Blood Banks", desc: "Locate nearby blood banks with details.", link: "/blood-banks", cta: "View Banks" },
              { icon: Tent, title: "Blood Camps", desc: "Find & join blood donation camps.", link: "/blood-camps", cta: "View Camps" },
            ].map((item, i) => (
              <div
                key={item.title}
                className="bg-card p-6 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col opacity-0 animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary mb-4">
                  <item.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-5 flex-1">{item.desc}</p>
                <Link to={item.link}>
                  <Button size="sm" className="w-full gradient-primary text-primary-foreground hover:opacity-90">{item.cta}</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blood Group Info */}
      <section className="container py-16">
        <h2 className="text-3xl font-heading font-bold text-center mb-3">Blood Group Compatibility</h2>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          Understanding blood type compatibility is crucial for safe transfusions
        </p>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg, i) => (
            <div
              key={bg}
              className="flex flex-col items-center p-4 rounded-xl border-2 border-primary/20 hover:border-primary hover:shadow-primary transition-all duration-300 cursor-pointer opacity-0 animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <Droplets className="h-8 w-8 text-primary mb-2" />
              <span className="text-xl font-heading font-bold text-primary">{bg}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-primary py-16">
        <div className="container text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Every Drop Counts</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            One donation can save up to three lives. Join our community of heroes and make a difference today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-primary">
                Get Started — It's Free
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 font-semibold">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
