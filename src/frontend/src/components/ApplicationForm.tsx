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
  FileText,
  Loader2,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  Send,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { FormData } from "../App";

const positions = [
  "Deck Officer",
  "Chef / Culinary Staff",
  "Hospitality & Guest Services",
  "Entertainment Staff",
  "Engineering Technician",
  "Medical Officer",
];

interface ApplicationFormProps {
  onSubmit: (data: FormData) => void;
  isSubmitting: boolean;
}

export default function ApplicationForm({
  onSubmit,
  isSubmitting,
}: ApplicationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    whatsapp: "",
    position: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errs: Partial<FormData> = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Enter a valid email address";
    }
    if (!formData.whatsapp.trim()) {
      errs.whatsapp = "WhatsApp number is required";
    } else if (!/^\+?[\d\s\-().]{7,}$/.test(formData.whatsapp)) {
      errs.whatsapp = "Enter a valid phone number with country code";
    }
    if (!formData.position) errs.position = "Please select a position";
    if (!formData.message.trim() || formData.message.trim().length < 20) {
      errs.message = "Please write at least 20 characters";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <section id="apply" className="py-24 bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">
            Apply Now
          </h2>
          <p className="text-white/50 text-base max-w-md mx-auto">
            Fill out the form below and our recruitment team will be in touch
            within 5–7 business days.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card-navy rounded-3xl p-8 md:p-10"
        >
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
                disabled={isSubmitting}
                data-ocid="form.name_input"
              />
              {errors.name && (
                <p
                  className="text-destructive text-xs flex items-center gap-1.5 mt-1"
                  data-ocid="form.name_error"
                >
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
                disabled={isSubmitting}
                data-ocid="form.email_input"
              />
              {errors.email && (
                <p
                  className="text-destructive text-xs flex items-center gap-1.5 mt-1"
                  data-ocid="form.email_error"
                >
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
              <Input
                id="whatsapp"
                type="tel"
                placeholder="+1 234 567 8900 (include country code)"
                value={formData.whatsapp}
                onChange={(e) => updateField("whatsapp", e.target.value)}
                autoComplete="tel"
                className="bg-navy-deep/60 border-gold/20 text-white placeholder:text-white/30 focus:border-gold focus:ring-gold/20 h-11"
                disabled={isSubmitting}
                data-ocid="form.whatsapp_input"
              />
              <p className="text-white/35 text-xs flex items-center gap-1.5">
                <MessageCircle className="w-3 h-3 text-gold/50" />
                Include country code, e.g. +44 7700 900123
              </p>
              {errors.whatsapp && (
                <p
                  className="text-destructive text-xs flex items-center gap-1.5"
                  data-ocid="form.whatsapp_error"
                >
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
                disabled={isSubmitting}
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
                <p
                  className="text-destructive text-xs flex items-center gap-1.5 mt-1"
                  data-ocid="form.position_error"
                >
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
                disabled={isSubmitting}
                data-ocid="form.message_textarea"
              />
              {errors.message && (
                <p
                  className="text-destructive text-xs flex items-center gap-1.5 mt-1"
                  data-ocid="form.message_error"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gold hover:bg-gold-light text-navy-deep font-bold text-base rounded-xl transition-all duration-200"
              data-ocid="form.submit_button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>

            {/* Trust badges */}
            <div className="flex justify-center gap-6 pt-2">
              <span className="flex items-center gap-1.5 text-white/35 text-xs">
                <Lock className="w-3.5 h-3.5 text-gold/50" />
                Data Kept Confidential
              </span>
              <span className="flex items-center gap-1.5 text-white/35 text-xs">
                <MessageCircle className="w-3.5 h-3.5 text-gold/50" />
                Response within 7 days
              </span>
            </div>
          </form>

          {/* WhatsApp contact box */}
          <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/5 p-5 text-center">
            <p className="text-white/60 text-sm mb-3">
              Have questions? Contact us on WhatsApp
            </p>
            <a
              href="https://wa.me/12028169872"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-5 py-2.5 rounded-full transition-colors text-sm"
              data-ocid="form.whatsapp_button"
            >
              <MessageCircle className="w-4 h-4" />
              +1 (202) 816-9872
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
