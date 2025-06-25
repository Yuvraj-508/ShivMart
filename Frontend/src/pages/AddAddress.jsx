import React, { useState, useEffect } from "react";
import { assets } from "../assets/ShivMart_assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
const InputField = ({ type, placeholder, name, handleChange, address }) => (
  <input
    className="w-full px-2 py-2.5 border border-gray-500/30 outline-none rounded text-gray-500 focus:border-primary transition"
    type={type}
    placeholder={placeholder}
    name={name}
    onChange={handleChange}
    value={address[name]}
    required
  />
);

function AddAddress() {
  const { axios, navigate, user } = useAppContext();
  const [isSaving, setIsSaving] = useState(false);

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
   
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault(); // ✅ Fix typo here
    try {
      setIsSaving(true);

      const { data } = await axios.post("/api/address/add", address);

      if (data.success) {
        toast.success(data.message);
        navigate("/cart"); // ✅ Use 'navigate' from React Router
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong, please try again later."
      );
    }finally{
      setIsSaving(false); // ✅ Stop saving state after operation
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/cart");
      // toast.error("Please login to add address");
    }
  });
  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping <span className="text-primary font-semibold">Address</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form className="space-y-3 mt-6 text-sm" onSubmit={onSubmitHandler}>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="firstName"
                type="text"
                placeholder="First Name"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="lastName"
                type="text"
                placeholder="Last Name"
              />
            </div>
            <InputField
              handleChange={handleChange}
              address={address}
              name="email"
              type="email"
              placeholder="Email address"
            />
            <InputField
              handleChange={handleChange}
              address={address}
              name="street"
              type="text"
              placeholder="Street"
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="city"
                type="text"
                placeholder="City"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="state"
                type="text"
                placeholder="State"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="zipCode"
                type="text"
                placeholder="Zip Code"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="country"
                type="text"
                placeholder="Country"
              />
            </div>
            <InputField
              handleChange={handleChange}
              address={address}
              name="phone"
              type="text"
              placeholder="Phone"
            />
            <button
              className="w-full mt-6 py-3 bg-primary hover:bg-primary-dull transition cursor-pointer uppercase !text-white flex items-center justify-center gap-2"
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full   animate-spin"></div>
              ) : (
                "Save Address"
              )}
            </button>
          </form>
        </div>
        <img
          src={assets.add_address_iamge}
          className="md:mr-16 mb-16 md:mt-0"
          alt=""
        />
      </div>
    </div>
  );
}

export default AddAddress;
