import React from 'react';
import { PlusCircle, Search } from 'lucide-react';
import Video from '../Components/ui/Video';
import GradientButton from '../Components/ui/Button';
import videoFetchService from '../Services/videoFetchService';
import { useUser } from '../Context/userContext';
import { Link } from 'react-router-dom';

export default function Library() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filteredVideos, setFilteredVideos] = React.useState([]);
    const [videos, setVideos] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const { session } = useUser();
    React.useEffect(() => {
        setLoading(true); 
        const fetchVideos = async () => {
            const userId = session?.user?.id; // Replace with actual user ID from auth context
            console.log("Fetching videos for user", userId)
            const userVideos = await videoFetchService.fetchUserVideos(userId);
            console.log(userVideos)
            setVideos(userVideos);
            setFilteredVideos(userVideos);
            setLoading(false);
        };
        fetchVideos();
    }, []);

    const handleSearch = (term) => {
        setSearchTerm(term);
        const filtered = videos.filter(
            (video) =>
                video.title.toLowerCase().includes(term.toLowerCase()) ||
                video.description.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredVideos(filtered);
    };

    return (
        <div className="px-3 py-4 md:px-6 md:py-8 min-h-full">

            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-400">Library</h1>
                    <p className="text-zinc-500 text-sm mt-1">Your saved videos and visualizations.</p>
                </div>
                <Link to="/workspace" className="shrink-0">
                    <GradientButton className="w-full sm:w-auto flex items-center justify-center gap-2 text-white font-semibold py-2.5 px-5 rounded-xl text-sm">
                        <PlusCircle size={17} />
                        Generate New
                    </GradientButton>
                </Link>
            </div>

            {/* Search bar */}
            <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 mb-6 focus-within:border-blue-500/60 transition-colors">
                <Search className="text-zinc-500 shrink-0" size={18} />
                <input
                    type="text"
                    placeholder="Search your library…"
                    className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            {/* Video grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <VideoLoadingSkeleton key={index} />
                        ))}
                    </div>
                ) : ( filteredVideos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                    <p className="text-zinc-400 text-sm">No videos match your search.</p>
                    <Link to="/workspace">
                        <GradientButton className="text-sm px-5 py-2.5">Generate one now</GradientButton>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredVideos.map((vid) => (
                        <Video video={vid} key={vid.videoId} />
                    ))}
                </div>
            ))}
        </div>
    );
}


const VideoLoadingSkeleton = () => (
    <div className="animate-pulse bg-zinc-800 rounded-xl h-48 w-full">
        <div className="bg-zinc-700 h-6 w-3/4 mt-4 mx-4 rounded"></div>
        <div className="bg-zinc-700 h-4 w-1/2 mt-2 mx-4 rounded"></div>
    </div>
);