import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useGetOrderByEmailQuery } from "../../../redux/features/orders/ordersApi";
import getBaseUrl from "../../../utils/baseURL";
import { getImgUrl } from "../../../utils/getImgUrl";

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useGetOrderByEmailQuery(currentUser?.email);

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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error getting orders data</div>;

  return (
    <div className=" bg-gray-100 py-16">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
        <p className="text-gray-700 mb-6">
          Welcome, {currentUser?.name || "User"}! Here are your recent orders:
        </p>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
          {orders.length > 0 ? (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li
                  key={order._id}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-1"
                >
                  <p className="font-medium">Order ID: {order._id}</p>
                  <p>Date: {new Date(order?.createdAt).toLocaleDateString()}</p>
                  <p>
                    Delivery By:{" "}
                    {new Date(order?.deliveryDate).toLocaleDateString()}
                  </p>
                  <p>Total: ₹{order.totalPrice}</p>

                  <ul className="space-y-2 mt-4 ml-4 pl-4 border-l-2 border-gray-200">
                    {/* making a horizontal scrallable list of items */}
                    <div className="flex space-x-4 overflow-x-auto">
                      {order.productIds.map((productId) => (
                        <li key={productId} className="w-32 h-40 mt-2 mb-2">
                          <img
                            src={getImgUrl(
                              productDetails[productId]?.coverImage
                            )}
                            alt={productDetails[productId]?.title}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <p className="text-sm font-medium">
                            {productDetails[productId]?.title}
                          </p>
                        </li>
                      ))}
                    </div>
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">You have no recent orders.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
