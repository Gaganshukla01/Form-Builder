import { useState } from "react";
import { useFormContext } from "../context/FormContext.jsx";
import {
  Trash2,
  GripVertical,
  ArrowLeft,    
  ArrowRight,   
  Send,  
  Settings,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Tablet,
  Smartphone,
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

// FormPreview Component
export const FormPreview = ({ 
  steps = [], 
  formTitle = "Form Preview", 
  previewMode = 'desktop', 
  setPreviewMode,
  setIsPreview 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: null
      }));
    }
  };

  const validateCurrentStep = () => {
    const currentStepFields = steps[currentStep] || [];
    const newErrors = {};
    let isValid = true;

    currentStepFields.forEach(field => {
      if (field.required && (!formData[field.id] || formData[field.id].toString().trim() === '')) {
        newErrors[field.id] = `${field.label} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateCurrentStep()) {
      console.log('Form submitted:', formData);
      alert('Form submitted successfully!');
    }
  };

  const renderField = (field) => {
    const hasError = errors[field.id];
    const baseInputClasses = `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
      hasError 
        ? 'border-red-500 bg-red-50' 
        : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
    }`;

    const value = formData[field.id] || '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <input
            type={field.type === 'phone' ? 'tel' : field.type}
            id={field.id}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className={baseInputClasses}
            required={field.required}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            id={field.id}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className={baseInputClasses}
            required={field.required}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            rows={4}
            className={baseInputClasses}
            required={field.required}
          />
        );
      
      case 'dropdown':
        return (
          <select
            id={field.id}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={baseInputClasses}
            required={field.required}
          >
            <option value="">Select {field.label.toLowerCase()}</option>
            {(field.options || []).map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id={field.id}
              checked={value || false}
              onChange={(e) => handleInputChange(field.id, e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required={field.required}
            />
            <label htmlFor={field.id} className="text-sm text-gray-700">
              {field.label}
            </label>
          </div>
        );
      
      case 'date':
        return (
          <input
            type="date"
            id={field.id}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={baseInputClasses}
            required={field.required}
          />
        );
      
      default:
        return (
          <input
            type="text"
            id={field.id}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className={baseInputClasses}
            required={field.required}
          />
        );
    }
  };

  const getContainerClasses = () => {
    switch (previewMode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      case 'desktop':
      default:
        return 'max-w-4xl mx-auto';
    }
  };

  const getFormClasses = () => {
    const baseClasses = 'bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden';
    switch (previewMode) {
      case 'mobile':
        return `${baseClasses} mx-4`;
      case 'tablet':
        return `${baseClasses} mx-6`;
      case 'desktop':
      default:
        return baseClasses;
    }
  };

  const currentStepFields = steps[currentStep] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => setIsPreview && setIsPreview(false)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Builder</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/30">
                <button
                  onClick={() => setPreviewMode && setPreviewMode("desktop")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    previewMode === "desktop" 
                      ? "bg-white shadow-md scale-105 text-blue-600" 
                      : "hover:bg-white/50 text-gray-600"
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode && setPreviewMode("tablet")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    previewMode === "tablet" 
                      ? "bg-white shadow-md scale-105 text-blue-600" 
                      : "hover:bg-white/50 text-gray-600"
                  }`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode && setPreviewMode("mobile")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    previewMode === "mobile" 
                      ? "bg-white shadow-md scale-105 text-blue-600" 
                      : "hover:bg-white/50 text-gray-600"
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-8">
        <div className={getContainerClasses()}>
          <div className={getFormClasses()}>
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <h1 className={`font-bold ${
                previewMode === 'mobile' ? 'text-xl' : 
                previewMode === 'tablet' ? 'text-2xl' : 'text-3xl'
              }`}>
                {formTitle}
              </h1>
              {steps.length > 1 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm opacity-90">
                    <span>Step {currentStep + 1} of {steps.length}</span>
                    <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
                  </div>
                  <div className="mt-2 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {currentStepFields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    {field.type !== 'checkbox' && (
                      <label 
                        htmlFor={field.id} 
                        className="block text-sm font-medium text-gray-700"
                      >
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                    )}
                    {renderField(field)}
                    {errors[field.id] && (
                      <p className="text-red-500 text-sm">{errors[field.id]}</p>
                    )}
                  </div>
                ))}
              </div>
              
              <div className={`mt-8 flex ${
                steps.length > 1 ? 'justify-between' : 'justify-end'
              }`}>
                {steps.length > 1 && currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                )}

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 ml-auto"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 ml-auto"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};