import { Link } from "react-router-dom";
import { Sparkles, Phone, Mail, MapPin, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">
                Influence<span className="text-gradient-primary">Nexus</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Shaping the future of digital storytelling with 4+ years of industry experience and a dynamic Gen Z team.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground">Quick Links</h4>
            <div className="space-y-3">
              <a href="/#services" className="block text-muted-foreground hover:text-primary transition-colors text-sm">Our Services</a>
              <a href="/#why-us" className="block text-muted-foreground hover:text-primary transition-colors text-sm">Why Choose Us</a>
              <Link to="/events" className="block text-muted-foreground hover:text-primary transition-colors text-sm">Events</Link>
              <Link to="/auth?type=brand" className="block text-muted-foreground hover:text-primary transition-colors text-sm">For Brands</Link>
              <Link to="/auth?type=creator" className="block text-muted-foreground hover:text-primary transition-colors text-sm">For Creators</Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground">Services</h4>
            <div className="space-y-3">
              <span className="block text-muted-foreground text-sm">Celebrity Marketing</span>
              <span className="block text-muted-foreground text-sm">Regional Campaigns</span>
              <span className="block text-muted-foreground text-sm">UGC Production</span>
              <span className="block text-muted-foreground text-sm">Social Media Management</span>
              <span className="block text-muted-foreground text-sm">PR & News Articles</span>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground">Contact Us</h4>
            <div className="space-y-3">
              <a href="tel:+918233223156" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors text-sm">
                <Phone size={16} />
                +91 8233223156
              </a>
              <a href="mailto:brand@influencenexus.in" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors text-sm">
                <Mail size={16} />
                brand@influencenexus.in
              </a>
              <div className="flex items-start gap-3 text-muted-foreground text-sm">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>6th Floor, Bhamasha Techno Hub, Jaipur, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 Influence Nexus. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
