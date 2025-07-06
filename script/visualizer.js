// visualizer.js
// Module for rendering the Swiss Cheese Model visualization

// Constants
const LAYER_THICKNESS = 0;
const LAYER_WIDTH = 300;
const LAYER_HEIGHT = 200;
const PERSPECTIVE_OFFSET = 100;

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
        
        // Create SVG with proper dimensions
        const svg = d3.select('#layers-container')
            .append('svg')
            .attr('width', containerRect.width)
            .attr('height', containerRect.height);
        
        // Calculate center position
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        
        // Render layers from back to front for proper layering
        layersData.forEach((layer, index) => {
            this.renderLayer(svg, layer, index, centerX, centerY, layersData.length);
        });
    }
    
    renderLayer(svg, layer, index, centerX, centerY, totalLayers) {
        const layerGroup = svg.append('g')
            .attr('class', 'layer')
            .attr('data-layer-index', index);
        
        // Calculate 3D positioning with perspective
        const perspectiveX = centerX - (LAYER_WIDTH) + (index * PERSPECTIVE_OFFSET);
        const perspectiveY = centerY + (index * PERSPECTIVE_OFFSET/totalLayers * 0.2);
        
        // Scale layers slightly smaller as they go deeper
        const scale = 1;
        const layerWidth = LAYER_WIDTH * scale;
        const layerHeight = LAYER_HEIGHT * scale;
        
        layerGroup.attr('transform', `translate(${perspectiveX}, ${perspectiveY}) matrix(0.95,-0.25,0,1,0,0)`);
        
        // Create layer with proper 3D effect
        this.create3DLayer(layerGroup, layer, layerWidth, layerHeight, index);
        
        // Add holes with proper depth
        this.renderHoles(layerGroup, layer.holes, layerWidth, layerHeight, index);
        
        // Add layer name
        layerGroup.append('text')
            .attr('class', 'layer-name')
            .attr('x', layerWidth / 2)
            .attr('y', 20)
            .style('font-size', `${14 * scale}px`)
            .style('font-weight', 'bold')
            .style('text-anchor', 'middle')
            .style('fill', '#333')
            .text(layer.name);
        
        // Add event listeners
        this.attachEventListeners(layerGroup, layer, index);
    }
    
    create3DLayer(layerGroup, layer, width, height, index) {
        const baseColor = d3.color(layer.color);
        
        // Create gradient for 3D effect
        const gradientId = `gradient-${index}`;
        const defs = layerGroup.append('defs');
        const gradient = defs.append('linearGradient')
            .attr('id', gradientId)
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '100%');
        
        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', baseColor.brighter(0.3))
            .attr('stop-opacity', 0.9);
        
        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', baseColor.darker(0.3))
            .attr('stop-opacity', 0.9);
        
        // Draw the main layer face
        layerGroup.append('rect')
            .attr('class', 'layer-body')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', `url(#${gradientId})`)
            .attr('stroke', '#333')
            .attr('stroke-width', 2)
            .attr('rx', 5)
            .attr('ry', 5);

    }
    
    renderHoles(layerGroup, holes, layerWidth, layerHeight, layerIndex) {
        // Create more realistic hole distribution
        const holePositions = this.generateHolePositions(holes.length, layerWidth, layerHeight);
        
        holes.forEach((hole, holeIndex) => {
            const position = holePositions[holeIndex];
            const holeSize = this.getRandomHoleSize();
            
            // Create hole with depth effect
            this.createHoleWithDepth(layerGroup, position.x, position.y, holeSize, layerIndex);
        });
    }
    
    generateHolePositions(holeCount, layerWidth, layerHeight) {
        const positions = [];
        const margin = 30;
        const attempts = 100;
        
        for (let i = 0; i < holeCount; i++) {
            let validPosition = false;
            let attempts_count = 0;
            
            while (!validPosition && attempts_count < attempts) {
                const x = margin + Math.random() * (layerWidth - 2 * margin);
                const y = margin + Math.random() * (layerHeight - 2 * margin);
                
                // Check if position is far enough from existing holes
                const tooClose = positions.some(pos => {
                    const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
                    return distance < 40; // Minimum distance between holes
                });
                
                if (!tooClose) {
                    positions.push({ x, y });
                    validPosition = true;
                }
                attempts_count++;
            }
            
            // If we couldn't find a valid position, use a grid fallback
            if (!validPosition) {
                const gridX = margin + (i % 3) * (layerWidth - 2 * margin) / 3;
                const gridY = margin + Math.floor(i / 3) * (layerHeight - 2 * margin) / 3;
                positions.push({ x: gridX, y: gridY });
            }
        }
        
        return positions;
    }
    
    getRandomHoleSize() {
        return {
            rx: 15 + Math.random() * 20,
            ry: 10 + Math.random() * 15
        };
    }
    
    createHoleWithDepth(layerGroup, x, y, size, layerIndex) {
        // Create hole with inner shadow for depth
        const holeGroup = layerGroup.append('g')
            .attr('class', 'hole-group');
        
        // Calculate animation timing (stagger animations for visual interest)
        const animationDelay = (layerIndex * 200) + (Math.random() * 1000);
        const animationDuration = 2000 + (Math.random() * 1000); // 2-3 seconds
        const positionDuration = 3000 + (Math.random() * 2000); // 3-5 seconds for position
        
        // Store original position and layer bounds for position animation
        const originalX = x;
        const originalY = y;
        const layerBounds = this.getLayerBounds(layerGroup);
        
        // Outer hole (slightly larger, darker) - animated
        const outerHole = holeGroup.append('ellipse')
            .attr('cx', x)
            .attr('cy', y)
            .attr('rx', size.rx + 2)
            .attr('ry', size.ry + 2)
            .attr('fill', '#000')
            .attr('fill-opacity', 0.3);
        
        // Inner hole (main hole) - animated
        const innerHole = holeGroup.append('ellipse')
            .attr('class', 'hole')
            .attr('cx', x)
            .attr('cy', y)
            .attr('rx', size.rx)
            .attr('ry', size.ry)
            .attr('fill', '#fff')
            .attr('stroke', '#333')
            .attr('stroke-width', 1);
        
        // Add depth highlight - animated
        const highlight = holeGroup.append('ellipse')
            .attr('cx', x - size.rx * 0.3)
            .attr('cy', y - size.ry * 0.3)
            .attr('rx', size.rx * 0.3)
            .attr('ry', size.ry * 0.3)
            .attr('fill', '#fff')
            .attr('fill-opacity', 0.6);
        
        // Add pulsing animation to all hole elements
        const animateHole = () => {
            // Calculate random size variations within the 10-50px range
            const minRadius = 2;
            const maxRadius = 20;
            const baseRx = minRadius + Math.random() * (maxRadius - minRadius);
            const baseRy = minRadius + Math.random() * (maxRadius - minRadius);
            
            // Animate outer hole
            outerHole.transition()
                .duration(animationDuration)
                .ease(d3.easeSinInOut)
                .attr('rx', baseRx + 2)
                .attr('ry', baseRy + 2)
                .on('end', animateHole);
            
            // Animate inner hole
            innerHole.transition()
                .duration(animationDuration)
                .ease(d3.easeSinInOut)
                .attr('rx', baseRx)
                .attr('ry', baseRy);
            
            // Animate highlight
            highlight.transition()
                .duration(animationDuration)
                .ease(d3.easeSinInOut)
                .attr('rx', baseRx * 0.3)
                .attr('ry', baseRy * 0.3);
            
            setTimeout(animateHole, animationDelay);
        };
        
        // Add position animation to move holes around
        const animatePosition = () => {
            // Generate new random position within layer bounds
            const margin = 30;
            const newX = margin + Math.random() * (layerBounds.width - 2 * margin);
            const newY = margin + Math.random() * (layerBounds.height - 2 * margin);
            
            // Animate outer hole position
            outerHole.transition()
                .duration(positionDuration)
                .ease(d3.easeSinInOut)
                .attr('cx', newX)
                .attr('cy', newY)
                .on('end', animatePosition);
            
            // Animate inner hole position
            innerHole.transition()
                .duration(positionDuration)
                .ease(d3.easeSinInOut)
                .attr('cx', newX)
                .attr('cy', newY);
            
            // Animate highlight position (offset from main hole)
            highlight.transition()
                .duration(positionDuration)
                .ease(d3.easeSinInOut)
                .attr('cx', newX - size.rx * 0.3)
                .attr('cy', newY - size.ry * 0.3);
        };
        
        // Start animations after delay
       // 
        setTimeout(animatePosition, animationDelay); // Start position animation slightly after size animation
    }
    
    getLayerBounds(layerGroup) {
        // Get the layer rectangle to determine bounds
        const layerRect = layerGroup.select('.layer-body').node();
        if (layerRect) {
            const width = parseFloat(layerRect.getAttribute('width'));
            const height = parseFloat(layerRect.getAttribute('height'));
            return { width, height };
        }
        // Fallback to default layer dimensions
        return { width: LAYER_WIDTH, height: LAYER_HEIGHT };
    }
    
    attachEventListeners(layerGroup, layer, index) {
        layerGroup
            .style('cursor', 'pointer')
            .on('mouseover', (event) => {
                this.tooltip.show(event, layer);
                // Add subtle highlight effect
                layerGroup.select('.layer-body')
                    .transition()
                    .duration(200)
                    .attr('stroke-width', 3);
            })
            .on('mouseout', () => {
                this.tooltip.hide();
                // Remove highlight if not selected
                if (this.selectedLayerIndex !== index) {
                    layerGroup.select('.layer-body')
                        .transition()
                        .duration(200)
                        .attr('stroke-width', 2);
                }
            })
            .on('click', () => {
                this.selectLayer(layer, index);
            });
    }
    
    selectLayer(layer, index) {
        this.selectedLayerIndex = index;
        
        // Update visual selection
        d3.selectAll('.layer .layer-body').attr('stroke-width', 2);
        d3.select(`.layer[data-layer-index="${index}"] .layer-body`)
            .attr('stroke-width', 4)
            .attr('stroke', '#000');
        
        // Notify callback
        this.onLayerClick(layer);
    }
}
