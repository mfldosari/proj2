// Function to generate template
function generateTemplate() {
    console.log('Generate template function called');
    
    // Get form elements
    const mediaForm = document.getElementById('mediaForm');
    const daySelect = document.getElementById('day');
    
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
    
    // Check that at least one assignee is selected
    if (!isAtLeastOneAssigneeSelected()) {
        alert('الرجاء اختيار مكلف واحد على الأقل');
        
        // Highlight the assignee selects
        const assigneeSelects = document.querySelectorAll('.assignee-select');
        assigneeSelects.forEach(select => {
            select.classList.add('error');
            select.addEventListener('change', function() {
                if (this.value) {
                    assigneeSelects.forEach(s => s.classList.remove('error'));
                }
            }, { once: true });
        });
        
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
    
    // Get checkbox values for the new section
    formValues.audio = document.getElementById('audio').checked;
    formValues.video = document.getElementById('video').checked;
    formValues.photo = document.getElementById('photo').checked;
    
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
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-bottom: 15px;
                        border-bottom: 2px solid #009CDE;
                    }
                    
                    .logo {
                        width: 100px;
                    }
                    
                    .title {
                        text-align: center;
                        flex-grow: 1;
                    }
                    
                    .title h1 {
                        color: #003459;
                        margin: 0;
                        font-size: 24px;
                    }
                    
                    .title h2 {
                        color: #009CDE;
                        margin: 5px 0 0;
                        font-size: 18px;
                    }
                    
                    .template-content {
                        position: relative;
                        margin-bottom: 20px;
                    }
                    
                    .template-image-container {
                        position: relative;
                        width: 100%;
                        margin-bottom: 20px;
                    }
                    
                    .template-image {
                        width: 100%;
                        height: auto;
                        display: block;
                        border-radius: 5px;
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
                        font-size: 16px;
                        color: #000;
                        background-color: transparent;
                    }
                    
                    .assignee-item {
                        position: absolute;
                        background-color: transparent;
                        font-size: 16px;
                        color: #000;
                    }
                    
                    .template-actions {
                        display: flex;
                        justify-content: center;
                        gap: 10px;
                        margin-top: 20px;
                    }
                    
                    .action-btn {
                        background-color: #009CDE;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-family: 'Cairo', sans-serif;
                        font-size: 14px;
                        display: flex;
                        align-items: center;
                        gap: 5px;
                    }
                    
                    .action-btn:hover {
                        background-color: #0078a8;
                    }
                    
                    .action-btn i {
                        font-size: 16px;
                    }
                    
                    .print-btn {
                        background-color: #4CAF50;
                    }
                    
                    .pdf-btn {
                        background-color: #FF5722;
                    }
                    
                    .img-btn {
                        background-color: #673AB7;
                    }
                    
                    .directional-controls {
                        display: flex;
                        justify-content: center;
                        gap: 5px;
                        margin-top: 10px;
                    }
                    
                    .direction-btn {
                        background-color: #f0f0f0;
                        border: 1px solid #ddd;
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                    }
                    
                    .direction-btn:hover {
                        background-color: #e0e0e0;
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
                    
                    .tooltip {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background-color: rgba(0, 0, 0, 0.8);
                        color: white;
                        padding: 10px 20px;
                        border-radius: 5px;
                        font-size: 16px;
                        z-index: 1000;
                        opacity: 0;
                        transition: opacity 0.3s;
                    }
                    
                    .style-controls {
                        display: flex;
                        justify-content: center;
                        gap: 10px;
                        margin-bottom: 15px;
                        padding: 10px;
                        background-color: #f9f9f9;
                        border-radius: 5px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    }
                    
                    .style-btn {
                        background-color: #f0f0f0;
                        border: 1px solid #ddd;
                        padding: 8px 15px;
                        border-radius: 5px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 5px;
                        transition: all 0.2s ease;
                    }
                    
                    .style-btn:hover {
                        background-color: #e0e0e0;
                    }
                    
                    .img-btn {
                        background-color: #673AB7;
                        color: white;
                        border: none;
                    }
                    
                    .img-btn:hover {
                        background-color: #5e35b1;
                    }
                    
                    .reset-btn {
                        background-color: #ff9800;
                        color: white;
                    }
                    
                    .reset-btn:hover {
                        background-color: #e68a00;
                    }
                    
                    .requirement-icon {
                        position: absolute;
                        font-size: 50px;
                        color: #009CDE;
                        font-weight: bold;
                    }
                    
                    @media print {
                        .style-controls {
                            display: none !important;
                        }
                        
                        body {
                            background-color: white;
                            padding: 0;
                        }
                        
                        .container {
                            box-shadow: none;
                            padding: 0;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="template-header">
                        <img src="/static/logo.png" alt="شعار المركز الإعلامي" class="logo">
                        <div class="title">
                            <h1>المركز الإعلامي</h1>
                            <h2>الإنتاج الفني</h2>
                        </div>
                    </div>
                    
                    <!-- Style controls at the top -->
                    <div class="style-controls">
                        <button id="fontSizeBtn" class="style-btn">
                            <i class="fas fa-text-height"></i> تغيير حجم الخط
                        </button>
                        <button id="fontFamilyBtn" class="style-btn">
                            <i class="fas fa-font"></i> تغيير نوع الخط
                        </button>
                        <button id="downloadImgBtn" class="action-btn img-btn">
                            <i class="fas fa-image"></i> تحميل صورة
                        </button>
                    </div>
                    
                    <div class="template-content">
                        <div class="template-image-container">
                            <img src="tamplet1.jpg" alt="نموذج الإنتاج الفني" class="template-image">
                            
                            <div class="data-overlay">
                                <div class="data-field font-family-cairo font-normal" style="top: 20.5%; right: 30%;">${formValues.subject || ''}</div>
                                <div class="data-field font-family-cairo font-normal" style="top: 28%; right: 31%; font-weight: bold;">${formValues.day || ''}</div>
                                <div class="data-field font-family-cairo font-normal" style="top: 28%; right: 70%;">${document.getElementById('hijriDateText').textContent.replace('التاريخ الهجري: ', '') || ''}</div>
                                <div class="data-field font-family-cairo font-normal" style="top: 35%; right: 31%;">${formValues.location || ''}</div>
                                <div class="data-field font-family-cairo font-normal" style="top: 42%; right: 70%;">${formValues.hour ? formatTime(formValues.hour) : ''}</div>
                                <div class="data-field font-family-cairo font-normal" style="top: 42%; right: 30%;">${formValues.time || ''}</div>
                                
                                <!-- Requirements section -->
                                ${formValues.audio ? '<div class="requirement-icon" style="top: 56.5%; right: 64.5%;">✓</div>' : ''}
                                ${formValues.video ? '<div class="requirement-icon" style="top: 56.5%; right: 43%;">✓</div>' : ''}
                                ${formValues.photo ? '<div class="requirement-icon" style="top: 56.5%; right: 15.5%;">✓</div>' : ''}
                                
                                <!-- Assignees with individual positioning -->
                                ${formValues.assignee1 ? `<div class="assignee-item font-family-cairo font-normal" style="position: absolute; top: 71.5%; right: 13.5%; min-width: 150px;">${formValues.assignee1}</div>` : ''}
                                ${formValues.assignee2 ? `<div class="assignee-item font-family-cairo font-normal" style="position: absolute; top: 71.5%; right: 51%; min-width: 150px;">${formValues.assignee2}</div>` : ''}
                                ${formValues.assignee3 ? `<div class="assignee-item font-family-cairo font-normal" style="position: absolute; top: 76.5%; right: 13.5%; min-width: 150px;">${formValues.assignee3}</div>` : ''}
                                ${formValues.assignee4 ? `<div class="assignee-item font-family-cairo font-normal" style="position: absolute; top: 76.5%; right: 51%; min-width: 150px;">${formValues.assignee4}</div>` : ''}
                                ${formValues.assignee5 ? `<div class="assignee-item font-family-cairo font-normal" style="position: absolute; top: 81.5%; right: 13.5%; min-width: 150px;">${formValues.assignee5}</div>` : ''}
                                ${formValues.assignee6 ? `<div class="assignee-item font-family-cairo font-normal" style="position: absolute; top: 81.5%; right: 51%; min-width: 150px;">${formValues.assignee6}</div>` : ''}
                            </div>
                        </div>
                    </div>
                    
                    <!-- No buttons at the bottom -->
                </div>
                
                <!-- Include html2canvas and jsPDF libraries -->
                <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
                <script>
                    // Initialize jsPDF when it's loaded
                    window.addEventListener('DOMContentLoaded', function() {
                        if (typeof window.jspdf === 'undefined' && typeof jsPDF !== 'undefined') {
                            window.jspdf = { jsPDF: jsPDF };
                        }
                        
                        // Add event listeners for buttons
                        document.getElementById('downloadImgBtn').addEventListener('click', downloadAsImage);
                        document.getElementById('fontSizeBtn').addEventListener('click', changeFontSize);
                        document.getElementById('fontFamilyBtn').addEventListener('click', changeFontFamily);
                        
                        // Function to change font size for all text elements
                        function changeFontSize() {
                            // Get all data fields and assignee items
                            const textElements = document.querySelectorAll('.data-field, .assignee-item');
                            
                            // Current font size classes
                            const fontSizeClasses = ['font-normal', 'font-large', 'font-larger'];
                            
                            // Find current font size class
                            let currentClassIndex = 0;
                            if (textElements.length > 0) {
                                const firstElement = textElements[0];
                                for (let i = 0; i < fontSizeClasses.length; i++) {
                                    if (firstElement.classList.contains(fontSizeClasses[i])) {
                                        currentClassIndex = i;
                                        break;
                                    }
                                }
                            }
                            
                            // Calculate next class index
                            const nextClassIndex = (currentClassIndex + 1) % fontSizeClasses.length;
                            
                            // Update all elements
                            textElements.forEach(element => {
                                // Remove all font size classes
                                fontSizeClasses.forEach(cls => {
                                    element.classList.remove(cls);
                                });
                                
                                // Add the next font size class
                                element.classList.add(fontSizeClasses[nextClassIndex]);
                            });
                            
                            // Show tooltip with the current font size
                            const fontSizeNames = {
                                'font-normal': 'عادي',
                                'font-large': 'كبير',
                                'font-larger': 'أكبر'
                            };
                            
                            showTooltip(fontSizeNames[fontSizeClasses[nextClassIndex]]);
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
                            let currentClassIndex = 0;
                            if (textElements.length > 0) {
                                const firstElement = textElements[0];
                                for (let i = 0; i < fontFamilyClasses.length; i++) {
                                    if (firstElement.classList.contains(fontFamilyClasses[i])) {
                                        currentClassIndex = i;
                                        break;
                                    }
                                }
                            }
                            
                            // Calculate next class index
                            const nextClassIndex = (currentClassIndex + 1) % fontFamilyClasses.length;
                            
                            // Update all elements
                            textElements.forEach(element => {
                                // Remove all font family classes
                                fontFamilyClasses.forEach(cls => {
                                    element.classList.remove(cls);
                                });
                                
                                // Add the next font family class
                                element.classList.add(fontFamilyClasses[nextClassIndex]);
                            });
                            
                            // Show tooltip with the current font family
                            const fontFamilyNames = {
                                'font-family-cairo': 'القاهرة',
                                'font-family-tajawal': 'تجوال',
                                'font-family-amiri': 'أميري',
                                'font-family-scheherazade': 'شهرزاد',
                                'font-family-lateef': 'لطيف',
                                'font-family-reem-kufi': 'ريم كوفي'
                            };
                            
                            showTooltip(fontFamilyNames[fontFamilyClasses[nextClassIndex]]);
                        }
                        
                        // Function to show tooltip
                        function showTooltip(text) {
                            // Create tooltip if it doesn't exist
                            let tooltip = document.querySelector('.tooltip');
                            if (!tooltip) {
                                tooltip = document.createElement('div');
                                tooltip.className = 'tooltip';
                                document.body.appendChild(tooltip);
                            }
                            
                            // Set tooltip text and show it
                            tooltip.textContent = text;
                            tooltip.style.opacity = '1';
                            
                            // Hide tooltip after 1.5 seconds
                            setTimeout(() => {
                                tooltip.style.opacity = '0';
                            }, 1500);
                        }
                        
                        // Function to download as PDF
                        function downloadAsPDF() {
                            const { jsPDF } = window.jspdf;
                            
                            // Hide buttons before capturing
                            const actions = document.querySelector('.template-actions');
                            const styleControls = document.querySelector('.style-controls');
                            const originalActionsDisplay = actions.style.display;
                            const originalStyleControlsDisplay = styleControls.style.display;
                            actions.style.display = 'none';
                            styleControls.style.display = 'none';
                            
                            // Get the template content
                            const content = document.querySelector('.template-content');
                            
                            // Use html2canvas to capture the content
                            html2canvas(content, {
                                scale: 2,
                                useCORS: true,
                                allowTaint: true,
                                backgroundColor: null
                            }).then(canvas => {
                                // Create PDF
                                const imgData = canvas.toDataURL('image/png');
                                const pdf = new jsPDF({
                                    orientation: 'portrait',
                                    unit: 'mm',
                                    format: 'a4'
                                });
                                
                                // Calculate dimensions to fit the page
                                const imgWidth = 210; // A4 width in mm
                                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                                
                                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                                pdf.save('نموذج_الإنتاج_الفني.pdf');
                                
                                // Restore buttons
                                actions.style.display = originalActionsDisplay;
                                styleControls.style.display = originalStyleControlsDisplay;
                            });
                        }
                        
                        // Function to download as image
                        function downloadAsImage() {
                            // Hide buttons before capturing
                            const styleControls = document.querySelector('.style-controls');
                            const originalStyleControlsDisplay = styleControls.style.display;
                            styleControls.style.display = 'none';
                            
                            // Get the template content
                            const content = document.querySelector('.template-content');
                            
                            // Use html2canvas to capture the content
                            html2canvas(content, {
                                scale: 2,
                                useCORS: true,
                                allowTaint: true,
                                backgroundColor: null
                            }).then(canvas => {
                                // Create download link
                                const link = document.createElement('a');
                                link.download = 'نموذج_الإنتاج_الفني.png';
                                link.href = canvas.toDataURL('image/png');
                                link.click();
                                
                                // Restore buttons
                                styleControls.style.display = originalStyleControlsDisplay;
                            });
                        }
                    });
                </script>
            </body>
            </html>
        `);
        
        // Close the document to finish loading
        newWindow.document.close();
        
        // Hide loading overlay
        setTimeout(() => {
            if (loadingOverlay.parentNode) {
                loadingOverlay.parentNode.removeChild(loadingOverlay);
            }
        }, 1500);
        
        // Reset form to default values
        mediaForm.reset();
        
        // Disable the day field again
        daySelect.disabled = true;
    }, 1500);
}

// Function to check if at least one assignee is selected
function isAtLeastOneAssigneeSelected() {
    const assigneeSelects = document.querySelectorAll('.assignee-select');
    return Array.from(assigneeSelects).some(select => select.value.trim() !== '');
}

// Function to format time
function formatTime(timeString) {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}

// Function to show loading overlay with logo animation
function showLogoLoadingOverlay() {
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
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
    
    return loadingOverlay;
}
