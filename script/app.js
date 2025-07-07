// app.js
// Main application orchestrator

import { loadLayersData } from './data-loader.js';
import { SwissCheeseVisualizer } from './visualizer.js';
import { Tooltip } from './tooltip.js';
import { DetailsPane } from './details-pane.js';
import { FindingsManager } from './findings-manager.js';

class SwissCheeseApp {
    constructor() {
        this.layersData = [];
        this.tooltip = null;
        this.visualizer = null;
        this.detailsPane = null;
    }
    
    async init() {
        try {
            // Initialize components
            this.tooltip = new Tooltip();
            this.detailsPane = new DetailsPane('selected-layer-details');
            this.visualizer = new SwissCheeseVisualizer(
                'layers-container',
                this.tooltip,
                (layer) => this.onLayerClick(layer)
            );
            
            // Load data and render
            this.layersData = await loadLayersData();
            this.visualizer.render(this.layersData);
            
            // Initialize findings badge
            FindingsManager.updateFindingsBadge();
            
            // Make toggleAccordion and detailsPane globally available
            window.toggleAccordion = DetailsPane.toggleAccordion;
            window.detailsPane = this.detailsPane;
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
        }
    }
    
    onLayerClick(layer) {
        this.detailsPane.updateLayerDetails(layer);
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Handle splash screen
    const splashScreen = document.getElementById('splashScreen');
    const dismissButton = document.getElementById('dismissSplash');
    
    // Add click handler for dismiss button
    dismissButton.addEventListener('click', () => {
        splashScreen.style.transition = 'opacity 0.5s ease-out';
        splashScreen.style.opacity = '0';
        
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 500);
    });
    
    // Optional: Auto-dismiss after 10 seconds
    setTimeout(() => {
        if (splashScreen.style.display !== 'none') {
            dismissButton.click();
        }
    }, 5000);
    
    const app = new SwissCheeseApp();
    app.init();
});
