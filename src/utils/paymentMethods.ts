// "cod" is paid to the courier; "xendit" opens Xendit's hosted checkout,
// where the customer picks card, e-wallet, bank, over-the-counter, etc.
export type CheckoutPaymentMethod = "cod" | "xendit";

// Older orders were saved with "card" or "gcash" before checkout moved to a
// single online option, so labels still cover them.
const LABELS: Record<string, string> = {
  cod: "Cash on delivery",
  xendit: "Online (Xendit)",
  card: "Card",
  gcash: "GCash",
};

export function getPaymentLabel(method: string): string {
  return LABELS[method] ?? method.toUpperCase();
}
