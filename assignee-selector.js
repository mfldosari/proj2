// Function to load assignees from JSON file
async function loadAssigneesForDropdowns() {
    try {
        const response = await fetch('/api/load-assignees');
        
        if (!response.ok) {
            // If file doesn't exist yet, just return empty array
            if (response.status === 404) {
                return [];
            }
            throw new Error('Failed to load assignees');
        }
        
        const data = await response.json();
        return data.assignees || [];
    } catch (error) {
        console.error('Error loading assignees:', error);
        return [];
    }
}

// Function to populate assignee dropdowns
async function populateAssigneeDropdowns() {
    // Load assignees from JSON file
    const assignees = await loadAssigneesForDropdowns();
    
    // Get all assignee select elements
    const assigneeSelects = document.querySelectorAll('.assignee-select');
    
    // If no assignees found, show a message
    if (assignees.length === 0) {
        assigneeSelects.forEach(select => {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'لا يوجد مكلفين - أضف مكلفين من الصفحة الرئيسية';
            option.disabled = true;
            select.appendChild(option);
            select.disabled = true;
        });
        return;
    }
    
    // Populate each select with assignees
    assigneeSelects.forEach(select => {
        // Clear existing options
        select.innerHTML = '';
        
        // Add empty option
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = 'اختر المكلف';
        select.appendChild(emptyOption);
        
        // Add assignees as options
        assignees.forEach(assignee => {
            const option = document.createElement('option');
            option.value = assignee;
            option.textContent = assignee;
            select.appendChild(option);
        });
    });
    
    // Add change event listeners to prevent duplicate selections
    assigneeSelects.forEach(select => {
        select.addEventListener('change', function() {
            updateAssigneeSelections(this);
            
            // Update preview when selection changes
            if (typeof updatePreview === 'function') {
                updatePreview();
            }
        });
    });
}

// Function to update assignee selections to prevent duplicates
function updateAssigneeSelections(changedSelect) {
    const selectedValue = changedSelect.value;
    
    // Skip if empty selection
    if (!selectedValue) return;
    
    // Get all assignee select elements
    const assigneeSelects = document.querySelectorAll('.assignee-select');
    
    // Check for duplicates and disable options
    assigneeSelects.forEach(select => {
        // Skip the current select that was changed
        if (select === changedSelect) return;
        
        // If another select has the same value, clear it
        if (select.value === selectedValue) {
            select.value = '';
        }
        
        // Disable/enable options based on selections
        Array.from(select.options).forEach(option => {
            // Skip the empty option
            if (!option.value) return;
            
            // Check if this option is selected in any other dropdown
            const isSelectedElsewhere = Array.from(assigneeSelects).some(s => 
                s !== select && s.value === option.value
            );
            
            // Disable if selected elsewhere
            option.disabled = isSelectedElsewhere;
        });
    });
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    populateAssigneeDropdowns();
});
