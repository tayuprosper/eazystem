import React from 'react'
import videos from '../../dummydata'
import Video from '../Components/ui/Video'

function CommunityVideos() {
    return (
        <div className="section">
            
            <div className="videos mx-10 flex sm:flex-wrap flex-col sm:flex-row  gap-4 justify-center md:gap-5 mt-4">
            {videos.map((vid) => (
                <div className="w-full sm:w-1/4 " key={vid.videoId}>
                    <Video video={vid} />
                </div>
            ))}
        </div>
        </div>
        
    )
}

export default CommunityVideos