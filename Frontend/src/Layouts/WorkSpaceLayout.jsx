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
        <div className="workspace-layout flex bg-background">
            <WorkspaceSideBar />
            <div className="main-content w-full h-screen overflow-scroll p-6">
                <div className="header">
                    <div className="bg-secondary p-6 navbr flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">Your Workspace</h1>
                        <div className="profile rounded-lg p-2 flex items-center gap-4 font-bold bg-primary text-bg-secondary">
                            {/* username */}
                            <img src="https://picsum.photos/40" alt="Profile" className="w-10 h-10 rounded-full" />
                            <span className="text-secondary mr-4">{user.email}</span> 
                            
                        </div>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    )
}