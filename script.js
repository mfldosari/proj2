// DOM Elements
const templatesGrid = document.querySelector('.templates-grid');
const addTemplateBtn = document.querySelector('.add-template-btn');

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
    
    return loadingOverlay;
}

// Function to create a template card
function createTemplateCard(template) {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    const preview = document.createElement('div');
    preview.className = 'template-preview';
    
    const img = document.createElement('img');
    img.src = template.imagePath || '/static/tamplet1.jpg';
    img.alt = template.name || 'نموذج الإنتاج الفني';
    
    const title = document.createElement('h3');
    title.textContent = template.name || 'نموذج الإنتاج الفني';
    
    const button = document.createElement('button');
    button.className = 'select-btn';
    button.textContent = 'اختيار القالب';
    
    // Add click event listener to select button
    button.addEventListener('click', () => {
        // Add visual feedback when clicked
        button.classList.add('clicked');
        
        // Store the selected template in localStorage
        localStorage.setItem('selectedTemplate', template.id || 'default');
        localStorage.setItem('selectedTemplateName', template.name || 'نموذج الإنتاج الفني');
        
        // Show loading overlay
        showLogoLoadingOverlay();
        
        // Redirect to the form page after a short delay
        setTimeout(() => {
            window.location.href = '/form';
        }, 3000);
    });
    
    preview.appendChild(img);
    card.appendChild(preview);
    card.appendChild(title);
    card.appendChild(button);
    
    return card;
}

// Function to create the add template card
function createAddTemplateCard() {
    const card = document.createElement('div');
    card.className = 'template-card add-template-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    const icon = document.createElement('div');
    icon.className = 'add-template-icon';
    
    const i = document.createElement('i');
    i.className = 'fas fa-plus-circle';
    
    const title = document.createElement('h3');
    title.textContent = 'إضافة قالب جديد';
    
    const button = document.createElement('button');
    button.className = 'add-template-btn';
    button.textContent = 'إنشاء قالب';
    
    // Add click event listener to add template button
    button.addEventListener('click', () => {
        // Add visual feedback when clicked
        button.classList.add('clicked');
        
        // Show loading overlay
        showLogoLoadingOverlay();
        
        // Redirect to the template creator page after a short delay
        setTimeout(() => {
            window.location.href = '/template-creator';
        }, 1500);
    });
    
    icon.appendChild(i);
    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(button);
    
    return card;
}

// Function to load templates from the server
async function loadTemplates() {
    try {
        // Clear existing templates
        templatesGrid.innerHTML = '';
        
        // Add default template
        const defaultTemplate = {
            id: 'default',
            name: 'نموذج الإنتاج الفني',
            imagePath: '/static/tamplet1.jpg'
        };
        
        const defaultCard = createTemplateCard(defaultTemplate);
        templatesGrid.appendChild(defaultCard);
        
        // Try to fetch custom templates
        try {
            const response = await fetch('/api/templates');
            if (response.ok) {
                const templates = await response.json();
                
                // Add custom templates
                templates.forEach(template => {
                    const card = createTemplateCard(template);
                    templatesGrid.appendChild(card);
                });
            }
        } catch (error) {
            console.error('Error loading templates:', error);
        }
        
        // Add the "Add Template" card
        const addCard = createAddTemplateCard();
        templatesGrid.appendChild(addCard);
        
        // Animate cards
        const cards = document.querySelectorAll('.template-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    } catch (error) {
        console.error('Error in loadTemplates:', error);
    }
}

// Load templates when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadTemplates();
});
