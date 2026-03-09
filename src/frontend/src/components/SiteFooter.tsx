import { Anchor, Globe, Mail, MessageCircle } from "lucide-react";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const hostname = window.location.hostname;

  return (
    <footer className="bg-navy-deep border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                <Anchor className="w-4 h-4 text-navy-deep" />
              </div>
              <div>
                <span className="font-display font-bold text-white text-base leading-tight block">
                  Norwegian
                </span>
                <span className="text-gold text-xs font-medium tracking-[0.2em] uppercase">
                  Cruise Line
                </span>
              </div>
            </div>
            <p className="text-white/45 text-sm leading-relaxed max-w-xs">
              One of the world's most innovative cruise companies, dedicated to
              exceptional vacations and extraordinary careers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold/80 text-xs font-bold uppercase tracking-[0.2em] mb-4">
              Recruitment
            </h3>
            <ul className="space-y-2.5">
              {[
                "Open Positions",
                "Benefits & Pay",
                "Apply Online",
                "Career Growth",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#apply"
                    className="text-white/50 hover:text-gold transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gold/80 text-xs font-bold uppercase tracking-[0.2em] mb-4">
              Contact Recruitment
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-white/50 text-sm">
                <Mail className="w-4 h-4 text-gold/60 flex-shrink-0" />
                <span>careers@ncl.com</span>
              </li>
              <li className="flex items-center gap-2.5 text-white/50 text-sm">
                <MessageCircle className="w-4 h-4 text-gold/60 flex-shrink-0" />
                <span>WhatsApp: +1 (305) 436-4000</span>
              </li>
              <li className="flex items-center gap-2.5 text-white/50 text-sm">
                <Globe className="w-4 h-4 text-gold/60 flex-shrink-0" />
                <span>Miami, FL — Worldwide Operations</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gold/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/35 text-sm">
            Norwegian Cruise Line Recruitment &copy; {year}. All rights
            reserved.
          </p>
          <p className="text-white/25 text-sm">
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/50 hover:text-gold transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
