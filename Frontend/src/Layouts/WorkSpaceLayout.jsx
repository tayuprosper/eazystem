// component containing the layour for the workspace containing the WorkspaceSideBar and the main content area for videos and visualizations
import { Outlet } from "react-router-dom";
import WorkspaceSideBar from "../Components/WorkspaceSideBar";

export default function WorkSpaceLayout() {
    return (
        <div className="workspace-layout flex">
            <WorkspaceSideBar />
            <div className="main-content flex-1 p-6">
                <div className="header">
                    <h1 className="text-2xl font-bold mb-4">Welcome to your Workspace</h1>
                    <p className="text-gray-600 mb-6">Here you can manage your videos, visualizations, and settings.</p>
                </div>
                <Outlet />
            </div>
        </div>
    )
}