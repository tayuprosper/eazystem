import supabase from "../utils/supabase";

const videoFetchService = {
    fetchUserVideos: async (userId) => {
        const { data, error } = await supabase
            .from('videos')
            .select('*')
            .eq('owner', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching videos:", error);
            return [];
        }
        console.log(data)
        return data;
    },
};

export default videoFetchService;