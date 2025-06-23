import React from 'react'
import { assets, features } from '../assets/ShivMart_assets/assets'

function BottomBannner() {
  return (
    <div className='relative mt-24'>
      <img src={assets.bottom_banner_image} alt="" className="w-full hidden md:block" />
      <img src={assets.bottom_banner_image_sm} alt="" className="w-full md:hidden" />

      <div className="absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-25">
        <div className="">
            <h1 className="text-2xl md:text-3xl font-semibold text-primary md-6">Why we Are the Best?</h1>
            {features.map((feature, idx) => (
              <div className="flex items-center gap-2 mt-2">
                <img src={feature.icon} alt="" className="md:w-11 w-9" />
               <div className=""> <h3 className="text-lg md:text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-500/70 text-xs md:text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default BottomBannner
