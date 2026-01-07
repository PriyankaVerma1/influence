import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Star, 
  MapPin, 
  Globe, 
  Video, 
  Newspaper, 
  Mic, 
  Instagram, 
  Camera 
} from "lucide-react";

const services = [
  {
    icon: Star,
    title: "Celebrity Influencer Marketing",
    description: "Strategic collaborations with top celebrities and public figures to elevate brand visibility and credibility.",
    color: "primary",
  },
  {
    icon: MapPin,
    title: "Store Visits & Experiential",
    description: "Curated influencer store visits creating authentic, immersive in-person brand experiences.",
    color: "secondary",
  },
  {
    icon: Globe,
    title: "Regional Influencer Marketing",
    description: "Partner with regional and vernacular influencers to connect with Tier 2 and Tier 3 city audiences.",
    color: "accent",
  },
  {
    icon: Video,
    title: "UGC Video Production",
    description: "Authentic, creator-led short-form videos that build genuine trust through real product testimonials.",
    color: "primary",
  },
  {
    icon: Newspaper,
    title: "PR & News Articles",
    description: "Strategic media relations and targeted outreach to secure high-impact press coverage.",
    color: "secondary",
  },
  {
    icon: Mic,
    title: "Podcast Collaborations",
    description: "Multi-channel podcast production featuring brands, creators, and industry experts.",
    color: "accent",
  },
  {
    icon: Instagram,
    title: "Social Media Management",
    description: "Comprehensive account handling across all platforms with content strategy and community engagement.",
    color: "primary",
  },
  {
    icon: Camera,
    title: "Product Photo Shoots",
    description: "High-quality, aesthetically striking product images that showcase your brand's identity.",
    color: "secondary",
  },
];

const colorMap = {
  primary: "from-primary/20 to-primary/5 border-primary/20",
  secondary: "from-secondary/20 to-secondary/5 border-secondary/20",
  accent: "from-accent/20 to-accent/5 border-accent/20",
};

const iconColorMap = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
};

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">What We Offer</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mt-4 mb-6">
            Our <span className="text-gradient-primary">Services</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            End-to-end digital and creative services that help brands and creators tell stories that resonate, inspire, and convert.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`group relative p-6 rounded-2xl bg-gradient-to-b ${colorMap[service.color as keyof typeof colorMap]} border backdrop-blur-sm`}
            >
              <div className={`w-14 h-14 rounded-xl ${iconColorMap[service.color as keyof typeof iconColorMap]} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
