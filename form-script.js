// DOM Elements
const mediaForm = document.getElementById('mediaForm');
const generateBtn = document.getElementById('generateBtn');
const backBtn = document.getElementById('backBtn');
const daySelect = document.getElementById('day');
const dateInput = document.getElementById('date');
const hijriDateInput = document.getElementById('hijriDate');
const templateResult = document.getElementById('templateResult');

// Function to show loading overlay with logo animation
function showLogoLoadingOverlay() {
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.id = 'templateLoadingOverlay';
    loadingOverlay.style.opacity = '0';
    
    // Create logo spinner
    const logoSpinner = document.createElement('div');
    logoSpinner.className = 'logo-spinner';
    
    // Create logo container
    const logoContainer = document.createElement('div');
    logoContainer.className = 'logo-container';
    
    // Create logo image
    const logoImg = document.createElement('img');
    logoImg.src = '/static/logo.png';
    logoImg.alt = 'شعار المركز الإعلامي';
    logoImg.className = 'logo-img';
    
    // Assemble the elements
    logoContainer.appendChild(logoImg);
    logoSpinner.appendChild(logoContainer);
    loadingOverlay.appendChild(logoSpinner);
    
    // Add to document
    document.body.appendChild(loadingOverlay);
    
    // Show with fade in
    setTimeout(() => {
        loadingOverlay.style.opacity = '1';
    }, 10);
    
    return loadingOverlay;
}

// Function to hide loading overlay
function hideLogoLoadingOverlay(overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => {
        document.body.removeChild(overlay);
    }, 500);
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

// Back button functionality
backBtn.addEventListener('click', () => {
    window.location.href = '/';
});

// Generate template with form data
generateBtn.addEventListener('click', () => {
    // Temporarily enable the day field for form submission
    daySelect.disabled = false;
    
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
        
        // Disable the day field again
        daySelect.disabled = true;
        return;
    }
    
    // Check Arabic validation
    if (typeof window.validateArabicFields === 'function') {
        if (!window.validateArabicFields()) {
            alert('الرجاء إدخال حروف عربية فقط في الحقول المطلوبة');
            
            // Disable the day field again
            daySelect.disabled = true;
            return;
        }
    }
    
    // Double check that all required fields are filled
    if (!areAllRequiredFieldsFilled()) {
        alert('الرجاء ملء جميع الحقول المطلوبة');
        
        // Disable the day field again
        daySelect.disabled = true;
        return;
    }
    
    // Get form data
    const formData = new FormData(mediaForm);
    const formValues = {};
    
    for (const [key, value] of formData.entries()) {
        formValues[key] = value;
    }
    
    // Make sure to get the day value even though the field is disabled
    formValues.day = daySelect.value;
    console.log('Day value:', formValues.day);
    
    // Format hour if available
    if (formValues.hour) {
        formValues.formattedHour = formatTime(formValues.hour);
    }
    
    // Show loading overlay
    const loadingOverlay = showLogoLoadingOverlay();
    
    // Wait a moment before showing the template
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
                        <div class="data-field" style="top: 28%; right: 31%; font-weight: bold;">${formValues.day || ''}</div>
                        <div class="data-field" style="top: 28%; right: 70%;">${formValues.hijriDate || ''}</div>
                        <div class="data-field" style="top: 35%; right: 31%;">${formValues.location || ''}</div>
                        <div class="data-field" style="top: 42%; right: 70%;">${formValues.time || ''}</div>
                        <div class="data-field" style="top: 42%; right: 30%;">${formValues.formattedHour || formValues.hour || ''}</div>
                        
                        <!-- Assignees with individual positioning -->
                        ${formValues.assignee1 ? `<div class="assignee-item" style="position: absolute; top: 71.5%; right: 13.5%;">${formValues.assignee1}</div>` : ''}
                        ${formValues.assignee2 ? `<div class="assignee-item" style="position: absolute; top: 71.5%; right: 51%;">${formValues.assignee2}</div>` : ''}
                        ${formValues.assignee3 ? `<div class="assignee-item" style="position: absolute; top: 76.5%; right: 13.5%;">${formValues.assignee3}</div>` : ''}
                        ${formValues.assignee4 ? `<div class="assignee-item" style="position: absolute; top: 76.5%; right: 51%;">${formValues.assignee4}</div>` : ''}
                        ${formValues.assignee5 ? `<div class="assignee-item" style="position: absolute; top: 81.5%; right: 13.5%;">${formValues.assignee5}</div>` : ''}
                        ${formValues.assignee6 ? `<div class="assignee-item" style="position: absolute; top: 81.5%; right: 51%;">${formValues.assignee6}</div>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        // Hide loading overlay
        hideLogoLoadingOverlay(loadingOverlay);
        
        // Show the template result section
        templateResult.classList.add('visible');
        
        // Add event listeners for download buttons
        document.getElementById('downloadPdfBtn').addEventListener('click', downloadAsPdf);
        document.getElementById('downloadImgBtn').addEventListener('click', downloadAsImage);
        
        // Scroll to the template result
        templateResult.scrollIntoView({ behavior: 'smooth' });
        
        // Reset form to default values
        mediaForm.reset();
        
        // Disable the day field again
        daySelect.disabled = true;
    }, 1500);
});

// Download as PDF
function downloadAsPdf() {
    const templateContainer = document.getElementById('templateContainer');
    
    // Show loading overlay
    const loadingOverlay = showLogoLoadingOverlay();
    
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
                    hideLogoLoadingOverlay(loadingOverlay);
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
            // Hide loading overlay
            hideLogoLoadingOverlay(loadingOverlay);
        }
    }).catch(error => {
        console.error('Error generating PDF:', error);
        alert('حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.');
        hideLogoLoadingOverlay(loadingOverlay);
    });
}

// Download as image
function downloadAsImage() {
    const templateContainer = document.getElementById('templateContainer');
    
    // Show loading overlay
    const loadingOverlay = showLogoLoadingOverlay();
    
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
            // Hide loading overlay
            hideLogoLoadingOverlay(loadingOverlay);
        }
    }).catch(error => {
        console.error('Error generating image:', error);
        alert('حدث خطأ أثناء إنشاء الصورة. يرجى المحاولة مرة أخرى.');
        hideLogoLoadingOverlay(loadingOverlay);
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
                } else if (field.type === 'checkbox') {
                    field.checked = value === 'on';
                } else {
                    field.value = value;
                }
            }
        }
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
