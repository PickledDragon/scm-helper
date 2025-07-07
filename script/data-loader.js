// data-loader.js
// Module for loading and managing data

export async function loadLayersData() {
    try {
        const response = await fetch('./data/sdlc-layers.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.layers;
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}
