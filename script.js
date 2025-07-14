// DOM Elements
const templateCards = document.querySelectorAll('.template-card');
const selectButtons = document.querySelectorAll('.select-btn');

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

// Add click event listeners to select buttons
selectButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Get the template name from the image alt attribute
        const templateName = button.closest('.template-card').querySelector('img').alt;
        console.log(`Selected template: ${templateName}`);
        
        // Add visual feedback when clicked
        button.classList.add('clicked');
        
        // Store the selected template in localStorage
        localStorage.setItem('selectedTemplate', templateName);
        
        // Show loading overlay
        showLogoLoadingOverlay();
        
        // Redirect to the form page after a short delay
        setTimeout(() => {
            window.location.href = '/form';
        }, 1500);
    });
});

// Add animation to cards when page loads
document.addEventListener('DOMContentLoaded', () => {
    templateCards.forEach((card, index) => {
        // Add a staggered entrance animation
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
});
