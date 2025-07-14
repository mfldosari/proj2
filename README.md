# Media Templates Application

This is a web application for managing media templates with form data entry and template generation.

## Features

- Template selection interface
- Form for entering media production details
- Loading animations between pages
- Template generation with form data overlay
- Export options: Print, PDF, and Image
- Arabic text validation
- Responsive design

## Project Structure

```
/proj2/
├── app.py                # FastAPI server script
├── index.html            # Main page with template selection
├── form.html             # Form page for data entry
├── loading.html          # Loading animation page
├── script.js             # JavaScript for index page
├── form-script.js        # JavaScript for form page
├── styles.css            # CSS for index page
├── form-styles.css       # CSS for form page
├── logo.png              # Logo image
├── tamplet1.jpg          # Template image
└── requirements.txt      # Python dependencies
```

## Setup and Running

### Prerequisites

- Python 3.7+
- pip (Python package manager)

### Installation

1. Clone the repository or download the project files

2. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

### Running the Application

1. Start the FastAPI server:
   ```
   python app.py
   ```

2. Open your web browser and navigate to:
   ```
   http://localhost:8000
   ```

3. The application should now be running and accessible through your web browser.

## Usage

1. On the main page, click "اختيار القالب" (Select Template) to choose a template
2. Fill out the form with the required information
3. Click "توليد النموذج" (Generate Template) to create the template with your data
4. Use the buttons to print or save the generated template as PDF or image

## Notes

- All text inputs accept Arabic text only
- The form validates that all required fields are filled before generating the template
- The positions of data on the template can be adjusted in the form-script.js file
