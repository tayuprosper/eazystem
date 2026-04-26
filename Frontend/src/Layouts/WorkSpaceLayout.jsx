// component containing the layour for the workspace containing the WorkspaceSideBar and the main content area for videos and visualizations
import { Outlet, Navigate } from "react-router-dom";
import WorkspaceSideBar from "../Components/WorkspaceSideBar";
import { useUser } from "../Context/userContext";

export default function WorkSpaceLayout() {
    const { session, loading } = useUser();

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#05070a]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" />;
    }

    const user = session.user;
    return (
        <div className="workspace-layout flex bg-background relative w-full h-screen overflow-hidden">
            <WorkspaceSideBar />
            <div className="main-content flex-1 h-screen overflow-y-auto p-4 md:p-6 ml-16 md:ml-0 transition-all duration-300">
                <div className="header w-full">
                    <div className="bg-secondary p-4 md:p-6 rounded-2xl flex flex-wrap gap-4 items-center justify-between mb-6 border border-zinc-800/50 shadow-sm">
                        <h1 className="text-xl md:text-2xl font-bold text-zinc-100">Your Workspace</h1>
                        <div className="profile rounded-xl p-2 pr-4 flex items-center gap-3 font-medium bg-primary/10 text-zinc-200 border border-primary/20">
                            {/* username */}
                            <img src="https://picsum.photos/40" alt="Profile" className="w-8 h-8 md:w-10 md:h-10 rounded-full shadow-sm" />
                            <span className="text-sm md:text-base truncate max-w-[120px] md:max-w-[200px]">{user.email}</span> 
                        </div>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    )
}