import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  ChevronLeft, 
  ArrowLeft, 
  ArrowRight, 
  Send, 
  Monitor, 
  Tablet, 
  Smartphone 
} from 'lucide-react';
import { toast } from 'react-toastify';

const backend_url = import.meta.env.VITE_BACKEND_URI;

const PreviewFormPage = () => {
  const { shareId } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [previewMode, setPreviewMode] = useState('desktop');

  // Function to detect device type based on screen width
  const getDeviceType = () => {
    const width = window.innerWidth;
    if (width < 768) {
      return 'mobile';
    } else if (width < 1024) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  };

  // Set initial preview mode based on device
  useEffect(() => {
    const deviceType = getDeviceType();
    setPreviewMode(deviceType);

    // Add event listener for window resize
    const handleResize = () => {
      const newDeviceType = getDeviceType();
      setPreviewMode(newDeviceType);
    };

    window.addEventListener('resize', handleResize);
    
 
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(`${backend_url}/api/form/share/${shareId}`);
        setForm(res.data);
      } catch (err) {
        console.error('Failed to load form:', err);
        alert('This form link is invalid or has been removed.');
      }
    };
    fetchForm();
  }, [shareId]);

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
    if (!form?.steps?.length) return true;
    
    const currentStepFields = form.steps[currentStep] || [];
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
      setCurrentStep(prev => Math.min(prev + 1, form.steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateCurrentStep()) return;

  try {
    const response = await axios.post(`${backend_url}/api/formres/formresadd`, {
      shareId, 
      steps: {
        [`step${currentStep + 1}`]: formData  
      },
    });
    if(response){
    toast.success('Form submitted successfully!');
    }

    console.log(response.data);
  } catch (err) {
    toast.err('There was a problem submitting the form.');
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

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 mx-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <p className="text-gray-500 mt-4">Loading form...</p>
        </div>
      </div>
    );
  }


  const steps = form.steps && Array.isArray(form.steps) && form.steps.length > 0 
    ? form.steps 
    : [form.steps?.flat() || []];
    
  const currentStepFields = steps[currentStep] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <a
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </a>

            {/* Preview Mode Toggle - Hidden on mobile for better UX */}
            {/* <div className="hidden sm:flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/30">
                <button
                  onClick={() => setPreviewMode("desktop")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    previewMode === "desktop" 
                      ? "bg-white shadow-md scale-105 text-blue-600" 
                      : "hover:bg-white/50 text-gray-600"
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode("tablet")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    previewMode === "tablet" 
                      ? "bg-white shadow-md scale-105 text-blue-600" 
                      : "hover:bg-white/50 text-gray-600"
                  }`}
                  title="Tablet View"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode("mobile")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    previewMode === "mobile" 
                      ? "bg-white shadow-md scale-105 text-blue-600" 
                      : "hover:bg-white/50 text-gray-600"
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div> */}

            {/* Mobile indicator */}
            <div className="sm:hidden flex items-center space-x-2 text-sm text-gray-600">
              {previewMode === 'mobile' && <Smartphone className="w-4 h-4" />}
              {previewMode === 'tablet' && <Tablet className="w-4 h-4" />}
              {previewMode === 'desktop' && <Monitor className="w-4 h-4" />}
              <span className="capitalize">{previewMode}</span>
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
                {form.title}
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
                    {field.helpText && (
                      <p className="text-sm text-gray-500">{field.helpText}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className={`mt-8 flex ${
                steps.length > 1 ? 'justify-between' : 'justify-end'
              } ${previewMode === 'mobile' ? 'flex-col space-y-3' : 'flex-row'}`}>
                {steps.length > 1 && currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className={`flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 hover:scale-105 ${
                      previewMode === 'mobile' ? 'w-full order-2' : ''
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                )}

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className={`flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 ${
                      previewMode === 'mobile' ? 'w-full order-1' : 'ml-auto'
                    }`}
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 ${
                      previewMode === 'mobile' ? 'w-full order-1' : 'ml-auto'
                    }`}
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

export default PreviewFormPage;