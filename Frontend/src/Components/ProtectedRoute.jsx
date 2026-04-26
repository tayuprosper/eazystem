import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../Context/userContext';

export default function ProtectedRoute() {
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
    
    return <Outlet />;
}