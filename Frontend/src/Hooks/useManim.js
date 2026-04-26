import { useState, useEffect } from 'react';
import axios from 'axios';

// Global state to persist across component unmounts
let globalState = {
    loading: false,
    error: null,
    videoUrl: null,
    currentPrompt: null,
};

let listeners = [];
let pollingInterval = null;

const notifyListeners = () => {
    listeners.forEach(listener => listener({ ...globalState }));
};

const updateState = (updates) => {
    globalState = { ...globalState, ...updates };
    notifyListeners();
};

export const useManim = () => {
    const [state, setState] = useState(globalState);

    useEffect(() => {
        // Subscribe to global state changes
        listeners.push(setState);
        return () => {
            listeners = listeners.filter(l => l !== setState);
        };
    }, []);

    const generateVideo = async (prompt) => {
        // Prevent duplicate generation for the same prompt if already loading or completed
        if (globalState.currentPrompt === prompt && (globalState.loading || globalState.videoUrl)) {
            return;
        }

        updateState({ loading: true, error: null, videoUrl: null, currentPrompt: prompt });
        
        try {
            const response = await axios.post('http://localhost:8000/render', { prompt });
            const { jobId } = response.data;

            // Clear any existing interval
            if (pollingInterval) clearInterval(pollingInterval);

            // Polling for job status
            pollingInterval = setInterval(async () => {
                try {
                    const statusRes = await axios.get(`http://localhost:8000/status/${jobId}`);

                    if (statusRes.data.state === 'COMPLETED') {
                        updateState({
                            videoUrl: `http://localhost:8000${statusRes.data.videoUrl}`,
                            loading: false
                        });
                        clearInterval(pollingInterval);
                        pollingInterval = null;
                    } else if (statusRes.data.state === 'FAILED') {
                        updateState({
                            error: 'Video generation failed',
                            loading: false
                        });
                        clearInterval(pollingInterval);
                        pollingInterval = null;
                    }
                } catch (pollErr) {
                    console.error("Polling error:", pollErr);
                }
            }, 3000); // Poll every 3 seconds
        } catch (err) {
            updateState({
                error: 'An error occurred while generating the video: ' + err.message,
                loading: false
            });
        }
    };

    return { ...state, generateVideo };
};