import React, { useEffect, useState } from "react";
import { useGetOrderByEmailQuery } from "../../redux/features/orders/ordersApi";
import { useAuth } from "../../context/AuthContext";
import getBaseUrl from "../../utils/baseURL";
import { getImgUrl } from "../../utils/getImgUrl";

const OrderPage = () => {
  const { currentUser } = useAuth();

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useGetOrderByEmailQuery(currentUser.email);

  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    const fetchProductDetails = async () => {
      const allProductIds = orders.flatMap((order) => order.productIds);
      if (allProductIds.length > 0) {
        const response = await fetch(
          `${getBaseUrl()}/api/books/get-books-by-ids`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: allProductIds }),
          }
        );
        const data = await response.json();
        const productMap = data.reduce(
          (acc, product) => ({
            ...acc,
            [product._id]: product,
          }),
          {}
        );

        setProductDetails(productMap);
      }
    };

    if (orders.length > 0) {
      fetchProductDetails();
    }
  }, [orders]);

  const handleCancelOrder = async (orderId) => {
    console.log("Cancel Order", orderId);

    await fetch(`${getBaseUrl()}/api/orders/${orderId}`, {
      method: "DELETE",
    });

    window.location.reload();
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error getting orders data</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <div>No orders found!</div>
      ) : (
        <div>
          {orders.map((order, index) => (
            <div key={order._id} className="border-b mb-4 pb-4">
              <p className="p-1 bg-secondary text-white w-10 rounded mb-1">
                # {index + 1}
              </p>
              <h2 className="font-bold">Order ID: {order._id}</h2>
              <p className="text-gray-600">Name: {order.name}</p>
              <p className="text-gray-600">Email: {order.email}</p>
              <p className="text-gray-600">Phone: {order.phone}</p>
              <p className="text-gray-600">
                Date: {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </p>
              <p className="text-gray-600">
                Delivery By:{" "}
                {new Date(order.deliveryDate).toLocaleDateString("en-IN")}
              </p>
              <p className="text-gray-600">Total Price: ₹{order.totalPrice}</p>
              <h3 className="font-semibold mt-2">Address:</h3>
              <p>
                {order.address.city}, {order.address.state},{" "}
                {order.address.country}, {order.address.zipcode}
              </p>
              <h3 className="font-semibold mt-2">Products:</h3>
              <ul className="list-disc pl-6">
                {order.productIds.map((productId) => {
                  const product = productDetails[productId];

                  return product ? (
                    <li
                      key={productId}
                      className="flex
                    items-center gap-4 px-2 py-1 border-b"
                    >
                      <img
                        src={`${getImgUrl(product?.coverImage)}`}
                        alt={product.title}
                        className="w-20 h-20 object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">{product.title}</h4>
                        <p>Price: ₹{product.newPrice}</p>
                      </div>
                    </li>
                  ) : null;
                })}
              </ul>

              <button
                className="bg-red-500 text-white px-2 py-1 rounded mt-2"
                onClick={() => {
                  handleCancelOrder(order._id);
                }}
              >
                Cancel Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
