// DOM Elements
const templateCards = document.querySelectorAll('.template-card');
const selectButtons = document.querySelectorAll('.select-btn');

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
        
        // Redirect to the form page after a short delay
        setTimeout(() => {
            window.location.href = 'form.html';
        }, 300);
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
