import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext';

function Loading() {
    const { loading } =useAppContext();

  return loading ? (
    <div className='flex justify-center items-center h-screen'>
      <div className="animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary"></div>
    </div>
  ): " "
}

export default Loading
