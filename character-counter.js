// Function to update character counter
function updateCharCounter(input) {
    const counterId = input.id + 'Counter';
    const counter = document.getElementById(counterId);
    
    if (counter) {
        const maxLength = input.getAttribute('maxlength');
        const currentLength = input.value.length;
        counter.textContent = currentLength + '/' + maxLength;
        
        // Add visual indication when approaching limit
        if (currentLength >= maxLength * 0.9) {
            counter.style.color = '#ff3333';
        } else {
            counter.style.color = '#666';
        }
    }
}

// Setup character counters for all inputs with maxlength
function setupCharCounters() {
    const inputs = document.querySelectorAll('input[maxlength]');
    
    inputs.forEach(input => {
        // Initialize counter
        updateCharCounter(input);
        
        // Add input event listener
        input.addEventListener('input', function() {
            updateCharCounter(this);
        });
    });
}

// Function to check if text contains only Arabic characters
function isArabicText(text) {
    // Arabic Unicode range: \u0600-\u06FF (Arabic), \u0750-\u077F (Arabic Supplement), \u08A0-\u08FF (Arabic Extended-A)
    // Also allow spaces, numbers, and some punctuation
    const arabicRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s\d\.\,\:\-\_\(\)]*$/;
    return arabicRegex.test(text);
}

// Function to validate Arabic fields
function validateArabicField(input) {
    const errorId = input.id + 'Error';
    const errorElement = document.getElementById(errorId);
    
    if (input.value.trim() !== '') {
        if (!isArabicText(input.value)) {
            input.classList.add('error');
            if (errorElement) {
                errorElement.style.display = 'block';
            }
            return false;
        } else {
            input.classList.remove('error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
            return true;
        }
    }
    return true;
}

// Setup Arabic validation for specific fields
function setupArabicValidation() {
    const arabicFields = ['subject', 'location', 'time'];
    
    arabicFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            // Validate on input
            field.addEventListener('input', function() {
                validateArabicField(this);
            });
            
            // Prevent non-Arabic input
            field.addEventListener('keypress', function(e) {
                const char = String.fromCharCode(e.charCode);
                if (!/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s\d\.\,\:\-\_\(\)]/.test(char)) {
                    e.preventDefault();
                    
                    const errorId = this.id + 'Error';
                    const errorElement = document.getElementById(errorId);
                    if (errorElement) {
                        errorElement.style.display = 'block';
                        setTimeout(() => {
                            errorElement.style.display = 'none';
                        }, 2000);
                    }
                }
            });
            
            // Handle paste events
            field.addEventListener('paste', function(e) {
                const pastedText = (e.clipboardData || window.clipboardData).getData('text');
                if (!/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s\d\.\,\:\-\_\(\)]*$/.test(pastedText)) {
                    e.preventDefault();
                    
                    const errorId = this.id + 'Error';
                    const errorElement = document.getElementById(errorId);
                    if (errorElement) {
                        errorElement.style.display = 'block';
                        setTimeout(() => {
                            errorElement.style.display = 'none';
                        }, 2000);
                    }
                }
            });
        }
    });
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupCharCounters();
    setupArabicValidation();
});
