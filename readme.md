🔧 Full Prompt to Build Arabic Media Center Form Web App
🖼️ Project Overview:
I want to build a web-based Arabic form that replicates the attached image design. The purpose is to allow users to fill in form data, and then generate a final visual version (with their data embedded into the layout), which they can download as a PDF or image.

📐 Page Structure and Layout:
Main Sections:

Header (Top)

Logo on the top-right.

Title in center: "المركز الإعلامي" — styled in blue (#009CDE).

Subtitle: "الإنتاج الفني" — in gold/yellow (#D4A62D).

Use a clean Google Arabic font like Cairo, Tajawal, or Amiri with:

Header font-size: 28px bold

Subtitle font-size: 20px semi-bold

Form Fields Section:
Use a grid layout (2 columns) in RTL direction with the following fields:

الموضوع (Subject)

اليوم (Day)

التاريخ (Date)

الموقع (Location)

الوقت (Time)

الساعة (Hour)

المطلوب (Required Media Type): with 3 radio buttons:

صوت (icon: 🔊)

فيديو (icon: 🎥)

فوتوغرافي (icon: 📷)

المكلفون (Assigned Personnel): 3 blank name inputs

Form field design:

Border: 1px solid #009CDE

Rounded corners: 5px

Input padding: 10px

Font size: 16px

Input labels on the right, inputs on the left (RTL style)

Buttons:

"توليد النموذج" (Generate Template)

"تحميل PDF" (Download PDF)

"تحميل صورة" (Download Image)

Button Style:

Background: #009CDE (primary blue)

Text color: white

Font: bold 16px

Rounded corners: 10px

Padding: 10px 20px

Icon (optional): 🧾 for PDF, 🖼️ for image

Hover effect: slightly darker blue or drop shadow

Footer:

Two fixed text boxes:

"مدير المركز الإعلامي: رفيدي الأسمري"

"رئيس قسم الإنتاج: أحمد راجحي"

Style:

Dark blue background: #003459

Text color: white

Rounded top-left and top-right corners: 20px

Padding: 10px

🧭 Positioning and Layout
Use flexbox or grid for layout:

RTL direction across the whole page.

Spacing between rows: 15px

Inputs are full-width within their columns (about 40% width each side)

Wrap the whole form in a centered card with padding and optional drop-shadow.

📦 Functionality
Form Input

Allow users to fill the data

Generate Template

On clicking "Generate", display a visual template styled exactly like the original image

Populate all fields dynamically with user input

Keep layout static, and just insert values into correct positions

Export Options

Use html2canvas to capture the filled form

Use jsPDF to allow export as PDF

Use built-in anchor with image download for PNG/JPEG

💡 Notes:
Everything must support Arabic input (UTF-8)

Entire layout must be RTL

Icons can be from:

Unicode (🔊 🎥 📷)

Font Awesome (if you prefer more control)

Ensure responsiveness for tablets and mobiles

Allow saving form data temporarily using localStorage (optional)

📂 Files and Tools Required:
index.html

styles.css

main.js

External libraries:

html2canvas

jsPDF

Google Fonts (Tajawal, Cairo, or Amiri)