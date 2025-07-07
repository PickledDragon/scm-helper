// findings-manager.js
// Utility functions for managing stored findings

export class FindingsManager {
    static getStoredFindings() {
        const stored = localStorage.getItem('scm-findings');
        return stored ? JSON.parse(stored) : [];
    }
    
    static exportFindings() {
        const findings = this.getStoredFindings();
        const dataStr = JSON.stringify(findings, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `scm-findings-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
    
    static exportFindingsAsHTML() {
        const findings = this.getStoredFindings();
        const exportDate = new Date().toISOString().split('T')[0];
        const reportDate = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SCM Findings Report - ${reportDate}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .header {
            background: linear-gradient(135deg, #0d6efd, #6610f2);
            color: white;
            padding: 2rem;
            border-radius: 10px;
            margin-bottom: 2rem;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5rem;
        }
        .header p {
            margin: 0.5rem 0 0 0;
            opacity: 0.9;
        }
        .summary {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            margin-bottom: 2rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .summary h2 {
            color: #0d6efd;
            margin-top: 0;
        }
        .finding-card {
            background: white;
            border-radius: 10px;
            margin-bottom: 1.5rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .finding-header {
            padding: 1rem 1.5rem;
            border-left: 5px solid;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: rgba(13, 110, 253, 0.05);
        }
        .finding-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin: 0;
        }
        .finding-date {
            font-size: 0.9rem;
            color: #6c757d;
        }
        .finding-content {
            padding: 1.5rem;
        }
        .finding-meta {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1rem;
        }
        .meta-item {
            background-color: #f8f9fa;
            padding: 0.75rem;
            border-radius: 5px;
        }
        .meta-label {
            font-weight: 600;
            color: #495057;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .meta-value {
            color: #212529;
            margin-top: 0.25rem;
        }
        .finding-description {
            background-color: #f8f9fa;
            padding: 1rem;
            border-radius: 5px;
            border-left: 4px solid #0d6efd;
            margin-top: 1rem;
        }
        .finding-description h4 {
            margin-top: 0;
            color: #0d6efd;
        }
        .no-findings {
            text-align: center;
            padding: 3rem;
            color: #6c757d;
        }
        .footer {
            text-align: center;
            padding: 2rem;
            color: #6c757d;
            border-top: 1px solid #dee2e6;
            margin-top: 2rem;
        }
        @media print {
            body {
                background-color: white;
                font-size: 12pt;
            }
            .finding-card {
                page-break-inside: avoid;
                box-shadow: none;
                border: 1px solid #dee2e6;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Swiss Cheese Model Findings Report</h1>
        <p>Generated on ${reportDate}</p>
    </div>
    
    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Total Findings:</strong> ${findings.length}</p>
        <p><strong>Export Date:</strong> ${reportDate}</p>
        <p><strong>Report Generated by:</strong> SCM Helper Application</p>
    </div>
`;

        if (findings.length === 0) {
            htmlContent += `
    <div class="no-findings">
        <h3>No Findings Recorded</h3>
        <p>No findings have been recorded for this Swiss Cheese Model analysis.</p>
    </div>`;
        } else {
            findings.forEach((finding, index) => {
                const timestamp = new Date(finding.timestamp);
                const formattedDate = timestamp.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                htmlContent += `
    <div class="finding-card">
        <div class="finding-header" style="border-left-color: ${finding.layer.color};">
            <h3 class="finding-title">Finding #${index + 1}: ${finding.layer.name}</h3>
            <span class="finding-date">${formattedDate}</span>
        </div>
        <div class="finding-content">
            <div class="finding-meta">
                <div class="meta-item">
                    <div class="meta-label">Layer</div>
                    <div class="meta-value">${finding.layer.name}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Hole</div>
                    <div class="meta-value">${finding.hole.name}</div>
                </div>
                ${finding.subClass ? `
                <div class="meta-item">
                    <div class="meta-label">Sub-class</div>
                    <div class="meta-value">${finding.subClass.name}</div>
                </div>` : ''}
            </div>
            
            <div class="finding-description">
                <h4>Finding Details</h4>
                <p>${finding.userInput.replace(/\n/g, '<br>')}</p>
            </div>
            
            ${finding.hole.description ? `
            <div class="finding-description">
                <h4>Hole Description</h4>
                <p>${finding.hole.description}</p>
            </div>` : ''}
            
            ${finding.subClass && finding.subClass.description ? `
            <div class="finding-description">
                <h4>Sub-class Description</h4>
                <p>${finding.subClass.description}</p>
            </div>` : ''}
        </div>
    </div>`;
            });
        }
        
        htmlContent += `
    <div class="footer">
        <p>This report was generated by the Swiss Cheese Model Helper application.</p>
        <p>For more information about the Swiss Cheese Model, visit your organization's incident response documentation.</p>
    </div>
</body>
</html>`;

        // Create and download the HTML file
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `scm-findings-report-${exportDate}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    static displayFindingsConsole() {
        const findings = this.getStoredFindings();
        console.group('SCM Findings');
        findings.forEach((finding, index) => {
            console.group(`Finding ${index + 1} - ${new Date(finding.timestamp).toLocaleString()}`);
            console.log('Layer:', finding.layer.name);
            console.log('Hole:', finding.hole.name);
            if (finding.subClass) {
                console.log('Sub-class:', finding.subClass.name);
            }
            console.log('Finding:', finding.userInput);
            console.groupEnd();
        });
        console.groupEnd();
    }
    
    static getFindingsByLayer(layerName) {
        const findings = this.getStoredFindings();
        return findings.filter(finding => finding.layer.name === layerName);
    }
    
    static getFindingsCount() {
        return this.getStoredFindings().length;
    }
    
    static updateFindingsBadge() {
        const count = this.getFindingsCount();
        const badge = document.getElementById('findings-badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline' : 'none';
        }
    }
    
    static addFinding(finding) {
        // Get existing findings from localStorage
        const existingFindings = this.getStoredFindings();
        
        // Add new finding
        existingFindings.push(finding);
        
        // Save back to localStorage
        localStorage.setItem('scm-findings', JSON.stringify(existingFindings));
        
        // Update badge
        this.updateFindingsBadge();
        
        // Dispatch custom event for other components to listen to
        window.dispatchEvent(new CustomEvent('findingsUpdated', { 
            detail: { count: existingFindings.length, findings: existingFindings }
        }));
    }
    
    static clearAllFindings() {
        localStorage.removeItem('scm-findings');
        this.updateFindingsBadge();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('findingsUpdated', { 
            detail: { count: 0, findings: [] }
        }));
    }
    
    static showFindingsModal() {
        const findings = this.getStoredFindings();
        
        // Create or update findings modal
        let modal = document.getElementById('findingsViewModal');
        if (!modal) {
            this.createFindingsModal();
            modal = document.getElementById('findingsViewModal');
        }
        
        // Populate modal with findings
        this.populateFindingsModal(findings);
        
        // Show modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
    
    static createFindingsModal() {
        const modalHtml = `
            <div class="modal fade" id="findingsViewModal" tabindex="-1" aria-labelledby="findingsViewModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="findingsViewModalLabel">
                                <i class="bi bi-clipboard-data"></i> Recorded Findings
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="findingsModalBody">
                            <!-- Findings will be populated here -->
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-danger" onclick="FindingsManager.clearAllFindingsWithConfirm()">
                                <i class="bi bi-trash"></i> Clear All
                            </button>
                            <div class="btn-group" role="group" aria-label="Export options">
                                <button type="button" class="btn btn-outline-primary" onclick="FindingsManager.exportFindings()">
                                    <i class="bi bi-filetype-json"></i> Export JSON
                                </button>
                                <button type="button" class="btn btn-outline-primary" onclick="FindingsManager.exportFindingsAsHTML()">
                                    <i class="bi bi-filetype-html"></i> Export HTML
                                </button>
                            </div>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
    
    static populateFindingsModal(findings) {
        const modalBody = document.getElementById('findingsModalBody');
        
        if (findings.length === 0) {
            modalBody.innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="bi bi-clipboard-x" style="font-size: 3rem;"></i>
                    <h4>No findings recorded yet</h4>
                    <p>Start by selecting a layer and clicking "Add new finding"</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="mb-3">
                <h6 class="text-muted">Total Findings: ${findings.length}</h6>
            </div>
            <div class="row">
        `;
        
        findings.forEach((finding, index) => {
            const date = new Date(finding.timestamp).toLocaleString();
            html += `
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card h-100">
                        <div class="card-header" style="background-color: ${finding.layer.color}20; border-left: 4px solid ${finding.layer.color};">
                            <h6 class="card-title mb-0 text-truncate">${finding.layer.name}</h6>
                            <small class="text-muted">${date}</small>
                        </div>
                        <div class="card-body">
                            <p class="card-text"><strong>Hole:</strong> ${finding.hole.name}</p>
                            ${finding.subClass ? `<p class="card-text"><strong>Sub-class:</strong> ${finding.subClass.name}</p>` : ''}
                            <p class="card-text"><strong>Finding:</strong></p>
                            <p class="card-text text-muted" style="font-size: 0.9rem; max-height: 100px; overflow-y: auto;">${finding.userInput}</p>
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-sm btn-outline-danger" onclick="FindingsManager.deleteFinding('${finding.id}')">
                                <i class="bi bi-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        modalBody.innerHTML = html;
    }
    
    static deleteFinding(findingId) {
        if (confirm('Are you sure you want to delete this finding?')) {
            const findings = this.getStoredFindings();
            const updatedFindings = findings.filter(f => f.id !== findingId);
            localStorage.setItem('scm-findings', JSON.stringify(updatedFindings));
            
            // Update badge and modal
            this.updateFindingsBadge();
            this.populateFindingsModal(updatedFindings);
            
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('findingsUpdated', { 
                detail: { count: updatedFindings.length, findings: updatedFindings }
            }));
        }
    }
    
    static clearAllFindingsWithConfirm() {
        if (confirm('Are you sure you want to delete all findings? This action cannot be undone.')) {
            this.clearAllFindings();
            this.populateFindingsModal([]);
        }
    }
}

// Make it globally available for debugging
window.FindingsManager = FindingsManager;
