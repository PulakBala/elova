"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Gift,
  Copy,
  Check,
  Share2,
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  DollarSign,
  Users,
  ShoppingBag,
  Info,
  Building2,
  Smartphone,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {
  fetchCustomerReferralApi,
  fetchCustomerWalletTransactionsApi,
  fetchCustomerPayoutRequestsApi,
  submitCustomerPayoutRequestApi,
  type ApiReferralDashboard,
  type ApiWalletTransaction,
  type ApiPayoutRequest,
} from "@/lib/api";

export function ReferralDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<ApiReferralDashboard | null>(null);
  const [transactions, setTransactions] = useState<ApiWalletTransaction[]>([]);
  const [payouts, setPayouts] = useState<ApiPayoutRequest[]>([]);
  const [activeHistoryTab, setActiveHistoryTab] = useState<"payouts" | "ledger">("payouts");
  
  // Copy to clipboard state
  const [copied, setCopied] = useState(false);
  
  // Payout Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<string>("");
  const [payoutMethod, setPayoutMethod] = useState<"bkash" | "nagad" | "rocket" | "bank_transfer">("bkash");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [payoutNotes, setPayoutNotes] = useState("");
  
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);
  const [payoutError, setPayoutError] = useState<string | null>(null);
  const [payoutSuccess, setPayoutSuccess] = useState<string | null>(null);

  // Load all referral and wallet data
  const loadData = useCallback(async () => {
    try {
      const [refRes, txRes, poRes] = await Promise.all([
        fetchCustomerReferralApi(),
        fetchCustomerWalletTransactionsApi(1),
        fetchCustomerPayoutRequestsApi(1),
      ]);

      if (refRes?.success && refRes.data) {
        setDashboardData(refRes.data);
      }
      if (txRes?.success && Array.isArray(txRes.data)) {
        setTransactions(txRes.data);
      }
      if (poRes?.success && Array.isArray(poRes.data)) {
        setPayouts(poRes.data);
      }
    } catch (err) {
      console.warn("Failed to load customer referral data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCopyLink = async () => {
    if (!dashboardData?.referral_link) return;
    try {
      await navigator.clipboard.writeText(dashboardData.referral_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = dashboardData.referral_link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = (platform: "whatsapp" | "facebook" | "native") => {
    if (!dashboardData) return;
    const url = encodeURIComponent(dashboardData.referral_link);
    const message = encodeURIComponent(
      `Shop premium products on ELVOA! Use my invite link to explore verified collections: ${dashboardData.referral_link}`
    );

    if (platform === "whatsapp") {
      window.open(`https://api.whatsapp.com/send?text=${message}`, "_blank");
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    } else if (platform === "native" && navigator.share) {
      navigator.share({
        title: "Join me on ELVOA",
        text: "Shop curated premium collections on ELVOA!",
        url: dashboardData.referral_link,
      }).catch(() => {});
    }
  };

  const openPayoutModal = () => {
    setPayoutError(null);
    setPayoutSuccess(null);
    if (dashboardData) {
      setPayoutAmount(String(dashboardData.stats.available_balance || ""));
    }
    setIsModalOpen(true);
  };

  const handlePayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutError(null);
    setPayoutSuccess(null);

    const amountNum = parseFloat(payoutAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setPayoutError("Please enter a valid payout amount.");
      return;
    }

    const minThreshold = dashboardData?.settings.minimum_payout_threshold ?? 500;
    if (amountNum < minThreshold) {
      setPayoutError(`Minimum payout request amount is ৳${minThreshold}.`);
      return;
    }

    const availableBal = dashboardData?.stats.available_balance ?? 0;
    if (amountNum > availableBal) {
      setPayoutError(`Requested amount exceeds your available balance of ৳${availableBal.toLocaleString()}.`);
      return;
    }

    if (!accountNumber.trim()) {
      setPayoutError("Please enter the recipient account / mobile wallet number.");
      return;
    }

    if (payoutMethod === "bank_transfer" && !bankName.trim()) {
      setPayoutError("Please provide your Bank name.");
      return;
    }

    setIsSubmittingPayout(true);
    try {
      const res = await submitCustomerPayoutRequestApi({
        amount: amountNum,
        method: payoutMethod,
        account_number: accountNumber.trim(),
        account_name: accountName.trim() || undefined,
        bank_name: bankName.trim() || undefined,
        branch_name: branchName.trim() || undefined,
        routing_number: routingNumber.trim() || undefined,
        notes: payoutNotes.trim() || undefined,
      });

      if (res.success) {
        setPayoutSuccess(res.message || "Payout request submitted successfully!");
        setAccountNumber("");
        setAccountName("");
        setBankName("");
        setBranchName("");
        setRoutingNumber("");
        setPayoutNotes("");
        // Refresh dashboard and tables
        await loadData();
        setTimeout(() => {
          setIsModalOpen(false);
          setPayoutSuccess(null);
        }, 1800);
      } else {
        setPayoutError(res.message || "Failed to submit payout request.");
      }
    } catch (err: any) {
      setPayoutError(err.message || "Something went wrong while submitting your request.");
    } finally {
      setIsSubmittingPayout(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-14 bg-white rounded-3xl border border-neutral-200">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF5B37]" />
        <p className="mt-3 text-xs font-semibold text-neutral-500">
          Loading your referral dashboard & wallet...
        </p>
      </div>
    );
  }

  const stats = dashboardData?.stats ?? {
    total_referred_users: 0,
    converted_orders_count: 0,
    available_balance: 0,
    pending_balance: 0,
    lifetime_earned: 0,
  };

  const settings = dashboardData?.settings ?? {
    is_enabled: true,
    commission_type: "percentage",
    commission_value: 5,
    minimum_order_value: 500,
    minimum_payout_threshold: 500,
    reward_frequency: "first_order_only",
  };

  const canRequestPayout = stats.available_balance >= settings.minimum_payout_threshold;

  return (
    <div className="space-y-6">
      {/* 1. Referral Link & Sharing Hero Banner */}
      <div className="rounded-3xl border border-neutral-200/90 bg-gradient-to-br from-white via-white to-orange-50/40 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FF5B37]/10 px-3 py-1 text-xs font-bold text-[#FF5B37]">
              <Gift className="h-3.5 w-3.5" />
              <span>ELVOA Refer & Earn Program</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
              Invite Friends & Earn{" "}
              <span className="text-[#FF5B37]">
                {settings.commission_type === "percentage"
                  ? `${settings.commission_value}% Commission`
                  : `৳${settings.commission_value}`}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Share your unique referral link with family and friends. When they place a
              delivered qualifying order of minimum ৳{settings.minimum_order_value.toLocaleString()}, you earn
              commission directly into your wallet.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xs border border-neutral-200/90 rounded-2xl p-4 shadow-2xs shrink-0">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Lifetime Earned
              </p>
              <p className="text-xl sm:text-2xl font-black text-neutral-900">
                ৳{stats.lifetime_earned.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Unique Link Copy Card */}
        <div className="mt-6 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              readOnly
              value={dashboardData?.referral_link || ""}
              className="w-full h-12 rounded-2xl border border-neutral-200 bg-neutral-50/90 px-4 text-xs sm:text-sm text-neutral-800 font-mono select-all focus:outline-none"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <span className="hidden sm:inline-block text-[11px] font-bold text-neutral-400 bg-neutral-200/60 px-2 py-0.5 rounded-lg font-mono">
                CODE: {dashboardData?.referral_code}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className={`h-12 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 shadow-sm ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-[#FF5B37] text-white hover:bg-[#eb4e2a]"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleShare("whatsapp")}
              className="h-12 w-12 rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center text-emerald-600 shadow-2xs transition-all cursor-pointer"
              title="Share via WhatsApp"
            >
              <Smartphone className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleShare("native")}
              className="h-12 w-12 rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-700 shadow-2xs transition-all cursor-pointer"
              title="Share Link"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Five Real-time Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Available Balance */}
        <div className="col-span-2 lg:col-span-1 rounded-2xl border border-neutral-200/90 bg-white p-4 sm:p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Available Cash
            </span>
            <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-neutral-900">
            ৳{stats.available_balance.toLocaleString()}
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-[10px] text-neutral-400">
              Min cashout: ৳{settings.minimum_payout_threshold}
            </span>
            <button
              type="button"
              onClick={openPayoutModal}
              disabled={!canRequestPayout}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                canRequestPayout
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-2xs"
                  : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              }`}
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Pending Orders Balance */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Pending Orders
            </span>
            <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-neutral-900">
            ৳{stats.pending_balance.toLocaleString()}
          </div>
          <p className="mt-3 pt-3 border-t border-neutral-100 text-[10.5px] text-neutral-400">
            Releases on delivery
          </p>
        </div>

        {/* Total Referred */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Referred Friends
            </span>
            <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-neutral-900">
            {stats.total_referred_users}
          </div>
          <p className="mt-3 pt-3 border-t border-neutral-100 text-[10.5px] text-neutral-400">
            Registered accounts
          </p>
        </div>

        {/* Converted Orders */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Converted Orders
            </span>
            <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-neutral-900">
            {stats.converted_orders_count}
          </div>
          <p className="mt-3 pt-3 border-t border-neutral-100 text-[10.5px] text-neutral-400">
            Delivered purchases
          </p>
        </div>

        {/* Total Earned */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Total Payouts
            </span>
            <div className="h-8 w-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-neutral-900">
            {payouts.filter((p) => p.status === "paid").length}
          </div>
          <p className="mt-3 pt-3 border-t border-neutral-100 text-[10.5px] text-neutral-400">
            Successful withdrawals
          </p>
        </div>
      </div>

      {/* 3. Program Rules & How It Works */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 sm:p-5 text-xs text-neutral-700">
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-neutral-900">How Commission & Cashout Works</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-[11.5px] text-neutral-600">
              <div className="bg-white/80 rounded-xl p-3 border border-blue-100/60">
                <span className="font-bold text-neutral-900 block mb-0.5">1. Qualifying Orders</span>
                Referred customer must place an order of at least ৳{settings.minimum_order_value} (excluding shipping).
              </div>
              <div className="bg-white/80 rounded-xl p-3 border border-blue-100/60">
                <span className="font-bold text-neutral-900 block mb-0.5">2. Delivered Status</span>
                Commission is awarded strictly once the parcel status becomes <strong>Delivered</strong> to prevent fraud.
              </div>
              <div className="bg-white/80 rounded-xl p-3 border border-blue-100/60">
                <span className="font-bold text-neutral-900 block mb-0.5">3. Instant Withdrawal</span>
                Once your available balance reaches ৳{settings.minimum_payout_threshold}, submit a withdrawal request to bKash, Nagad, Rocket or Bank.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. History Tabs (Payout Requests vs Wallet Ledger) */}
      <div className="rounded-3xl border border-neutral-200/90 bg-white p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveHistoryTab("payouts")}
              className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeHistoryTab === "payouts"
                  ? "border-[#FF5B37] text-[#FF5B37]"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Withdrawal Requests ({payouts.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveHistoryTab("ledger")}
              className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeHistoryTab === "ledger"
                  ? "border-[#FF5B37] text-[#FF5B37]"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Wallet Ledger ({transactions.length})
            </button>
          </div>

          <button
            type="button"
            onClick={openPayoutModal}
            disabled={!canRequestPayout}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              canRequestPayout
                ? "bg-[#FF5B37] text-white hover:bg-[#eb4e2a] cursor-pointer"
                : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
            }`}
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>Request Payout</span>
          </button>
        </div>

        {/* Tab 1: Payout Requests Table */}
        {activeHistoryTab === "payouts" && (
          <div className="mt-4">
            {payouts.length === 0 ? (
              <div className="text-center py-12 text-neutral-400 text-xs">
                <Wallet className="h-8 w-8 mx-auto mb-2 text-neutral-300" />
                <p>No withdrawal requests yet.</p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Once your earnings reach ৳{settings.minimum_payout_threshold}, click &quot;Request Payout&quot; to withdraw.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-100 text-neutral-400 text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-3 font-semibold">Request #</th>
                      <th className="py-3 px-3 font-semibold">Date</th>
                      <th className="py-3 px-3 font-semibold">Method & Account</th>
                      <th className="py-3 px-3 font-semibold">Amount</th>
                      <th className="py-3 px-3 font-semibold">Status</th>
                      <th className="py-3 px-3 font-semibold">Reference / Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {payouts.map((req) => (
                      <tr key={req.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-neutral-900">
                          {req.payout_number}
                        </td>
                        <td className="py-3.5 px-3 text-neutral-500">
                          {new Date(req.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-neutral-900 uppercase">
                            {req.method.replace("_", " ")}
                          </span>
                          <span className="block text-[11px] text-neutral-500 font-mono">
                            {req.account_number}
                          </span>
                          {req.bank_name && (
                            <span className="block text-[10px] text-neutral-400">
                              {req.bank_name} {req.branch_name ? `(${req.branch_name})` : ""}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 font-extrabold text-neutral-900">
                          ৳{req.amount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3">
                          {req.status === "paid" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                              <CheckCircle2 className="h-3 w-3" />
                              Paid
                            </span>
                          )}
                          {req.status === "pending" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                              <Clock className="h-3 w-3" />
                              Pending Review
                            </span>
                          )}
                          {req.status === "rejected" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700">
                              <XCircle className="h-3 w-3" />
                              Rejected (Refunded)
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-[11px] text-neutral-500 max-w-[200px]">
                          {req.transaction_reference && (
                            <span className="font-mono text-neutral-700 block">
                              TrxID: {req.transaction_reference}
                            </span>
                          )}
                          {req.rejection_reason && (
                            <span className="text-red-600 block">
                              Reason: {req.rejection_reason}
                            </span>
                          )}
                          {req.admin_notes && (
                            <span className="text-neutral-400 block text-[10.5px]">
                              {req.admin_notes}
                            </span>
                          )}
                          {!req.transaction_reference && !req.rejection_reason && !req.admin_notes && "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Wallet Transaction Ledger */}
        {activeHistoryTab === "ledger" && (
          <div className="mt-4">
            {transactions.length === 0 ? (
              <div className="text-center py-12 text-neutral-400 text-xs">
                <Wallet className="h-8 w-8 mx-auto mb-2 text-neutral-300" />
                <p>No ledger transactions recorded yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-100 text-neutral-400 text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-3 font-semibold">Date</th>
                      <th className="py-3 px-3 font-semibold">Source / Description</th>
                      <th className="py-3 px-3 font-semibold">Type</th>
                      <th className="py-3 px-3 font-semibold">Amount</th>
                      <th className="py-3 px-3 font-semibold">Balance After</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="py-3.5 px-3 text-neutral-500">
                          {new Date(tx.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-neutral-900 block capitalize">
                            {tx.source.replace("_", " ")}
                          </span>
                          <span className="text-[11px] text-neutral-500">
                            {tx.description || "—"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-bold uppercase ${
                              tx.type === "credit"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td
                          className={`py-3.5 px-3 font-black ${
                            tx.type === "credit" ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {tx.type === "credit" ? "+" : "-"}৳{tx.amount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3 font-bold text-neutral-800">
                          ৳{tx.balance_after.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Request Payout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-neutral-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-2xl bg-[#FF5B37]/10 flex items-center justify-center text-[#FF5B37]">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-neutral-900">
                    Withdraw Referral Earnings
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Available Balance:{" "}
                    <strong className="text-emerald-600">
                      ৳{stats.available_balance.toLocaleString()}
                    </strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-neutral-100 text-neutral-400 hover:text-neutral-700 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {payoutError && (
              <div className="mt-4 p-3 rounded-2xl bg-red-50 border border-red-100 text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{payoutError}</span>
              </div>
            )}

            {payoutSuccess && (
              <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{payoutSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePayoutSubmit} className="mt-5 space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Amount to Withdraw (BDT) <span className="text-[#FF5B37]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-neutral-400 text-sm">
                    ৳
                  </span>
                  <input
                    type="number"
                    min={settings.minimum_payout_threshold}
                    max={stats.available_balance}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder={`Min ৳${settings.minimum_payout_threshold}`}
                    className="w-full h-11 rounded-xl border border-neutral-300 pl-8 pr-3 text-xs text-neutral-900 focus:border-[#FF5B37] focus:outline-none"
                    required
                  />
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-neutral-400">
                  <span>Minimum: ৳{settings.minimum_payout_threshold}</span>
                  <button
                    type="button"
                    onClick={() => setPayoutAmount(String(stats.available_balance))}
                    className="text-[#FF5B37] font-semibold hover:underline cursor-pointer"
                  >
                    Withdraw All (৳{stats.available_balance})
                  </button>
                </div>
              </div>

              {/* Method Selection */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Select Payout Method <span className="text-[#FF5B37]">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "bkash", label: "bKash" },
                    { id: "nagad", label: "Nagad" },
                    { id: "rocket", label: "Rocket" },
                    { id: "bank_transfer", label: "Bank" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayoutMethod(m.id as any)}
                      className={`h-11 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                        payoutMethod === m.id
                          ? "border-[#FF5B37] bg-[#FF5B37]/5 text-[#FF5B37]"
                          : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile / Account Number */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  {payoutMethod === "bank_transfer" ? "Bank Account Number" : `${payoutMethod.toUpperCase()} Personal Number`}{" "}
                  <span className="text-[#FF5B37]">*</span>
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder={
                    payoutMethod === "bank_transfer"
                      ? "e.g. 2050123456789"
                      : "e.g. 017XXXXXXXX"
                  }
                  className="w-full h-11 rounded-xl border border-neutral-300 px-3.5 text-xs text-neutral-900 focus:border-[#FF5B37] focus:outline-none"
                  required
                />
              </div>

              {/* Bank Transfer specific fields */}
              {payoutMethod === "bank_transfer" && (
                <div className="space-y-3 pt-1 border-t border-neutral-100">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Bank Name <span className="text-[#FF5B37]">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. Islami Bank Bangladesh / City Bank"
                      className="w-full h-10.5 rounded-xl border border-neutral-300 px-3 text-xs text-neutral-900 focus:border-[#FF5B37] focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Branch Name
                      </label>
                      <input
                        type="text"
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                        placeholder="e.g. Dhanmondi"
                        className="w-full h-10.5 rounded-xl border border-neutral-300 px-3 text-xs text-neutral-900 focus:border-[#FF5B37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Routing Number
                      </label>
                      <input
                        type="text"
                        value={routingNumber}
                        onChange={(e) => setRoutingNumber(e.target.value)}
                        placeholder="e.g. 125272828"
                        className="w-full h-10.5 rounded-xl border border-neutral-300 px-3 text-xs text-neutral-900 focus:border-[#FF5B37] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Account Holder Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Account Holder Name <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. MD Shakil Ahmed"
                  className="w-full h-11 rounded-xl border border-neutral-300 px-3.5 text-xs text-neutral-900 focus:border-[#FF5B37] focus:outline-none"
                />
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Notes <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={payoutNotes}
                  onChange={(e) => setPayoutNotes(e.target.value)}
                  placeholder="Any special remarks for admin"
                  className="w-full h-11 rounded-xl border border-neutral-300 px-3.5 text-xs text-neutral-900 focus:border-[#FF5B37] focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-11 rounded-xl border border-neutral-300 font-bold text-xs text-neutral-700 hover:bg-neutral-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayout}
                  className="flex-1 h-11 rounded-xl bg-[#FF5B37] hover:bg-[#eb4e2a] font-bold text-xs text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-70"
                >
                  {isSubmittingPayout ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Confirm Withdrawal</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
