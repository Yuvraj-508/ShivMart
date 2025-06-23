import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useParams } from 'react-router';
import { categories } from '../assets/ShivMart_assets/assets';
import ProductCard from '../components/ProductCard'

function ProductCategory() {
    const {products} =useAppContext();
    const { category } = useParams();
    const searchCategory = categories.find(((item)=>item.path.toLowerCase()=== category))
    console.log(searchCategory)

    const filterProducts= products.filter((product)=>product.category.toLowerCase()===category)
  return (
  

    <div className='mt-16'>
      {searchCategory && (
        <div className="flex flex-col items-end w-max">
            <p className="text-2xl font-bold">{searchCategory.text.toUpperCase()}</p>
            <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>
      )}
      {filterProducts.length>0 ? (
     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-5  mt-6 md:gap-6">
        {filterProducts.filter((product)=>product.inStock).map((product,idx)=>(<ProductCard key={idx} product={product}/>))} 
      </div>
      ) :(
        <p className='text-2xl md:text-3xl font-medium '>No Products Found On This Category</p>
      )}
    </div>
  )
}

export default ProductCategory
