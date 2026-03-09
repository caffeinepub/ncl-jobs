import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { PayoutMethod } from "./backend";
import AdminSection from "./components/AdminSection";
import ApplicationForm from "./components/ApplicationForm";
import type { PayoutFormData } from "./components/ApplicationForm";
import BenefitsSection from "./components/BenefitsSection";
import ConfirmationView from "./components/ConfirmationView";
import HeroSection from "./components/HeroSection";
import JobsSection from "./components/JobsSection";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import { useActor } from "./hooks/useActor";
import {
  useGetStripeSessionStatus,
  useSubmitApplication,
} from "./hooks/useQueries";

export type FormData = {
  name: string;
  email: string;
  whatsapp: string;
  position: string;
  message: string;
};

const FORM_STORAGE_KEY = "ncl_application_form_data";
const PAYOUT_STORAGE_KEY = "ncl_payout_data";

function payoutFormDataToPayoutMethod(
  data: PayoutFormData,
): PayoutMethod | null {
  if (data.method === "btc") {
    return { __kind__: "btc", btc: { address: data.btcAddress } };
  }
  if (data.method === "paypal") {
    return { __kind__: "paypal", paypal: { email: data.paypalEmail } };
  }
  if (data.method === "giftCard") {
    return {
      __kind__: "giftCard",
      giftCard: { cardType: data.giftCardType, email: data.giftCardEmail },
    };
  }
  return null;
}

export default function App() {
  const formRef = useRef<HTMLDivElement>(null);
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Confirmation data
  const [confirmedName, setConfirmedName] = useState<string>("");
  const [confirmedPosition, setConfirmedPosition] = useState<string>("");
  const [confirmedPayoutMethod, setConfirmedPayoutMethod] =
    useState<PayoutMethod | null>(null);

  const { actor, isFetching: actorFetching } = useActor();
  const getStripeSessionStatus = useGetStripeSessionStatus();
  const submitApplication = useSubmitApplication();
  const { mutateAsync: getStripeStatusAsync } = getStripeSessionStatus;
  const { mutateAsync: submitApplicationAsync } = submitApplication;

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Handle payment return
  useEffect(() => {
    if (actorFetching || !actor) return;

    const url = new URL(window.location.href);
    const payment = url.searchParams.get("payment");
    const sessionId = url.searchParams.get("session_id");

    if (payment === "success" && sessionId) {
      setProcessingPayment(true);
      const storedData = localStorage.getItem(FORM_STORAGE_KEY);
      const storedPayout = localStorage.getItem(PAYOUT_STORAGE_KEY);

      if (!storedData) {
        setProcessingPayment(false);
        setPaymentError("Form data not found. Please apply again.");
        return;
      }

      if (!storedPayout) {
        setProcessingPayment(false);
        setPaymentError("Payout data not found. Please apply again.");
        return;
      }

      const formData: FormData = JSON.parse(storedData);
      const payoutFormData: PayoutFormData = JSON.parse(storedPayout);
      const payoutMethod = payoutFormDataToPayoutMethod(payoutFormData);

      if (!payoutMethod) {
        setProcessingPayment(false);
        setPaymentError("Invalid payout method. Please apply again.");
        return;
      }

      getStripeStatusAsync(sessionId)
        .then((status) => {
          if (status.__kind__ === "completed") {
            const responseData = JSON.parse(status.completed.response || "{}");
            const paymentIntentId = responseData.payment_intent || sessionId;

            submitApplicationAsync({
              name: formData.name,
              email: formData.email,
              whatsapp: formData.whatsapp,
              position: formData.position,
              message: formData.message,
              paymentIntentId,
              payoutMethod,
            })
              .then((result) => {
                setProcessingPayment(false);
                if (result.__kind__ === "ok") {
                  setAppSubmitted(true);
                  setConfirmedName(formData.name);
                  setConfirmedPosition(formData.position);
                  setConfirmedPayoutMethod(payoutMethod);
                  localStorage.removeItem(FORM_STORAGE_KEY);
                  localStorage.removeItem(PAYOUT_STORAGE_KEY);
                  toast.success("Application submitted successfully!");
                  // Clean URL
                  window.history.replaceState({}, "", window.location.pathname);
                  setTimeout(() => {
                    formRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 300);
                } else if (result.__kind__ === "duplicateApplication") {
                  setAppSubmitted(true);
                  localStorage.removeItem(FORM_STORAGE_KEY);
                  localStorage.removeItem(PAYOUT_STORAGE_KEY);
                  window.history.replaceState({}, "", window.location.pathname);
                } else {
                  setPaymentError(
                    "Payment successful but application submission failed. Please contact support.",
                  );
                }
              })
              .catch(() => {
                setProcessingPayment(false);
                setPaymentError(
                  "Failed to submit application after payment. Please contact support.",
                );
              });
          } else if (status.__kind__ === "failed") {
            setProcessingPayment(false);
            setPaymentError(
              `Payment verification failed: ${status.failed.error}`,
            );
            window.history.replaceState({}, "", window.location.pathname);
          }
        })
        .catch(() => {
          setProcessingPayment(false);
          setPaymentError(
            "Failed to verify payment status. Please contact support.",
          );
          window.history.replaceState({}, "", window.location.pathname);
        });
    } else if (payment === "cancelled") {
      toast.error("Payment was cancelled. Your application was not submitted.");
      window.history.replaceState({}, "", window.location.pathname);
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 500);
    }
  }, [actor, actorFetching, getStripeStatusAsync, submitApplicationAsync]);

  return (
    <div className="min-h-screen bg-background font-sans scroll-smooth">
      <Toaster position="top-right" richColors />
      <SiteHeader onApplyClick={scrollToForm} />

      <main>
        <HeroSection onApplyClick={scrollToForm} />
        <BenefitsSection />
        <JobsSection onApplyClick={scrollToForm} />

        <div ref={formRef}>
          {appSubmitted && confirmedPayoutMethod ? (
            <ConfirmationView
              name={confirmedName}
              position={confirmedPosition}
              payoutMethod={confirmedPayoutMethod}
            />
          ) : (
            <ApplicationForm
              appSubmitted={appSubmitted}
              processingPayment={processingPayment}
              paymentError={paymentError}
              onPaymentErrorClear={() => setPaymentError(null)}
            />
          )}
        </div>

        <AdminSection />
      </main>

      <SiteFooter />

      {/* Processing payment overlay */}
      <AnimatePresence>
        {processingPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/90 backdrop-blur-sm"
            data-ocid="form.loading_state"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
              <p className="font-display text-xl text-gold-light">
                Processing your application…
              </p>
              <p className="text-white/60 text-sm">
                Please wait while we confirm your payment
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
