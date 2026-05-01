import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useManim } from "../../Hooks/useManim";

export default function Video({ video }) {
    const navigate = useNavigate();
    const { setVideoData } = useManim();
    const openVideo = () => {
        setVideoData(video.video_url, video.prompt);
        navigate(`/workspace?videoUrl=${encodeURIComponent(video.video_url)}`);
    };

    return (
        <div className="video-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300" onClick={openVideo} style={{ cursor: 'pointer' }}>
            <div className="thumbnail relative">
                <video src={`${video.video_url}#t=2`} preload="metadata" muted style={{pointerEvents: "none", }} disablePictureInPicture controlsList="nodownloads" playsInline alt={video.prompt} className="w-full h-48 object-cover" />
                <div className="play-button absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <FaPlay className="text-white text-4xl" />
                </div>
            </div>
            <div className="p-4 bg-gray-100">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{video.prompt}</h3>
                <p className="text-gray-600 text-sm">{video.prompt}</p>
            </div>
        </div>
    )
}