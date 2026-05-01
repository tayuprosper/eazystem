import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://eazystem.onrender.com'; // Update with your backend URL
// ---------------------------------------------------------------------------
// Module-level global state — shared across all mounted instances of useManim
// so that polling continues even if the component re-renders.
// ---------------------------------------------------------------------------
const INITIAL_STATE = {
    loading: false,
    error: null,
    videoUrl: null,
    currentPrompt: null,
};

let globalState = { ...INITIAL_STATE };
let listeners = [];
let pollingInterval = null;

const notifyListeners = () => {
    listeners.forEach(listener => listener({ ...globalState }));
};

const updateState = (updates) => {
    globalState = { ...globalState, ...updates };
    notifyListeners();
};

// ---------------------------------------------------------------------------
// resetState — call this when entering a fresh workspace session so that
// the previous video / error from another session does NOT bleed through.
// ---------------------------------------------------------------------------
export const resetManimState = () => {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
    globalState = { ...INITIAL_STATE };
    notifyListeners();
};

// cancelGeneration — stops the active poll and returns the UI to idle state.
export const cancelGeneration = () => {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
    globalState = { ...INITIAL_STATE };
    notifyListeners();
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export const useManim = () => {
    const [state, setState] = useState(globalState);

    useEffect(() => {
        const doWork = () => {
            listeners.push(setState);
            setState({ ...globalState });
            return () => {
                listeners = listeners.filter(l => l !== setState);
            };
        };
        doWork();
    }, []);

    // NEW: Function to manually set the state for an existing video
    const setVideoData = (videoUrl, prompt = null) => {
        updateState({
            videoUrl: videoUrl,
            currentPrompt: prompt,
            loading: false,
            error: null
        });
    };

    const generateVideo = async (prompt, userId) => {
        // Prevent duplicate generation for the same prompt if already loading or completed
        if (globalState.currentPrompt === prompt && (globalState.loading || globalState.videoUrl)) {
            return;
        }

        // Stop any ongoing poll before starting a new one
        if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
        }

        updateState({ loading: true, error: null, videoUrl: null, currentPrompt: prompt });

        if (!userId) {
            console.error("userId is missing! Cannot start render.");
            updateState({ error: "User ID is required to generate videos.", loading: false });
            return;
        }

        try {
            // Step 1: Request video generation with prompt and user id for uploading to supabase
            const response = await axios.post(`${API_BASE_URL}/render`, { "prompt": prompt, "userId": userId });
            const { jobId } = response.data;

            // Polling for job status
            pollingInterval = setInterval(async () => {
                try {
                    const statusRes = await axios.get(`${API_BASE_URL}/status/${jobId}`);

                    if (statusRes.data.state === 'COMPLETED') {
                        updateState({
                            videoUrl: `${statusRes.data.videoUrl}`,
                            loading: false,
                        });
                        clearInterval(pollingInterval);
                        pollingInterval = null;
                    } else if (statusRes.data.state === 'FAILED') {
                        updateState({
                            error: statusRes.data.error || 'Video generation failed',
                            loading: false,
                        });
                        clearInterval(pollingInterval);
                        pollingInterval = null;
                    } else if (statusRes.data.state === 'NOT_FOUND') {
                        updateState({
                            error: 'Server restarted and the video job was lost. Please try again.',
                            loading: false,
                        });
                        clearInterval(pollingInterval);
                        pollingInterval = null;
                    }
                } catch (pollErr) {
                    console.error('Polling error:', pollErr);
                }
            }, 3000); // Poll every 3 seconds
        } catch (err) {
            updateState({
                error: 'An error occurred while generating the video: ' + err.message,
                loading: false,
            });
        }
    };

    return { ...state, generateVideo, setVideoData };
};