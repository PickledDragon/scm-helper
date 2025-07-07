// findings-manager.js
// Utility functions for managing stored findings

export class FindingsManager {
    static getStoredFindings() {
        const stored = localStorage.getItem('scm-findings');
        return stored ? JSON.parse(stored) : [];
    }
    
    static clearAllFindings() {
        localStorage.removeItem('scm-findings');
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
}

// Make it globally available for debugging
window.FindingsManager = FindingsManager;
