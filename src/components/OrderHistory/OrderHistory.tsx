import React from "react";
import { useCard } from "../../state/CardContext";
import "./OrderHistory.css";

const OrderHistory: React.FC = () => {
  const { state, dispatch } = useCard();

  return (
    <>
      <div
        className={`order-history-overlay ${
          state.isOrderHistoryOpen ? "order-history-overlay--visible" : ""
        }`}
        onClick={() =>
          dispatch({ type: "TOGGLE_ORDER_HISTORY", payload: false })
        }
      />

      <aside
        className={`order-history ${
          state.isOrderHistoryOpen ? "order-history--open" : ""
        }`}
      >
        <div className="order-history__header">
          <h2>Order History</h2>
          <button
            className="order-history__close"
            onClick={() =>
              dispatch({ type: "TOGGLE_ORDER_HISTORY", payload: false })
            }
          >
            ×
          </button>
        </div>

        {state.orders.length === 0 ? (
          <p className="order-history__empty">
            You haven't placed any orders yet.
          </p>
        ) : (
          <div className="order-history__list">
            {state.orders.map((order) => (
              <div className="order-history__card" key={order.id}>
                <div className="order-history__top">
                  <div>
                    <h3>Order #{order.id}</h3>
                    <p>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`order-history__status order-history__status--${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="order-history__items">
                  {order.items.map((item) => (
                    <div className="order-history__item" key={item.id}>
                      <img src={item.image} alt={item.name} />
                      <div>
                        <p>{item.name}</p>
                        <span>
                          ₱{item.unitPrice.toLocaleString()} × {item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-history__bottom">
                  <span>
                    Payment: {order.paymentMethod.toUpperCase()}
                  </span>
                  <strong>₱{order.total.toLocaleString()}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
    </aside>
  </>
  );
};

export default OrderHistory;
