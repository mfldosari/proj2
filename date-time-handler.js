// Date and Time Handler
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const dateInput = document.getElementById('date');
    const daySelect = document.getElementById('day');
    const hourInput = document.getElementById('hour');
    const timeInput = document.getElementById('time');
    const hijriDateText = document.getElementById('hijriDateText');
    const hijriDateInput = document.getElementById('hijriDate');
    
    // Set default date and time values
    function setDefaultDateAndTime() {
        // Get current date and time
        const now = new Date();
        
        // Set default date to today
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        if (dateInput) {
            dateInput.value = `${year}-${month}-${day}`;
        }
        
        // Set default day of week
        const daysOfWeek = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        if (daySelect) {
            daySelect.value = daysOfWeek[dayOfWeek];
        }
        
        // Set default time
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        if (hourInput) {
            hourInput.value = `${hours}:${minutes}`;
        }
        
        // For timeInput, we'll just leave it empty with placeholder
        if (timeInput) {
            timeInput.value = ''; // Clear any default value
            timeInput.placeholder = 'ادخل الوقت'; // Set placeholder
        }
    }
    
    // Set default values
    setDefaultDateAndTime();
    
    // Update Hijri date
    function updateHijriDate() {
        if (!dateInput || !hijriDateText || !hijriDateInput) return;
        
        const date = dateInput.value;
        if (!date) {
            hijriDateText.textContent = 'التاريخ الهجري: ';
            hijriDateInput.value = '';
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
                    hijriDateInput.value = formattedDate;
                } else {
                    // Fallback to a simple calculation if API fails
                    const fallbackDate = getFallbackHijriDate(date);
                    hijriDateText.textContent = `التاريخ الهجري: ${fallbackDate}`;
                    hijriDateInput.value = fallbackDate;
                }
            })
            .catch(error => {
                console.error('Error updating Hijri date:', error);
                const fallbackDate = getFallbackHijriDate(date);
                hijriDateText.textContent = `التاريخ الهجري: ${fallbackDate}`;
                hijriDateInput.value = fallbackDate;
            });
    }
    
    // Function to get Hijri date from API
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
    
    // Function to get fallback Hijri date
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
    
    // Add event listener for date changes
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            // Update day of week
            const selectedDate = new Date(this.value);
            const selectedDayOfWeek = selectedDate.getDay();
            const daysOfWeek = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
            if (daySelect) {
                daySelect.value = daysOfWeek[selectedDayOfWeek];
            }
            
            // Update Hijri date
            updateHijriDate();
        });
    }
    
    // Update Hijri date on page load
    setTimeout(updateHijriDate, 500);
});
