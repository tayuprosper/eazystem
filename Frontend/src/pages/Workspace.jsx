import {
    Play,
    List,
    SquareTerminal,
    Search,
    Paperclip,
    SendHorizonal,
    Lightbulb,
    CheckCircle2,
    PlayCircle
} from 'lucide-react';

export default function Workspace() {
    return (
        <div className="min-h-screen bg-[#05070a] text-zinc-300 p-4 md:p-8">

            {/* LEFT COLUMN (Main Content - 8 Columns) */}
            <div className="flex flex-col gap-6 p-v-[5em] rounded-3xl shadow-xl">

                {/* 1. Video Player */}

                <PlayingVideo src={"/videos/sample_video.mp4"} />
                {/* 2. Transcript Section */}
                <div className="bg-[#0b101b] rounded-2xl p-6 border border-zinc-800/50">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2 text-zinc-100 font-semibold">
                            <List size={20} className="text-blue-500" />
                            <span>Transcript</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded tracking-widest uppercase">Auto-scroll</span>
                            <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
                                <Search size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6 text-sm leading-relaxed">
                        <p className="text-zinc-500">
                            <span className="text-blue-500/80 font-mono mr-3">04:05</span>
                            Now, as we increase the number of terms in our sum, you'll notice the approximation becomes sharper...
                        </p>

                        {/* Highlighted Active Text */}
                        <div className="bg-blue-600/5 border border-blue-500/20 rounded-xl p-4 text-zinc-200">
                            <span className="text-blue-400 font-mono mr-3">04:12</span>
                            Notice the Gibbs phenomenon occurring at the discontinuities. This ripple effect is an unavoidable consequence of using a finite Fourier series...
                        </div>

                        <p className="text-zinc-500">
                            <span className="text-blue-500/80 font-mono mr-3">04:25</span>
                            Let's break down the coefficients $a_n$ and $b_n$ to see how each harmonic contributes to the final shape...
                        </p>
                    </div>
                </div>

                {/* 3. Chat Input Section */}
                <ChatInput />
            </div>

            {/* RIGHT COLUMN (Sidebar - 4 Columns)
                <div className="lg:col-span-4">
                    <KeyConceptsSidebar />
                </div> */}
        </div>
    )
}



const ChatInput = () => {
    return (
        <div className="bg-[#0b101b] rounded-2xl p-6 mt-6 border border-zinc-800/50 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-600 p-1 rounded-md">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
                </div>
                <h3 className="text-zinc-100 font-semibold text-sm">Ask a Follow-up</h3>
            </div>

            <div className="relative group">
                <textarea
                    placeholder="Is there a limit to how many terms we can add before..."
                    className="w-full bg-[#05070a]/50 border border-zinc-800 rounded-xl p-4 pr-32 min-h-[100px] text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                />

                {/* Actions bar inside the textarea */}
                <div className="absolute bottom-3 right-3 flex items-center gap-3">
                    <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
                        <Paperclip size={20} />
                    </button>

                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-blue-500/20 shadow-lg">
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



// const KeyConceptsSidebar = () => {
//     const concepts = [
//         {
//             title: "Gibbs Phenomenon",
//             description: "The peculiar manner in which the Fourier series of a piecewise continuously differentiable periodic function behaves at a jump discontinuity.",
//             formula: "lim sup |S_n(x) - f(x)| = 0.089...",
//             completed: true,
//         },
//         {
//             title: "Fundamental Frequency",
//             description: "The lowest frequency of a periodic waveform. In the Fourier series, this corresponds to $n=1$.",
//             completed: true,
//         },
//         {
//             title: "Harmonic Series",
//             description: "The sequence of all frequencies that are integer multiples of the fundamental frequency.",
//             jumpTime: "02:15",
//             completed: true,
//         },
//     ];

//     return (
//         <div className="flex flex-col gap-6 w-full max-w-sm">
//             {/* Main Concepts Card */}
//             <div className="bg-[#0b101b] rounded-2xl p-6 border border-zinc-800/50 shadow-xl">
//                 <div className="flex items-center gap-2 mb-8">
//                     <Lightbulb className="text-blue-400 w-5 h-5" />
//                     <h3 className="text-zinc-100 font-semibold">Key Concepts</h3>
//                 </div>

//                 <div className="space-y-8 relative">
//                     {/* Vertical Progress Line */}
//                     <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-zinc-800" />

//                     {concepts.map((concept, index) => (
//                         <div key={index} className="relative pl-8">
//                             {/* Checkbox Icon */}
//                             <div className="absolute left-0 top-0 bg-[#0b101b] py-1">
//                                 <CheckCircle2
//                                     className={`w-5 h-5 ${concept.completed ? 'text-blue-500' : 'text-zinc-600'}`}
//                                 />
//                             </div>

//                             <h4 className="text-zinc-100 text-sm font-medium mb-1">{concept.title}</h4>
//                             <p className="text-zinc-500 text-xs leading-relaxed mb-3">
//                                 {concept.description}
//                             </p>

//                             {/* Math Formula Box (Glassmorphism) */}
//                             {concept.formula && (
//                                 <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-3 font-mono text-[11px] text-blue-400/80 mb-3">
//                                     {concept.formula}
//                                 </div>
//                             )}

//                             {/* Jump to Timestamp */}
//                             {concept.jumpTime && (
//                                 <button className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-wider hover:text-blue-400 transition-colors">
//                                     <PlayCircle size={14} />
//                                     Jump to {concept.jumpTime}
//                                 </button>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Next Up Card */}
//             <div className="bg-[#0b101b] rounded-2xl p-4 border border-zinc-800/50">
//                 <div className="flex justify-between items-center mb-4">
//                     <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Next Up</span>
//                     <span className="bg-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full text-white">Coming Next</span>
//                 </div>
//                 <div className="flex gap-4 items-center">
//                     <div className="w-16 h-12 bg-zinc-800 rounded-md overflow-hidden">
//                         <img src="/api/placeholder/64/48" alt="Thumbnail" className="w-full h-full object-cover opacity-50" />
//                     </div>
//                     <div>
//                         <h5 className="text-zinc-200 text-xs font-semibold">Complex Fourier Transforms</h5>
//                         <p className="text-zinc-500 text-[10px]">15 mins • 4 Modules</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


// const WorkspacePage = () => {
//     return (
//         <div className="min-h-screen bg-[#05070a] text-zinc-300 p-4 md:p-8">
//             <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

//                 {/* LEFT COLUMN (Main Content - 8 Columns) */}
//                 <div className="lg:col-span-8 flex flex-col gap-6">

//                     {/* 1. Video Player */}
//                     <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl group">
//                         <img
//                             src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070"
//                             className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
//                             alt="Fourier Series Visualization"
//                         />
//                         <button className="absolute inset-0 m-auto w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:scale-110 transition-transform">
//                             <Play className="text-white w-10 h-10 fill-current ml-1" />
//                         </button>
//                     </div>

//                     {/* 2. Transcript Section */}
//                     <div className="bg-[#0b101b] rounded-2xl p-6 border border-zinc-800/50">
//                         <div className="flex justify-between items-center mb-6">
//                             <div className="flex items-center gap-2 text-zinc-100 font-semibold">
//                                 <List size={20} className="text-blue-500" />
//                                 <span>Transcript</span>
//                             </div>
//                             <div className="flex gap-4 items-center">
//                                 <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded tracking-widest uppercase">Auto-scroll</span>
//                                 <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
//                                     <Search size={18} />
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="space-y-6 text-sm leading-relaxed">
//                             <p className="text-zinc-500">
//                                 <span className="text-blue-500/80 font-mono mr-3">04:05</span>
//                                 Now, as we increase the number of terms in our sum, you'll notice the approximation becomes sharper...
//                             </p>

//                             {/* Highlighted Active Text */}
//                             <div className="bg-blue-600/5 border border-blue-500/20 rounded-xl p-4 text-zinc-200">
//                                 <span className="text-blue-400 font-mono mr-3">04:12</span>
//                                 Notice the Gibbs phenomenon occurring at the discontinuities. This ripple effect is an unavoidable consequence of using a finite Fourier series...
//                             </div>

//                             <p className="text-zinc-500">
//                                 <span className="text-blue-500/80 font-mono mr-3">04:25</span>
//                                 Let's break down the coefficients $a_n$ and $b_n$ to see how each harmonic contributes to the final shape...
//                             </p>
//                         </div>
//                     </div>

//                     {/* 3. Chat Input Section */}
//                     <ChatInput />
//                 </div>

//                 {/* RIGHT COLUMN (Sidebar - 4 Columns) */}
//                 <div className="lg:col-span-4">
//                     <KeyConceptsSidebar />
//                 </div>

//             </div>
//         </div>
//     );
// };


const PlayingVideo = ({ src }) => {
    return (
        <div className="relative aspect-video h-[40vh] rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl group">
            <video
                
                className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
                controls
            >
                <source src={src} type='video/mp4'/>
            </video>
            {/* <button className="absolute inset-0 m-auto w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:scale-110 transition-transform">
                <Play className="text-white w-10 h-10 fill-current ml-1" />
            </button> */}

            
        </div>
    )
}