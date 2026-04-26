import { useState, useEffect } from 'react';
import axios from 'axios';

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

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export const useManim = () => {
    const [state, setState] = useState(globalState);

    useEffect(() => {
        // Subscribe to global state changes
        listeners.push(setState);
        // Always sync with the current global state on mount so the subscriber
        // immediately reflects what's happening (e.g. an in-progress poll).
        setState({ ...globalState });
        return () => {
            listeners = listeners.filter(l => l !== setState);
        };
    }, []);

    const generateVideo = async (prompt) => {
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

        try {
            const response = await axios.post('https://eazystem.onrender.com/render', { prompt });
            const { jobId } = response.data;

            // Polling for job status
            pollingInterval = setInterval(async () => {
                try {
                    const statusRes = await axios.get(`https://eazystem.onrender.com/status/${jobId}`);

                    if (statusRes.data.state === 'COMPLETED') {
                        updateState({
                            videoUrl: `https://eazystem.onrender.com${statusRes.data.videoUrl}`,
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

    return { ...state, generateVideo };
};