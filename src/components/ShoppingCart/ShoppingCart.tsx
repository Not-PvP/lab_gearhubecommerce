import { useCard } from "../../state/CardContext";
import "./ShoppingCart.css";

function ShoppingCart() {
  const { state, dispatch } = useCard();
  const { cart, isCartOpen } = state;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 150 : 0;
  const total = subtotal + shipping;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const onClose = () => dispatch({ type: "TOGGLE_CART", payload: false });
  const onIncrease = (id: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity: quantity + 1 } });
  const onDecrease = (id: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity: quantity - 1 } });
  const onRemove = (id: string) => dispatch({ type: "REMOVE_FROM_CART", payload: id });

  return (
    <>
      <div
        className={`cart-overlay ${isCartOpen ? "cart-overlay--visible" : ""}`}
        onClick={onClose}
      />
      <aside className={`cart-drawer ${isCartOpen ? "cart-drawer--open" : ""}`}>
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">Your Cart ({itemCount})</h2>
          <button className="cart-drawer__close" onClick={onClose}>✕</button>
        </div>

        <div className="cart-drawer__items">
          {cart.length === 0 ? (
            <div className="cart-drawer__empty">
              <p>Your cart is empty.</p>
              <button className="cart-drawer__continue" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} className="cart-item__image" />
                <div className="cart-item__details">
                  <p className="cart-item__name">{item.name}</p>
                  <p className="cart-item__price">₱{item.price.toLocaleString()}</p>
                  <div className="cart-item__qty">
                    <button onClick={() => onDecrease(item.id, item.quantity)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onIncrease(item.id, item.quantity)}>+</button>
                  </div>
                </div>
                <button className="cart-item__remove" onClick={() => onRemove(item.id)} aria-label="Remove item">✕</button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__row"><span>Subtotal</span><span>₱{subtotal.toLocaleString()}</span></div>
            <div className="cart-drawer__row"><span>Shipping</span><span>₱{shipping.toLocaleString()}</span></div>
            <div className="cart-drawer__row cart-drawer__row--total"><span>Total</span><span>₱{total.toLocaleString()}</span></div>
            <button className="cart-drawer__checkout">Checkout</button>
          </div>
        )}
      </aside>
    </>
  );
}

export default ShoppingCart;