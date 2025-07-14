document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('requestForm');
  const template = document.getElementById('template');
  const exportBtns = document.getElementById('exportBtns');
  const generateBtn = document.getElementById('generateBtn');
  const downloadPdf = document.getElementById('downloadPdf');
  const downloadImg = document.getElementById('downloadImg');
  const printBtn = document.getElementById('printBtn');
  const backBtn = document.getElementById('backBtn');

  generateBtn.onclick = function() {
    // Validation: at least 3 assigned personnel
    const persons = [
      form.person1.value.trim(),
      form.person2.value.trim(),
      form.person3.value.trim()
    ];
    if (persons.filter(Boolean).length < 3) {
      alert('يرجى إدخال 3 أسماء على الأقل للمكلفين.');
      return;
    }
    // Fill template fields
    document.getElementById('t_subject').textContent = form.subject.value;
    document.getElementById('t_day').textContent = form.day.value;
    document.getElementById('t_date').textContent = form.date.value;
    document.getElementById('t_location').textContent = form.location.value;
    document.getElementById('t_time').textContent = form.time.value;
    document.getElementById('t_hour').textContent = form.hour.value;
    // Media types
    const mediaTypes = Array.from(form.querySelectorAll('input[name="mediaType"]:checked')).map(e => e.value);
    document.getElementById('t_mediaType').textContent = mediaTypes.join('، ');
    // Persons
    const allPersons = [form.person1.value, form.person2.value, form.person3.value, form.person4.value].filter(Boolean);
    document.getElementById('t_persons').textContent = allPersons.join('، ');
    // Show template, hide form
    form.style.display = 'none';
    template.style.display = 'block';
    exportBtns.style.display = 'block';
  };

  backBtn.onclick = function() {
    template.style.display = 'none';
    exportBtns.style.display = 'none';
    form.style.display = 'block';
  };

  downloadPdf.onclick = function() {
    html2canvas(template).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new window.jspdf.jsPDF({orientation: 'portrait', unit: 'pt', format: 'a4'});
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      // Fit image to page
      const imgWidth = pageWidth - 40;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
      pdf.save('media-center-request.pdf');
    });
  };

  downloadImg.onclick = function() {
    html2canvas(template).then(canvas => {
      const link = document.createElement('a');
      link.download = 'media-center-request.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  printBtn.onclick = function() {
    const original = document.body.innerHTML;
    document.body.innerHTML = template.outerHTML;
    window.print();
    document.body.innerHTML = original;
    window.location.reload();
  };
});
