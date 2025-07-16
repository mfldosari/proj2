// DOM Elements
const assigneeNameInput = document.getElementById('assigneeName');
const assigneeNameCounter = document.getElementById('assigneeNameCounter');
const assigneeNameError = document.getElementById('assigneeNameError');
const addAssigneeBtn = document.getElementById('addAssigneeBtn');
const assigneesList = document.getElementById('assigneesList');

// Assignees array to store the data
let assignees = [];

// Function to check if text contains only Arabic characters
function isArabicText(text) {
    // Arabic Unicode range: \u0600-\u06FF (Arabic), \u0750-\u077F (Arabic Supplement), \u08A0-\u08FF (Arabic Extended-A)
    // Also allow spaces, numbers, and some punctuation
    const arabicRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s\d\.\,\:\-\_\(\)]*$/;
    return arabicRegex.test(text);
}

// Function to update character counter
function updateCharCounter() {
    const maxLength = assigneeNameInput.getAttribute('maxlength');
    const currentLength = assigneeNameInput.value.length;
    assigneeNameCounter.textContent = currentLength + '/' + maxLength;
    
    // Add visual indication when approaching limit
    if (currentLength >= maxLength) {
        assigneeNameCounter.style.color = '#ff3333';
        assigneeNameCounter.style.fontWeight = 'bold';
    } else {
        assigneeNameCounter.style.color = '#666';
        assigneeNameCounter.style.fontWeight = 'normal';
    }
}

// Function to validate Arabic input
function validateArabicInput() {
    if (assigneeNameInput.value.trim() !== '') {
        if (!isArabicText(assigneeNameInput.value)) {
            assigneeNameInput.classList.add('arabic-error');
            assigneeNameError.style.display = 'block';
            return false;
        } else {
            assigneeNameInput.classList.remove('arabic-error');
            assigneeNameError.style.display = 'none';
            return true;
        }
    }
    return true;
}

// Function to save assignees to JSON file
async function saveAssigneesToFile() {
    try {
        const response = await fetch('/api/save-assignees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ assignees })
        });
        
        if (!response.ok) {
            throw new Error('Failed to save assignees');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error saving assignees:', error);
        alert('حدث خطأ أثناء حفظ المكلفين. يرجى المحاولة مرة أخرى.');
    }
}

// Function to load assignees from JSON file
async function loadAssigneesFromFile() {
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

// Function to render assignees list
function renderAssigneesList() {
    // Clear the list
    assigneesList.innerHTML = '';
    
    if (assignees.length === 0) {
        const noAssigneesMsg = document.createElement('div');
        noAssigneesMsg.className = 'no-assignees-msg';
        noAssigneesMsg.textContent = 'لا يوجد مكلفين حالياً';
        assigneesList.appendChild(noAssigneesMsg);
        return;
    }
    
    // Add each assignee to the list
    assignees.forEach((assignee, index) => {
        const assigneeItem = document.createElement('div');
        assigneeItem.className = 'assignee-item';
        
        const assigneeName = document.createElement('div');
        assigneeName.className = 'assignee-name';
        assigneeName.textContent = assignee;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-assignee-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'حذف المكلف';
        
        // Add click event to delete button
        deleteBtn.addEventListener('click', () => {
            // Remove assignee from array
            assignees.splice(index, 1);
            
            // Save to file
            saveAssigneesToFile();
            
            // Re-render the list
            renderAssigneesList();
        });
        
        assigneeItem.appendChild(assigneeName);
        assigneeItem.appendChild(deleteBtn);
        assigneesList.appendChild(assigneeItem);
    });
}

// Function to add a new assignee
function addAssignee() {
    const assigneeName = assigneeNameInput.value.trim();
    
    // Validate input
    if (!assigneeName) {
        alert('يرجى إدخال اسم المكلف');
        return;
    }
    
    if (!validateArabicInput()) {
        alert('يرجى إدخال حروف عربية فقط');
        return;
    }
    
    // Add to array
    assignees.push(assigneeName);
    
    // Save to file
    saveAssigneesToFile();
    
    // Clear input
    assigneeNameInput.value = '';
    updateCharCounter();
    
    // Re-render the list
    renderAssigneesList();
}

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Load assignees from file
    assignees = await loadAssigneesFromFile();
    
    // Render the list
    renderAssigneesList();
    
    // Add event listeners
    assigneeNameInput.addEventListener('input', () => {
        updateCharCounter();
        validateArabicInput();
    });
    
    // Prevent non-Arabic input
    assigneeNameInput.addEventListener('keypress', (e) => {
        const char = String.fromCharCode(e.charCode);
        if (!/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s\d\.\,\:\-\_\(\)]/.test(char)) {
            e.preventDefault();
            assigneeNameError.style.display = 'block';
            setTimeout(() => {
                assigneeNameError.style.display = 'none';
            }, 2000);
        }
    });
    
    // Handle paste events
    assigneeNameInput.addEventListener('paste', (e) => {
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        if (!/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s\d\.\,\:\-\_\(\)]*$/.test(pastedText)) {
            e.preventDefault();
            assigneeNameError.style.display = 'block';
            setTimeout(() => {
                assigneeNameError.style.display = 'none';
            }, 2000);
        }
    });
    
    addAssigneeBtn.addEventListener('click', addAssignee);
    
    // Also add enter key support
    assigneeNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addAssignee();
        }
    });
    
    // Initialize counter
    updateCharCounter();
});
