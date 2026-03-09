import { Button } from "@/components/ui/button";
import { Anchor } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface SiteHeaderProps {
  onApplyClick: () => void;
}

export default function SiteHeader({ onApplyClick }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-navy-deep/95 backdrop-blur-md shadow-lg shadow-black/30 border-b border-gold/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center">
              <Anchor className="w-5 h-5 text-navy-deep" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-lg leading-tight block">
                Norwegian
              </span>
              <span className="text-gold text-xs font-medium tracking-[0.2em] uppercase leading-none">
                Cruise Line
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Benefits", id: "benefits" },
              { label: "Open Positions", id: "positions" },
              { label: "Apply", id: "apply" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-white/80 hover:text-gold transition-colors text-sm font-medium tracking-wide"
                data-ocid={`nav.${item.id}.link`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <Button
            onClick={onApplyClick}
            className="bg-gold hover:bg-gold-light text-navy-deep font-bold tracking-wide text-sm transition-all duration-200 hover:scale-105 active:scale-95"
            data-ocid="header.primary_button"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
