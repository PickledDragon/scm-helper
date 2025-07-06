// tooltip.js
// Module for tooltip functionality

export class Tooltip {
    constructor() {
        this.element = null;
        this.init();
    }
    
    init() {
        this.element = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);
    }
    
    show(event, layer) {
        const tooltipContent = `
            <div class="tooltip-header">${layer.name}</div>
            <div class="tooltip-body">${layer.description}</div>
            <div class="tooltip-footer">Holes: ${layer.holes.length}</div>
        `;
        
        this.element.transition()
            .duration(200)
            .style('opacity', 0.9);
        
        this.element.html(tooltipContent)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
    }
    
    hide() {
        this.element.transition()
            .duration(500)
            .style('opacity', 0);
    }
}
