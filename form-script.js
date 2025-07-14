// DOM Elements
const mediaForm = document.getElementById('mediaForm');
const generateBtn = document.getElementById('generateBtn');
const daySelect = document.getElementById('day');
const dateInput = document.getElementById('date');

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
    
    // Display the template image
    const templateResult = document.getElementById('templateResult');
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
