// DOM Elements
const mediaForm = document.getElementById('mediaForm');
const generateBtn = document.getElementById('generateBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const downloadImgBtn = document.getElementById('downloadImgBtn');
const templateResult = document.getElementById('templateResult');

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
        mediaForm.reportValidity();
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
        formValues.date = formatDateToArabic(formValues.date);
    }
    
    // Create template HTML
    let templateHTML = `
        <div class="generated-template">
            <div class="template-header">
                <h2>نموذج الإنتاج الفني</h2>
            </div>
            <div class="template-content">
                <div class="template-field">
                    <span class="field-label">الموضوع:</span>
                    <span class="field-value">${formValues.subject || ''}</span>
                </div>
                <div class="template-field">
                    <span class="field-label">اليوم:</span>
                    <span class="field-value">${formValues.day || ''}</span>
                </div>
                <div class="template-field">
                    <span class="field-label">التاريخ:</span>
                    <span class="field-value">${formValues.date || ''}</span>
                </div>
                <div class="template-field">
                    <span class="field-label">الموقع:</span>
                    <span class="field-value">${formValues.location || ''}</span>
                </div>
                <div class="template-field">
                    <span class="field-label">الوقت:</span>
                    <span class="field-value">${formValues.time || ''}</span>
                </div>
                <div class="template-field">
                    <span class="field-label">الساعة:</span>
                    <span class="field-value">${formValues.hour || ''} ساعة</span>
                </div>
                <div class="template-field">
                    <span class="field-label">المطلوب:</span>
                    <span class="field-value">${formValues.required || ''}</span>
                </div>
                <div class="template-field">
                    <span class="field-label">المكلفون:</span>
                    <div class="assignees-list">
                        ${formValues.assignee1 ? `<div class="assignee">${formValues.assignee1}</div>` : ''}
                        ${formValues.assignee2 ? `<div class="assignee">${formValues.assignee2}</div>` : ''}
                        ${formValues.assignee3 ? `<div class="assignee">${formValues.assignee3}</div>` : ''}
                        ${formValues.assignee4 ? `<div class="assignee">${formValues.assignee4}</div>` : ''}
                        ${formValues.assignee5 ? `<div class="assignee">${formValues.assignee5}</div>` : ''}
                        ${formValues.assignee6 ? `<div class="assignee">${formValues.assignee6}</div>` : ''}
                    </div>
                </div>
            </div>
            <div class="template-footer">
                <div class="footer-signature">مدير المركز الإعلامي: رفيدي الأسمري</div>
                <div class="footer-signature">رئيس قسم الإنتاج: أحمد راجحي</div>
            </div>
        </div>
    `;
    
    // Display the template
    templateResult.innerHTML = templateHTML;
    templateResult.classList.add('visible');
    
    // Enable download buttons
    downloadPdfBtn.disabled = false;
    downloadImgBtn.disabled = false;
    
    // Scroll to the template result
    templateResult.scrollIntoView({ behavior: 'smooth' });
    
    // Add styles for the generated template
    const style = document.createElement('style');
    style.textContent = `
        .generated-template {
            border: 2px solid var(--primary-color);
            border-radius: 10px;
            padding: 20px;
            background-color: #fff;
            position: relative;
        }
        
        .template-header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid var(--secondary-color);
            padding-bottom: 10px;
        }
        
        .template-header h2 {
            color: var(--primary-color);
            font-size: 24px;
        }
        
        .template-content {
            display: grid;
            grid-template-columns: 1fr;
            gap: 15px;
        }
        
        .template-field {
            display: flex;
            align-items: baseline;
            gap: 10px;
        }
        
        .field-label {
            font-weight: bold;
            color: var(--dark-blue);
            min-width: 80px;
        }
        
        .field-value {
            flex: 1;
            padding: 5px 10px;
            background-color: #f9f9f9;
            border-radius: 4px;
            border-right: 3px solid var(--primary-color);
        }
        
        .assignees-list {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        }
        
        .assignee {
            padding: 5px;
            background-color: #f0f0f0;
            border-radius: 4px;
            text-align: center;
        }
        
        .template-footer {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            border-top: 1px solid #ddd;
            padding-top: 15px;
        }
        
        .footer-signature {
            font-weight: bold;
            color: var(--dark-blue);
        }
        
        @media (max-width: 768px) {
            .assignees-list {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .template-footer {
                flex-direction: column;
                gap: 10px;
            }
        }
        
        @media (max-width: 480px) {
            .assignees-list {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
});

// Download as PDF
downloadPdfBtn.addEventListener('click', () => {
    // Check if jsPDF is loaded
    if (typeof window.jspdf === 'undefined') {
        alert('مكتبة jsPDF غير متوفرة. يرجى التحقق من اتصال الإنترنت وإعادة تحميل الصفحة.');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    
    // Create a new PDF document
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    
    // Use html2canvas to capture the template
    html2canvas(templateResult, {
        scale: 2,
        useCORS: true,
        logging: false
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        doc.save('نموذج_الإنتاج_الفني.pdf');
    });
});

// Download as Image
downloadImgBtn.addEventListener('click', () => {
    html2canvas(templateResult, {
        scale: 2,
        useCORS: true,
        logging: false
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'نموذج_الإنتاج_الفني.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
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
});
