import React from 'react'
import Hero from '../Components/HeroSection'
import FeaturedVideos from '../Components/Featured'
import Stats from '../Components/Stats'
import TestNotes from '../Components/Testnotes'


function Home() {
    return (
        <div>
            <Hero />
            <FeaturedVideos />
            <Stats />
            <TestNotes />
        </div>
    )
}

export default Home