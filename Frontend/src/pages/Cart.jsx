import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets, dummyAddress } from "../assets/ShivMart_assets/assets";

function Cart() {
  const {
    products,
    currency,
    cartItems,
    getCartCount,
    removeToCart,
    updateToCart,
    navigate,
    getCartTotal,
    axios,
    toast,
    user,
    setCartItems,
    isSubmitting,
    setIsSubmitting,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      product.quantity = cartItems[key];
      tempArray.push(product);

    }
    console.log("Cart Array:", tempArray);
    setCartArray(tempArray);
   
  };

  const getAddresses = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [cartItems, products]);

  useEffect(() => {
    if (user) {
      getAddresses();
    }
  }, [user]);

  const PlaceOrder = async () => {
    setIsSubmitting(true);

    try {
      if (!selectedAddress) {
        toast.error("Please select an address");
        return;
      }
      if( cartArray.length === 0) {
        toast.error("Your cart is empty");
        return;
      }
      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          userId: user._id,
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });
        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      } else if (paymentOption === "Online") {
        try {
          // ✅ Step 1: Create Razorpay order on backend
          const { data } = await axios.post("/api/order/online", {
            items: cartArray.map((item) => ({
              product: item._id,
              quantity: item.quantity,
            })),
            address: selectedAddress._id,
          });

          if (data.success) {
            const { order, razorpayKey } = data;

            // ✅ Step 2: Configure Razorpay payment options
            const options = {
              key: razorpayKey,
              amount: order.amount,
              currency: "INR",
              name: "ShivMart",
              description: "Order Payment",
              order_id: order.id, // Razorpay order ID
              handler: async function (response) {
                const {
                  razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature,
                } = response;

                try {
                  // ✅ Step 3: Send payment verification request to backend
                  const verifyRes = await axios.post("/api/order/verify", {
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                    localOrderId: order.receipt, // Your MongoDB Order ID (used in backend)
                  });

                  if (verifyRes.data.success) {
                    setCartItems({});
                    toast.success("Payment verified and order placed!");
                    // Optionally redirect to thank-you or order success page
                  } else {
                    toast.error(
                      "Payment failed to verify. Please contact support."
                    );
                  }
                } catch (err) {
                  console.error("Verification Error:", err);
                  toast.error("Verification failed!");
                }
              },
              prefill: {
                name: user.name,
                email: user.email,
              },
              theme: {
                color: "#3399cc",
              },
            };

            // ✅ Step 4: Open Razorpay payment window
            const rzp = new window.Razorpay(options);
            rzp.open();
          } else {
            toast.error(data.message || "Payment setup failed");
          }
        } catch (err) {
          console.error("Online payment error:", err);
          toast.error("Technical error while placing the order, please try again later.");
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Something went wrong while placing the order");
    }finally{
      setIsSubmitting(false);

    }
  };
  return products.length > 0 && cartItems ? (
    <div className="flex flex-col md:flex-row mt-16">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-primary">{getCartCount()}items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() =>
                  navigate(
                    `/products/${product.category.toLowerCase()}/${product._id}`
                  )
                }
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={product.image[0]}
                  alt={product.name}
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>
                    Weight: <span>{product.size || "N/A"}</span>
                  </p>
                  <div className="flex items-center">
                    <p>Qty:</p>
                    <select
                      onChange={(e) =>
                        updateToCart(product._id, Number(e.target.value))
                      }
                      value={cartItems[product._id]}
                      className="outline-none"
                    >
                      {Array(
                        cartItems[product._id] > 9 ? cartItems[product._id] : 9
                      )
                        .fill("")
                        .map((_, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center">
              {currency}
              {product.offerPrice * product.quantity}
            </p>
            <button
              onClick={() => removeToCart(product._id)}
              className="cursor-pointer mx-auto"
            >
              <img
                src={assets.remove_icon}
                alt=""
                className="inline-block w-6 h-6"
              />
            </button>
          </div>
        ))}

        <button
          onClick={() => navigate("/products")}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
        >
          <img
            src={assets.arrow_right_icon_colored}
            alt=""
            className="group-hover:-translate-x-1 transition"
          />
          Continue Shopping
        </button>
      </div>

      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} ,${selectedAddress.country}`
                : "No address found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-primary hover:underline cursor-pointer"
            >
              Change
            </button>
            {showAddress && (
              <div
                className={`absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full  ${
                  showAddress ? "cursor-pointer" : ""
                }`}
              >
                {addresses.map((add, idx) => (
                  <p
                    onClick={() => {
                      setSelectedAddress(add);
                      setShowAddress(false);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100"
                  >
                    {add.street}, {add.city}, {add.state} ,{add.country}
                  </p>
                ))}
                <p
                  onClick={() => navigate("/add-address")}
                  className="text-primary text-center cursor-pointer p-2 hover:bg-primary-dull hover:text-white"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>
              {currency}
              {getCartTotal()}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency}
              {(getCartTotal() * 2) / 100}
            </span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>
              {currency}
              {getCartTotal() + (getCartTotal() * 2) / 100}
            </span>
          </p>
        </div>

        <button
          onClick={PlaceOrder}
          className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : paymentOption === "COD" ? (
            "Place Order"
          ) : (
            "Proceed to Checkout"
          )}
        </button>
      </div>
    </div>
  ) : null;
}

export default Cart;
