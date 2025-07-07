// details-pane.js
// Module for managing the details pane

export class DetailsPane {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentLayer = null;
        this.createModal();
    }
    
    createModal() {
        // Create the modal HTML
        const modalHtml = `
            <div class="modal fade" id="addFindingModal" tabindex="-1" aria-labelledby="addFindingModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addFindingModalLabel">Add new finding for : </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="findingForm">
                                <div class="mb-3">
                                    <label for="findingText" class="form-label">Finding Details</label>
                                    <textarea class="form-control" id="findingText" rows="4" placeholder="Enter your finding details here..." required></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="holeSelect" class="form-label">Select Hole</label>
                                    <select class="form-select" id="holeSelect" required>
                                        <option value="">Choose a hole...</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="subClassSelect" class="form-label">Select Sub-class (if applicable)</label>
                                    <select class="form-select" id="subClassSelect">
                                        <option value="">Choose a sub-class...</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="saveFindingBtn">Save Finding</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to the document body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Set up event listeners
        this.setupModalEventListeners();
    }
    
    setupModalEventListeners() {
        // Handle hole selection change to populate sub-classes
        document.getElementById('holeSelect').addEventListener('change', (e) => {
            this.populateSubClasses(e.target.value);
        });
        
        // Handle save finding button
        document.getElementById('saveFindingBtn').addEventListener('click', () => {
            this.saveFinding();
        });
    }
    
    populateSubClasses(holeIndex) {
        const subClassSelect = document.getElementById('subClassSelect');
        subClassSelect.innerHTML = '<option value="">Choose a sub-class...</option>';
        
        if (holeIndex !== '' && this.currentLayer && this.currentLayer.holes[holeIndex]) {
            const hole = this.currentLayer.holes[holeIndex];
            if (hole['sub-classes']) {
                hole['sub-classes'].forEach((subClass, index) => {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = subClass.name;
                    subClassSelect.appendChild(option);
                });
            }
        }
    }
    
    showAddFindingModal() {
        if (!this.currentLayer) {
            alert('Please select a layer first.');
            return;
        }
        
        // Update modal title
        document.getElementById('addFindingModalLabel').textContent = `Add new finding for : ${this.currentLayer.name}`;
        
        // Populate holes dropdown
        const holeSelect = document.getElementById('holeSelect');
        holeSelect.innerHTML = '<option value="">Choose a hole...</option>';
        
        this.currentLayer.holes.forEach((hole, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = hole.name;
            holeSelect.appendChild(option);
        });
        
        // Clear form
        document.getElementById('findingText').value = '';
        document.getElementById('subClassSelect').innerHTML = '<option value="">Choose a sub-class...</option>';
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('addFindingModal'));
        modal.show();
    }
    
    saveFinding() {
        const findingText = document.getElementById('findingText').value.trim();
        const holeIndex = document.getElementById('holeSelect').value;
        const subClassIndex = document.getElementById('subClassSelect').value;
        
        if (!findingText) {
            alert('Please enter finding details.');
            return;
        }
        
        if (holeIndex === '') {
            alert('Please select a hole.');
            return;
        }
        
        // Prepare finding data
        const finding = {
            id: Date.now().toString(), // Simple ID generation
            timestamp: new Date().toISOString(),
            userInput: findingText,
            layer: {
                name: this.currentLayer.name,
                color: this.currentLayer.color
            },
            hole: {
                name: this.currentLayer.holes[holeIndex].name,
                description: this.currentLayer.holes[holeIndex].description
            },
            subClass: null
        };
        
        // Add sub-class if selected
        if (subClassIndex !== '') {
            const subClass = this.currentLayer.holes[holeIndex]['sub-classes'][subClassIndex];
            finding.subClass = {
                name: subClass.name,
                description: subClass.description
            };
        }
        
        // Save to localStorage
        this.saveToLocalStorage(finding);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addFindingModal'));
        modal.hide();
        
        // Show success message
        alert('Finding saved successfully!');
        
        // Clear form
        document.getElementById('findingForm').reset();
    }
    
    saveToLocalStorage(finding) {
        // Get existing findings from localStorage
        const existingFindings = this.getStoredFindings();
        
        // Add new finding
        existingFindings.push(finding);
        
        // Save back to localStorage
        localStorage.setItem('scm-findings', JSON.stringify(existingFindings));
    }
    
    getStoredFindings() {
        const stored = localStorage.getItem('scm-findings');
        return stored ? JSON.parse(stored) : [];
    }
    
    updateLayerDetails(layer) {
        this.currentLayer = layer; // Store current layer for modal use
        
        let html = `
            <h3 style="color: ${layer.color};">${layer.name}</h3>
            <p>${layer.description}</p>
            <button type="button" class="btn btn-primary mb-3" onclick="window.detailsPane.showAddFindingModal()">Add new finding</button>
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
