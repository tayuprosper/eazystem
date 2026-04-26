import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Blocks, LibrarySquare, LogOutIcon, Menu, Settings, X } from "lucide-react";
import supabaseService from "../Services/supaBaseServices";

export default function WorkspaceSideBar() {
    const location = useLocation();

    const workspaceMenu = [
        {
            name: "Workspace",
            icon: Blocks,
            path: "/workspace"
        },
        {
            name: "Library",
            icon: LibrarySquare,
            path: "/workspace/library"
        },
        {
            name: "Settings",
            icon: Settings,
            path: "/workspace/settings"
        },
    ];

    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        return supabaseService.signOut();
    }
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={toggleSidebar}
                />
            )}
            <div className={`nav bg-bg-secondary h-screen z-50 flex flex-col fixed md:relative transition-all duration-300 border-r border-zinc-800 ${isOpen ? "w-[75vw] md:w-64" : "w-16"}`}>
                <div className="top flex-1">
                    <div className={`head flex items-center p-4 border-b border-zinc-800/50 h-[88px] ${isOpen ? "justify-between gap-4" : "justify-center"}`}>
                        <div className={`logo ${isOpen ? "block" : "hidden"}`}>
                            <h1 className="text-xl md:text-2xl font-bold text-primary truncate">EazyStem</h1>
                        </div>
                        <div className="menu-control cursor-pointer text-zinc-400 hover:text-zinc-100 transition-colors">
                            {
                                isOpen ? <X onClick={toggleSidebar} /> : <Menu onClick={toggleSidebar} />
                            }
                        </div>
                    </div>
                    <nav>
                        <ul className="menu flex flex-col gap-2 p-4">
                            {workspaceMenu.map((item) => (
                                <Link to={item.path} key={item.name} title={item.name}>
                                    <li className={`menu-item flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${location.pathname === item.path ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200"} ${isOpen ? "" : "justify-center"}`}>
                                        <item.icon size={20} className="shrink-0" />
                                        {isOpen && <span className="font-medium truncate">{item.name}</span>}
                                    </li>   
                                </Link>
                            ))}
                        </ul>
                    </nav>
                </div>
                <div className="bottom p-4 border-t border-zinc-800/50">
                    <div className={`menu-item flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-zinc-800/50 text-zinc-400 hover:text-red-400 transition-colors ${isOpen ? "" : "justify-center"}`} onClick={handleLogout} title="Logout">
                        <LogOutIcon size={20} className="shrink-0" />
                        {isOpen && <Link to="/logout" className="font-medium truncate">Logout</Link>}
                    </div>
                </div>
            </div>
        </>
    );
}