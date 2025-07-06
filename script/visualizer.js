// visualizer.js
// Module for rendering the Swiss Cheese Model visualization

// Constants
const LAYER_THICKNESS = 20;
const LAYER_WIDTH = 200;
const LAYER_HEIGHT = 300;
const LAYER_SPACING = 80;

export class SwissCheeseVisualizer {
    constructor(containerId, tooltip, onLayerClick) {
        this.containerId = containerId;
        this.tooltip = tooltip;
        this.onLayerClick = onLayerClick;
        this.selectedLayerIndex = null;
    }
    
    render(layersData) {
        const container = document.getElementById('layers-container');
        const containerRect = container.getBoundingClientRect();
        
        // Clear previous content
        d3.select('#layers-container').selectAll('*').remove();
        
        // Create SVG
        const svg = d3.select('#layers-container')
            .append('svg')
            .attr('width', containerRect.width)
            .attr('height', containerRect.height);
        
        // Calculate positions
        const totalWidth = (layersData.length * LAYER_SPACING) + LAYER_WIDTH;
        const startX = (containerRect.width - totalWidth) / 2;
        const startY = (containerRect.height - LAYER_HEIGHT) / 2;
        
        // Render each layer
        layersData.forEach((layer, index) => {
            this.renderLayer(svg, layer, index, startX, startY);
        });
    }
    
    renderLayer(svg, layer, index, startX, startY) {
        const layerGroup = svg.append('g')
            .attr('class', 'layer')
            .attr('data-layer-index', index)
            .attr('transform', `translate(${startX + (index * LAYER_SPACING)}, ${startY})`);
        
        // Draw layer body (front face)
        layerGroup.append('rect')
            .attr('class', 'layer-body')
            .attr('width', LAYER_WIDTH)
            .attr('height', LAYER_HEIGHT)
            .attr('fill', layer.color);
        
        // Draw layer thickness (right side)
        layerGroup.append('polygon')
            .attr('class', 'layer-side')
            .attr('points', `${LAYER_WIDTH},0 ${LAYER_WIDTH + LAYER_THICKNESS},${LAYER_THICKNESS} ${LAYER_WIDTH + LAYER_THICKNESS},${LAYER_HEIGHT + LAYER_THICKNESS} ${LAYER_WIDTH},${LAYER_HEIGHT}`)
            .attr('fill', d3.color(layer.color).darker(0.3));
        
        // Draw layer thickness (top side)
        layerGroup.append('polygon')
            .attr('class', 'layer-top')
            .attr('points', `0,0 ${LAYER_THICKNESS},${LAYER_THICKNESS} ${LAYER_WIDTH + LAYER_THICKNESS},${LAYER_THICKNESS} ${LAYER_WIDTH},0`)
            .attr('fill', d3.color(layer.color).darker(0.1));
        
        // Draw holes
        this.renderHoles(layerGroup, layer.holes);
        
        // Add layer name
        layerGroup.append('text')
            .attr('class', 'layer-name')
            .attr('x', LAYER_WIDTH / 2)
            .attr('y', -10)
            .text(layer.name);
        
        // Add event listeners
        this.attachEventListeners(layerGroup, layer, index);
    }
    
    renderHoles(layerGroup, holes) {
        holes.forEach((hole, holeIndex) => {
            // Position holes randomly but ensure they don't overlap
            const holeX = 30 + (holeIndex * 60) % (LAYER_WIDTH - 60);
            const holeY = 50 + Math.floor(holeIndex / 3) * 80;
            const holeWidth = 25 + Math.random() * 20;
            const holeHeight = 35 + Math.random() * 25;
            
            layerGroup.append('ellipse')
                .attr('class', 'hole')
                .attr('cx', holeX)
                .attr('cy', holeY)
                .attr('rx', holeWidth / 2)
                .attr('ry', holeHeight / 2);
        });
    }
    
    attachEventListeners(layerGroup, layer, index) {
        layerGroup
            .on('mouseover', (event) => {
                this.tooltip.show(event, layer);
            })
            .on('mouseout', () => {
                this.tooltip.hide();
            })
            .on('click', () => {
                this.selectLayer(layer, index);
            });
    }
    
    selectLayer(layer, index) {
        this.selectedLayerIndex = index;
        
        // Update visual selection
        d3.selectAll('.layer').classed('active', false);
        d3.select(`.layer[data-layer-index="${index}"]`).classed('active', true);
        
        // Notify callback
        this.onLayerClick(layer);
    }
}
