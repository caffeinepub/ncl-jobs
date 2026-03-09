import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Coins,
  CreditCard,
  Mail,
  MessageCircle,
} from "lucide-react";
import { motion } from "motion/react";
import type { PayoutMethod } from "../backend";

interface ConfirmationViewProps {
  name: string;
  position: string;
  payoutMethod: PayoutMethod;
}

function truncate(str: string, len: number): string {
  if (str.length <= len) return str;
  return `${str.slice(0, len)}...`;
}

function PayoutSummary({ method }: { method: PayoutMethod }) {
  if (method.__kind__ === "btc") {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center flex-shrink-0">
          <Coins className="w-4 h-4 text-gold" />
        </div>
        <div>
          <p className="text-white/50 text-xs uppercase tracking-wide font-semibold">
            Bitcoin (BTC)
          </p>
          <p className="text-white font-mono text-sm mt-0.5">
            {truncate(method.btc.address, 20)}
          </p>
        </div>
      </div>
    );
  }

  if (method.__kind__ === "paypal") {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center flex-shrink-0">
          <Mail className="w-4 h-4 text-gold" />
        </div>
        <div>
          <p className="text-white/50 text-xs uppercase tracking-wide font-semibold">
            PayPal
          </p>
          <p className="text-white text-sm mt-0.5">{method.paypal.email}</p>
        </div>
      </div>
    );
  }

  if (method.__kind__ === "giftCard") {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center flex-shrink-0">
          <CreditCard className="w-4 h-4 text-gold" />
        </div>
        <div>
          <p className="text-white/50 text-xs uppercase tracking-wide font-semibold">
            Gift Card — {method.giftCard.cardType}
          </p>
          <p className="text-white text-sm mt-0.5">{method.giftCard.email}</p>
        </div>
      </div>
    );
  }

  return null;
}

export default function ConfirmationView({
  name,
  position,
  payoutMethod,
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
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs uppercase tracking-widest font-semibold">
                Application Summary
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {/* Name */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Applicant</span>
                <span className="text-white font-medium">{name}</span>
              </div>
              {/* Position */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Position</span>
                <Badge className="bg-gold/15 text-gold border-0 text-xs">
                  {position}
                </Badge>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gold/10 pt-4">
              <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-3">
                Payout Details
              </p>
              <PayoutSummary method={payoutMethod} />
              <div className="mt-4 flex items-center gap-2">
                <span className="text-white/50 text-sm">Payout Status:</span>
                <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/25 text-xs font-semibold">
                  ⏳ Pending
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.4 }}
            className="mt-6 text-white/50 text-sm text-center leading-relaxed"
          >
            Your payout is queued for processing. We will reach out via email or
            WhatsApp within{" "}
            <span className="text-white/75 font-medium">5–7 business days</span>
            .
          </motion.p>

          {/* Footer icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.4 }}
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
