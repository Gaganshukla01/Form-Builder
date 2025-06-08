// Field Components
import { useFormContext } from "../context/FormContext.jsx";
import {

  Trash2,
  GripVertical,
  Settings,
  ChevronLeft,
  ChevronRight,
  
} from 'lucide-react';
export const FieldRenderer = ({ field, onChange, preview = false }) => {
  const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
  
  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            className={baseClasses}
            placeholder={field.placeholder}
            required={field.required}
            onChange={onChange}
            minLength={field.validations?.minLength || undefined}
            maxLength={field.validations?.maxLength || undefined}
            pattern={field.validations?.pattern || undefined}
          />
        );
      case 'email':
        return (
          <input
            type="email"
            className={baseClasses}
            placeholder={field.placeholder}
            required={field.required}
            onChange={onChange}
          />
        );
      case 'phone':
        return (
          <input
            type="tel"
            className={baseClasses}
            placeholder={field.placeholder}
            required={field.required}
            onChange={onChange}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            className={baseClasses}
            placeholder={field.placeholder}
            required={field.required}
            onChange={onChange}
          />
        );
      case 'textarea':
        return (
          <textarea
            className={`${baseClasses} min-h-[100px] resize-vertical`}
            placeholder={field.placeholder}
            required={field.required}
            onChange={onChange}
            rows={4}
          />
        );
      case 'checkbox':
        return (
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              required={field.required}
              onChange={onChange}
            />
            <span className="text-gray-700">{field.label}</span>
          </label>
        );
      case 'dropdown':
        return (
          <select className={baseClasses} required={field.required} onChange={onChange}>
            <option value="">Choose an option...</option>
            {field.options?.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'date':
        return (
          <input
            type="date"
            className={baseClasses}
            required={field.required}
            onChange={onChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {field.type !== 'checkbox' && (
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderField()}
      {field.helpText && (
        <p className="text-sm text-gray-500">{field.helpText}</p>
      )}
    </div>
  );
};

// Draggable Field Component
export const DraggableField = ({ field, index, stepIndex }) => {
  const { selectedFieldId, setSelectedFieldId, removeField, reorderFields } = useFormContext();
  const isSelected = selectedFieldId === field.id;

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ field, index, stepIndex }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (dragData.stepIndex === stepIndex && dragData.index !== index) {
      reorderFields(stepIndex, dragData.index, index);
    }
  };

  return (
    <div
      className={`group relative p-4 border-2 rounded-lg transition-all cursor-pointer ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
      onClick={() => setSelectedFieldId(field.id)}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <FieldRenderer field={field} onChange={() => {}} preview={false} />
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeField(field.id);
            }}
            className="p-1 text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Field Properties Panel
export const FieldPropertiesPanel = () => {
  const { steps, selectedFieldId, updateField } = useFormContext();
  
  const selectedField = steps.flat().find(field => field.id === selectedFieldId);
  
  if (!selectedField) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>Select a field to edit its properties</p>
      </div>
    );
  }

  const handleUpdate = (key, value) => {
    updateField(selectedField.id, { [key]: value });
  };

  const handleValidationUpdate = (key, value) => {
    updateField(selectedField.id, {
      validations: { ...selectedField.validations, [key]: value }
    });
  };

  const handleOptionsUpdate = (options) => {
    updateField(selectedField.id, { options });
  };

  return (
    <div className="p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Field Properties</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
          <input
            type="text"
            value={selectedField.label}
            onChange={(e) => handleUpdate('label', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {selectedField.type !== 'checkbox' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder</label>
            <input
              type="text"
              value={selectedField.placeholder}
              onChange={(e) => handleUpdate('placeholder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Help Text</label>
          <textarea
            value={selectedField.helpText}
            onChange={(e) => handleUpdate('helpText', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="required"
            checked={selectedField.required}
            onChange={(e) => handleUpdate('required', e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="required" className="ml-2 text-sm text-gray-700">Required field</label>
        </div>

        {selectedField.type === 'dropdown' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
            <div className="space-y-2">
              {selectedField.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...selectedField.options];
                      newOptions[index] = e.target.value;
                      handleOptionsUpdate(newOptions);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => {
                      const newOptions = selectedField.options.filter((_, i) => i !== index);
                      handleOptionsUpdate(newOptions);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleOptionsUpdate([...selectedField.options, `Option ${selectedField.options.length + 1}`])}
                className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-md text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
              >
                + Add Option
              </button>
            </div>
          </div>
        )}

        {(selectedField.type === 'text' || selectedField.type === 'textarea') && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Validation</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Length</label>
                <input
                  type="number"
                  value={selectedField.validations?.minLength || ''}
                  onChange={(e) => handleValidationUpdate('minLength', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Length</label>
                <input
                  type="number"
                  value={selectedField.validations?.maxLength || ''}
                  onChange={(e) => handleValidationUpdate('maxLength', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Form Preview Component
export const FormPreview = () => {
  const { steps, currentStep, setCurrentStep, previewMode, formTitle } = useFormContext();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleFieldChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: null }));
    }
  };

  const validateStep = (stepIndex) => {
    const stepFields = steps[stepIndex] || [];
    const stepErrors = {};
    
    stepFields.forEach(field => {
      const value = formData[field.id];
      
      if (field.required && (!value || value.toString().trim() === '')) {
        stepErrors[field.id] = 'This field is required';
      } else if (value && field.validations) {
        if (field.validations.minLength && value.length < parseInt(field.validations.minLength)) {
          stepErrors[field.id] = `Minimum length is ${field.validations.minLength}`;
        }
        if (field.validations.maxLength && value.length > parseInt(field.validations.maxLength)) {
          stepErrors[field.id] = `Maximum length is ${field.validations.maxLength}`;
        }
      }
    });
    
    return stepErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    alert('Form submitted successfully!');
    console.log('Form Data:', formData);
  };

  const currentFields = steps[currentStep] || [];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const containerClasses = {
    desktop: 'max-w-2xl mx-auto',
    tablet: 'max-w-lg mx-auto',
    mobile: 'max-w-sm mx-auto'
  };

  return (
    <div className={`p-6 ${containerClasses[previewMode]}`}>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{formTitle}</h1>
          
          {steps.length > 1 && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentFields.map((field) => (
            <div key={field.id}>
              <FieldRenderer
                field={field}
                onChange={(e) => {
                  const value = field.type === 'checkbox' ? e.target.checked : e.target.value;
                  handleFieldChange(field.id, value);
                }}
                preview={true}
              />
              {errors[field.id] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
              )}
            </div>
          ))}

          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <span>Submit</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};