import { useState } from "react";
import { useCard } from "../../state/CardContext";
import { PaymentMethod, ShippingAddress } from "../../types/types";
import "./Checkout.css";

const EMPTY_ADDRESS: ShippingAddress = {
  fullName: "",
  street: "",
  city: "",
  province: "",
  postalCode: "",
  phone: "",
};

function Checkout() {
  const { state, dispatch } = useCard();
  const { cart, isCheckoutOpen } = state;

  const [address, setAddress] = useState<ShippingAddress>(EMPTY_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const selectedItems = cart.filter((item) => item.selected);
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 0 ? 150 : 0;
  const total = subtotal + shipping;

  const onClose = () => {
    dispatch({ type: "TOGGLE_CHECKOUT", payload: false });
    // Reset local form state after the close animation has room to run.
    setTimeout(() => {
      setAddress(EMPTY_ADDRESS);
      setPaymentMethod("cod");
      setPlacedOrderId(null);
    }, 250);
  };

  const onChangeField =
    (field: keyof ShippingAddress) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setAddress((prev) => ({ ...prev, [field]: e.target.value }));

  const isAddressComplete = Object.values(address).every(
    (value) => value.trim().length > 0,
  );

  const onPlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddressComplete || selectedItems.length === 0) return;

    const orderId = `ORD-${Date.now()}`;
    dispatch({
      type: "PLACE_ORDER",
      payload: { id: orderId, shippingAddress: address, paymentMethod },
    });
    setPlacedOrderId(orderId);
  };

  if (!isCheckoutOpen) return null;

  return (
    <>
      <div className="checkout-overlay" onClick={onClose} />
      <div className="checkout-modal" role="dialog" aria-modal="true">
        <div className="checkout-modal__header">
          <h2 className="checkout-modal__title">
            {placedOrderId ? "Order Confirmed" : "Checkout"}
          </h2>
          <button className="checkout-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        {placedOrderId ? (
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
        ) : (
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
                  { id: "card", label: "Card (Simulated)" },
                  { id: "gcash", label: "GCash (Simulated)" },
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
              Place Order — ₱{total.toLocaleString()}
            </button>
          </form>
        )}
      </div>
    </>
  );
}

export default Checkout;