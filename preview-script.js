// Preview functionality
document.addEventListener('DOMContentLoaded', function() {
    // Preview elements
    const previewSubject = document.getElementById('preview-subject');
    const previewDay = document.getElementById('preview-day');
    const previewHijriDate = document.getElementById('preview-hijriDate');
    const previewLocation = document.getElementById('preview-location');
    const previewTime = document.getElementById('preview-time');
    const previewHour = document.getElementById('preview-hour');
    const previewAssignee1 = document.getElementById('preview-assignee1');
    const previewAssignee2 = document.getElementById('preview-assignee2');
    const previewAssignee3 = document.getElementById('preview-assignee3');
    const previewAssignee4 = document.getElementById('preview-assignee4');
    const previewAssignee5 = document.getElementById('preview-assignee5');
    const previewAssignee6 = document.getElementById('preview-assignee6');

    // Form elements
    const subjectInput = document.getElementById('subject');
    const daySelect = document.getElementById('day');
    const hijriDateText = document.getElementById('hijriDateText');
    const locationInput = document.getElementById('location');
    const timeInput = document.getElementById('time');
    const hourInput = document.getElementById('hour');
    const assignee1Input = document.getElementById('assignee1');
    const assignee2Input = document.getElementById('assignee2');
    const assignee3Input = document.getElementById('assignee3');
    const assignee4Input = document.getElementById('assignee4');
    const assignee5Input = document.getElementById('assignee5');
    const assignee6Input = document.getElementById('assignee6');
    
    // Preview section and button
    const previewSection = document.getElementById('previewSection');
    const previewBtn = document.getElementById('previewBtn');

    // Function to update preview in real-time
    function updatePreview() {
        // Get form values
        const subject = subjectInput.value || 'الموضوع';
        const day = daySelect.value || 'اليوم';
        const hijriDate = hijriDateText.textContent.replace('التاريخ الهجري: ', '') || 'التاريخ الهجري';
        const location = locationInput.value || 'الموقع';
        const time = timeInput.value || 'الوقت';
        const hour = formatTime(hourInput.value) || 'الساعة';
        const assignee1 = assignee1Input.value || 'المكلف 1';
        const assignee2 = assignee2Input.value || 'المكلف 2';
        const assignee3 = assignee3Input.value || 'المكلف 3';
        const assignee4 = assignee4Input.value || 'المكلف 4';
        const assignee5 = assignee5Input.value || 'المكلف 5';
        const assignee6 = assignee6Input.value || 'المكلف 6';
        
        // Update preview elements
        if (previewSubject) previewSubject.textContent = subject;
        if (previewDay) previewDay.textContent = day;
        if (previewHijriDate) previewHijriDate.textContent = hijriDate;
        if (previewLocation) previewLocation.textContent = location;
        if (previewHour) previewHour.textContent = hour;
        if (previewTime) previewTime.textContent = time;
        if (previewAssignee1) previewAssignee1.textContent = assignee1;
        if (previewAssignee2) previewAssignee2.textContent = assignee2;
        if (previewAssignee3) previewAssignee3.textContent = assignee3;
        if (previewAssignee4) previewAssignee4.textContent = assignee4;
        if (previewAssignee5) previewAssignee5.textContent = assignee5;
        if (previewAssignee6) previewAssignee6.textContent = assignee6;
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

    // Add event listeners for real-time preview updates
    const formInputs = [
        subjectInput, daySelect, locationInput, 
        timeInput, hourInput, assignee1Input, assignee2Input, 
        assignee3Input, assignee4Input, assignee5Input, assignee6Input
    ];
    
    formInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', updatePreview);
            input.addEventListener('change', updatePreview);
        }
    });
    
    // Special listener for hijri date changes
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            // Wait a moment for the hijri date to be updated
            setTimeout(updatePreview, 1000);
        });
    }
    
    // Listen for changes to the hijriDateText element
    if (hijriDateText) {
        // Use MutationObserver to detect changes to the hijriDateText content
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'characterData' || mutation.type === 'childList') {
                    updatePreview();
                }
            });
        });
        
        // Configure and start the observer
        observer.observe(hijriDateText, { 
            characterData: true, 
            childList: true,
            subtree: true 
        });
    }
    
    // Toggle preview section when preview button is clicked
    if (previewBtn && previewSection) {
        previewBtn.addEventListener('click', function() {
            // Update preview before showing
            updatePreview();
            
            // Toggle preview section visibility with animation
            if (previewSection.style.display === 'none') {
                // Show preview section
                previewSection.style.display = 'block';
                previewBtn.innerHTML = '<i class="fas fa-eye-slash"></i> إخفاء المعاينة';
                
                // Add animation class
                previewSection.classList.add('fade-in');
                
                // Scroll to preview section
                setTimeout(() => {
                    previewSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Check if we're on a mobile device and add scroll hint
                    if (window.innerWidth <= 820) {
                        // Reset horizontal scroll position to show the beginning (right side in RTL)
                        previewSection.scrollLeft = previewSection.scrollWidth;
                        
                        // Add a visual indicator for horizontal scrolling
                        const scrollHint = document.createElement('div');
                        scrollHint.className = 'scroll-hint';
                        scrollHint.textContent = '← اسحب للمشاهدة →';
                        scrollHint.style.cssText = `
                            text-align: center;
                            padding: 5px;
                            color: #666;
                            font-size: 12px;
                            margin-top: 10px;
                            animation: pulse 2s infinite;
                        `;
                        
                        // Add the hint after the preview section
                        if (!document.querySelector('.scroll-hint')) {
                            previewSection.appendChild(scrollHint);
                            
                            // Remove the hint after 5 seconds
                            setTimeout(() => {
                                if (scrollHint.parentNode) {
                                    scrollHint.parentNode.removeChild(scrollHint);
                                }
                            }, 5000);
                        }
                    }
                }, 100);
            } else {
                // Hide preview section
                previewSection.classList.add('fade-out');
                
                setTimeout(() => {
                    previewSection.style.display = 'none';
                    previewSection.classList.remove('fade-out');
                    previewBtn.innerHTML = '<i class="fas fa-eye"></i> معاينة النموذج';
                }, 300);
            }
        });
    }
    
    // Initialize preview with a slight delay to ensure all values are loaded
    setTimeout(updatePreview, 1000);
});
