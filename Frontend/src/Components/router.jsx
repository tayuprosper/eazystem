import { createBrowserRouter } from "react-router-dom";


import MainLayout from "../Layouts/PublicLayout";
import Signup from "../pages/Signup";
import CommunityVideos from "../pages/CommunityVideos";
import Home from "../pages/Home";
import Login from "../pages/Login";



import WorkSpaceLayout from "../Layouts/WorkSpaceLayout";
import Workspace from "../pages/Workspace";
import Library from "../pages/Library";
import Settings from "../pages/Settings";





const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <MainLayout/>,
            children: [
                {
                    index: true,
                    element: <Home/>
                },
                {
                    path: '/community-videos',
                    element: <CommunityVideos/>
                },
                {
                    path: '/login',
                    element: <Login/>
                },
                {
                    path: '/signup',
                    element: <Signup/>
                }
            ]
        },
        {
            path: "/workspace",
            element: <WorkSpaceLayout/>,
             children: [
                {
                    index: true,
                    element: <Workspace/>
                },
                {
                    path: '/workspace/library',
                    element: <Library/>
                },
                {
                    path: '/workspace/settings',
                    element: <Settings/>
                },
                {
                }
             ]
        }
    ]
)

export default router;