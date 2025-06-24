import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Also fix this import
import { dummyProducts } from "../assets/ShivMart_assets/assets";
import toast from "react-hot-toast";
import axios from 'axios';

axios.defaults.withCredentials = true; // Ensure cookies are sent with requests
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const currency =import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [userLogin, setUserLogin] = useState(null);
   const [products, setProducts] = useState([]);
   const [loading,setLoading]=useState(false);
   const [cartItems, setCartItems] = useState({});
   const [searchQuery, setSearchQuery] = useState({});
   const [isSubmitting, setIsSubmitting] = useState(false);



   const sellerStatus =async () => {
    try {
      const { data } = await axios.get('/api/seller/is-auth');
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      console.error(error);
        setIsSeller(false);
    }
   }

   const userStatus = async () => {
    try {
      const { data } = await axios.get('/api/user/is-auth');
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(error);
      setUser(null);
     
    }
   }
   const fetchProducts = async () => {
    try{
      const { data } = await axios.get('/api/product/list');
      if (data.success) {
        setProducts(data.products);
      } else {
       toast.error(data.message || "Techinal Error please try again later");
      }
    }catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Techinal Error please try again later");
    }
   }

   useEffect(()=>{
     fetchProducts();
     sellerStatus();
     userStatus();
    
   },[])

  useEffect(() => {
  const updateCart = async () => {
    try {
      const { data } = await axios.post('/api/cart/update', { cartItems });
      console.log("Cart updated successfully:", data);
      if (!data.success) {
        toast.error(data.message || "Failed to update cart");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    }
  };

  // ✅ You need to call the function inside useEffect like this:
  if (user) {
    updateCart();
  }
}, [cartItems, user]);


  //add to cart

  const addToCart=(itemId)=>{
    let cartData=structuredClone(cartItems);

    if(cartData[itemId]){
      cartData[itemId]+=1;
    } else {

      cartData[itemId]=1;

    }
      

    setCartItems(cartData);
    toast.success("Added to Cart")
  }
//remove cart
const removeToCart=(itemId)=>{
  let cartData=structuredClone(cartItems);

  if(cartData[itemId]){
    cartData[itemId]-=1;
    if(cartData[itemId]===0){
      delete cartData[itemId];
    }
  }
  
  setCartItems(cartData);
  toast.success("Removed from Cart")
}
//update cart
const updateToCart=(itemId,quantity)=>{
    let cartData=structuredClone(cartItems);
    cartData[itemId]=quantity;
    setCartItems(cartData);
    toast.success("Cart Updated")
  }

  /// cart total 
  const getCartCount=()=>{
    let totalCount=0;
    for (const item in cartItems){
      totalCount+=cartItems[item];
    }
    return totalCount;
  }

  // /cart amt

  const getCartTotal=()=>{
    let totalAmt=0;
    for (const items in cartItems){
    let itemInfo = products.find((product)=>product._id===items);
    if(cartItems[items]>0){
      totalAmt+=itemInfo.offerPrice*cartItems[items]
    }
    }
    return Math.floor(totalAmt*100)/100;
  }


  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    userLogin,
    setUserLogin,
    products,
    currency,
    cartItems,
    addToCart,
    removeToCart,
    updateToCart,
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartTotal,
    axios,
    fetchProducts,
    toast,
    setCartItems,
    loading,
    setLoading,
    isSubmitting, setIsSubmitting,
 
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
