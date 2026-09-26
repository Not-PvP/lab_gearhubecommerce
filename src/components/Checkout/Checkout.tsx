import { useEffect, useRef, useState } from "react";
import { useCard } from "../../state/CardContext";
import { PaymentMethod, ShippingAddress } from "../../types/types";
import { createInvoice, getInvoiceStatus } from "../../utils/xenditClient";
import "./Checkout.css";

const EMPTY_ADDRESS: ShippingAddress = {
  fullName: "",
  street: "",
  city: "",
  province: "",
  postalCode: "",
  phone: "",
};

const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

type Stage = "form" | "awaiting-payment" | "confirmed" | "cancelled" | "error";

function Checkout() {
  const { state, dispatch } = useCard();
  const { cart, isCheckoutOpen } = state;

  const [address, setAddress] = useState<ShippingAddress>(EMPTY_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [stage, setStage] = useState<Stage>("form");
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const popupRef = useRef<Window | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedItems = cart.filter((item) => item.selected);
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 0 ? 150 : 0;
  const total = subtotal + shipping;

  const clearPolling = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
    pollIntervalRef.current = null;
    pollTimeoutRef.current = null;
  };

  useEffect(() => {
    if (!isCheckoutOpen) {
      clearPolling();
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    }
  }, [isCheckoutOpen]);

  useEffect(() => () => clearPolling(), []);

  const onClose = () => {
    clearPolling();
    if (popupRef.current && !popupRef.current.closed) popupRef.current.close();
    

    setAddress(EMPTY_ADDRESS);
    setPaymentMethod("cod");
    setStage("form");
    setPlacedOrderId(null);
    setErrorMessage("");
    
    dispatch({ type: "TOGGLE_CHECKOUT", payload: false });
  };

  const onChangeField =
    (field: keyof ShippingAddress) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setAddress((prev) => ({ ...prev, [field]: e.target.value }));

  const isAddressComplete = Object.values(address).every(
    (value) => value.trim().length > 0,
  );

  const finalizeOrder = (orderId: string) => {
    dispatch({
      type: "PLACE_ORDER",
      payload: { id: orderId, shippingAddress: address, paymentMethod },
    });
    setPlacedOrderId(orderId);
    setStage("confirmed");
  };

  const startPollingForPayment = (sessionId: string, orderId: string) => {
    const deadline = Date.now() + POLL_TIMEOUT_MS;

    pollIntervalRef.current = setInterval(async () => {
      if (popupRef.current?.closed) {
        clearPolling();
        setStage("cancelled");
        return;
      }

      if (Date.now() > deadline) {
        clearPolling();
        if (popupRef.current && !popupRef.current.closed) popupRef.current.close();
        setErrorMessage("This checkout session timed out. Please try again.");
        setStage("error");
        return;
      }

      try {
        const { status } = await getInvoiceStatus(sessionId);
        if (status === "PAID" || status === "SETTLED") {
          clearPolling();
          if (popupRef.current && !popupRef.current.closed) popupRef.current.close();
          finalizeOrder(orderId);
        } else if (status === "EXPIRED") {
          clearPolling();
          if (popupRef.current && !popupRef.current.closed) popupRef.current.close();
          setErrorMessage("This invoice expired before payment was completed.");
          setStage("error");
        }
      } catch (err) {
        console.error("Failed to poll invoice status:", err);
      }
    }, POLL_INTERVAL_MS);
  };

  const onPlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddressComplete || selectedItems.length === 0) return;

    const orderId = `ORD-${Date.now()}`;

    if (paymentMethod === "cod") {
      finalizeOrder(orderId);
      return;
    }

    const popup = window.open(
      "about:blank",
      "xendit_checkout",
      "width=480,height=720",
    );
    popupRef.current = popup;

    if (popup) {
      popup.document.write(
        "<p style='font-family:sans-serif;padding:24px;color:#555'>Loading secure checkout&hellip;</p>",
      );
    }

    setStage("awaiting-payment");
    setErrorMessage("");

    try {
      const { id, invoiceUrl } = await createInvoice(
        selectedItems.map((item) => ({
          name: item.name,
          unitPrice: item.price,
          quantity: item.quantity,
        })),
        orderId,
        [paymentMethod === "gcash" ? "GCASH" : "CREDIT_CARD"],
      );

      if (popup) {
        popup.location.href = invoiceUrl;
      } else {
        window.location.href = invoiceUrl;
        return;
      }

      startPollingForPayment(id, orderId);
    } catch (err) {
      if (popup && !popup.closed) popup.close();
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Couldn't start checkout. Please try again.",
      );
      setStage("error");
    }
  };

  const onCancelAwaitingPayment = () => {
    clearPolling();
    if (popupRef.current && !popupRef.current.closed) popupRef.current.close();
    setStage("form");
  };

  const onRetry = () => {
    setErrorMessage("");
    setStage("form");
  };

  if (!isCheckoutOpen) return null;

  return (
    <>
      <div className="checkout-overlay" onClick={stage === "form" ? onClose : undefined} />
      <div className="checkout-modal" role="dialog" aria-modal="true">
        <div className="checkout-modal__header">
          <h2 className="checkout-modal__title">
            {stage === "confirmed"
              ? "Order Confirmed"
              : stage === "awaiting-payment"
                ? "Complete Payment"
                : stage === "cancelled"
                  ? "Payment Cancelled"
                  : stage === "error"
                    ? "Something Went Wrong"
                    : "Checkout"}
          </h2>
          <button className="checkout-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        {stage === "confirmed" && placedOrderId && (
          <div className="checkout-confirmation">
            <p className="checkout-confirmation__icon">✓</p>
            <p className="checkout-confirmation__text">
              Your order has been placed.
            </p>
            <p className="checkout-confirmation__id">Order ID: {placedOrderId}</p>
            <p className="checkout-confirmation__status">Status: PENDING</p>
            <button className="checkout-modal__submit" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        )}

        {stage === "awaiting-payment" && (
          <div className="checkout-confirmation">
            <p className="checkout-confirmation__spinner" aria-hidden="true" />
            <p className="checkout-confirmation__text">
              Complete your {paymentMethod === "gcash" ? "GCash" : "card"} payment
              in the window that opened.
            </p>
            <p className="checkout-confirmation__status">
              Waiting for confirmation&hellip;
            </p>
            <button className="checkout-modal__secondary" onClick={onCancelAwaitingPayment}>
              Cancel
            </button>
          </div>
        )}

        {stage === "cancelled" && (
          <div className="checkout-confirmation">
            <p className="checkout-confirmation__icon checkout-confirmation__icon--muted">
              ✕
            </p>
            <p className="checkout-confirmation__text">
              Payment window was closed before completing.
            </p>
            <p className="checkout-confirmation__status">
              Your cart is unchanged — nothing was charged.
            </p>
            <button className="checkout-modal__submit" onClick={onRetry}>
              Try Again
            </button>
          </div>
        )}

        {stage === "error" && (
          <div className="checkout-confirmation">
            <p className="checkout-confirmation__icon checkout-confirmation__icon--error">
              !
            </p>
            <p className="checkout-confirmation__text">{errorMessage}</p>
            <button className="checkout-modal__submit" onClick={onRetry}>
              Try Again
            </button>
          </div>
        )}

        {stage === "form" && (
          <form className="checkout-form" onSubmit={onPlaceOrder}>
            <div className="checkout-order-summary">
              {selectedItems.map((item) => (
                <div className="checkout-order-summary__row" key={item.id}>
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₱{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="checkout-order-summary__row">
                <span>Shipping</span>
                <span>₱{shipping.toLocaleString()}</span>
              </div>
              <div className="checkout-order-summary__row checkout-order-summary__row--total">
                <span>Total</span>
                <span>₱{total.toLocaleString()}</span>
              </div>
            </div>

            <h3 className="checkout-form__section-title">Shipping Address</h3>
            <div className="checkout-form__grid">
              <input
                className="checkout-form__input"
                placeholder="Full Name"
                value={address.fullName}
                onChange={onChangeField("fullName")}
                required
              />
              <input
                className="checkout-form__input"
                placeholder="Phone Number"
                value={address.phone}
                onChange={onChangeField("phone")}
                required
              />
              <input
                className="checkout-form__input checkout-form__input--full"
                placeholder="Street Address"
                value={address.street}
                onChange={onChangeField("street")}
                required
              />
              <input
                className="checkout-form__input"
                placeholder="City"
                value={address.city}
                onChange={onChangeField("city")}
                required
              />
              <input
                className="checkout-form__input"
                placeholder="Province"
                value={address.province}
                onChange={onChangeField("province")}
                required
              />
              <input
                className="checkout-form__input"
                placeholder="Postal Code"
                value={address.postalCode}
                onChange={onChangeField("postalCode")}
                required
              />
            </div>

            <h3 className="checkout-form__section-title">Payment Method</h3>
            <div className="checkout-payment-options">
              {(
                [
                  { id: "cod", label: "Cash on Delivery" },
                  { id: "card", label: "Card via Xendit (Test Mode)" },
                  { id: "gcash", label: "GCash via Xendit (Test Mode)" },
                ] as { id: PaymentMethod; label: string }[]
              ).map((option) => (
                <label className="checkout-payment-option" key={option.id}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === option.id}
                    onChange={() => setPaymentMethod(option.id)}
                  />
                  {option.label}
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="checkout-modal__submit"
              disabled={!isAddressComplete || selectedItems.length === 0}
            >
              {paymentMethod === "cod"
                ? `Place Order — ₱${total.toLocaleString()}`
                : `Pay ₱${total.toLocaleString()} with Xendit`}
            </button>
          </form>
        )}
      </div>
    </>
  );
}

export default Checkout;