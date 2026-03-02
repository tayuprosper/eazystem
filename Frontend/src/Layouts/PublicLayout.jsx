import React from 'react'
import Navbar from '../Components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../Components/Footer'

function MainLayout() {
  return (
    <section className='sm:px-10 lg:px-[20em]'>
        <Navbar/>
        <main className='mt-20'>
            <Outlet/>
        </main>
        <Footer/>
    </section>
  )
}

export default MainLayout