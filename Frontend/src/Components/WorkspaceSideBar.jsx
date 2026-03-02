import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Blocks, LibrarySquare, LogOutIcon, Settings } from "lucide-react";

// use navbar icon from lucide react for the menu button and use a state to toggle the sidebar open and closed on smaller screens and a properly styled sidebar for the workspace navigation with links to different sections of the workspace such as videos, visualizations, settings, etc. and make sure the sidebar is responsive and works well on different screen sizes
// with selected navbar item highlighted and the rest of the items in the sidebar are styled with a hover effect to indicate they are clickable and the sidebar should be collapsible on smaller screens with a menu button to toggle it open and closed
// the sidebar should also have a close button on smaller screens to allow users to easily close the sidebar when they are done navigating through it and the sidebar should be styled with a modern and clean design that fits well with the overall aesthetic of the application and the links in the sidebar should be clearly labeled and easy to understand for users to navigate through the different sections of the workspace effectively

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

    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`workspace-sidebar h-screen  bg-gray-800 text-white w-64 p-6 ${isOpen ? "block" : "hidden"} md:block`}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Workspace</h2>
                <button className="md:hidden" onClick={toggleSidebar}>
                    {isOpen ? "Close" : <Blocks />}
                </button>
            </div>
            <nav className="flex flex-col justify-between h-[calc(100%-4rem)]">
                <ul className="space-y-4">
                    {workspaceMenu.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-300 ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`}
                                >
                                    <item.icon />
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                <div className="logout">
                    <Link
                        to="/logout"
                        className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-gray-700 mt-6"
                    >
                        <LogOutIcon />
                        Logout
                    </Link>
                </div>
            </nav>
        </div>
    );
}