# Media Templates Application - Text Styling Enhancement

## New Feature: Text Styling Buttons

This enhancement adds two dedicated buttons to the template interface that allow users to change the styling of all text elements in the generated template. This provides a more streamlined and consistent approach to text styling.

### Added Functionality

1. **Font Size Button**
   - Button with text height icon to cycle through different font sizes
   - Applies the same font size to all text elements in the template
   - Shows a tooltip with the current size name in Arabic

2. **Font Family Button**
   - Button with font icon to cycle through different Arabic font families
   - Applies the same font family to all text elements in the template
   - Shows a tooltip with the current font family name in Arabic

3. **Default Styling**
   - All text elements start with Cairo font and normal size
   - Consistent styling across all template elements

### Font Size Options
- Normal (100%)
- Large (120%)
- Larger (140%)

### Arabic Font Family Options
- Cairo
- Tajawal
- Amiri
- Scheherazade New
- Lateef
- Reem Kufi

### Implementation Details

1. **CSS Classes Added:**
   - `font-normal`: Default font size (100%)
   - `font-large`: Increases text size to 120%
   - `font-larger`: Increases text size to 140%
   - `font-family-cairo`: Sets font to Cairo
   - `font-family-tajawal`: Sets font to Tajawal
   - `font-family-amiri`: Sets font to Amiri
   - `font-family-scheherazade`: Sets font to Scheherazade New
   - `font-family-lateef`: Sets font to Lateef
   - `font-family-reem-kufi`: Sets font to Reem Kufi

2. **JavaScript Functions:**
   - `changeFontSize()`: Cycles through font size options for all text elements
   - `changeFontFamily()`: Cycles through font family options for all text elements
   - `showTooltip(text)`: Displays a tooltip with the current style name

3. **User Interface:**
   - Added "تغيير حجم الخط" (Change Font Size) button with text height icon
   - Added "تغيير نوع الخط" (Change Font Family) button with font icon
   - Tooltips showing the current style name when buttons are clicked

### How It Works

1. When a user clicks the font size button, the `changeFontSize()` function is called
2. The function checks the current font size class applied to text elements
3. It removes the current size class and applies the next size in sequence to all text elements
4. A tooltip appears briefly showing the name of the applied size in Arabic
5. The same process applies for the font family button with the `changeFontFamily()` function

### Future Enhancements

Potential future improvements could include:
- Individual text element styling
- More font styling options (bold, italic, etc.)
- Color options
- Saving style preferences
- Undo/redo functionality
