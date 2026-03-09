import { DollarSign, Home, Plane, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

const benefits = [
  {
    icon: DollarSign,
    title: "Industry-Leading Pay",
    description:
      "Starting from $3,500/month with competitive overtime and bonuses. Top positions earn $9,000+ monthly — tax-free in international waters.",
    highlight: "From $3,500/mo",
  },
  {
    icon: Plane,
    title: "Free World Travel",
    description:
      "Sail to the Caribbean, Mediterranean, Alaska, and beyond. Visit 40+ destinations across 6 continents while on the job.",
    highlight: "40+ Destinations",
  },
  {
    icon: Home,
    title: "Free Accommodation & Meals",
    description:
      "All crew cabins, meals, and onboard amenities are fully covered. Save virtually your entire salary with zero living expenses at sea.",
    highlight: "Zero Living Costs",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description:
      "We invest in our people. Internal promotions, professional certifications, and leadership training help you rise fast in your career.",
    highlight: "Fast Advancement",
  },
];

export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-24 section-waves bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-semibold tracking-[0.25em] uppercase block mb-3">
            Why Join Us
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4 leading-tight">
            Life at Sea, Elevated
          </h2>
          <div className="w-16 h-1 bg-gold mx-auto rounded-full" />
        </motion.div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl p-7 card-navy hover:border-gold/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/10"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center mb-5 group-hover:bg-gold/25 transition-colors">
                <benefit.icon className="w-6 h-6 text-gold" />
              </div>

              {/* Highlight badge */}
              <span className="inline-block text-xs font-bold text-gold bg-gold/10 px-2.5 py-1 rounded-full mb-3 tracking-wide uppercase">
                {benefit.highlight}
              </span>

              <h3 className="font-display font-bold text-xl text-white mb-3 leading-tight">
                {benefit.title}
              </h3>
              <p className="text-white/65 text-sm leading-relaxed">
                {benefit.description}
              </p>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity">
                <div className="absolute -top-4 -right-4 w-16 h-16 border-2 border-gold rounded-xl" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
