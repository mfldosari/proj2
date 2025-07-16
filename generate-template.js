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
        formValues.hour = formatTime(formValues.hour);
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
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                <title>النموذج المولد</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Aref+Ruqaa:wght@400;700&family=Cairo:wght@400;600;700&family=Lateef&family=Noto+Kufi+Arabic:wght@400;700&family=Reem+Kufi:wght@400;700&family=Scheherazade+New:wght@400;700&family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
                <style>
                    html {
                        font-size: 16px;
                        -webkit-text-size-adjust: 100%;
                        -moz-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                        text-size-adjust: 100%;
                    }
                    
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
                    
                    .template-content-wrapper {
                        width: 100%;
                        overflow-x: auto;
                        -webkit-overflow-scrolling: touch;
                        margin: 0 auto;
                        padding-bottom: 10px;
                    }
                    
                    .template-content {
                        position: relative;
                        margin-bottom: 20px;
                        width: 800px;
                        margin: 0 auto 20px;
                    }
                    
                    .template-image-container {
                        position: relative;
                        width: 800px;
                        margin-bottom: 20px;
                    }
                    
                    .template-image {
                        width: 800px;
                        height: auto;
                        display: block;
                        border-radius: 5px;
                    }
                    
                    .data-overlay {
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 800px;
                        height: 100%;
                    }
                    
                    .data-field, .assignee-item {
                        position: absolute;
                        font-size: 16px;
                        color: #000;
                        background-color: transparent;
                        padding: 5px;
                        border-radius: 3px;
                        transition: background-color 0.3s;
                        cursor: pointer;
                        /* Prevent text size adjustment on mobile */
                        -webkit-text-size-adjust: 100% !important;
                        -moz-text-size-adjust: 100% !important;
                        -ms-text-size-adjust: 100% !important;
                        text-size-adjust: 100% !important;
                    }
                    
                    .data-field:hover, .assignee-item:hover {
                        background-color: rgba(0, 156, 222, 0.1);
                    }
                    
                    .data-field.active, .assignee-item.active {
                        background-color: rgba(0, 156, 222, 0.2);
                        outline: 2px dashed #009CDE;
                        position: relative;
                    }
                    
                    .data-field.active::after, .assignee-item.active::after {
                        position: absolute;
                        bottom: -25px;
                        right: 0;
                        font-size: 12px;
                        background-color: rgba(0, 0, 0, 0.7);
                        color: white;
                        padding: 3px 8px;
                        border-radius: 3px;
                        white-space: nowrap;
                        z-index: 20;
                    }
                    
                    .item-controls {
                        display: none;
                        position: absolute;
                        top: 100%;
                        right: 0;
                        background-color: rgba(255, 255, 255, 0.9);
                        border-radius: 3px;
                        padding: 3px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                        z-index: 10;
                    }
                    
                    .data-field.active .item-controls, .assignee-item.active .item-controls {
                        display: flex;
                    }
                    
                    .item-btn {
                        width: 24px;
                        height: 24px;
                        border: 1px solid #ddd;
                        background-color: white;
                        border-radius: 3px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        margin: 2px;
                        font-size: 12px;
                        color: #666;
                        transition: all 0.2s;
                    }
                    
                    .item-btn:hover {
                        background-color: #f0f0f0;
                        color: #009CDE;
                    }
                    
                    .item-btn:active {
                        transform: scale(0.95);
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
                        align-items: center;
                        gap: 8px;
                        margin-bottom: 15px;
                        padding: 10px;
                        background-color: #f0f0f0;
                        border-radius: 5px;
                        flex-wrap: wrap;
                    }
                    
                    .direction-label {
                        margin-right: 10px;
                        font-weight: bold;
                        color: #333;
                    }
                    
                    .direction-btn {
                        background-color: #fff;
                        border: 1px solid #ddd;
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }
                    
                    .direction-btn:hover {
                        background-color: #e0e0e0;
                    }
                    
                    .direction-btn:active {
                        transform: scale(0.95);
                    }
                    
                    .reset-btn {
                        background-color: #ff9800;
                        color: white;
                        border: none;
                    }
                    
                    .reset-btn:hover {
                        background-color: #e68a00;
                    }
                    
                    .element-selector {
                        padding: 8px;
                        border-radius: 4px;
                        border: 1px solid #ddd;
                        font-family: 'Cairo', sans-serif;
                        min-width: 150px;
                    }
                    
                    .font-normal {
                        font-size: 16px !important;
                        -webkit-text-size-adjust: 100%;
                        -moz-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                        text-size-adjust: 100%;
                    }
                    
                    .font-large {
                        font-size: 19px !important;
                        -webkit-text-size-adjust: 100%;
                        -moz-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                        text-size-adjust: 100%;
                    }
                    
                    .font-larger {
                        font-size: 22px !important;
                        -webkit-text-size-adjust: 100%;
                        -moz-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                        text-size-adjust: 100%;
                    }
                    
                    .font-x-large {
                        font-size: 25px !important;
                        -webkit-text-size-adjust: 100%;
                        -moz-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                        text-size-adjust: 100%;
                    }
                    
                    .font-xx-large {
                        font-size: 28px !important;
                        -webkit-text-size-adjust: 100%;
                        -moz-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                        text-size-adjust: 100%;
                    }
                    
                    .font-family-cairo {
                        font-family: 'Cairo', sans-serif !important;
                    }
                    
                    .font-family-tajawal {
                        font-family: 'Tajawal', sans-serif !important;
                    }
                    
                    .font-family-amiri {
                        font-family: 'Amiri', serif !important;
                    }
                    
                    .font-family-scheherazade {
                        font-family: 'Scheherazade New', serif !important;
                    }
                    
                    .font-family-lateef {
                        font-family: 'Lateef', cursive !important;
                    }
                    
                    .font-family-reem-kufi {
                        font-family: 'Reem Kufi', sans-serif !important;
                    }
                    
                    .font-family-aref-ruqaa {
                        font-family: 'Aref Ruqaa', serif !important;
                    }
                    
                    .font-family-noto-kufi {
                        font-family: 'Noto Kufi Arabic', sans-serif !important;
                    }
                    
                    .tooltip {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background-color: rgba(0, 0, 0, 0.9);
                        color: white;
                        padding: 12px 24px;
                        border-radius: 8px;
                        font-size: 18px;
                        font-weight: bold;
                        z-index: 1000;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                        text-align: center;
                        min-width: 200px;
                    }
                        transition: opacity 0.3s;
                    }
                    
                    .control-button {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        padding: 8px 16px;
                        border-radius: 5px;
                        background-color: #f0f0f0;
                        color: #333;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                        font-size: 14px;
                        margin: 0 5px;
                    }
                    
                    .control-button:hover {
                        background-color: #e0e0e0;
                        transform: translateY(-2px);
                    }
                    
                    .control-button i {
                        font-size: 16px;
                    }
                    
                    .back-button {
                        background-color: #f44336;
                        color: white;
                    }
                    
                    .back-button:hover {
                        background-color: #d32f2f;
                    }
                    
                    .download-button {
                        background-color: #673AB7;
                        color: white;
                    }
                    
                    .download-button:hover {
                        background-color: #5e35b1;
                    }
                    
                    .font-button {
                        background-color: #2196F3;
                        color: white;
                    }
                    
                    .font-button:hover {
                        background-color: #1976D2;
                    }
                    
                    .back-btn {
                        background-color: #f44336;
                        color: white;
                        border: none;
                        padding: 8px 15px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                        margin-right: 10px;
                        display: inline-flex;
                        align-items: center;
                        gap: 5px;
                    }
                    
                    .back-btn:hover {
                        background-color: #d32f2f;
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
                    
                    @media (max-width: 820px) {
                        .template-content-wrapper::after {
                            content: "← اسحب للمشاهدة →";
                            display: block;
                            text-align: center;
                            padding: 5px;
                            color: #666;
                            font-size: 12px;
                            margin-top: 10px;
                        }
                    }
                    
                    @media print {
                        .button-controls, .item-controls {
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
                    
                    <!-- Button controls at the top -->
                    <div class="button-controls" style="display: flex; justify-content: center; gap: 10px; margin-bottom: 15px; padding: 10px;">
                        <div id="backBtn" class="control-button back-button" title="العودة للصفحة الرئيسية">
                            <i class="fas fa-home"></i>
                            <span>الصفحة الرئيسية</span>
                        </div>
                        <div id="fontFamilyBtn" class="control-button font-button" title="تغيير نوع الخط">
                            <i class="fas fa-font"></i>
                            <span>تغيير نوع الخط</span>
                        </div>
                        <div id="downloadImgBtn" class="control-button download-button" title="تحميل صورة">
                            <i class="fas fa-image"></i>
                            <span>تحميل صورة</span>
                        </div>
                    </div>
                    
                    <div class="template-content-wrapper">
                        <div class="template-content">
                            <div class="template-image-container">
                                <img src="tamplet1.jpg" alt="نموذج الإنتاج الفني" class="template-image">
                            
                            <div class="data-overlay">
                                <div class="data-field font-family-cairo font-large" style="top: 20.5%; right: 30.5%;">
                                    ${formValues.subject || ''}
                                    <div class="item-controls">
                                        <button class="item-btn item-up"><i class="fas fa-chevron-up"></i></button>
                                        <button class="item-btn item-down"><i class="fas fa-chevron-down"></i></button>
                                        <button class="item-btn item-right"><i class="fas fa-chevron-right"></i></button>
                                        <button class="item-btn item-left"><i class="fas fa-chevron-left"></i></button>
                                    </div>
                                </div>
                                <div class="data-field font-family-cairo font-x-large" style="top: 27.5%; right: 32.9%; font-weight: bold;">
                                    ${formValues.day || ''}
                                    <div class="item-controls">
                                        <button class="item-btn item-up"><i class="fas fa-chevron-up"></i></button>
                                        <button class="item-btn item-down"><i class="fas fa-chevron-down"></i></button>
                                        <button class="item-btn item-right"><i class="fas fa-chevron-right"></i></button>
                                        <button class="item-btn item-left"><i class="fas fa-chevron-left"></i></button>
                                    </div>
                                </div>
                                <div class="data-field font-family-cairo font-x-large" style="top: 27.5%; right: 67.7%;">
                                    ${document.getElementById('hijriDateText').textContent.replace('التاريخ الهجري: ', '') || ''}
                                    <div class="item-controls">
                                        <button class="item-btn item-up"><i class="fas fa-chevron-up"></i></button>
                                        <button class="item-btn item-down"><i class="fas fa-chevron-down"></i></button>
                                        <button class="item-btn item-right"><i class="fas fa-chevron-right"></i></button>
                                        <button class="item-btn item-left"><i class="fas fa-chevron-left"></i></button>
                                    </div>
                                </div>
                                <div class="data-field font-family-cairo font-large" style="top: 34.5%; right: 30.5%;">
                                    ${formValues.location || ''}
                                    <div class="item-controls">
                                        <button class="item-btn item-up"><i class="fas fa-chevron-up"></i></button>
                                        <button class="item-btn item-down"><i class="fas fa-chevron-down"></i></button>
                                        <button class="item-btn item-right"><i class="fas fa-chevron-right"></i></button>
                                        <button class="item-btn item-left"><i class="fas fa-chevron-left"></i></button>
                                    </div>
                                </div>
                                <div class="data-field font-family-cairo font-x-large" style="top: 41%; right: 73.7%;">
                                    ${formValues.hour || ''}
                                    <div class="item-controls">
                                        <button class="item-btn item-up"><i class="fas fa-chevron-up"></i></button>
                                        <button class="item-btn item-down"><i class="fas fa-chevron-down"></i></button>
                                        <button class="item-btn item-right"><i class="fas fa-chevron-right"></i></button>
                                        <button class="item-btn item-left"><i class="fas fa-chevron-left"></i></button>
                                    </div>
                                </div>
                                <div class="data-field font-family-cairo font-normal" style="top: 42%; right: 30%;">
                                    ${formValues.time || ''}
                                    <div class="item-controls">
                                        <button class="item-btn item-up"><i class="fas fa-chevron-up"></i></button>
                                        <button class="item-btn item-down"><i class="fas fa-chevron-down"></i></button>
                                        <button class="item-btn item-right"><i class="fas fa-chevron-right"></i></button>
                                        <button class="item-btn item-left"><i class="fas fa-chevron-left"></i></button>
                                    </div>
                                </div>
                                
                                <!-- Requirements section -->
                                ${formValues.audio ? '<div class="requirement-icon" style="top: 55.5%; right: 64%;">✓</div>' : ''}
                                ${formValues.video ? '<div class="requirement-icon" style="top: 55.5%; right: 42.5%;">✓</div>' : ''}
                                ${formValues.photo ? '<div class="requirement-icon" style="top: 55.5%; right: 15%;">✓</div>' : ''}
                                
                                <!-- Assignees with individual positioning and controls -->
                                ${formValues.assignee1 ? `<div class="assignee-item font-family-cairo font-xx-large" style="position: absolute; top: 71.5%; right: 13.5%; min-width: 150px;">
                                    ${formValues.assignee1}
                                    <div class="item-controls">
                                        <button class="item-btn item-up"><i class="fas fa-chevron-up"></i></button>
                                        <button class="item-btn item-down"><i class="fas fa-chevron-down"></i></button>
                                        <button class="item-btn item-right"><i class="fas fa-chevron-right"></i></button>
                                        <button class="item-btn item-left"><i class="fas fa-chevron-left"></i></button>
                                    </div>
                                </div>` : ''}
                                ${formValues.assignee2 ? `<div class="assignee-item font-family-cairo font-xx-large" style="position: absolute; top: 71.5%; right: 51%; min-width: 150px;">
                                    ${formValues.assignee2}
                                    <div class="item-controls">
                                        <button class="item-btn item-up"><i class="fas fa-chevron-up"></i></button>
                                        <button class="item-btn item-down"><i class="fas fa-chevron-down"></i></button>
                                        <button class="item-btn item-right"><i class="fas fa-chevron-right"></i></button>
                                        <button class="item-btn item-left"><i class="fas fa-chevron-left"></i></button>
                                    </div>
                                </div>` : ''}
                                ${formValues.assignee3 ? `<div class="assignee-item font-family-cairo font-xx-large" style="position: absolute; top: 76.5%; right: 13.5%; min-width: 150px;">
                                    ${formValues.assignee3}
                                    <div class="item-controls">
                                        <button class="item-btn item-up"><i class="fas fa-chevron-up"></i></button>
                                        <button class="item-btn item-down"><i class="fas fa-chevron-down"></i></button>
                                        <button class="item-btn item-right"><i class="fas fa-chevron-right"></i></button>
                                        <button class="item-btn item-left"><i class="fas fa-chevron-left"></i></button>
                                    </div>
                                </div>` : ''}
                                ${formValues.assignee4 ? `<div class="assignee-item font-family-cairo font-xx-large" style="position: absolute; top: 76.5%; right: 51%; min-width: 150px;">
                                    ${formValues.assignee4}
                                    <div class="item-controls">
                                        <button class="item-btn item-up"><i class="fas fa-chevron-up"></i></button>
                                        <button class="item-btn item-down"><i class="fas fa-chevron-down"></i></button>
                                        <button class="item-btn item-right"><i class="fas fa-chevron-right"></i></button>
                                        <button class="item-btn item-left"><i class="fas fa-chevron-left"></i></button>
                                    </div>
                                </div>` : ''}
                                ${formValues.assignee5 ? `<div class="assignee-item font-family-cairo font-xx-large" style="position: absolute; top: 81.5%; right: 13.5%; min-width: 150px;">
                                    ${formValues.assignee5}
                                    <div class="item-controls">
                                        <button class="item-btn item-up"><i class="fas fa-chevron-up"></i></button>
                                        <button class="item-btn item-down"><i class="fas fa-chevron-down"></i></button>
                                        <button class="item-btn item-right"><i class="fas fa-chevron-right"></i></button>
                                        <button class="item-btn item-left"><i class="fas fa-chevron-left"></i></button>
                                    </div>
                                </div>` : ''}
                                ${formValues.assignee6 ? `<div class="assignee-item font-family-cairo font-xx-large" style="position: absolute; top: 81.5%; right: 51%; min-width: 150px;">
                                    ${formValues.assignee6}
                                    <div class="item-controls">
                                        <button class="item-btn item-up"><i class="fas fa-chevron-up"></i></button>
                                        <button class="item-btn item-down"><i class="fas fa-chevron-down"></i></button>
                                        <button class="item-btn item-right"><i class="fas fa-chevron-right"></i></button>
                                        <button class="item-btn item-left"><i class="fas fa-chevron-left"></i></button>
                                    </div>
                                </div>` : ''}
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
                        document.getElementById('fontFamilyBtn').addEventListener('click', changeFontFamily);
                        
                        // Setup item directional controls
                        setupItemControls();
                        
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
                                'font-family-reem-kufi',
                                'font-family-aref-ruqaa',
                                'font-family-noto-kufi'
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
                                'font-family-reem-kufi': 'ريم كوفي',
                                'font-family-aref-ruqaa': 'عارف رقعة',
                                'font-family-noto-kufi': 'نوتو كوفي'
                            };
                            
                            showTooltip('نوع الخط: ' + fontFamilyNames[fontFamilyClasses[nextClassIndex]]);
                        }
                        
                        // Function to setup item controls
                        function setupItemControls() {
                            // Get all items with controls
                            const items = document.querySelectorAll('.data-field, .assignee-item');
                            
                            // Track active item
                            let activeItem = null;
                            
                            // Handle click outside to close controls
                            document.addEventListener('click', function(e) {
                                // If click is outside any item, deactivate all
                                if (!e.target.closest('.data-field') && !e.target.closest('.assignee-item') && !e.target.closest('.item-controls')) {
                                    items.forEach(item => {
                                        item.classList.remove('active');
                                    });
                                    activeItem = null;
                                }
                            });
                            
                            // Add keyboard support for arrow keys
                            document.addEventListener('keydown', function(e) {
                                if (!activeItem) return;
                                
                                const step = 0.5; // 0.5% each time
                                const currentTop = parseFloat(activeItem.style.top) || 0;
                                const currentRight = parseFloat(activeItem.style.right) || 0;
                                
                                switch (e.key) {
                                    case 'ArrowUp':
                                        activeItem.style.top = (currentTop - step) + '%';
                                        e.preventDefault();
                                        break;
                                    case 'ArrowDown':
                                        activeItem.style.top = (currentTop + step) + '%';
                                        e.preventDefault();
                                        break;
                                    case 'ArrowRight':
                                        // Move right (decrease right value)
                                        activeItem.style.right = (currentRight - step) + '%';
                                        e.preventDefault();
                                        break;
                                    case 'ArrowLeft':
                                        // Move left (increase right value)
                                        activeItem.style.right = (currentRight + step) + '%';
                                        e.preventDefault();
                                        break;
                                    case 'Escape':
                                        // Deactivate on Escape key
                                        activeItem.classList.remove('active');
                                        activeItem = null;
                                        break;
                                }
                            });
                            
                            items.forEach(item => {
                                const upBtn = item.querySelector('.item-up');
                                const downBtn = item.querySelector('.item-down');
                                const rightBtn = item.querySelector('.item-right');
                                const leftBtn = item.querySelector('.item-left');
                                
                                // Add click event to show controls
                                item.addEventListener('click', function(e) {
                                    // If clicking on a button, don't toggle active state
                                    if (e.target.closest('.item-btn')) {
                                        return;
                                    }
                                    
                                    // Deactivate all items
                                    items.forEach(i => {
                                        if (i !== item) {
                                            i.classList.remove('active');
                                        }
                                    });
                                    
                                    // Toggle active state for clicked item
                                    item.classList.toggle('active');
                                    activeItem = item.classList.contains('active') ? item : null;
                                });
                                
                                if (upBtn && downBtn && rightBtn && leftBtn) {
                                    // Store original position
                                    const originalTop = parseFloat(item.style.top) || 0;
                                    const originalRight = parseFloat(item.style.right) || 0;
                                    
                                    // Move step size
                                    const step = 0.5; // 0.5% each time
                                    
                                    // Add event listeners
                                    upBtn.addEventListener('click', (e) => {
                                        e.stopPropagation();
                                        const currentTop = parseFloat(item.style.top) || 0;
                                        item.style.top = (currentTop - step) + '%';
                                    });
                                    
                                    downBtn.addEventListener('click', (e) => {
                                        e.stopPropagation();
                                        const currentTop = parseFloat(item.style.top) || 0;
                                        item.style.top = (currentTop + step) + '%';
                                    });
                                    
                                    // Fix the direction: right button should decrease right value (move right)
                                    rightBtn.addEventListener('click', (e) => {
                                        e.stopPropagation();
                                        const currentRight = parseFloat(item.style.right) || 0;
                                        item.style.right = (currentRight - step) + '%';
                                    });
                                    
                                    // Fix the direction: left button should increase right value (move left)
                                    leftBtn.addEventListener('click', (e) => {
                                        e.stopPropagation();
                                        const currentRight = parseFloat(item.style.right) || 0;
                                        item.style.right = (currentRight + step) + '%';
                                    });
                                    
                                    // Double click to reset position
                                    item.addEventListener('dblclick', () => {
                                        item.style.top = originalTop + '%';
                                        item.style.right = originalRight + '%';
                                    });
                                }
                            });
                        }
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
                            
                            // Hide tooltip after 2 seconds
                            setTimeout(() => {
                                tooltip.style.opacity = '0';
                            }, 2000);
                        }
                        
                        // Function to download as PDF
                        function downloadAsPDF() {
                            const { jsPDF } = window.jspdf;
                            
                            // Hide buttons before capturing
                            const actions = document.querySelector('.template-actions');
                            const styleControls = document.querySelector('.button-controls');
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
                            const styleControls = document.querySelector('.button-controls');
                            const originalStyleControlsDisplay = styleControls.style.display;
                            styleControls.style.display = 'none';
                            
                            // Hide all item controls and deactivate all items
                            const items = document.querySelectorAll('.data-field, .assignee-item');
                            items.forEach(item => {
                                item.classList.remove('active');
                            });
                            
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
                        
                        // Handle back button click
                        document.getElementById('backBtn').addEventListener('click', function() {
                            window.location.href = '/';
                        });
                    });
                    // Function to ensure consistent template sizing on all devices
                    function ensureConsistentTemplateSize() {
                        // Apply fixed sizing to all text elements in the template
                        const textElements = document.querySelectorAll('.data-field, .assignee-item');
                        textElements.forEach(element => {
                            // Ensure text size doesn't get adjusted by mobile browsers
                            element.style.webkitTextSizeAdjust = '100%';
                            element.style.mozTextSizeAdjust = '100%';
                            element.style.msTextSizeAdjust = '100%';
                            element.style.textSizeAdjust = '100%';
                        });
                    }
                    
                    // Run when DOM is loaded
                    document.addEventListener('DOMContentLoaded', ensureConsistentTemplateSize);
                    
                    // Also run when window is resized
                    window.addEventListener('resize', ensureConsistentTemplateSize);
                    
                    // Run when orientation changes (mobile devices)
                    window.addEventListener('orientationchange', ensureConsistentTemplateSize);
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

// Function to format time to 12-hour format with Arabic AM/PM (ص/م)
function formatTime(timeString) {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    
    if (hour === 0) {
        return `12:${minutes} ص`;
    } else if (hour < 12) {
        return `${hour}:${minutes} ص`;
    } else if (hour === 12) {
        return `12:${minutes} م`;
    } else {
        return `${hour - 12}:${minutes} م`;
    }
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
