import React from 'react'
import Navbar from '../Components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../Components/Footer'

function MainLayout() {
  return (
    <section>
        <Navbar/>
        <main>
            <Outlet/>
        </main>
        <Footer/>
    </section>
  )
}

export default MainLayout