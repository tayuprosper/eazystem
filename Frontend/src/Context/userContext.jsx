import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import supabase from "../utils/supabase";

export const userContext = createContext();

export const UserProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // 2. Listen for changes - store the whole response object
        const authListener = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        // 3. The "Manual" Cleanup
        return () => {
            // Accessing it directly from the response object
            if (authListener?.data?.subscription) {
                authListener.data.subscription.unsubscribe();
            }
        };
    }, []);


    return (
        <userContext.Provider value={{ session, loading }}>
            {children}
        </userContext.Provider>
    );
}

export const useUser = () => {
    return useContext(userContext);
}