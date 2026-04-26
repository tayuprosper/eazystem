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
        <div className="nav bg-bg-secondary w-fit w-max-[15vw] h-screen z-50 flex flex-col">
            <div className="top">
                <div className="head flex items-center justify-between p-4 border-b gap-10">
                    <div className={`logo ${isOpen ? "block" : "hidden"}`}>
                        <h1 className={`text-2xl font-bold text-primary`}>EazyStem</h1>
                    </div>
                    <div className="menu-control">
                        {
                            isOpen ? <X onClick={toggleSidebar} /> : <Menu onClick={toggleSidebar} />
                        }
                    </div>
                </div>
                <nav>
                    <ul className={`menu flex flex-col gap-4 p-4 ${isOpen ? "block" : "hidden"}`}>
                        {workspaceMenu.map((item) => (
                            <Link to={item.path} key={item.name}> <li className={`menu-item flex items-center gap-3 p-2 rounded-lg cursor-pointer ${location.pathname === item.path ? "bg-primary text-white" : "hover:bg-bg-hover text-secondary"}`}>
                                <item.icon />
                                {item.name}
                            </li>   
                            </Link>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className={`bottom mt-auto p-4 ${isOpen ? "block" : "hidden"}`}>
                <div className="menu-item flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-bg-hover text-secondary">
                    <LogOutIcon />
                    <Link to="/logout" onClick={handleLogout}>Logout</Link>
                </div>
            </div>
        </div>
    );
}