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
    
    // Set initial styles
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        opacity: 0;
        animation: fadeIn 0.5s ease-out forwards;
    `;
    
    // Create style element for animations
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
        
        @keyframes fadeOut {
            0% { opacity: 1; }
            100% { opacity: 0; visibility: hidden; }
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
        }
    `;
    document.head.appendChild(styleElement);
    
    // Create logo spinner
    const logoSpinner = document.createElement('div');
    logoSpinner.className = 'logo-spinner';
    logoSpinner.style.cssText = 'position: relative; width: 150px; height: 150px; display: flex; justify-content: center; align-items: center;';
    
    // Create spinner animation element
    const spinnerAnimation = document.createElement('div');
    spinnerAnimation.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 4px solid rgba(0, 0, 0, 0.05);
        border-top-color: #009CDE;
        border-bottom-color: #D4A62D;
        animation: spin 1.2s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite;
    `;
    logoSpinner.appendChild(spinnerAnimation);
    
    // Create logo container
    const logoContainer = document.createElement('div');
    logoContainer.className = 'logo-container';
    logoContainer.style.cssText = 'animation: pulse 2s ease-in-out infinite; transform-origin: center center;';
    
    // Create logo image
    const logoImg = document.createElement('img');
    logoImg.src = '/static/logo.png';
    logoImg.alt = 'شعار المركز الإعلامي';
    logoImg.className = 'logo-img';
    logoImg.style.cssText = 'width: 100px; height: auto; filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.1));';
    
    // Assemble the elements
    logoContainer.appendChild(logoImg);
    logoSpinner.appendChild(logoContainer);
    loadingOverlay.appendChild(logoSpinner);
    
    // Add to document
    document.body.appendChild(loadingOverlay);
    
    // Set up automatic removal after 3 seconds
    setTimeout(() => {
        loadingOverlay.style.animation = 'fadeOut 0.8s ease-in forwards';
        
        setTimeout(() => {
            if (loadingOverlay.parentNode) {
                loadingOverlay.parentNode.removeChild(loadingOverlay);
            }
        }, 800);
    }, 2500);
    
    // Failsafe removal
    setTimeout(() => {
        if (loadingOverlay.parentNode) {
            loadingOverlay.parentNode.removeChild(loadingOverlay);
        }
    }, 4000);
    
    return loadingOverlay;
}

// Function to hide loading overlay
function hideLogoLoadingOverlay(overlay) {
    if (!overlay) return;
    
    // Add fade-out animation
    overlay.style.animation = 'fadeOut 0.8s ease-in forwards';
    
    // Remove from DOM after animation completes
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }, 800);
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
    
    // Wait a moment before opening the new window
    setTimeout(() => {
        // Create a new window with the template
        const newWindow = window.open('', '_blank');
        
        // Write the HTML content to the new window
        newWindow.document.write(`
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
                <title>النموذج المولد</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700&family=Lateef&family=Reem+Kufi:wght@400;700&family=Scheherazade+New:wght@400;700&family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
                <style>
                    body {
                        font-family: 'Cairo', sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: #f5f9ff;
                        direction: rtl;
                    }
                    
                    .container {
                        max-width: 1000px;
                        margin: 0 auto;
                        background-color: white;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    }
                    
                    .template-header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    
                    .template-header h2 {
                        color: #009CDE;
                        font-size: 24px;
                        font-weight: bold;
                    }
                    
                    .template-actions {
                        display: flex;
                        justify-content: center;
                        gap: 10px;
                        margin: 15px 0;
                        flex-wrap: wrap;
                    }
                    
                    .action-btn {
                        padding: 10px 20px;
                        border: none;
                        border-radius: 10px;
                        font-size: 16px;
                        font-weight: 700;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        transition: all 0.3s ease;
                    }
                    
                    .help-btn {
                        background-color: #4CAF50;
                        color: white;
                    }
                    
                    .help-btn:hover {
                        background-color: #388E3C;
                    }
                    
                    .help-modal {
                        display: none;
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.7);
                        z-index: 1000;
                        justify-content: center;
                        align-items: center;
                    }
                    
                    .help-modal-content {
                        background-color: white;
                        padding: 20px;
                        border-radius: 10px;
                        max-width: 500px;
                        width: 90%;
                        max-height: 80vh;
                        overflow-y: auto;
                        direction: rtl;
                    }
                    
                    .help-modal-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 15px;
                    }
                    
                    .help-modal-close {
                        font-size: 24px;
                        cursor: pointer;
                        color: #666;
                    }
                    
                    .help-modal-title {
                        font-size: 20px;
                        font-weight: bold;
                        color: #009CDE;
                    }
                    
                    .help-style-example {
                        margin: 10px 0;
                        padding: 8px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                    }
                        background-color: #f44336;
                        color: white;
                    }
                    
                    .download-img-btn {
                        background-color: #2196f3;
                        color: white;
                    }
                    
                    .font-size-btn {
                        background-color: #4CAF50;
                        color: white;
                    }
                    
                    .font-family-btn {
                        background-color: #FF9800;
                        color: white;
                    }
                    
                    .font-size-btn {
                        background-color: #4CAF50;
                        color: white;
                    }
                    
                    .font-family-btn {
                        background-color: #FF9800;
                        color: white;
                    }
                    
                    .action-btn:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                    }
                    
                    /* Fixed size template container for all devices */
                    .template-container {
                        position: relative;
                        margin: 20px auto;
                        width: 800px;
                        max-width: 100%;
                        overflow-x: auto;
                    }
                    
                    .template-image-container {
                        position: relative;
                        width: 800px;
                        min-width: 800px; /* Force minimum width */
                    }
                    
                    .template-image {
                        width: 800px;
                        height: auto;
                        display: block;
                        border: 2px solid #009CDE;
                        border-radius: 5px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
                        font-family: 'Cairo', sans-serif;
                        font-size: 16px;
                        color: #000;
                        background-color: transparent;
                        padding: 3px 6px;
                        border-radius: 3px;
                    }
                    
                    .clickable {
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }
                    
                    .clickable:hover {
                        background-color: rgba(0, 156, 222, 0.1);
                    }
                    
                    .font-bold {
                        font-weight: bold;
                    }
                    
                    .font-normal {
                        font-size: 100%;
                    }
                    
                    .font-large {
                        font-size: 120%;
                    }
                    
                    .font-larger {
                        font-size: 140%;
                    }
                    
                    .font-underline {
                        text-decoration: underline;
                    }
                    
                    .font-color-primary {
                        color: #009CDE;
                    }
                    
                    .font-color-secondary {
                        color: #D4A62D;
                    }
                    
                    .font-color-red {
                        color: #E53935;
                    }
                    
                    .font-color-green {
                        color: #43A047;
                    }
                    
                    .text-align-right {
                        text-align: right;
                    }
                    
                    .text-align-center {
                        text-align: center;
                    }
                    
                    .text-align-left {
                        text-align: left;
                    }
                    
                    .font-family-cairo {
                        font-family: 'Cairo', sans-serif;
                    }
                    
                    .font-family-tajawal {
                        font-family: 'Tajawal', sans-serif;
                    }
                    
                    .font-family-amiri {
                        font-family: 'Amiri', serif;
                    }
                    
                    .font-family-scheherazade {
                        font-family: 'Scheherazade New', serif;
                    }
                    
                    .font-family-lateef {
                        font-family: 'Lateef', cursive;
                    }
                    
                    .font-family-reem-kufi {
                        font-family: 'Reem Kufi', sans-serif;
                    }
                    
                    .assignee-item {
                        position: absolute;
                        font-family: 'Cairo', sans-serif;
                        font-size: 14px;
                        background-color: transparent;
                        padding: 3px 6px;
                        border-radius: 3px;
                        text-align: center;
                    }
                    
                    /* Mobile specific styles */
                    @media (max-width: 820px) {
                        body {
                            padding: 10px;
                        }
                        
                        .container {
                            padding: 10px;
                        }
                        
                        /* Make container scrollable horizontally */
                        .template-container {
                            overflow-x: scroll;
                            -webkit-overflow-scrolling: touch;
                            padding-bottom: 15px; /* Space for scrollbar */
                        }
                    }
                    
                    @media print {
                        .template-actions {
                            display: none;
                        }
                        
                        body {
                            background-color: white;
                            padding: 0;
                        }
                        
                        .container {
                            box-shadow: none;
                            padding: 0;
                        }
                        
                        .template-header {
                            display: none;
                        }
                        
                        #style-tooltip {
                            display: none;
                        }
                    }
                </style>
                <!-- Include html2canvas library -->
                <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
                <!-- Include jsPDF library -->
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
            </head>
            <body>
                <div class="container">
                    <div class="template-header">
                        <h2>النموذج المولد</h2>
                        <div class="template-actions">
                            <button id="downloadPdfBtn" class="action-btn download-pdf-btn">
                                <i class="fas fa-file-pdf"></i> حفظ كـ PDF
                            </button>
                            <button id="downloadImgBtn" class="action-btn download-img-btn">
                                <i class="fas fa-image"></i> حفظ كصورة
                            </button>
                            <button id="fontSizeBtn" class="action-btn font-size-btn">
                                <i class="fas fa-text-height"></i> تغيير حجم الخط
                            </button>
                            <button id="fontFamilyBtn" class="action-btn font-family-btn">
                                <i class="fas fa-font"></i> تغيير نوع الخط
                            </button>
                        </div>
                    </div>
                    <div class="template-container" id="templateContainer">
                        <div class="template-image-container">
                            <img src="/static/tamplet1.jpg" alt="نموذج الإنتاج الفني" class="template-image">
                            
                            <!-- Overlay form data on the template -->
                            <div class="data-overlay">
                                <!-- You can adjust these positions as needed -->
                                <div class="data-field font-family-cairo font-normal" style="top: 20.5%; right: 30%;">${formValues.subject || ''}</div>
                                <div class="data-field font-family-cairo font-normal" style="top: 28%; right: 31%; font-weight: bold;">${formValues.day || ''}</div>
                                <div class="data-field font-family-cairo font-normal" style="top: 28%; right: 70%;">${formValues.hijriDate || ''}</div>
                                <div class="data-field font-family-cairo font-normal" style="top: 35%; right: 31%;">${formValues.location || ''}</div>
                                <div class="data-field font-family-cairo font-normal" style="top: 42%; right: 70%;">${formValues.time || ''}</div>
                                <div class="data-field font-family-cairo font-normal" style="top: 42%; right: 30%;">${formValues.formattedHour || formValues.hour || ''}</div>
                                
                                <!-- Assignees with individual positioning -->
                                ${formValues.assignee1 ? `<div class="assignee-item font-family-cairo font-normal" style="position: absolute; top: 71.5%; right: 13.5%;">${formValues.assignee1}</div>` : ''}
                                ${formValues.assignee2 ? `<div class="assignee-item font-family-cairo font-normal" style="position: absolute; top: 71.5%; right: 51%;">${formValues.assignee2}</div>` : ''}
                                ${formValues.assignee3 ? `<div class="assignee-item font-family-cairo font-normal" style="position: absolute; top: 76.5%; right: 13.5%;">${formValues.assignee3}</div>` : ''}
                                ${formValues.assignee4 ? `<div class="assignee-item font-family-cairo font-normal" style="position: absolute; top: 76.5%; right: 51%;">${formValues.assignee4}</div>` : ''}
                                ${formValues.assignee5 ? `<div class="assignee-item font-family-cairo font-normal" style="position: absolute; top: 81.5%; right: 13.5%;">${formValues.assignee5}</div>` : ''}
                                ${formValues.assignee6 ? `<div class="assignee-item font-family-cairo font-normal" style="position: absolute; top: 81.5%; right: 51%;">${formValues.assignee6}</div>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                <script src="/static/movable-fields.js"></script>
                <script>
                    // Initialize jsPDF when it's loaded
                    window.addEventListener('DOMContentLoaded', function() {
                        if (typeof window.jspdf === 'undefined' && typeof jsPDF !== 'undefined') {
                            window.jspdf = { jsPDF: jsPDF };
                        }
                        
                        // Add event listeners for buttons
                        document.getElementById('downloadPdfBtn').addEventListener('click', downloadAsPdf);
                        document.getElementById('downloadImgBtn').addEventListener('click', downloadAsImage);
                        document.getElementById('fontSizeBtn').addEventListener('click', changeFontSize);
                        document.getElementById('fontFamilyBtn').addEventListener('click', changeFontFamily);
                        
                        // Make fields movable with directional arrows
                        makeFieldsMovable();
                        
                        // Add reset positions button
                        addResetPositionsButton();
                        
                        // Function to change font size for all text elements
                        function changeFontSize() {
                            // Get all data fields and assignee items
                            const textElements = document.querySelectorAll('.data-field, .assignee-item');
                            
                            // Current font size classes
                            const fontSizeClasses = ['font-normal', 'font-large', 'font-larger'];
                            
                            // Find current font size class
                            let currentSizeIndex = -1;
                            
                            // Check the first element to determine current size
                            if (textElements.length > 0) {
                                for (let i = 0; i < fontSizeClasses.length; i++) {
                                    if (textElements[0].classList.contains(fontSizeClasses[i])) {
                                        currentSizeIndex = i;
                                        break;
                                    }
                                }
                            }
                            
                            // Calculate next size index
                            const nextSizeIndex = (currentSizeIndex + 1) % fontSizeClasses.length;
                            
                            // Remove current size class and add next size class to all elements
                            textElements.forEach(element => {
                                // Remove all font size classes
                                fontSizeClasses.forEach(cls => {
                                    element.classList.remove(cls);
                                });
                                
                                // Add next size class
                                element.classList.add(fontSizeClasses[nextSizeIndex]);
                            });
                            
                            // Show tooltip with current size
                            const sizeNames = {
                                'font-normal': 'حجم عادي',
                                'font-large': 'حجم كبير',
                                'font-larger': 'حجم أكبر'
                            };
                            
                            showTooltip(sizeNames[fontSizeClasses[nextSizeIndex]]);
                        }
                        
                        // Function to change font family for all text elements
                        function changeFontFamily() {
                            // Get all data fields and assignee items
                            const textElements = document.querySelectorAll('.data-field, .assignee-item');
                            
                            // Font family classes
                            const fontFamilyClasses = [
                                'font-family-cairo',
                                'font-family-tajawal',
                                'font-family-amiri',
                                'font-family-scheherazade',
                                'font-family-lateef',
                                'font-family-reem-kufi'
                            ];
                            
                            // Find current font family class
                            let currentFamilyIndex = -1;
                            
                            // Check the first element to determine current family
                            if (textElements.length > 0) {
                                for (let i = 0; i < fontFamilyClasses.length; i++) {
                                    if (textElements[0].classList.contains(fontFamilyClasses[i])) {
                                        currentFamilyIndex = i;
                                        break;
                                    }
                                }
                            }
                            
                            // Calculate next family index
                            const nextFamilyIndex = (currentFamilyIndex + 1) % fontFamilyClasses.length;
                            
                            // Remove current family class and add next family class to all elements
                            textElements.forEach(element => {
                                // Remove all font family classes
                                fontFamilyClasses.forEach(cls => {
                                    element.classList.remove(cls);
                                });
                                
                                // Add next family class
                                element.classList.add(fontFamilyClasses[nextFamilyIndex]);
                            });
                            
                            // Show tooltip with current family
                            const familyNames = {
                                'font-family-cairo': 'خط القاهرة',
                                'font-family-tajawal': 'خط تجوال',
                                'font-family-amiri': 'خط أميري',
                                'font-family-scheherazade': 'خط شهرزاد',
                                'font-family-lateef': 'خط لطيف',
                                'font-family-reem-kufi': 'خط ريم كوفي'
                            };
                            
                            showTooltip(familyNames[fontFamilyClasses[nextFamilyIndex]]);
                        }
                        
                        // Function to show tooltip
                        function showTooltip(text) {
                            // Create or update tooltip
                            let tooltip = document.getElementById('style-tooltip');
                            if (!tooltip) {
                                tooltip = document.createElement('div');
                                tooltip.id = 'style-tooltip';
                                tooltip.style.position = 'fixed';
                                tooltip.style.padding = '5px 10px';
                                tooltip.style.backgroundColor = '#333';
                                tooltip.style.color = 'white';
                                tooltip.style.borderRadius = '4px';
                                tooltip.style.fontSize = '14px';
                                tooltip.style.zIndex = '1000';
                                tooltip.style.opacity = '0';
                                tooltip.style.transition = 'opacity 0.3s';
                                tooltip.style.top = '50%';
                                tooltip.style.left = '50%';
                                tooltip.style.transform = 'translate(-50%, -50%)';
                                document.body.appendChild(tooltip);
                            }
                            
                            // Show tooltip with text
                            tooltip.textContent = text;
                            tooltip.style.opacity = '1';
                            
                            // Hide tooltip after 1.5 seconds
                            setTimeout(() => {
                                tooltip.style.opacity = '0';
                            }, 1500);
                        }
                        
                        // Ensure proper sizing on mobile devices
                        const templateContainer = document.getElementById('templateContainer');
                        const templateImageContainer = templateContainer.querySelector('.template-image-container');
                        
                        // Force scrolling to the right (RTL layout) to show the beginning of the template
                        if (templateContainer.scrollWidth > templateContainer.clientWidth) {
                            templateContainer.scrollLeft = templateContainer.scrollWidth;
                        }
                    });
                    
                    // Function to change font style when clicking on text
                    function changeFontStyle(element) {
                        // Array of possible style classes
                        const styleClasses = [
                            'font-bold',
                            'font-large',
                            'font-larger',
                            'font-underline',
                            'font-color-primary',
                            'font-color-secondary',
                            'font-color-red',
                            'font-color-green',
                            'text-align-right',
                            'text-align-center',
                            'text-align-left',
                            'font-family-cairo',
                            'font-family-tajawal',
                            'font-family-amiri',
                            'font-family-scheherazade',
                            'font-family-lateef',
                            'font-family-reem-kufi'
                        ];
                        
                        // Get current style index or start at -1
                        let currentIndex = -1;
                        
                        // Find which style is currently applied
                        for (let i = 0; i < styleClasses.length; i++) {
                            if (element.classList.contains(styleClasses[i])) {
                                currentIndex = i;
                                break;
                            }
                        }
                        
                        // Remove current style if any
                        if (currentIndex >= 0) {
                            element.classList.remove(styleClasses[currentIndex]);
                        }
                        
                        // Apply next style in the list
                        const nextIndex = (currentIndex + 1) % styleClasses.length;
                        element.classList.add(styleClasses[nextIndex]);
                        
                        // Show a tooltip with the current style name
                        const styleNames = {
                            'font-bold': 'خط عريض',
                            'font-large': 'خط كبير',
                            'font-larger': 'خط أكبر',
                            'font-underline': 'خط تحته',
                            'font-color-primary': 'لون أزرق',
                            'font-color-secondary': 'لون ذهبي',
                            'font-color-red': 'لون أحمر',
                            'font-color-green': 'لون أخضر',
                            'text-align-right': 'محاذاة لليمين',
                            'text-align-center': 'محاذاة للوسط',
                            'text-align-left': 'محاذاة لليسار',
                            'font-family-cairo': 'خط القاهرة',
                            'font-family-tajawal': 'خط تجوال',
                            'font-family-amiri': 'خط أميري',
                            'font-family-scheherazade': 'خط شهرزاد',
                            'font-family-lateef': 'خط لطيف',
                            'font-family-reem-kufi': 'خط ريم كوفي'
                        };
                        
                        // Create or update tooltip
                        let tooltip = document.getElementById('style-tooltip');
                        if (!tooltip) {
                            tooltip = document.createElement('div');
                            tooltip.id = 'style-tooltip';
                            tooltip.style.position = 'fixed';
                            tooltip.style.padding = '5px 10px';
                            tooltip.style.backgroundColor = '#333';
                            tooltip.style.color = 'white';
                            tooltip.style.borderRadius = '4px';
                            tooltip.style.fontSize = '14px';
                            tooltip.style.zIndex = '1000';
                            tooltip.style.opacity = '0';
                            tooltip.style.transition = 'opacity 0.3s';
                            document.body.appendChild(tooltip);
                        }
                        
                        // Position and show tooltip
                        const rect = element.getBoundingClientRect();
                        tooltip.style.top = (rect.top - 30) + 'px';
                        tooltip.style.right = (rect.right - rect.width/2) + 'px';
                        tooltip.textContent = styleNames[styleClasses[nextIndex]];
                        tooltip.style.opacity = '1';
                        
                        // Hide tooltip after 1.5 seconds
                        setTimeout(() => {
                            tooltip.style.opacity = '0';
                        }, 1500);
                    }
                    
                    // Download as PDF
                    function downloadAsPdf() {
                        const templateContainer = document.getElementById('templateContainer');
                        
                        // Show loading message
                        const loadingMsg = document.createElement('div');
                        loadingMsg.style.position = 'fixed';
                        loadingMsg.style.top = '0';
                        loadingMsg.style.left = '0';
                        loadingMsg.style.width = '100%';
                        loadingMsg.style.padding = '10px';
                        loadingMsg.style.backgroundColor = '#009CDE';
                        loadingMsg.style.color = 'white';
                        loadingMsg.style.textAlign = 'center';
                        loadingMsg.style.zIndex = '9999';
                        loadingMsg.textContent = 'جاري إنشاء ملف PDF...';
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
                                // Hide loading message
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
                        loadingMsg.style.position = 'fixed';
                        loadingMsg.style.top = '0';
                        loadingMsg.style.left = '0';
                        loadingMsg.style.width = '100%';
                        loadingMsg.style.padding = '10px';
                        loadingMsg.style.backgroundColor = '#009CDE';
                        loadingMsg.style.color = 'white';
                        loadingMsg.style.textAlign = 'center';
                        loadingMsg.style.zIndex = '9999';
                        loadingMsg.textContent = 'جاري إنشاء الصورة...';
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
                                // Hide loading message
                                document.body.removeChild(loadingMsg);
                            }
                        }).catch(error => {
                            console.error('Error generating image:', error);
                            alert('حدث خطأ أثناء إنشاء الصورة. يرجى المحاولة مرة أخرى.');
                            document.body.removeChild(loadingMsg);
                        });
                    }
                </script>
            </body>
            </html>
        `);
        
        // Close the document to finish loading
        newWindow.document.close();
        
        // Hide loading overlay
        hideLogoLoadingOverlay(loadingOverlay);
        
        // Reset form to default values
        mediaForm.reset();
        
        // Disable the day field again
        daySelect.disabled = true;
    }, 1500);
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
