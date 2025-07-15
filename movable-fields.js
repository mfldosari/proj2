// Add CSS for movable fields
function addMovementCSS() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .data-field-container {
      position: absolute;
      display: inline-block;
    }
    
    .data-field, .assignee-item {
      position: relative;
      z-index: 1;
      padding: 2px;
      border: 1px dashed transparent;
    }
    
    .data-field-container:hover .data-field,
    .data-field-container:hover .assignee-item {
      border: 1px dashed #999;
    }
    
    .directional-controls {
      position: absolute;
      z-index: 2;
    }
    
    .move-btn {
      width: 24px;
      height: 24px;
      padding: 0;
      font-size: 14px;
      background-color: rgba(0, 123, 255, 0.7);
      color: white;
      border: 1px solid #0056b3;
      border-radius: 50%;
      cursor: pointer;
      position: absolute;
      display: block;
    }
    
    .move-btn:hover {
      background-color: rgba(0, 86, 179, 0.9);
    }
    
    .move-up {
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
    }
    
    .move-right {
      top: 50%;
      right: -30px;
      transform: translateY(-50%);
    }
    
    .move-down {
      bottom: -30px;
      left: 50%;
      transform: translateX(-50%);
    }
    
    .move-left {
      top: 50%;
      left: -30px;
      transform: translateY(-50%);
    }
  `;
  document.head.appendChild(styleElement);
}

// Make all data fields movable
function makeFieldsMovable() {
  // First add the CSS
  addMovementCSS();
  
  // Get all data fields
  const dataFields = document.querySelectorAll('.data-field, .assignee-item');
  
  dataFields.forEach(field => {
    // Create container div
    const container = document.createElement('div');
    container.className = 'data-field-container';
    
    // Set container position to match field position
    container.style.top = field.style.top;
    container.style.right = field.style.right;
    
    // Create directional controls
    const controls = document.createElement('div');
    controls.className = 'directional-controls';
    
    // Create the four directional buttons
    const directions = [
      { name: 'up', symbol: '↑' },
      { name: 'right', symbol: '→' },
      { name: 'down', symbol: '↓' },
      { name: 'left', symbol: '←' }
    ];
    
    directions.forEach(dir => {
      const btn = document.createElement('button');
      btn.className = `move-btn move-${dir.name}`;
      btn.textContent = dir.symbol;
      
      // Add click event to move the field
      btn.addEventListener('click', function() {
        moveField(container, dir.name);
      });
      
      controls.appendChild(btn);
    });
    
    // Replace the field with the container
    const parent = field.parentNode;
    parent.insertBefore(container, field);
    container.appendChild(field);
    container.appendChild(controls);
    
    // Reset field position relative to container
    field.style.top = 'auto';
    field.style.right = 'auto';
  });
  
  // Load any previously saved positions
  loadSavedPositions();
}

// Function to move a field
function moveField(container, direction) {
  // Get current position
  const currentTop = parseFloat(container.style.top) || 0;
  const currentRight = parseFloat(container.style.right) || 0;
  
  // Movement step (in percentage)
  const step = 0.5;
  
  // Update position based on direction
  switch(direction) {
    case 'up':
      container.style.top = (currentTop - step) + '%';
      break;
    case 'right':
      container.style.right = (currentRight - step) + '%';
      break;
    case 'down':
      container.style.top = (currentTop + step) + '%';
      break;
    case 'left':
      container.style.right = (currentRight + step) + '%';
      break;
  }
  
  // Save the new position
  const fieldElement = container.querySelector('.data-field, .assignee-item');
  const fieldContent = fieldElement.textContent.trim();
  const newTop = parseFloat(container.style.top);
  const newRight = parseFloat(container.style.right);
  
  // Save to localStorage
  const savedPositions = JSON.parse(localStorage.getItem('fieldPositions') || '{}');
  savedPositions[fieldContent] = { top: newTop, right: newRight };
  localStorage.setItem('fieldPositions', JSON.stringify(savedPositions));
}

// Function to load saved positions
function loadSavedPositions() {
  const savedPositions = JSON.parse(localStorage.getItem('fieldPositions') || '{}');
  
  document.querySelectorAll('.data-field-container').forEach(container => {
    const fieldElement = container.querySelector('.data-field, .assignee-item');
    if (fieldElement) {
      const fieldContent = fieldElement.textContent.trim();
      
      if (savedPositions[fieldContent]) {
        container.style.top = savedPositions[fieldContent].top + '%';
        container.style.right = savedPositions[fieldContent].right + '%';
      }
    }
  });
}

// Add a reset button to restore default positions
function addResetPositionsButton() {
  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'إعادة ضبط المواقع';
  resetBtn.className = 'reset-positions-btn';
  resetBtn.style.position = 'fixed';
  resetBtn.style.bottom = '20px';
  resetBtn.style.right = '20px';
  resetBtn.style.padding = '8px 16px';
  resetBtn.style.backgroundColor = '#dc3545';
  resetBtn.style.color = 'white';
  resetBtn.style.border = 'none';
  resetBtn.style.borderRadius = '4px';
  resetBtn.style.cursor = 'pointer';
  resetBtn.style.zIndex = '1000';
  
  resetBtn.addEventListener('click', function() {
    localStorage.removeItem('fieldPositions');
    location.reload();
  });
  
  document.body.appendChild(resetBtn);
}
