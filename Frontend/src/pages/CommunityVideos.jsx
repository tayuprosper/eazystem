import React from 'react'
import {videos} from '../../dummydata'
import Video from '../Components/ui/Video'
import { Search } from 'lucide-react'

function CommunityVideos() {

    const [searchTerm, setSearchTerm] = React.useState('')
    const [filteredVideos, setFilteredVideos] = React.useState(videos)

    const handleSearch = (term) => {
        setSearchTerm(term)
        const filtered = videos.filter(video =>
            video.title.toLowerCase().includes(term.toLowerCase()) ||
            video.description.toLowerCase().includes(term.toLowerCase())
        )
        setFilteredVideos(filtered)
    }


    return (
        <div className="section community-videos py-10">
            <div className="header">
                <div className="search border border-primary flex items-center justify-between rounded-xl">
                    <div className="input flex items-center w-full">
                        <Search className='m-3' />
                        {/* handle search as soon as it entered in the input  */}
                        <input type="text" placeholder='Enter keyword to search...' className='h-full w-full focus:outline-none' value={searchTerm} onChange={(e) => handleSearch(e.target.value)}/>
                    </div>
                </div>
            </div>
            {/* better responsivenes for videos 3 per row for large enough screens with suitable gap between them */}
            <div className="videos flex flex-wrap -mx-2 mt-6">
            {filteredVideos.map((vid) => (
                <div className="w-full sm:w-1/3 px-2 mb-4" key={vid.videoId}>
                    <Video video={vid} />
                </div>
            ))}
        </div>
        </div>
        
    )
}

export default CommunityVideos