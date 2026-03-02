import React from "react";
import { 
    PlusCircle,
    Search,
 } from "lucide-react";
import Video from "../Components/ui/Video";
import GradientButton from "../Components/ui/Button";
import { videos } from "../../dummydata";

export default function Library() {
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
        <div className="workspace-section">
            <div className="info-section flex justify-between items-center mb-6">
                <div className="right">
                    <h1 className="text-4xl text-primary font-bold ">Library</h1>
                    <p>Manage your saved videos and visualizations Here.</p>
                </div>
                <div className="left">
                    <GradientButton className="bg-primary flex gap-3  text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition duration-300">
                        <PlusCircle className="ml-2" />
                        Generate New Explainer
                    </GradientButton>
                </div>
            </div>

            <div className="search border border-primary flex items-center justify-between rounded-xl">
                <div className="input flex items-center w-full">
                    <Search className='m-3' />
                    {/* handle search as soon as it entered in the input  */}
                    <input type="text" placeholder='Enter keyword to search...' className='h-full w-full focus:outline-none' value={searchTerm} onChange={(e) => handleSearch(e.target.value)} />
                </div>
            </div>

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