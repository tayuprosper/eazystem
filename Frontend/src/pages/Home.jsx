import React from 'react'
import Hero from '../Components/HeroSection'
import FeaturedVideos from '../Components/Featured'
import Stats from '../Components/Stats'


function Home() {
    return (
        <div>
            <Hero />
            <FeaturedVideos />
            <Stats />
        </div>
    )
}

export default Home