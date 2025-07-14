document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('requestForm');
  const template = document.getElementById('template');
  const exportBtns = document.getElementById('exportBtns');
  const generateBtn = document.getElementById('generateBtn');
  const downloadPdf = document.getElementById('downloadPdf');
  const downloadImg = document.getElementById('downloadImg');
  const printBtn = document.getElementById('printBtn');
  const backBtn = document.getElementById('backBtn');

  // Load saved data from localStorage
  const saved = localStorage.getItem('mediaForm');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      for (const k in data) {
        if (form[k]) form[k].value = data[k];
        if (k === 'mediaType' && data[k]) {
          const radio = form.querySelector(`input[name="mediaType"][value="${data[k]}"]`);
          if (radio) radio.checked = true;
        }
      }
    } catch {}
  }

  // Save to localStorage on input
  form.addEventListener('input', function() {
    const data = {
      subject: form.subject.value,
      day: form.day.value,
      date: form.date.value,
      location: form.location.value,
      time: form.time.value,
      hour: form.hour.value,
      mediaType: form.mediaType.value,
      person1: form.person1.value,
      person2: form.person2.value,
      person3: form.person3.value
    };
    localStorage.setItem('mediaForm', JSON.stringify(data));
  });

  generateBtn.onclick = function() {
    // Validation: all required fields
    if (!form.subject.value || !form.day.value || !form.date.value || !form.location.value || !form.time.value || !form.hour.value) {
      alert('يرجى تعبئة جميع الحقول المطلوبة.');
      return;
    }
    if (!form.mediaType.value) {
      alert('يرجى اختيار نوع المطلوب.');
      return;
    }
    const persons = [form.person1.value.trim(), form.person2.value.trim(), form.person3.value.trim()];
    if (persons.filter(Boolean).length < 3) {
      alert('يرجى إدخال 3 أسماء للمكلفين.');
      return;
    }
    // Fill template fields
    document.getElementById('t_subject').textContent = form.subject.value;
    document.getElementById('t_day').textContent = form.day.value;
    document.getElementById('t_date').textContent = form.date.value;
    document.getElementById('t_location').textContent = form.location.value;
    document.getElementById('t_time').textContent = form.time.value;
    document.getElementById('t_hour').textContent = form.hour.value;
    document.getElementById('t_mediaType').textContent = form.mediaType.value;
    document.getElementById('t_persons').textContent = persons.join('، ');
    // Show template, hide form
    form.style.display = 'none';
    template.style.display = 'block';
    exportBtns.style.display = 'flex';
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
