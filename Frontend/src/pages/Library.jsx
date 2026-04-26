import React from "react";
import { 
    PlusCircle,
    Search,
 } from "lucide-react";
import Video from "../Components/ui/Video";
import GradientButton from "../Components/ui/Button";
import { videos } from "../../dummydata";
import { Link } from "react-router-dom";

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
        // make h to occupy the full height of the main content area and make it scrollable if the content exceeds the height of the main content area and add some padding to the section for better spacing and also add a header for the section with a title and a description and a button to generate new explainer videos and also add a search bar to filter the videos in the library based on keywords in the title or description of the videos and make sure the search is case insensitive and updates the displayed videos in real time as the user types in the search input and also make sure to style the search bar with a border and some padding for better usability and also style the videos in a responsive grid layout that adjusts based on the screen size with suitable gaps between them for better visual appeal and make sure each video is displayed with its title, description, and thumbnail for easy identification by users
        <div className="workspace-section p-4 md:p-8">
            <div className="info-section flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="right">
                    <h1 className="text-3xl md:text-4xl text-primary font-bold ">Library</h1>
                    <p className="text-gray-600 mt-1">Manage your saved videos and visualizations Here.</p>
                </div>
                <div className="left w-full md:w-auto">
                 <Link to="/workspace">
                    <GradientButton className="w-full md:w-auto bg-primary flex items-center justify-center gap-3 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all">
                        <PlusCircle size={20} />
                        Generate New Explainer
                    </GradientButton>
                 </Link>
                </div>
            </div>

            <div className="search border-2 border-primary/20 hover:border-primary/40 focus-within:border-primary flex items-center justify-between rounded-2xl bg-white shadow-sm transition-all overflow-hidden">
                <div className="input flex items-center w-full">
                    <Search className='m-4 text-primary/60' size={22} />
                    <input type="text" placeholder='Search your library...' className='h-14 w-full focus:outline-none text-lg placeholder:text-gray-400' value={searchTerm} onChange={(e) => handleSearch(e.target.value)} />
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