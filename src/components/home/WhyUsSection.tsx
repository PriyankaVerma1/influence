import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Network, 
  Languages, 
  Users, 
  Award, 
  BarChart3, 
  Settings 
} from "lucide-react";

const reasons = [
  {
    icon: Network,
    title: "Pan-India Creator Network",
    description: "A community of 1,00,000+ influencers across Tier 1 to Tier 3 cities helping brands reach audiences in every corner of India.",
  },
  {
    icon: Languages,
    title: "Multilingual Reach",
    description: "English, Hindi, Tamil, Bengali, Marathi, and more — we ensure your brand communicates in the language your audience feels most connected to.",
  },
  {
    icon: Users,
    title: "Creators Across Every Tier",
    description: "From nano and micro creators for authentic storytelling to macro and celebrity influencers for large-scale impact.",
  },
  {
    icon: Award,
    title: "Category Expertise",
    description: "Proven track record of over 10+ brand collaborations across beauty, fashion, lifestyle, tech, and wellness domains.",
  },
  {
    icon: BarChart3,
    title: "Performance-Led Strategy",
    description: "Each campaign is guided by data, insights, and measurable KPIs, built to maximize authentic engagement and conversions.",
  },
  {
    icon: Settings,
    title: "End-to-End Management",
    description: "From shortlist to strategy, approvals to reporting — we manage every step seamlessly to deliver measurable success.",
  },
];

const WhyUsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="why-us" className="py-24 bg-card relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mt-4 mb-6">
              Why <span className="text-gradient-secondary">Influence Nexus</span>?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              With 4+ years of industry experience and a dynamic Gen Z team, we blend strategic expertise with cultural insight to build campaigns that truly connect.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We specialize in influencer marketing, covering everything from paid and performance-led collaborations to UGC ad videos, barter campaigns, celebrity partnerships, meme marketing, and regional brand activations.
            </p>

            {/* Client Logos Placeholder */}
            <div className="mt-10 pt-10 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">Trusted by leading brands</p>
              <div className="flex flex-wrap gap-4">
                {["Myntra", "AngelOne", "DealShare", "Suhana"].map((brand) => (
                  <div
                    key={brand}
                    className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium"
                  >
                    {brand}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - Features Grid */}
          <div className="grid sm:grid-cols-2 gap-5">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-5 rounded-xl glass-card hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <reason.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
