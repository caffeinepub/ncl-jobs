import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { useRef } from "react";
import { toast } from "sonner";
import AdminSection from "./components/AdminSection";
import ApplicationForm from "./components/ApplicationForm";
import BenefitsSection from "./components/BenefitsSection";
import ConfirmationView from "./components/ConfirmationView";
import HeroSection from "./components/HeroSection";
import JobsSection from "./components/JobsSection";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import { useSubmitApplication } from "./hooks/useQueries";

export type FormData = {
  name: string;
  email: string;
  whatsapp: string;
  position: string;
  message: string;
};

export default function App() {
  const formRef = useRef<HTMLDivElement>(null);
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [confirmedName, setConfirmedName] = useState("");
  const [confirmedPosition, setConfirmedPosition] = useState("");

  const submitApplication = useSubmitApplication();

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (data: FormData) => {
    try {
      const result = await submitApplication.mutateAsync({
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        position: data.position,
        message: data.message,
        paymentIntentId: "",
        payoutMethod: { __kind__: "btc", btc: { address: "" } },
      });

      if (
        result.__kind__ === "ok" ||
        result.__kind__ === "duplicateApplication"
      ) {
        setConfirmedName(data.name);
        setConfirmedPosition(data.position);
        setAppSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error("Failed to submit application. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans scroll-smooth">
      <Toaster position="top-right" richColors />
      <SiteHeader onApplyClick={scrollToForm} />

      <main>
        <HeroSection onApplyClick={scrollToForm} />
        <BenefitsSection />
        <JobsSection onApplyClick={scrollToForm} />

        <div ref={formRef}>
          {appSubmitted ? (
            <ConfirmationView
              name={confirmedName}
              position={confirmedPosition}
            />
          ) : (
            <ApplicationForm
              onSubmit={handleSubmit}
              isSubmitting={submitApplication.isPending}
            />
          )}
        </div>

        <AdminSection />
      </main>

      <SiteFooter />
    </div>
  );
}
