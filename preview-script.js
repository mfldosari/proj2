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
        if (previewTime) previewTime.textContent = time;
        if (previewHour) previewHour.textContent = hour;
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
    
    // Toggle preview section when preview button is clicked
    if (previewBtn && previewSection) {
        previewBtn.addEventListener('click', function() {
            // Update preview before showing
            updatePreview();
            
            // Toggle preview section visibility
            if (previewSection.style.display === 'none') {
                previewSection.style.display = 'block';
                previewBtn.innerHTML = '<i class="fas fa-eye-slash"></i> إخفاء المعاينة';
                
                // Scroll to preview section
                previewSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                previewSection.style.display = 'none';
                previewBtn.innerHTML = '<i class="fas fa-eye"></i> معاينة النموذج';
            }
        });
    }
    
    // Improved Hijri date conversion
    function updateHijriDate() {
        const date = dateInput.value;
        if (!date) {
            hijriDateText.textContent = 'التاريخ الهجري: ';
            return;
        }
        
        // Show loading state
        hijriDateText.textContent = 'التاريخ الهجري: جاري التحميل...';
        
        // Get Hijri date from API
        getHijriDate(date)
            .then(hijriDate => {
                if (hijriDate) {
                    const formattedDate = `${hijriDate.day} ${hijriDate.month} ${hijriDate.year} هـ`;
                    hijriDateText.textContent = `التاريخ الهجري: ${formattedDate}`;
                    
                    // Update preview after hijri date is updated
                    updatePreview();
                } else {
                    // Fallback to a simple calculation if API fails
                    const fallbackDate = getFallbackHijriDate(date);
                    hijriDateText.textContent = `التاريخ الهجري: ${fallbackDate}`;
                    
                    // Update preview after hijri date is updated
                    updatePreview();
                }
            })
            .catch(error => {
                console.error('Error updating Hijri date:', error);
                const fallbackDate = getFallbackHijriDate(date);
                hijriDateText.textContent = `التاريخ الهجري: ${fallbackDate}`;
                
                // Update preview after hijri date is updated
                updatePreview();
            });
    }
    
    // Fetch Hijri date from API
    async function getHijriDate(gregorianDate) {
        try {
            const [year, month, day] = gregorianDate.split('-');
            const url = `https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`;
            
            console.log('Fetching Hijri date from API:', url);
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.code === 200 && data.data) {
                const hijri = data.data.hijri;
                console.log('API response:', hijri);
                
                return {
                    day: parseInt(hijri.day),
                    month: hijri.month.ar,
                    year: parseInt(hijri.year)
                };
            } else {
                throw new Error('Invalid API response format');
            }
        } catch (error) {
            console.error('Error fetching Hijri date:', error);
            return null;
        }
    }
    
    // Simple fallback calculation (approximate)
    function getFallbackHijriDate(gregorianDateStr) {
        try {
            // Try to use moment-hijri if available
            if (typeof moment !== 'undefined' && typeof moment().iHijri === 'function') {
                const m = moment(gregorianDateStr);
                const hijriDate = m.iHijri();
                return `${hijriDate.iDate()} ${getHijriMonthName(hijriDate.iMonth())} ${hijriDate.iYear()} هـ`;
            }
        } catch (e) {
            console.error('Error using moment-hijri:', e);
        }
        
        // Very simple approximation as fallback
        const gregorianDate = new Date(gregorianDateStr);
        
        // Approximate conversion (Hijri year is about 354 days)
        const gregorianYear = gregorianDate.getFullYear();
        const gregorianMonth = gregorianDate.getMonth();
        const gregorianDay = gregorianDate.getDate();
        
        // Approximate Hijri year (622 CE is year 1 in Hijri calendar)
        const yearDiff = gregorianYear - 622;
        const hijriYear = Math.floor(yearDiff + (yearDiff / 32));
        
        // Approximate month and day (very rough estimate)
        const dayOfYear = Math.floor((gregorianDate - new Date(gregorianYear, 0, 1)) / (24 * 60 * 60 * 1000));
        const hijriDayOfYear = (dayOfYear + 10) % 354; // Offset by 10 days as a rough adjustment
        
        const hijriMonth = Math.floor(hijriDayOfYear / 29.5);
        const hijriDay = Math.floor(hijriDayOfYear % 29.5) + 1;
        
        return `${hijriDay} ${getHijriMonthName(hijriMonth)} ${hijriYear} هـ`;
    }
    
    // Helper function to get Hijri month name
    function getHijriMonthName(monthIndex) {
        const hijriMonths = [
            'محرم',
            'صفر',
            'ربيع الأول',
            'ربيع الثاني',
            'جمادى الأولى',
            'جمادى الآخرة',
            'رجب',
            'شعبان',
            'رمضان',
            'شوال',
            'ذو القعدة',
            'ذو الحجة'
        ];
        return hijriMonths[monthIndex % 12];
    }
    
    // Update Hijri date when date input changes
    if (dateInput) {
        dateInput.addEventListener('change', updateHijriDate);
        
        // Initial update of Hijri date
        setTimeout(updateHijriDate, 500);
    }
});
