import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  Application,
  PayoutMethod,
  ShoppingItem,
  StripeSessionStatus,
  SubmitApplicationResult,
  Variant_pending_completed_processing,
} from "../backend";
import { useActor } from "./useActor";

export type CheckoutSession = {
  id: string;
  url: string;
};

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetApplications() {
  const { actor, isFetching } = useActor();
  return useQuery<Application[]>({
    queryKey: ["applications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApplications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      items,
      successUrl,
      cancelUrl,
    }: {
      items: ShoppingItem[];
      successUrl: string;
      cancelUrl: string;
    }): Promise<CheckoutSession> => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.createCheckoutSession(
        items,
        successUrl,
        cancelUrl,
      );
      const session = JSON.parse(result) as CheckoutSession;
      if (!session?.url) {
        throw new Error("Stripe session missing url");
      }
      return session;
    },
  });
}

export function useGetStripeSessionStatus() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (sessionId: string): Promise<StripeSessionStatus> => {
      if (!actor) throw new Error("Actor not available");
      return actor.getStripeSessionStatus(sessionId);
    },
  });
}

export function useSubmitApplication() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      whatsapp,
      position,
      message,
      paymentIntentId,
      payoutMethod,
    }: {
      name: string;
      email: string;
      whatsapp: string;
      position: string;
      message: string;
      paymentIntentId: string;
      payoutMethod: PayoutMethod;
    }): Promise<SubmitApplicationResult> => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitApplication(
        name,
        email,
        whatsapp,
        position,
        message,
        paymentIntentId,
        payoutMethod,
      );
    },
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isStripeConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdatePayoutStatus() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      email,
      position,
      newStatus,
    }: {
      email: string;
      position: string;
      newStatus: Variant_pending_completed_processing;
    }): Promise<boolean> => {
      if (!actor) throw new Error("Actor not available");
      return actor.updatePayoutStatus(email, position, newStatus);
    },
  });
}
