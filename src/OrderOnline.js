import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useParams } from "react-router-dom";

const API_BASE_URL = "https://azeezolabode.pythonanywhere.com";

export default function Orders() {
  const { token } = useAuth();
  const { id } = useParams(); // ✅ Correct way to get /order/:id

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let url = `${API_BASE_URL}/order/`;
        if (id) url = `${API_BASE_URL}/order/${id}/`;

        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!res.ok) {
          console.error("Failed response:", res.status);
          setOrders([]);
          return;
        }

        const data = await res.json();

        // ✅ Normalize data
        if (id) {
          setOrders(data ? [data] : []);
        } else {
          setOrders(Array.isArray(data) ? data : []);
        }

      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token, id]);

  // ✅ UI States
  if (loading) return <p>Loading orders...</p>;

  if (!token) return <p>SIGN UP OR LOGIN TO VIEW ORDERS HISTORY</p>;

  if (orders.length === 0) return <p>No orders found</p>;

  return (
    <div>
      <h2>{id ? `Order #${id}` : "Your Orders"}</h2>

      {orders.map((order) => {
        const items = order.items || [];
        const address = order.address || {};

        return (
          <div key={order.id} className="p-4 border rounded mb-4">
            <h4>Order #{order.id}</h4>

            <p>Status: {order.status || "pending"}</p>
            <p>Name: {order.full_name || "N/A"}</p>
            <p>Phone: {order.phone || "N/A"}</p>

            <p>
              Delivery address: {address.address || "N/A"}
            </p>

            <p>
              Total: ₦{Number(order.total || order.total_price || 0).toFixed(2)}
            </p>

            <p>
              Payment Status: {order.is_paid ? "Paid" : "Pending"}
            </p>

            <h5>Items:</h5>
            <ul>
              {items.length === 0 ? (
                <li>No items</li>
              ) : (
                items.map((item) => {
                  const price = Number(item.price || 0);
                  const qty = Number(item.quantity || 0);

                  return (
                    <li key={item.id}>
                      {item.product_name || "Item"} x {qty} - ₦
                      {(price * qty).toFixed(2)}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}