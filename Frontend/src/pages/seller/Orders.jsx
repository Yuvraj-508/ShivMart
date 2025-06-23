import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets, dummyOrders } from '../../assets/ShivMart_assets/assets';

function Orders() {
    const {currency,axios,toast} =useAppContext();
    const[orders,setOrders] =useState([]);

    const fetchOrders =async()=>{
  try{
  const {data} = await axios.get('/api/order/seller');
  if(data.success){
    setOrders(data.orders);
   }else{
    toast.error(data.message);
   }
  }catch(error){
    console.log(error);
  }
    }
    useEffect(() => {
        fetchOrders();
    }, []);
  return (
    <div className="no-scrollbar h-[80vh] overflow-y-scroll">
        <div className="md:p-10 p-4 space-y-4">
    <h2 className="text-lg font-medium">Orders List</h2>
    {orders.map((order, index) => (
        <div key={index} className="flex flex-col md:items-center justify-between md:flex-row gap-20 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800">
            <div className="flex gap-5 max-w-80">
                <img className="w-12 h-12 object-cover opacity-60" src={assets.box_icon} alt="boxIcon" />
                <div>
                    {order.items.map((item, index) => (
                        <div key={index} className="flex flex-col justify-center">
                            <p className="font-medium">
                                {item.product.name}{" "} <span className='font-medium text-primary'>x {item.quantity}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-sm md:text-base text-black/60">
                <p className='text-black/80'>{order.address.firstName} {order.address.lastName}</p>

                <p>{order.address.street}, {order.address.city}</p> <p>{order.address.state}, {order.address.zipcode}, {order.address.country}</p>
                <p className="">{order.address.phone}</p>
            </div>

            <p className="font-medium text-lg my-auto text-black/70">{currency}{order.amount}</p>

            <div className="flex flex-col text-sm">
                <p>Method: {order.paymentType}</p>
                <p>Date: {new Date(order.createdAt).toDateString()}</p>
                <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
            </div>
        </div>
    ))}
    </div>
</div>
  )
}

export default Orders
