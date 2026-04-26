import {
    Play,
    Paperclip,
    SendHorizonal,
    Lightbulb,
    MessageCircleMore
} from 'lucide-react';

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useManim } from '../Hooks/useManim';

export default function Workspace() {
    const { prompt } = useParams();
    const { loading, error, videoUrl, generateVideo } = useManim();

    const generateVideoFromPrompt = async (text) => {
        if (text) await generateVideo(text);
    };

    useEffect(() => {
        if (error) {
            alert("Failed to generate video: " + error);
        }
    }, [error]);

    useEffect(() => {
        if (prompt) {
            generateVideo(prompt);
        }
    }, [prompt]);

    return (
        <div className="min-h-screen bg-[#05070a] text-zinc-300 p-4 md:p-8">

            {/* LEFT COLUMN (Main Content - 8 Columns) */}
            <div className="flex flex-col gap-6 p-v-[5em] rounded-3xl shadow-xl">


                {!loading && videoUrl ? (
                    <PlayingVideo src={videoUrl} />
                ) : loading ? (
                    <div className="flex items-center justify-center h-[40vh] bg-zinc-900 border border-zinc-800 rounded-3xl">
                        <Play className="animate-pulse text-blue-500" size={48} />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[40vh] bg-zinc-900 border border-zinc-800 rounded-3xl gap-4">
                        <Lightbulb size={32} className="text-yellow-400" />
                        <p className="text-zinc-500 text-sm">Enter a prompt to generate a video</p>
                    </div>
                )}

                {/* Chat Input Section */}
                {!loading && (
                    <ChatInput videoPlaying={!!videoUrl} generate={generateVideoFromPrompt} />
                )}
            </div>

        </div>
    )
}



const ChatInput = ({ videoPlaying, generate }) => {
    const [input, setInput] = useState("");
    return (
        <div className="bg-[#0b101b] rounded-2xl p-6 mt-6 border border-zinc-800/50 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                {videoPlaying ? (
                    <> <MessageCircleMore className="text-blue-400 w-5 h-5" />

                        <h3 className="text-zinc-100 font-semibold text-sm">Ask a Follow-up</h3>
                    </>
                ) : null}
            </div>

            <div className="relative group">
                <textarea
                    placeholder="Ask the AI assistant about the video, formulas, or concepts..."
                    className="w-full bg-[#05070a]/50 border border-zinc-800 rounded-xl p-4 pr-32 min-h-[100px] text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                {/* Actions bar inside the textarea */}
                <div className="absolute bottom-3 right-3 flex items-center gap-3">
                    <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
                        <Paperclip size={20} />
                    </button>

                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-blue-500/20 shadow-lg"
                        disabled={input.trim() === ""}
                        onClick={() => generate(input)}
                    >
                        <span>Send</span>
                        <SendHorizonal size={16} />
                    </button>
                </div>
            </div>

            <p className="text-center text-[10px] uppercase tracking-widest text-zinc-600 mt-4 font-medium">
                AI Assistant is ready to help with formulas and concepts
            </p>
        </div>
    );
};




const PlayingVideo = ({ src }) => {
    return (
        <div className="relative aspect-video h-[40vh] rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl group">
            <video
                className="w-full h-full object-contain transition-opacity"
                controls>
                <source src={src} type='video/mp4' />
            </video>
        </div>
    )
}
