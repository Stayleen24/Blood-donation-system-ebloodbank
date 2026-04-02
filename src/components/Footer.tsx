import { Link } from "react-router-dom";
import { Droplets, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="gradient-hero text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-heading font-bold">eBloodBank</span>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              A centralized blood bank management system connecting donors, blood banks, and patients across the nation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/search" className="hover:text-primary-foreground transition-colors">Search Blood</Link></li>
              <li><Link to="/blood-banks" className="hover:text-primary-foreground transition-colors">Blood Banks</Link></li>
              <li><Link to="/register-donor" className="hover:text-primary-foreground transition-colors">Become a Donor</Link></li>
              <li><Link to="/about" className="hover:text-primary-foreground transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Blood Groups */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Blood Groups</h3>
            <div className="flex flex-wrap gap-2">
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <span
                  key={bg}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-foreground/20 border border-primary-foreground/30"
                >
                  {bg}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> 9096614688
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> mudholkarstayleen2004@gmail.com
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" /> Mumbai, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} eBloodBank — Blood Donation Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
