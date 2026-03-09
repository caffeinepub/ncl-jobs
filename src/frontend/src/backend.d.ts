import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type PayoutMethod = {
    __kind__: "btc";
    btc: {
        address: string;
    };
} | {
    __kind__: "giftCard";
    giftCard: {
        cardType: string;
        email: string;
    };
} | {
    __kind__: "paypal";
    paypal: {
        email: string;
    };
};
export interface Application {
    payoutStatus: Variant_pending_completed_processing;
    payoutMethod: PayoutMethod;
    name: string;
    whatsapp: string;
    submittedAt: bigint;
    email: string;
    message: string;
    position: string;
    paymentIntentId: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export type CreatePaymentResult = {
    __kind__: "ok";
    ok: {
        clientSecret: string;
    };
} | {
    __kind__: "paymentError";
    paymentError: string;
} | {
    __kind__: "invalidAmount";
    invalidAmount: null;
};
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type SubmitApplicationResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "submissionError";
    submissionError: string;
} | {
    __kind__: "duplicateApplication";
    duplicateApplication: null;
} | {
    __kind__: "paymentNotFound";
    paymentNotFound: null;
} | {
    __kind__: "missingFields";
    missingFields: null;
};
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface UserProfile {
    name: string;
}
export interface http_header {
    value: string;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_pending_completed_processing {
    pending = "pending",
    completed = "completed",
    processing = "processing"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createPaymentIntent(amount: bigint): Promise<CreatePaymentResult>;
    getApplications(): Promise<Array<Application>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitApplication(name: string, email: string, whatsapp: string, position: string, message: string, paymentIntentId: string, payoutMethod: PayoutMethod): Promise<SubmitApplicationResult>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updatePayoutStatus(email: string, position: string, newStatus: Variant_pending_completed_processing): Promise<boolean>;
}
