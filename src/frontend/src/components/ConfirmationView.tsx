import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Mail, MessageCircle } from "lucide-react";
import { motion } from "motion/react";

interface ConfirmationViewProps {
  name: string;
  position: string;
}

export default function ConfirmationView({
  name,
  position,
}: ConfirmationViewProps) {
  return (
    <section
      id="apply"
      className="py-24 bg-background"
      data-ocid="confirmation.panel"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="card-navy rounded-3xl p-10 md:p-12"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-center mb-8"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">
              Application Received!
            </h2>
            <p className="text-white/60 text-base leading-relaxed max-w-md mx-auto">
              Thank you, <span className="text-gold font-semibold">{name}</span>
              . Your application for the{" "}
              <span className="text-gold font-semibold">{position}</span>{" "}
              position has been submitted.
            </p>
          </motion.div>

          {/* Summary card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="rounded-2xl border border-gold/15 bg-navy-deep/40 p-6 space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Applicant</span>
                <span className="text-white font-medium">{name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Position</span>
                <Badge className="bg-gold/15 text-gold border-0 text-xs">
                  {position}
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* What's next */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-6 text-white/50 text-sm text-center leading-relaxed"
          >
            Our recruitment team will review your application and contact you
            via WhatsApp or email within{" "}
            <span className="text-white/75 font-medium">5–7 business days</span>
            .
          </motion.p>

          {/* WhatsApp contact */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/5 p-5 text-center"
          >
            <p className="text-white/60 text-sm mb-3">
              Need to follow up? Message us on WhatsApp
            </p>
            <a
              href="https://wa.me/12028169872"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-5 py-2.5 rounded-full transition-colors text-sm"
              data-ocid="confirmation.whatsapp_button"
            >
              <MessageCircle className="w-4 h-4" />
              +1 (202) 816-9872
            </a>
          </motion.div>

          {/* Footer icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="mt-8 pt-6 border-t border-gold/15 flex justify-center gap-6 text-sm text-white/40"
          >
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gold" />
              Check your email
            </span>
            <span className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-gold" />
              Watch WhatsApp
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
