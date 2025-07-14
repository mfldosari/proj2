// DOM Elements
const mediaForm = document.getElementById('mediaForm');
const generateBtn = document.getElementById('generateBtn');
const backBtn = document.getElementById('backBtn');
const daySelect = document.getElementById('day');
const dateInput = document.getElementById('date');
const templateResult = document.getElementById('templateResult');
const loadingOverlay = document.getElementById('loadingOverlay');

// Template positions for form fields
const fieldPositions = {
    'subject': { top: '20%', right: '25%' },
    'day': { top: '25%', right: '25%' },
    'date': { top: '30%', right: '25%' },
    'location': { top: '35%', right: '25%' },
    'time': { top: '40%', right: '25%' },
    'hour': { top: '45%', right: '25%' },
    'required': { top: '50%', right: '25%' },
    'assignees': { top: '60%', right: '25%', grid: true }
};

// Arabic day names
const arabicDays = [
    'الأحد',    // Sunday
    'الإثنين',  // Monday
    'الثلاثاء', // Tuesday
    'الأربعاء', // Wednesday
    'الخميس',   // Thursday
    'الجمعة',   // Friday
    'السبت'     // Saturday
];

// Update day based on selected date
dateInput.addEventListener('change', function() {
    if (this.value) {
        const selectedDate = new Date(this.value);
        const dayIndex = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        daySelect.value = arabicDays[dayIndex];
    }
});

// Format date to Arabic format
function formatDateToArabic(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ar-SA', options);
}

// Format time from time input
function formatTime(timeString) {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    let formattedHours = parseInt(hours);
    const period = formattedHours >= 12 ? 'م' : 'ص';
    
    if (formattedHours > 12) {
        formattedHours -= 12;
    } else if (formattedHours === 0) {
        formattedHours = 12;
    }
    
    return `${formattedHours}:${minutes} ${period}`;
}

// Check if all required fields are filled
function areAllRequiredFieldsFilled() {
    const requiredFields = mediaForm.querySelectorAll('[required]');
    return Array.from(requiredFields).every(field => field.value.trim() !== '');
}

// Show loading overlay with custom text
function showLoadingOverlay(text) {
    // Update loading text if provided
    if (text) {
        const loadingText = loadingOverlay.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = text;
        }
    }
    
    // Reset progress bar
    const progressBar = document.getElementById('progress');
    progressBar.style.width = '0%';
    
    // Show overlay
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.opacity = '1';
    
    // Start progress animation
    let width = 0;
    const interval = 20; // Update every 20ms
    const duration = 2000; // 2 seconds
    const increment = 100 / (duration / interval);
    
    const timer = setInterval(() => {
        width += increment;
        progressBar.style.width = width + '%';
        
        if (width >= 100) {
            clearInterval(timer);
            // Hide loading overlay with fade effect
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 500);
        }
    }, interval);
}

// Back button functionality
backBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Generate template with form data
generateBtn.addEventListener('click', () => {
    // Check form validity
    if (!mediaForm.checkValidity()) {
        // Mark all required fields that are empty
        const requiredFields = mediaForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value) {
                field.classList.add('error');
                field.addEventListener('input', function() {
                    if (this.value) {
                        this.classList.remove('error');
                    }
                }, { once: true });
            }
        });
        
        // Show error message
        alert('الرجاء ملء جميع الحقول المطلوبة');
        return;
    }
    
    // Double check that all required fields are filled
    if (!areAllRequiredFieldsFilled()) {
        alert('الرجاء ملء جميع الحقول المطلوبة');
        return;
    }
    
    // Get form data
    const formData = new FormData(mediaForm);
    const formValues = {};
    
    for (const [key, value] of formData.entries()) {
        formValues[key] = value;
    }
    
    // Format date if available
    if (formValues.date) {
        formValues.formattedDate = formatDateToArabic(formValues.date);
    }
    
    // Format hour if available
    if (formValues.hour) {
        formValues.formattedHour = formatTime(formValues.hour);
    }
    
    // Show loading overlay with generating template message
    showLoadingOverlay('جاري توليد النموذج بالبيانات المدخلة...');
    
    // Wait for loading to complete before showing the template
    setTimeout(() => {
        // Display the template image
        templateResult.innerHTML = `
            <div class="template-header">
                <h2>النموذج المولد</h2>
            </div>
            <div class="template-image-container">
                <img src="tamplet1.jpg" alt="نموذج الإنتاج الفني" class="template-image">
            </div>
        `;
        
        // Show the template result section
        templateResult.classList.add('visible');
        
        // Scroll to the template result
        templateResult.scrollIntoView({ behavior: 'smooth' });
        
        // Reset form to default values
        mediaForm.reset();
        
        // Update day field after reset
        if (dateInput.value) {
            const event = new Event('change');
            dateInput.dispatchEvent(event);
        }
    }, 2500); // Wait a bit longer than the loading animation
});

// Save form data to localStorage
mediaForm.addEventListener('input', () => {
    const formData = new FormData(mediaForm);
    const formValues = {};
    
    for (const [key, value] of formData.entries()) {
        formValues[key] = value;
    }
    
    localStorage.setItem('mediaFormData', JSON.stringify(formValues));
});

// Load saved form data on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedData = localStorage.getItem('mediaFormData');
    
    if (savedData) {
        const formValues = JSON.parse(savedData);
        
        for (const [key, value] of Object.entries(formValues)) {
            const field = mediaForm.elements[key];
            if (field) {
                if (field.type === 'radio') {
                    const radio = mediaForm.querySelector(`input[name="${key}"][value="${value}"]`);
                    if (radio) radio.checked = true;
                } else {
                    field.value = value;
                }
            }
        }
    }
    
    // If date is set, update day automatically
    if (dateInput.value) {
        const event = new Event('change');
        dateInput.dispatchEvent(event);
    }
});

// Save form data to localStorage
mediaForm.addEventListener('input', () => {
    const formData = new FormData(mediaForm);
    const formValues = {};
    
    for (const [key, value] of formData.entries()) {
        formValues[key] = value;
    }
    
    localStorage.setItem('mediaFormData', JSON.stringify(formValues));
});

// Load saved form data on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedData = localStorage.getItem('mediaFormData');
    
    if (savedData) {
        const formValues = JSON.parse(savedData);
        
        for (const [key, value] of Object.entries(formValues)) {
            const field = mediaForm.elements[key];
            if (field) {
                if (field.type === 'radio') {
                    const radio = mediaForm.querySelector(`input[name="${key}"][value="${value}"]`);
                    if (radio) radio.checked = true;
                } else {
                    field.value = value;
                }
            }
        }
    }
    
    // If date is set, update day automatically
    if (dateInput.value) {
        const event = new Event('change');
        dateInput.dispatchEvent(event);
    }
});
