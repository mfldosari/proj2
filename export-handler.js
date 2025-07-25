// Export functionality for templates
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to export buttons in the generated template window
    window.addEventListener('message', function(event) {
        if (event.data === 'templateGenerated') {
            // Wait for the template window to be fully loaded
            setTimeout(function() {
                const templateWindow = window.open('', '_blank');
                if (templateWindow) {
                    // Add event listeners to the buttons in the template window
                    const downloadImgBtn = templateWindow.document.getElementById('downloadImgBtn');
                    
                    if (downloadImgBtn) {
                        downloadImgBtn.addEventListener('click', function() {
                            downloadAsImage(templateWindow);
                        });
                    }
                }
            }, 1000);
        }
    });
    
    // Function to download as image
    function downloadAsImage(targetWindow) {
        const templateContainer = targetWindow.document.getElementById('templateContainer');
        if (!templateContainer) return;
        
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
        targetWindow.document.body.appendChild(loadingMsg);
        
        // Hide any controls that shouldn't be in the export
        const controlsToHide = targetWindow.document.querySelectorAll('.directional-controls, .template-actions');
        controlsToHide.forEach(control => {
            control.style.display = 'none';
        });
        
        // Get the template image container for better capture
        const templateImageContainer = templateContainer.querySelector('.template-image-container');
        const targetElement = templateImageContainer || templateContainer;
        
        // Calculate dimensions
        const originalWidth = targetElement.offsetWidth;
        const originalHeight = targetElement.offsetHeight;
        
        // Use html2canvas with improved settings for mobile
        targetWindow.html2canvas(targetElement, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            allowTaint: true,
            logging: false,
            width: originalWidth,
            height: originalHeight,
            scrollX: 0,
            scrollY: 0,
            windowWidth: targetWindow.document.documentElement.offsetWidth,
            windowHeight: targetWindow.document.documentElement.offsetHeight
        }).then(canvas => {
            try {
                // Create a download link
                const link = document.createElement('a');
                link.download = 'نموذج_الإنتاج_الفني.png';
                link.href = canvas.toDataURL('image/png');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Show controls again
                controlsToHide.forEach(control => {
                    control.style.display = '';
                });
                
                // Remove loading message
                targetWindow.document.body.removeChild(loadingMsg);
            } catch (error) {
                console.error('Error generating image:', error);
                alert('حدث خطأ أثناء إنشاء الصورة. يرجى المحاولة مرة أخرى.');
                
                // Show controls again
                controlsToHide.forEach(control => {
                    control.style.display = '';
                });
                
                // Remove loading message
                if (loadingMsg.parentNode) {
                    loadingMsg.parentNode.removeChild(loadingMsg);
                }
            }
        }).catch(error => {
            console.error('Error capturing template:', error);
            alert('حدث خطأ أثناء التقاط الصورة. يرجى المحاولة مرة أخرى.');
            
            // Show controls again
            controlsToHide.forEach(control => {
                control.style.display = '';
            });
            
            // Remove loading message
            if (loadingMsg.parentNode) {
                loadingMsg.parentNode.removeChild(loadingMsg);
            }
        });
    }
});
