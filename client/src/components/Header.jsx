import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/Context'
import { useNavigate } from 'react-router-dom'

function Header() {
    const navigate=useNavigate()
    const {userData}=useContext(AppContent)

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
      <img src={assets.header_img} className='w-36 h-36 rounded-full mb-6'  alt='error'/>

      <h1 className='flex item-center gap-2 text-xl 
      sm:text-3xl font-medium mb-2
      '>Hey {userData?userData.name:'Developers'} !!<img src={assets.hand_wave} className='w-8 aspect-square'/></h1>

      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to Auth App</h2>
      <p className='mb-8 max-w-md'>Let's take a tour of the auth webApp and enjoy the stramless process</p>
      <button  className='border border-gray-500 px-8 
      py-2.5 hover:bg-gray-100 cursor-pointer transition-all'
      onClick={()=>navigate("/Notes")} 
      >Get's Started </button>

    </div>
  )
}

export default Header
