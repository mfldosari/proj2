// DOM Elements
const mediaForm = document.getElementById('mediaForm');
const generateBtn = document.getElementById('generateBtn');
const backBtn = document.getElementById('backBtn');
const daySelect = document.getElementById('day');
const dateInput = document.getElementById('date');
const templateResult = document.getElementById('templateResult');
const loadingOverlay = document.getElementById('loadingOverlay');

// Function to validate Arabic text input
function isArabicText(text) {
    // Arabic Unicode range: \u0600-\u06FF
    // Additional Arabic characters: \u0750-\u077F, \u08A0-\u08FF
    // Arabic presentation forms: \uFB50-\uFDFF, \uFE70-\uFEFF
    // Allow spaces, commas, and periods
    const arabicRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s.,]+$/;
    return arabicRegex.test(text);
}

// Add Arabic-only validation to text inputs
function addArabicValidation() {
    // Get all text inputs
    const textInputs = document.querySelectorAll('input[type="text"]');
    
    textInputs.forEach(input => {
        // Add input event listener
        input.addEventListener('input', function() {
            // If the input is not empty and not Arabic
            if (this.value && !isArabicText(this.value)) {
                // Remove non-Arabic characters
                this.value = this.value.split('').filter(char => 
                    isArabicText(char) || char === ' ' || char === '.' || char === ','
                ).join('');
                
                // Add error class
                this.classList.add('arabic-error');
                
                // Show error message
                let errorMsg = this.parentNode.querySelector('.arabic-error-msg');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'arabic-error-msg';
                    errorMsg.textContent = 'يرجى إدخال حروف عربية فقط';
                    this.parentNode.appendChild(errorMsg);
                }
            } else {
                // Remove error class
                this.classList.remove('arabic-error');
                
                // Remove error message
                const errorMsg = this.parentNode.querySelector('.arabic-error-msg');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });
    });
}

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
    window.location.href = '/';
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
        // Create template with data overlaid
        templateResult.innerHTML = `
            <div class="template-header">
                <h2>النموذج المولد</h2>
                <div class="template-actions">
                    <button id="downloadPdfBtn" class="action-btn download-pdf-btn">
                        <i class="fas fa-file-pdf"></i> حفظ كـ PDF
                    </button>
                    <button id="downloadImgBtn" class="action-btn download-img-btn">
                        <i class="fas fa-image"></i> حفظ كصورة
                    </button>
                </div>
            </div>
            <div class="template-container" id="templateContainer">
                <div class="template-image-container">
                    <img src="/static/tamplet1.jpg" alt="نموذج الإنتاج الفني" class="template-image">
                    
                    <!-- Overlay form data on the template -->
                    <div class="data-overlay">
                        <!-- You can adjust these positions as needed -->
                        <div class="data-field" style="top: 20.5%; right: 30%;">${formValues.subject || ''}</div>
                        <div class="data-field" style="top: 28%; right: 31%;">${formValues.day || ''}</div>
                        <div class="data-field" style="top: 28%; right: 70%;">${formValues.formattedDate || formValues.date || ''}</div>
                        <div class="data-field" style="top: 35%; right: 31%;">${formValues.location || ''}</div>
                        <div class="data-field" style="top: 41.5%; right: 70%;">${formValues.time || ''}</div>
                        <div class="data-field" style="top: 41.5%; right: 30%;">${formValues.formattedHour || formValues.hour || ''}</div>
                        <div class="data-field" style="top: 48%; right: 50%;">${formValues.required || ''}</div>
                        
                        <!-- Assignees with individual positioning -->
                        ${formValues.assignee1 ? `<div class="assignee-item" style="position: absolute; top: 71%; right: 13%;">${formValues.assignee1}</div>` : ''}
                        ${formValues.assignee2 ? `<div class="assignee-item" style="position: absolute; top: 71%; right: 51%;">${formValues.assignee2}</div>` : ''}
                        ${formValues.assignee3 ? `<div class="assignee-item" style="position: absolute; top: 76%; right: 13%;">${formValues.assignee3}</div>` : ''}
                        ${formValues.assignee4 ? `<div class="assignee-item" style="position: absolute; top: 76%; right: 51%;">${formValues.assignee4}</div>` : ''}
                        ${formValues.assignee5 ? `<div class="assignee-item" style="position: absolute; top: 81%; right: 13%;">${formValues.assignee5}</div>` : ''}
                        ${formValues.assignee6 ? `<div class="assignee-item" style="position: absolute; top: 81%; right: 51%;">${formValues.assignee6}</div>` : ''}
                    </div>
                    </div>
                </div>
            </div>
        `;
        
        // Show the template result section
        templateResult.classList.add('visible');
        
        // Add event listeners for download buttons
        document.getElementById('downloadPdfBtn').addEventListener('click', downloadAsPdf);
        document.getElementById('downloadImgBtn').addEventListener('click', downloadAsImage);
        
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

// Print the template
function printTemplate() {
    const templateContainer = document.getElementById('templateContainer');
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <html>
        <head>
            <title>طباعة النموذج</title>
            <style>
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                    }
                }
                .template-container {
                    position: relative;
                }
                .template-image-container {
                    position: relative;
                }
                .template-image {
                    width: 100%;
                    max-width: 800px;
                    height: auto;
                }
                .data-overlay {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 100%;
                    height: 100%;
                }
                .data-field {
                    position: absolute;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    font-weight: bold;
                    background-color: transparent;
                }
                .assignee-item {
                    position: absolute;
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    background-color: transparent;
                }
            </style>
        </head>
        <body>
            ${templateContainer.outerHTML}
            <script>
                window.onload = function() {
                    window.print();
                    window.setTimeout(function() {
                        window.close();
                    }, 500);
                };
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Download as PDF
function downloadAsPdf() {
    const templateContainer = document.getElementById('templateContainer');
    
    // Show loading message
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'pdf-loading-msg';
    loadingMsg.textContent = 'جاري إنشاء ملف PDF...';
    loadingMsg.style.position = 'fixed';
    loadingMsg.style.top = '50%';
    loadingMsg.style.left = '50%';
    loadingMsg.style.transform = 'translate(-50%, -50%)';
    loadingMsg.style.background = 'rgba(0, 0, 0, 0.7)';
    loadingMsg.style.color = 'white';
    loadingMsg.style.padding = '20px';
    loadingMsg.style.borderRadius = '10px';
    loadingMsg.style.zIndex = '9999';
    document.body.appendChild(loadingMsg);
    
    // Use html2canvas to capture the template with fixed dimensions
    html2canvas(templateContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: 800, // Fixed width
        height: templateContainer.offsetHeight // Maintain aspect ratio
    }).then(canvas => {
        try {
            // Check if jsPDF is available in the window object
            if (typeof window.jspdf === 'undefined') {
                // Try to use jsPDF directly if available
                if (typeof jsPDF === 'undefined') {
                    alert('مكتبة jsPDF غير متوفرة. يرجى التحقق من اتصال الإنترنت وإعادة تحميل الصفحة.');
                    document.body.removeChild(loadingMsg);
                    return;
                }
                
                // Create a new jsPDF instance
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });
                
                // Calculate dimensions
                const imgData = canvas.toDataURL('image/png');
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = pageWidth - 20; // Margins
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                // Add the image to the PDF
                pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
                
                // Save the PDF
                pdf.save('نموذج_الإنتاج_الفني.pdf');
            } else {
                // Use window.jspdf if available
                const { jsPDF } = window.jspdf;
                
                // Create a new jsPDF instance
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });
                
                // Calculate dimensions
                const imgData = canvas.toDataURL('image/png');
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = pageWidth - 20; // Margins
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                // Add the image to the PDF
                pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
                
                // Save the PDF
                pdf.save('نموذج_الإنتاج_الفني.pdf');
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.');
        } finally {
            // Remove loading message
            document.body.removeChild(loadingMsg);
        }
    }).catch(error => {
        console.error('Error generating PDF:', error);
        alert('حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.');
        document.body.removeChild(loadingMsg);
    });
}

// Download as image
function downloadAsImage() {
    const templateContainer = document.getElementById('templateContainer');
    
    // Show loading message
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'img-loading-msg';
    loadingMsg.textContent = 'جاري إنشاء الصورة...';
    loadingMsg.style.position = 'fixed';
    loadingMsg.style.top = '50%';
    loadingMsg.style.left = '50%';
    loadingMsg.style.transform = 'translate(-50%, -50%)';
    loadingMsg.style.background = 'rgba(0, 0, 0, 0.7)';
    loadingMsg.style.color = 'white';
    loadingMsg.style.padding = '20px';
    loadingMsg.style.borderRadius = '10px';
    loadingMsg.style.zIndex = '9999';
    document.body.appendChild(loadingMsg);
    
    // Use html2canvas to capture the template with fixed dimensions
    html2canvas(templateContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: 800, // Fixed width
        height: templateContainer.offsetHeight // Maintain aspect ratio
    }).then(canvas => {
        try {
            // Create a download link
            const link = document.createElement('a');
            link.download = 'نموذج_الإنتاج_الفني.png';
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link); // Append to body to work in Firefox
            link.click();
            document.body.removeChild(link); // Clean up
        } catch (error) {
            console.error('Error downloading image:', error);
            alert('حدث خطأ أثناء حفظ الصورة. يرجى المحاولة مرة أخرى.');
        } finally {
            // Remove loading message
            document.body.removeChild(loadingMsg);
        }
    }).catch(error => {
        console.error('Error generating image:', error);
        alert('حدث خطأ أثناء إنشاء الصورة. يرجى المحاولة مرة أخرى.');
        document.body.removeChild(loadingMsg);
    });
}

// Function to handle assignee fields sequential enabling
function setupAssigneeFields() {
    // Get all assignee input fields
    const assigneeInputs = document.querySelectorAll('.assignees-inputs input[type="text"]');
    
    // Disable all except the first one
    assigneeInputs.forEach((input, index) => {
        if (index > 0) {
            input.disabled = true;
        }
    });
    
    // Add input event listeners to enable next field when text is entered
    assigneeInputs.forEach((input, index) => {
        if (index < assigneeInputs.length - 1) { // Skip the last one
            input.addEventListener('input', function() {
                // If current field has text, enable the next field
                if (this.value.trim() !== '') {
                    assigneeInputs[index + 1].disabled = false;
                } else {
                    // If current field is empty, disable all subsequent fields
                    for (let i = index + 1; i < assigneeInputs.length; i++) {
                        assigneeInputs[i].disabled = true;
                        assigneeInputs[i].value = ''; // Clear the value
                    }
                }
            });
        }
    });
}

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
    
    // Setup assignee fields sequential enabling
    setupAssigneeFields();
    
    // After loading saved data, we need to check if we should enable subsequent assignee fields
    const assigneeInputs = document.querySelectorAll('.assignees-inputs input[type="text"]');
    assigneeInputs.forEach((input, index) => {
        if (index > 0 && index < assigneeInputs.length) {
            // If the previous field has a value, enable this field
            if (assigneeInputs[index - 1].value.trim() !== '') {
                input.disabled = false;
            }
        }
    });
});
