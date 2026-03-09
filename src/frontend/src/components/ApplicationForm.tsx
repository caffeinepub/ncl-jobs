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
  Briefcase,
  CheckCircle2,
  CreditCard,
  FileText,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Shield,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { FormData } from "../App";
import { useCreateCheckoutSession } from "../hooks/useQueries";

const FORM_STORAGE_KEY = "ncl_application_form_data";

const positions = [
  "Deck Officer",
  "Chef / Culinary Staff",
  "Hospitality & Guest Services",
  "Entertainment Staff",
  "Engineering Technician",
  "Medical Officer",
];

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
  const [isRedirecting, setIsRedirecting] = useState(false);

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
  }, []);

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
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Store form data before redirect
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));

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

            {/* Payment note */}
            <div className="rounded-xl border border-gold/20 bg-gold/8 p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white/80 font-semibold text-sm">
                  $20 Processing Fee
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
