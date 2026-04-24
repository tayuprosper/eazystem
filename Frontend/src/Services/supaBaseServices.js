import supabase from "../utils/supabase";

const supabaseService = {
    signUp: async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            console.error("Error signing up:", error);
            return null;
        }
        return data;
    },
    signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            console.error("Error signing in:", error);
            return null;
        }
        return data;
    },
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error signing out:", error);
            return false;
        }
        return true;
    },
};

export default supabaseService;