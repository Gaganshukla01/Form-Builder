import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
const backend_url = import.meta.env.VITE_BACKEND_URI;
import { toast } from "react-toastify";

const FormContext = createContext();

export const defaultField = (type) => ({
  id: Math.random().toString(36).substr(2, 9),
  type,
  label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
  placeholder: `Enter ${type}...`,
  required: false,
  helpText: "",
  options: type === "dropdown" ? ["Option 1", "Option 2"] : [],
  validations: {
    minLength: "",
    maxLength: "",
    pattern: "",
  },
});

export const FormProvider = ({ children }) => {
  const [steps, setSteps] = useState([[]]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [isPreview, setIsPreview] = useState(false);
  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [formId, setFormId] = useState(null);
  const [shareId, setShareId] = useState(null);
  const [draggedField, setDraggedField] = useState(null);

  const addField = (type, stepIndex = currentStep) => {
    const field = defaultField(type);
    const updatedSteps = [...steps];
    if (!updatedSteps[stepIndex]) updatedSteps[stepIndex] = [];
    updatedSteps[stepIndex] = [...updatedSteps[stepIndex], field];
    setSteps(updatedSteps);
    setSelectedFieldId(field.id);
  };

  const insertFieldAtIndex = (fieldType, stepIndex, insertIndex) => {
    const newField = defaultField(fieldType);
    const newSteps = [...steps];
    const currentStepFields = [...(newSteps[stepIndex] || [])];

    if (insertIndex >= 0 && insertIndex <= currentStepFields.length) {
      currentStepFields.splice(insertIndex, 0, newField);
    } else {
      currentStepFields.push(newField);
    }

    newSteps[stepIndex] = currentStepFields;
    setSteps(newSteps);
    setSelectedFieldId(newField.id);
  };

  const removeField = (id) => {
    const updatedSteps = steps.map((step) =>
      step.filter((field) => field.id !== id)
    );
    setSteps(updatedSteps);
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const updateField = (id, updates) => {
    const updatedSteps = steps.map((step) =>
      step.map((field) => (field.id === id ? { ...field, ...updates } : field))
    );
    setSteps(updatedSteps);
  };

  const reorderFields = (stepIndex, startIndex, endIndex) => {
    const updatedSteps = [...steps];
    const fields = Array.from(updatedSteps[stepIndex]);
    const [reorderedItem] = fields.splice(startIndex, 1);
    fields.splice(endIndex, 0, reorderedItem);
    updatedSteps[stepIndex] = fields;
    setSteps(updatedSteps);
  };

  const addStep = () => {
    setSteps([...steps, []]);
    setCurrentStep(steps.length);
  };

  const removeStep = (index) => {
    if (steps.length <= 1) return;
    const updatedSteps = [...steps];
    updatedSteps.splice(index, 1);
    setSteps(updatedSteps);
    if (currentStep >= updatedSteps.length) {
      setCurrentStep(updatedSteps.length - 1);
    }
  };

  const saveForm = async () => {
    const formData = {
      id: formId || Math.random().toString(36).substr(2, 9),
      title: formTitle,
      steps,
      shareId: shareId || Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage (replace with API call)

    const response = await axios.post(`${backend_url}/api/form/create`, {
      title: formTitle,
      steps,
    });
    console.log(response);
    setFormId(response.data.id);
    setShareId(response.data.shareId);
    alert(`Form saved! Share link ID: ${response.data.shareId}`);
    // localStorage.setItem(`form_${formData.id}`, JSON.stringify(formData));
    // setFormId(formData.id);x
    // setShareId(formData.shareId);
    // alert(`Form saved! Share ID: ${formData.shareId}`);
  };

  const loadTemplate = (template) => {
    setSteps(template.steps);
    setFormTitle(template.title);
  };

  useEffect(() => {
    // Auto-save every 30 seconds
    const autoSave = setInterval(() => {
      if (steps.some((step) => step.length > 0)) {
        saveForm();
      }
    }, 30000);
    return () => clearInterval(autoSave);
  }, [steps, formTitle]);

  return (
    <FormContext.Provider
      value={{
        steps,
        setSteps,
        currentStep,
        setCurrentStep,
        addField,
        removeField,
        updateField,
        reorderFields,
        addStep,
        removeStep,
        insertFieldAtIndex,
        selectedFieldId,
        setSelectedFieldId,
        previewMode,
        setPreviewMode,
        isPreview,
        setIsPreview,
        formTitle,
        setFormTitle,
        formId,
        shareId,
        saveForm,
        loadTemplate,
        draggedField,
        setDraggedField,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => useContext(FormContext);
