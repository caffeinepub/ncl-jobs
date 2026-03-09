import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronUp,
  Coins,
  CreditCard,
  Loader2,
  LogIn,
  LogOut,
  Mail,
  RefreshCw,
  Shield,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type {
  Application,
  PayoutMethod,
  Variant_pending_completed_processing,
} from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetApplications,
  useIsCallerAdmin,
  useUpdatePayoutStatus,
} from "../hooks/useQueries";

function formatDate(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PayoutMethodBadge({ method }: { method: PayoutMethod }) {
  if (method.__kind__ === "btc") {
    return (
      <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/25 text-xs gap-1 whitespace-nowrap">
        <Coins className="w-3 h-3" />
        BTC
      </Badge>
    );
  }
  if (method.__kind__ === "paypal") {
    return (
      <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/25 text-xs gap-1 whitespace-nowrap">
        <Mail className="w-3 h-3" />
        PayPal
      </Badge>
    );
  }
  if (method.__kind__ === "giftCard") {
    return (
      <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/25 text-xs gap-1 whitespace-nowrap">
        <CreditCard className="w-3 h-3" />
        Gift Card
      </Badge>
    );
  }
  return null;
}

function PayoutDetails({ method }: { method: PayoutMethod }) {
  if (method.__kind__ === "btc") {
    const addr = method.btc.address;
    return (
      <span className="font-mono text-xs text-white/70">
        {addr.length > 8 ? `${addr.slice(0, 8)}…` : addr}
      </span>
    );
  }
  if (method.__kind__ === "paypal") {
    return <span className="text-xs text-white/70">{method.paypal.email}</span>;
  }
  if (method.__kind__ === "giftCard") {
    return (
      <span className="text-xs text-white/70">
        {method.giftCard.cardType} · {method.giftCard.email}
      </span>
    );
  }
  return null;
}

function PayoutStatusBadge({
  status,
}: {
  status: Variant_pending_completed_processing;
}) {
  if (status === "pending") {
    return (
      <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/25 text-xs whitespace-nowrap">
        ⏳ Pending
      </Badge>
    );
  }
  if (status === "processing") {
    return (
      <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/25 text-xs whitespace-nowrap">
        🔄 Processing
      </Badge>
    );
  }
  if (status === "completed") {
    return (
      <Badge className="bg-green-500/15 text-green-400 border-green-500/25 text-xs whitespace-nowrap">
        ✓ Completed
      </Badge>
    );
  }
  return null;
}

function PayoutStatusCell({
  app,
  index,
}: {
  app: Application;
  index: number;
}) {
  const queryClient = useQueryClient();
  const updatePayoutStatus = useUpdatePayoutStatus();
  const [optimisticStatus, setOptimisticStatus] =
    useState<Variant_pending_completed_processing | null>(null);

  const currentStatus = optimisticStatus ?? app.payoutStatus;

  const handleChange = async (
    newStatus: Variant_pending_completed_processing,
  ) => {
    setOptimisticStatus(newStatus);
    try {
      await updatePayoutStatus.mutateAsync({
        email: app.email,
        position: app.position,
        newStatus,
      });
      await queryClient.invalidateQueries({ queryKey: ["applications"] });
    } catch {
      setOptimisticStatus(null);
    }
  };

  return (
    <div className="flex flex-col gap-2 min-w-[140px]">
      <PayoutStatusBadge status={currentStatus} />
      <Select
        value={currentStatus}
        onValueChange={(val) =>
          handleChange(val as Variant_pending_completed_processing)
        }
        disabled={updatePayoutStatus.isPending}
      >
        <SelectTrigger
          className="h-7 text-xs bg-navy-deep/60 border-gold/20 text-white/70 focus:ring-gold/20 focus:border-gold w-full"
          data-ocid={`admin.payout_status_select.${index}`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-navy border-gold/20">
          <SelectItem
            value="pending"
            className="text-amber-400 focus:bg-amber-500/10 text-xs"
          >
            Pending
          </SelectItem>
          <SelectItem
            value="processing"
            className="text-blue-400 focus:bg-blue-500/10 text-xs"
          >
            Processing
          </SelectItem>
          <SelectItem
            value="completed"
            className="text-green-400 focus:bg-green-500/10 text-xs"
          >
            Completed
          </SelectItem>
        </SelectContent>
      </Select>
      {updatePayoutStatus.isPending && (
        <Loader2 className="w-3 h-3 animate-spin text-gold/50" />
      )}
    </div>
  );
}

export default function AdminSection() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const {
    data: applications,
    isLoading: appsLoading,
    refetch,
    isFetching: appsRefetching,
  } = useGetApplications();

  const handleAuthToggle = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as { message?: string };
        if (err?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const showAdminPanel = isAuthenticated && !adminLoading && isAdmin;

  return (
    <section className="py-20 bg-navy-deep border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin toggle header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center">
              <Shield className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-white">
                Admin Dashboard
              </h2>
              <p className="text-white/40 text-sm">
                {isAuthenticated
                  ? isAdmin
                    ? "You have admin access"
                    : "Not authorized as admin"
                  : "Login to access admin panel"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && showAdminPanel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="border-gold/30 text-gold hover:bg-gold/10 gap-2"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" /> Collapse
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" /> View Applications
                  </>
                )}
              </Button>
            )}

            <Button
              onClick={handleAuthToggle}
              disabled={isLoggingIn}
              className={`gap-2 font-semibold ${
                isAuthenticated
                  ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  : "bg-gold hover:bg-gold-light text-navy-deep"
              }`}
              data-ocid={
                isAuthenticated ? "admin.logout_button" : "admin.login_button"
              }
            >
              {isLoggingIn ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Admin Login
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Applications table */}
        <AnimatePresence>
          {showAdminPanel && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="rounded-2xl border border-gold/15 overflow-hidden bg-navy-mid">
                {/* Table header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gold/10">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-gold" />
                    <span className="text-white font-semibold text-sm">
                      All Applications
                    </span>
                    {applications && (
                      <Badge className="bg-gold/15 text-gold border-0 text-xs">
                        {applications.length}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={appsRefetching}
                    className="text-white/50 hover:text-gold hover:bg-gold/10 gap-1.5"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${appsRefetching ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </Button>
                </div>

                {/* Table content */}
                {appsLoading ? (
                  <div className="p-6 space-y-3">
                    {["sk1", "sk2", "sk3"].map((id) => (
                      <Skeleton key={id} className="h-12 w-full bg-white/5" />
                    ))}
                  </div>
                ) : !applications || applications.length === 0 ? (
                  <div
                    className="py-16 text-center"
                    data-ocid="admin.empty_state"
                  >
                    <Users className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40 font-medium">
                      No applications yet
                    </p>
                    <p className="text-white/25 text-sm mt-1">
                      Applications will appear here once submitted
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="admin.table">
                      <TableHeader>
                        <TableRow className="border-gold/10 hover:bg-transparent">
                          <TableHead className="text-gold/70 font-semibold text-xs uppercase tracking-wide">
                            Name
                          </TableHead>
                          <TableHead className="text-gold/70 font-semibold text-xs uppercase tracking-wide">
                            Email
                          </TableHead>
                          <TableHead className="text-gold/70 font-semibold text-xs uppercase tracking-wide">
                            WhatsApp
                          </TableHead>
                          <TableHead className="text-gold/70 font-semibold text-xs uppercase tracking-wide">
                            Position
                          </TableHead>
                          <TableHead className="text-gold/70 font-semibold text-xs uppercase tracking-wide">
                            Message
                          </TableHead>
                          <TableHead className="text-gold/70 font-semibold text-xs uppercase tracking-wide">
                            Payout Method
                          </TableHead>
                          <TableHead className="text-gold/70 font-semibold text-xs uppercase tracking-wide">
                            Payout Details
                          </TableHead>
                          <TableHead className="text-gold/70 font-semibold text-xs uppercase tracking-wide">
                            Payout Status
                          </TableHead>
                          <TableHead className="text-gold/70 font-semibold text-xs uppercase tracking-wide">
                            Date
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applications.map((app, i) => (
                          <TableRow
                            key={`${app.email}-${app.submittedAt}`}
                            className="border-gold/8 hover:bg-white/5 transition-colors"
                            data-ocid={`admin.row.${i + 1}`}
                          >
                            <TableCell className="text-white font-medium text-sm">
                              {app.name}
                            </TableCell>
                            <TableCell className="text-white/70 text-sm">
                              {app.email}
                            </TableCell>
                            <TableCell className="text-white/70 text-sm">
                              {app.whatsapp}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-gold/15 text-gold border-0 text-xs whitespace-nowrap">
                                {app.position}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-white/60 text-sm max-w-xs">
                              <p className="line-clamp-2">{app.message}</p>
                            </TableCell>
                            <TableCell>
                              <PayoutMethodBadge method={app.payoutMethod} />
                            </TableCell>
                            <TableCell className="max-w-[180px]">
                              <PayoutDetails method={app.payoutMethod} />
                            </TableCell>
                            <TableCell>
                              <PayoutStatusCell app={app} index={i + 1} />
                            </TableCell>
                            <TableCell className="text-white/50 text-xs whitespace-nowrap">
                              {formatDate(app.submittedAt)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Not admin message */}
        {isAuthenticated && !adminLoading && !isAdmin && (
          <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-4 flex items-center gap-3">
            <Shield className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-destructive/90 text-sm">
              Your account does not have admin privileges. Contact the system
              administrator for access.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
