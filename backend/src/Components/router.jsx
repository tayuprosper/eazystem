import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import CommunityVideos from "../pages/CommunityVideos";
import Home from "../pages/Home";

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
                
                }
            ]
        }
    ]
)

export default router;