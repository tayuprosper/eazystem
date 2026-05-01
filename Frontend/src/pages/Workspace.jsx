import {
    Play,
    Paperclip,
    SendHorizonal,
    Lightbulb,
    MessageCircleMore,
    Loader2,
    X,
} from 'lucide-react';

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useManim, resetManimState, cancelGeneration } from '../Hooks/useManim';
import { useUser } from '../Context/userContext';

export default function Workspace() {
    const { prompt } = useParams();
    const { loading, error, videoUrl, currentPrompt, generateVideo } = useManim();
    const { session } = useUser();

    const generateVideoFromPrompt = async (text) => {
        if (text) await generateVideo(text, session.user.id);
    };

    // On mount: if there is no URL prompt this is a fresh workspace session.
    useEffect(() => {
        if (!currentPrompt) {
            resetManimState();
        }
    }, []);

    useEffect(() => {
        if (error) {
            alert('Failed to generate video: ' + error);
        }
    }, [error]);

    useEffect(() => {
        if (prompt) {
            generateVideo(prompt, session.user.id);
        }
    }, [prompt]);

    return (
        <div className="flex flex-col gap-4 px-3 py-4 md:px-6 md:py-8 min-h-full">

            {/* Video / Loading / Idle area */}
            {!loading && videoUrl ? (
                <PlayingVideo src={videoUrl} />
            ) : loading ? (
                <LoadingState />
            ) : (
                <IdleState />
            )}

            {/* Chat input — always visible, but label changes */}
            <ChatInput videoPlaying={!!videoUrl} loading={loading} generate={generateVideoFromPrompt} />

        </div>
    );
}

/* ─────────────────────────────────────────────────────────────── */
/*  Sub-components                                                  */
/* ─────────────────────────────────────────────────────────────── */

const IdleState = () => (
    <div className="flex flex-col items-center justify-center
                    h-[30vh] sm:h-[40vh] md:h-[45vh]
                    bg-zinc-900/60 border border-zinc-800 rounded-2xl
                    gap-3 p-6 text-center">
        <Lightbulb size={32} className="text-yellow-400 shrink-0" />
        <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
            Enter a topic below and EazyStem will generate a <span className="text-blue-400 font-medium">3Blue1Brown-style</span> lesson video for you.
        </p>
    </div>
);

const LoadingState = () => (
    <div className="flex flex-col items-center justify-center gap-4
                    h-[30vh] sm:h-[40vh] md:h-[45vh]
                    bg-zinc-900/60 border border-dashed border-zinc-700 rounded-2xl
                    p-6 text-center">

        {/* Animated icon */}
        <div className="relative flex items-center justify-center w-16 h-16">
            <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500/20 animate-ping" />
            <Loader2 size={32} className="text-blue-400 animate-spin relative z-10" />
        </div>

        <div className="space-y-1">
            <p className="text-zinc-200 font-semibold text-sm">Generating your lesson…</p>
            <p className="text-zinc-500 text-xs">This can take up to 2 minutes. Hang tight!</p>
        </div>

        {/* Cancel button */}
        <button
            onClick={cancelGeneration}
            className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg
                       border border-zinc-700 text-zinc-400 text-sm
                       hover:border-red-500/60 hover:text-red-400
                       transition-colors duration-200"
        >
            <X size={15} />
            Cancel generation
        </button>
    </div>
);

const PlayingVideo = ({ src }) => (
    <div className="relative w-full rounded-2xl overflow-hidden
                    bg-zinc-900 border border-zinc-800 shadow-2xl
                    aspect-video">
        <video
            className="w-full h-full object-contain"
            controls
            autoPlay
        >
            <source src={src} type="video/mp4" />
        </video>
    </div>
);

const ChatInput = ({ videoPlaying, loading, generate }) => {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        generate(input.trim());
        setInput('');
    };

    const handleKeyDown = (e) => {
        // Ctrl/Cmd+Enter submits
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="bg-zinc-900/80 border border-zinc-800/60 rounded-2xl p-4 md:p-5 shadow-xl backdrop-blur-sm">

            {/* Label row */}
            {videoPlaying && (
                <div className="flex items-center gap-2 mb-3">
                    <MessageCircleMore className="text-blue-400 shrink-0" size={18} />
                    <span className="text-zinc-200 font-semibold text-sm">Ask a Follow-up</span>
                </div>
            )}

            {/* Textarea */}
            <div className="relative">
                <textarea
                    id="workspace-chat-input"
                    placeholder={
                        loading
                            ? 'Generating… you can queue the next topic here'
                            : videoPlaying
                                ? 'Ask about the video, formulas, or concepts…'
                                : 'Enter an educational topic, e.g. "How does Fourier Transform work?"'
                    }
                    className="w-full bg-zinc-950/70 border border-zinc-700/60 rounded-xl
                               p-4 pr-4 pb-14
                               text-sm text-zinc-200 placeholder:text-zinc-600
                               focus:outline-none focus:ring-1 focus:ring-blue-500/50
                               transition-all resize-none min-h-27.5 md:min-h-25"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                {/* Action bar pinned to textarea bottom */}
                <div className=" bottom-3 mt-4 left-3 right-3 flex items-center justify-between gap-2">
                    <button
                        className="text-zinc-600 hover:text-zinc-400 transition-colors p-1.5 rounded-lg hover:bg-zinc-800"
                        title="Attach file (coming soon)"
                    >
                        <Paperclip size={18} />
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-zinc-700 text-xs hidden sm:block">
                            {loading ? '' : 'Ctrl+↵ to send'}
                        </span>
                        <button
                            id="workspace-send-btn"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500
                                       disabled:opacity-40 disabled:cursor-not-allowed
                                       text-white px-4 py-2 rounded-lg text-sm font-medium
                                       transition-all shadow-blue-600/20 shadow-lg"
                            disabled={input.trim() === '' || loading}
                            onClick={handleSend}
                        >
                            <span>{loading ? 'Queued' : 'Generate'}</span>
                            <SendHorizonal size={15} />
                        </button>
                    </div>
                </div>
            </div>

            <p className="text-center text-[10px] uppercase tracking-widest text-zinc-700 mt-3 font-medium">
                EazyStem · Powered by Gemini + Manim
            </p>
        </div>
    );
};
