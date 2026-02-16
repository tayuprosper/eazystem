import { FaShareAlt, FaEnvelope, FaCommentDots } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-200 px-4 md:px-10 py-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">

                {/* Sections */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
                    
                    {/* Product */}
                    <div>
                        <h3 className="font-semibold text-white mb-2">Product</h3>
                        <ul className="space-y-1">
                            <li><a href="#" className="hover:text-white transition">Showcase</a></li>
                            <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                            <li><a href="#" className="hover:text-white transition">API</a></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-semibold text-white mb-2">Resources</h3>
                        <ul className="space-y-1">
                            <li><a href="#" className="hover:text-white transition">Docs</a></li>
                            <li><a href="#" className="hover:text-white transition">Tutorials</a></li>
                            <li><a href="#" className="hover:text-white transition">GitHub</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold text-white mb-2">Company</h3>
                        <ul className="space-y-1">
                            <li><a href="#" className="hover:text-white transition">About</a></li>
                            <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                            <li><a href="#" className="hover:text-white transition">Terms</a></li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Bottom row: copyright + icons */}
            <div className="mt-8 border-t border-gray-700 pt-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
                <span>&copy; {new Date().getFullYear()} VideoHub. All rights reserved.</span>
                <div className="flex gap-4 mt-2 sm:mt-0 text-gray-400">
                    <FaShareAlt className="hover:text-white cursor-pointer" />
                    <FaEnvelope className="hover:text-white cursor-pointer" />
                    <FaCommentDots className="hover:text-white cursor-pointer" />
                </div>
            </div>
        </footer>
    );
}
