// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Hide loading overlay after 2 seconds
    setTimeout(() => {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    }, 2000);
    
    // Step 1 elements
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const templatePreview = document.getElementById('templatePreview');
    const previewImage = document.getElementById('previewImage');
    const templateFileInput = document.getElementById('templateFileInput');
    const changeTemplateBtn = document.getElementById('changeTemplateBtn');
    const templateName = document.getElementById('templateName');
    const goToStep2Btn = document.getElementById('goToStep2Btn');
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    
    // Step 2 elements
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const canvasTemplateImage = document.getElementById('canvasTemplateImage');
    const templateCanvas = document.getElementById('templateCanvas');
    const fieldsList = document.getElementById('fieldsList');
    const addFieldBtn = document.getElementById('addFieldBtn');
    const backToStep1Btn = document.getElementById('backToStep1Btn');
    const goToHomeFromStep2Btn = document.getElementById('goToHomeFromStep2Btn');
    const saveTemplateBtn = document.getElementById('saveTemplateBtn');
    
    // Modal elements
    const fieldEditorModal = document.getElementById('fieldEditorModal');
    const closeModal = document.querySelector('.close-modal');
    const fieldName = document.getElementById('fieldName');
    const fieldType = document.getElementById('fieldType');
    const selectOptionsGroup = document.getElementById('selectOptionsGroup');
    const selectOptions = document.getElementById('selectOptions');
    const maxLength = document.getElementById('maxLength');
    const isRequired = document.getElementById('isRequired');
    const fieldX = document.getElementById('fieldX');
    const fieldY = document.getElementById('fieldY');
    const fieldWidth = document.getElementById('fieldWidth');
    const fontSize = document.getElementById('fontSize');
    const fontFamily = document.getElementById('fontFamily');
    const cancelFieldBtn = document.getElementById('cancelFieldBtn');
    const saveFieldBtn = document.getElementById('saveFieldBtn');
    
    // Success modal elements
    const successModal = document.getElementById('successModal');
    const goToHomeBtn = document.getElementById('goToHomeBtn');
    
    // Template data
    let templateData = {
        name: '',
        description: '',
        imageFile: null,
        imageUrl: '',
        fields: []
    };
    
    // Current field being edited
    let currentFieldIndex = -1;
    let isNewField = true;
    
    // Event listeners for step 1
    uploadPlaceholder.addEventListener('click', () => {
        templateFileInput.click();
    });
    
    templateFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                templateData.imageUrl = e.target.result;
                templateData.imageFile = file;
                uploadPlaceholder.style.display = 'none';
                templatePreview.style.display = 'block';
                validateStep1();
            };
            reader.readAsDataURL(file);
        }
    });
    
    changeTemplateBtn.addEventListener('click', () => {
        templateFileInput.click();
    });
    
    templateName.addEventListener('input', validateStep1);
    
    function validateStep1() {
        if (templateData.imageUrl && templateName.value.trim()) {
            goToStep2Btn.disabled = false;
            templateData.name = templateName.value.trim();
            templateData.description = document.getElementById('templateDescription').value.trim();
        } else {
            goToStep2Btn.disabled = true;
        }
    }
    
    goToStep2Btn.addEventListener('click', () => {
        step1.style.display = 'none';
        step2.style.display = 'block';
        canvasTemplateImage.src = templateData.imageUrl;
    });
    
    backToHomeBtn.addEventListener('click', () => {
        window.location.href = '/';
    });
    
    // Event listeners for step 2
    addFieldBtn.addEventListener('click', () => {
        currentFieldIndex = -1;
        isNewField = true;
        resetFieldForm();
        openFieldModal();
    });
    
    backToStep1Btn.addEventListener('click', () => {
        step2.style.display = 'none';
        step1.style.display = 'block';
    });
    
    goToHomeFromStep2Btn.addEventListener('click', () => {
        window.location.href = '/';
    });
    
    // Field type change handler
    fieldType.addEventListener('change', () => {
        if (fieldType.value === 'select') {
            selectOptionsGroup.style.display = 'block';
        } else {
            selectOptionsGroup.style.display = 'none';
        }
    });
    
    // Modal event listeners
    closeModal.addEventListener('click', closeFieldModal);
    cancelFieldBtn.addEventListener('click', closeFieldModal);
    
    saveFieldBtn.addEventListener('click', () => {
        if (!fieldName.value.trim()) {
            alert('يرجى إدخال اسم الحقل');
            return;
        }
        
        const fieldData = {
            name: fieldName.value.trim(),
            type: fieldType.value,
            maxLength: parseInt(maxLength.value) || 50,
            required: isRequired.checked,
            x: parseInt(fieldX.value) || 0,
            y: parseInt(fieldY.value) || 0,
            width: parseInt(fieldWidth.value) || 200,
            fontSize: parseInt(fontSize.value) || 16,
            fontFamily: fontFamily.value
        };
        
        if (fieldType.value === 'select') {
            fieldData.options = selectOptions.value.split(',').map(option => option.trim()).filter(option => option);
        }
        
        if (isNewField) {
            templateData.fields.push(fieldData);
            addFieldToCanvas(fieldData, templateData.fields.length - 1);
            addFieldToList(fieldData, templateData.fields.length - 1);
        } else {
            templateData.fields[currentFieldIndex] = fieldData;
            updateFieldOnCanvas(fieldData, currentFieldIndex);
            updateFieldInList(fieldData, currentFieldIndex);
        }
        
        closeFieldModal();
    });
    
    // Save template button
    saveTemplateBtn.addEventListener('click', () => {
        // Show "Coming soon..." notification
        showSuccessModal();
        
        // Hide any loading overlay if it's visible
        if (loadingOverlay.style.display === 'flex') {
            loadingOverlay.style.display = 'none';
        }
    });
    
    goToHomeBtn.addEventListener('click', () => {
        window.location.href = '/';
    });
    
    // Helper functions
    function resetFieldForm() {
        fieldName.value = '';
        fieldType.value = 'text';
        selectOptionsGroup.style.display = 'none';
        selectOptions.value = '';
        maxLength.value = '50';
        isRequired.checked = false;
        fieldX.value = '0';
        fieldY.value = '0';
        fieldWidth.value = '200';
        fontSize.value = '16';
        fontFamily.value = 'Cairo';
    }
    
    function openFieldModal() {
        fieldEditorModal.style.display = 'flex';
    }
    
    function closeFieldModal() {
        fieldEditorModal.style.display = 'none';
    }
    
    function showSuccessModal() {
        successModal.style.display = 'flex';
    }
    
    function addFieldToCanvas(fieldData, index) {
        const fieldElement = document.createElement('div');
        fieldElement.className = 'canvas-field';
        fieldElement.id = `canvas-field-${index}`;
        fieldElement.style.left = `${fieldData.x}px`;
        fieldElement.style.top = `${fieldData.y}px`;
        fieldElement.style.width = `${fieldData.width}px`;
        fieldElement.style.fontSize = `${fieldData.fontSize}px`;
        fieldElement.style.fontFamily = fieldData.fontFamily;
        
        const fieldLabel = document.createElement('div');
        fieldLabel.className = 'canvas-field-label';
        fieldLabel.textContent = fieldData.name;
        
        const fieldContent = document.createElement('div');
        fieldContent.textContent = getPlaceholderText(fieldData);
        
        fieldElement.appendChild(fieldLabel);
        fieldElement.appendChild(fieldContent);
        templateCanvas.appendChild(fieldElement);
        
        makeFieldDraggable(fieldElement, index);
    }
    
    function updateFieldOnCanvas(fieldData, index) {
        const fieldElement = document.getElementById(`canvas-field-${index}`);
        if (fieldElement) {
            fieldElement.style.left = `${fieldData.x}px`;
            fieldElement.style.top = `${fieldData.y}px`;
            fieldElement.style.width = `${fieldData.width}px`;
            fieldElement.style.fontSize = `${fieldData.fontSize}px`;
            fieldElement.style.fontFamily = fieldData.fontFamily;
            
            const fieldLabel = fieldElement.querySelector('.canvas-field-label');
            fieldLabel.textContent = fieldData.name;
            
            const fieldContent = fieldElement.querySelector('div:not(.canvas-field-label)');
            fieldContent.textContent = getPlaceholderText(fieldData);
        }
    }
    
    function getPlaceholderText(fieldData) {
        switch (fieldData.type) {
            case 'text':
                return 'نص...';
            case 'number':
                return '123';
            case 'date':
                return '01/01/2025';
            case 'time':
                return '12:00';
            case 'select':
                return fieldData.options && fieldData.options.length > 0 ? fieldData.options[0] : 'اختر...';
            default:
                return 'نص...';
        }
    }
    
    function addFieldToList(fieldData, index) {
        const fieldItem = document.createElement('div');
        fieldItem.className = 'field-item';
        fieldItem.id = `field-item-${index}`;
        
        const fieldTitle = document.createElement('h4');
        fieldTitle.textContent = fieldData.name;
        
        const fieldInfo = document.createElement('p');
        fieldInfo.textContent = getFieldTypeText(fieldData.type);
        
        const fieldActions = document.createElement('div');
        fieldActions.className = 'field-actions';
        
        const editButton = document.createElement('button');
        editButton.className = 'edit-field-btn';
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.addEventListener('click', () => {
            editField(index);
        });
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-field-btn';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener('click', () => {
            deleteField(index);
        });
        
        fieldActions.appendChild(editButton);
        fieldActions.appendChild(deleteButton);
        
        fieldItem.appendChild(fieldTitle);
        fieldItem.appendChild(fieldInfo);
        fieldItem.appendChild(fieldActions);
        
        fieldsList.appendChild(fieldItem);
    }
    
    function updateFieldInList(fieldData, index) {
        const fieldItem = document.getElementById(`field-item-${index}`);
        if (fieldItem) {
            const fieldTitle = fieldItem.querySelector('h4');
            fieldTitle.textContent = fieldData.name;
            
            const fieldInfo = fieldItem.querySelector('p');
            fieldInfo.textContent = getFieldTypeText(fieldData.type);
        }
    }
    
    function getFieldTypeText(type) {
        switch (type) {
            case 'text':
                return 'نص';
            case 'number':
                return 'رقم';
            case 'date':
                return 'تاريخ';
            case 'time':
                return 'وقت';
            case 'select':
                return 'قائمة منسدلة';
            default:
                return 'نص';
        }
    }
    
    function editField(index) {
        currentFieldIndex = index;
        isNewField = false;
        
        const fieldData = templateData.fields[index];
        
        fieldName.value = fieldData.name;
        fieldType.value = fieldData.type;
        maxLength.value = fieldData.maxLength;
        isRequired.checked = fieldData.required;
        fieldX.value = fieldData.x;
        fieldY.value = fieldData.y;
        fieldWidth.value = fieldData.width;
        fontSize.value = fieldData.fontSize;
        fontFamily.value = fieldData.fontFamily;
        
        if (fieldData.type === 'select') {
            selectOptionsGroup.style.display = 'block';
            selectOptions.value = fieldData.options ? fieldData.options.join(', ') : '';
        } else {
            selectOptionsGroup.style.display = 'none';
        }
        
        openFieldModal();
    }
    
    function deleteField(index) {
        if (confirm('هل أنت متأكد من حذف هذا الحقل؟')) {
            // Remove from template data
            templateData.fields.splice(index, 1);
            
            // Remove from canvas
            const canvasField = document.getElementById(`canvas-field-${index}`);
            if (canvasField) {
                canvasField.remove();
            }
            
            // Remove from list
            const listField = document.getElementById(`field-item-${index}`);
            if (listField) {
                listField.remove();
            }
            
            // Update IDs for remaining fields
            updateFieldIds();
        }
    }
    
    function updateFieldIds() {
        // Update canvas field IDs
        const canvasFields = document.querySelectorAll('.canvas-field');
        canvasFields.forEach((field, index) => {
            field.id = `canvas-field-${index}`;
        });
        
        // Update list field IDs
        const listFields = document.querySelectorAll('.field-item');
        listFields.forEach((field, index) => {
            field.id = `field-item-${index}`;
            
            // Update event listeners
            const editButton = field.querySelector('.edit-field-btn');
            const deleteButton = field.querySelector('.delete-field-btn');
            
            editButton.replaceWith(editButton.cloneNode(true));
            deleteButton.replaceWith(deleteButton.cloneNode(true));
            
            field.querySelector('.edit-field-btn').addEventListener('click', () => {
                editField(index);
            });
            
            field.querySelector('.delete-field-btn').addEventListener('click', () => {
                deleteField(index);
            });
        });
    }
    
    function makeFieldDraggable(element, index) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        element.addEventListener('mousedown', dragMouseDown);
        
        function dragMouseDown(e) {
            e.preventDefault();
            // Get the mouse cursor position at startup
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            // Select this field
            document.querySelectorAll('.canvas-field').forEach(field => {
                field.classList.remove('selected');
            });
            element.classList.add('selected');
            
            document.addEventListener('mouseup', closeDragElement);
            document.addEventListener('mousemove', elementDrag);
        }
        
        function elementDrag(e) {
            e.preventDefault();
            // Calculate the new cursor position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            // Set the element's new position
            const newTop = element.offsetTop - pos2;
            const newLeft = element.offsetLeft - pos1;
            
            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
            
            // Update the field data
            templateData.fields[index].x = newLeft;
            templateData.fields[index].y = newTop;
        }
        
        function closeDragElement() {
            // Stop moving when mouse button is released
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('mousemove', elementDrag);
        }
    }
});
