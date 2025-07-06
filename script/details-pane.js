// details-pane.js
// Module for managing the details pane

export class DetailsPane {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }
    
    updateLayerDetails(layer) {
        let html = `
            <h3 style="color: ${layer.color};">${layer.name}</h3>
            <p>${layer.description}</p>
            <h4>Holes</h4>
            <div class="accordion" id="holesAccordion">
        `;
        
        layer.holes.forEach((hole, index) => {
            html += `
                <div class="accordion-item">
                    <div class="accordion-header" onclick="window.toggleAccordion(${index})">
                        <strong>${hole.name}</strong>
                    </div>
                    <div id="accordion-content-${index}" class="accordion-content">
                        <p>${hole.description}</p>
                        ${hole['sub-classes'] ? `
                            <h6>Sub-classes:</h6>
                            <ul>
                                ${hole['sub-classes'].map(subClass => `
                                    <li><strong>${subClass.name}</strong>: ${subClass.description}</li>
                                `).join('')}
                            </ul>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        this.container.innerHTML = html;
    }
    
    static toggleAccordion(index) {
        const content = document.getElementById(`accordion-content-${index}`);
        content.classList.toggle('active');
    }
}
