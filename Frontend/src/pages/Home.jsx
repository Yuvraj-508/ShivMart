import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import BottomBannner from '../components/BottomBannner'
import Newsletter from '../components/Newsletter'

function Home() {
  return (
    <div className='mt-10'>
      <MainBanner/>
      <Categories/>
      <BestSeller/>
      <BottomBannner/>
      <Newsletter/>
    </div>
  )
}

export default Home
