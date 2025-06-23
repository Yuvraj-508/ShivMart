import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { useEffect } from 'react';
import ProductCard from '../components/ProductCard'

function AllProducts() {
    const {searchQuery,products} =useAppContext();
    const [filterProducts,SetFilterProducts] =useState([]);

    useEffect(()=>{
        if(searchQuery.length>0){
            SetFilterProducts(products.filter(product=> product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ))
        }
        else{
            SetFilterProducts(products)
        }
    },[searchQuery,products])
  return (
    <div className='mt-16 flex flex-col'>
        <div className="flex flex-col items-end w-max">
        <p className='text-2xl md:text-3xl font-medium '>All Products</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-5  mt-6 md:gap-6">
        {filterProducts.filter((product)=>product.inStock).map((product,idx)=>(<ProductCard key={idx} product={product}/>))} 
      </div>
    </div>
  )
}

export default AllProducts
