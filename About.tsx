import { Heart, Users, Shield, Target, Droplets } from "lucide-react";

const About = () => {
  return (
    <div>
      <section className="gradient-primary py-16">
        <div className="container text-primary-foreground text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3">About eBloodBank</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            A centralized blood bank management system dedicated to bridging the gap between blood donors and patients in need.
          </p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-heading font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              eBloodBank aims to create a seamless, transparent, and efficient blood donation ecosystem. 
              We connect voluntary blood donors with blood banks and hospitals, ensuring that no patient 
              suffers due to the unavailability of safe blood.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our platform provides real-time blood availability data, facilitates donor registration, 
              and helps maintain a comprehensive directory of blood banks across the nation.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Heart, title: "Save Lives", desc: "Every donation can save up to 3 lives" },
              { icon: Users, title: "Community", desc: "Growing network of voluntary donors" },
              { icon: Shield, title: "Safe Blood", desc: "Rigorous testing and quality standards" },
              { icon: Target, title: "Accessibility", desc: "Easy access to blood across India" },
            ].map((item, i) => (
              <div
                key={item.title}
                className="p-5 bg-card rounded-xl shadow-card text-center opacity-0 animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <item.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-heading font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="bg-secondary py-16">
        <div className="container">
          <h2 className="text-2xl font-heading font-bold text-center mb-8">Who Can Donate Blood?</h2>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Age between 18-65 years",
              "Weight at least 45 kg",
              "Hemoglobin level above 12.5 g/dL",
              "No history of infectious diseases",
              "Not donated blood in last 3 months",
              "Not under medication for chronic illness",
              "Normal blood pressure and pulse",
              "Not pregnant or breastfeeding",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 p-3 bg-card rounded-lg shadow-card">
                <Droplets className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
