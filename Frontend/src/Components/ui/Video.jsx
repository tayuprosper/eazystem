import { FaPlay } from "react-icons/fa";

// Redesign the video component to be more modern and visually appealing, with a focus on the thumbnail and title. Add a play button overlay on the thumbnail for better user experience. Ensure the component is responsive and looks good on different screen sizes.
// make the video title and description more visible and attractive, with a larger font size and a different color. Add some spacing between the title and description for better readability. Consider adding a hover effect on the video card to make it more interactive and engaging for users.

export default function Video({ video }) {
    return (
        <div className="video-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="thumbnail relative">
                <img src={video.thumbnail_img} alt={video.title} className="w-full h-48 object-cover" />
                <div className="play-button absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <FaPlay className="text-white text-4xl" />
                </div>
            </div>
            <div className="p-4 bg-gray-100">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{video.title}</h3>
                <p className="text-gray-600 text-sm">{video.description}</p>
            </div>
        </div>
    )
}