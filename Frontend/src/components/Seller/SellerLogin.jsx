import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext';
import toast from "react-hot-toast";
function SellerLogin() {

     const {isSeller,setIsSeller,navigate,axios} = useAppContext();
    const [email,setEmail]=useState('');
    const [password,setPassword] =useState('');

   const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
        console.log("Seller Login", email, password);
        const { data } = await axios.post('/api/seller/login', {
            email,
            password
        });

        if (data.success) {
            setIsSeller(true);
            navigate('/seller');
        } else {
            toast.error(data.message);
        }
    } catch (err) {
        console.error(err);

        // Properly access error message
        if (err.response && err.response.data && err.response.data.message) {
            toast.error(err.response.data.message);
        } else {
            toast.error("An unexpected error occurred.");
        }
    }
};

   

    useEffect(()=>{if(isSeller) navigate('/seller')},[isSeller])
  return !isSeller &&(
    <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className="min-h-screen flex items-center text-sm text-gray-600">
        <div className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">Seller </span> <span>Login</span> 
            </p>
           
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="email" required />
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="password" required />
            </div>
             <button className="bg-primary text-white w-full py-2 rounded-md cursor-pointer">Login</button>
             </div>
        </form>
  )
}

export default SellerLogin
