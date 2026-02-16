import { FaPlay } from "react-icons/fa";


export default function Video({video}){
    return(
        <div className="">
            <div className={`border flex justify-end rounded-lg items-end play h-[15em]`} style={{ backgroundImage: `url(${video.thumbnail_img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <p className="m-4"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>10:20</p>
            </div>
            <div className="desc flex">
                <div className="h-10 rounded-lg flex justify-center items-center mr-3 bg- mt-3 w-30 border"><FaPlay   style={{
          background:
            "radial-gradient(ellipse at top, rgba(59,130,246,0.18), transparent 60%)",
        }}/></div>
                <div className="textdesc mt-3">
                    <h2>{video.title}</h2>
                    <p className="line-clamp-2 text-xs">{video.description}</p>
                </div>
            </div>
        </div>
    )
}