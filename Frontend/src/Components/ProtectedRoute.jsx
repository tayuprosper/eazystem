import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../Context/userContext';

    export default function ProtectedRoute() {
        const { session } = useUser();

        if (!session) {
            return <Navigate to="/login" />;
        }
    return <Outlet />;
}