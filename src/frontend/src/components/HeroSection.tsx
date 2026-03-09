import { Button } from "@/components/ui/button";
import { ChevronDown, Ship, Star } from "lucide-react";
import { motion } from "motion/react";

interface HeroSectionProps {
  onApplyClick: () => void;
}

export default function HeroSection({ onApplyClick }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/ncl-hero.dim_1400x700.jpg"
          alt="Norwegian Cruise Ship in Fjords"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 hero-overlay" />
        {/* Extra depth gradient at top for header readability */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-navy-deep/70 to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-8 w-px h-32 bg-gold/40 hidden lg:block" />
      <div className="absolute top-1/4 right-8 w-px h-32 bg-gold/40 hidden lg:block" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/15 border border-gold/35 mb-8"
        >
          <Ship className="w-4 h-4 text-gold" />
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">
            Now Hiring Worldwide
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="font-display font-bold text-white leading-tight mb-6"
          style={{ fontSize: "clamp(2.25rem, 6vw, 4.5rem)" }}
        >
          Start Your Career <span className="gold-shimmer">at Sea</span> with
          Norwegian
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-white/85 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Exceptional pay, world travel, and a crew that feels like family. Join
          thousands of professionals building extraordinary careers aboard our
          fleet.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-8 mb-12"
        >
          {[
            { value: "$3,500+", label: "Starting Monthly Pay" },
            { value: "40+", label: "Global Destinations" },
            { value: "17", label: "Ships in Fleet" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-gold font-display font-bold text-2xl md:text-3xl">
                {stat.value}
              </div>
              <div className="text-white/60 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            size="lg"
            onClick={onApplyClick}
            className="bg-gold hover:bg-gold-light text-navy-deep font-bold text-lg px-10 py-6 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-gold/25"
            data-ocid="hero.primary_button"
          >
            Apply Now
          </Button>
          <a
            href="#positions"
            className="flex items-center gap-2 text-white/80 hover:text-gold transition-colors font-medium"
            data-ocid="hero.secondary_button"
          >
            <span>View Open Positions</span>
            <ChevronDown className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Trust signal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-12 flex items-center justify-center gap-2 text-white/50 text-sm"
        >
          {["s1", "s2", "s3", "s4", "s5"].map((id) => (
            <Star key={id} className="w-3.5 h-3.5 fill-gold/60 text-gold/60" />
          ))}
          <span className="ml-1">
            Trusted by 25,000+ crew members worldwide
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-6 h-6 text-gold/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
