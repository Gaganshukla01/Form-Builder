import React, { createContext, useContext, useState, useEffect } from "react";
import {
  FieldPropertiesPanel,
  DraggableField,
  FormPreview
} from "../components/FieldRenderer.jsx";
import { defaultField } from "../context/FormContext.jsx";
import { toast } from "react-toastify";
import { useFormContext } from "../context/FormContext.jsx";

import {
  Plus,
  Trash2,
  Edit3,
  Eye,
  Save,
  Share2,
  Smartphone,
  Tablet,
  Monitor,
  GripVertical,
  Settings,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Type,
  FileText,
  CheckSquare,
  ChevronDown,
  Calendar,
  Mail,
  Phone,
  Hash,
} from "lucide-react";

const FormBuilderApp = () => {
  const {
    steps,
    currentStep,
    setCurrentStep,
    addField,
    addStep,
    removeStep,
    isPreview,
    insertFieldAtIndex,
    setIsPreview,
    previewMode,
    setPreviewMode,
    formTitle,
    setFormTitle,
    saveForm,
    shareId,
    loadTemplate,
  } = useFormContext();

  const [draggedFieldType, setDraggedFieldType] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const fieldTypes = [
    { type: "text", icon: Type, label: "Text" },
    { type: "email", icon: Mail, label: "Email" },
    { type: "phone", icon: Phone, label: "Phone" },
    { type: "number", icon: Hash, label: "Number" },
    { type: "textarea", icon: FileText, label: "Textarea" },
    { type: "checkbox", icon: CheckSquare, label: "Checkbox" },
    { type: "dropdown", icon: ChevronDown, label: "Dropdown" },
    { type: "date", icon: Calendar, label: "Date" },
  ];

  const templates = [
    {
      title: "Contact Form",
      steps: [
        [
          { ...defaultField("text"), label: "Full Name", required: true },
          { ...defaultField("email"), label: "Email Address", required: true },
          { ...defaultField("phone"), label: "Phone Number" },
          { ...defaultField("textarea"), label: "Message", required: true },
        ],
      ],
    },
    {
      title: "Registration Form",
      steps: [
        [
          { ...defaultField("text"), label: "First Name", required: true },
          { ...defaultField("text"), label: "Last Name", required: true },
          { ...defaultField("email"), label: "Email", required: true },
        ],
        [
          { ...defaultField("phone"), label: "Phone Number" },
          { ...defaultField("date"), label: "Date of Birth" },
          {
            ...defaultField("dropdown"),
            label: "Country",
            options: ["USA", "Canada", "UK", "Other"],
          },
        ],
      ],
    },
  ];

  // Handle drag start for field types
  const handleFieldTypeDragStart = (e, fieldType) => {
    setDraggedFieldType(fieldType);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/plain", fieldType);
  };

  // Handle drop in the form builder area
  const handleFormBuilderDrop = (e, dropIndex = null) => {
    e.preventDefault();

    if (draggedFieldType) {
      if (typeof insertFieldAtIndex === "function" && dropIndex !== null) {
        insertFieldAtIndex(draggedFieldType, currentStep, dropIndex);
      } else {
        addField(draggedFieldType, currentStep);
      }

      setDraggedFieldType(null);
      setDragOverIndex(null);
    }
  };

  // Handle drag over in form builder
  const handleFormBuilderDragOver = (e, index = null) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDragOverIndex(index);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const exportForm = () => {
    const formData = {
      title: formTitle,
      steps,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(formData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${formTitle.replace(/\s+/g, "_").toLowerCase()}_form.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importForm = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const formData = JSON.parse(e.target.result);
          setFormTitle(formData.title || "Imported Form");
          loadTemplate(formData);
        } catch (error) {
          toast.error("Invalid form file");
        }
      };
      reader.readAsText(file);
    }
  };

  if (isPreview) {
  return (
    <FormPreview 
      steps={steps}
      formTitle={formTitle}
      previewMode={previewMode}
      setPreviewMode={setPreviewMode}
      setIsPreview={setIsPreview}
    />
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-3 py-2 hover:bg-white/30 transition-all duration-200"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      const template = templates.find(
                        (t) => t.title === e.target.value
                      );
                      if (template) loadTemplate(template);
                    }
                  }}
                  className="px-4 py-2 border border-white/30 rounded-xl bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg transition-all duration-200 hover:shadow-xl"
                  defaultValue=""
                >
                  <option value="">Load Template</option>
                  {templates.map((template) => (
                    <option key={template.title} value={template.title}>
                      {template.title}
                    </option>
                  ))}
                </select>

                <button
                  onClick={exportForm}
                  className="flex items-center space-x-2 px-4 py-2 border border-white/30 rounded-xl bg-white/70 backdrop-blur-sm hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>

                <label className="flex items-center space-x-2 px-4 py-2 border border-white/30 rounded-xl bg-white/70 backdrop-blur-sm hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Import</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importForm}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                onClick={() => setIsPreview(true)}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-white/50"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>

              <button
                onClick={saveForm}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-blue-500/50"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>

              {shareId && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/form/${shareId}`
                    );
                    toast.success("Share link copied to clipboard!");
                    

                  }}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-green-500/50"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Field Types */}
          <div className="col-span-3">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/30 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Field Types
                <span className="block text-xs text-gray-500 font-normal mt-1">
                  Drag to add fields
                </span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {fieldTypes.map(({ type, icon: Icon, label }) => (
                  <div
                    key={type}
                    draggable={true}
                    onDragStart={(e) => handleFieldTypeDragStart(e, type)}
                    onDragEnd={() => setDraggedFieldType(null)}
                    className="flex flex-col items-center space-y-2 p-3 border border-white/40 rounded-xl hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all duration-200 group shadow-md hover:shadow-lg hover:scale-105 bg-white/50 backdrop-blur-sm cursor-grab active:cursor-grabbing select-none"
                  >
                    <GripVertical className="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                    <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                    <span className="text-xs text-gray-700 group-hover:text-blue-700 font-medium text-center">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {steps.length > 1 && (
                <div className="mt-6 pt-6 border-t border-white/30">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Steps
                  </h4>
                  <div className="space-y-2">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                          currentStep === index
                            ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-md border-2 border-blue-300"
                            : "hover:bg-white/60 bg-white/30 border border-white/40 hover:shadow-md"
                        }`}
                      >
                        <button
                          onClick={() => setCurrentStep(index)}
                          className="flex-1 text-left text-sm font-medium"
                        >
                          Step {index + 1}
                        </button>
                        {steps.length > 1 && (
                          <button
                            onClick={() => removeStep(index)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addStep}
                      className="w-full p-3 border-2 border-dashed border-white/50 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-white/30 transition-all duration-200 font-medium"
                    >
                      + Add Step
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Form Builder */}
          <div className="col-span-6">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300">
              <div className="p-6 border-b border-white/30 bg-gradient-to-r from-white/50 to-white/30 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Form Builder - Step {currentStep + 1}
                  </h3>
                  {steps.length > 1 && (
                    <div className="flex items-center space-x-2 bg-white/50 rounded-xl p-1 shadow-md">
                      <button
                        onClick={() =>
                          setCurrentStep(Math.max(0, currentStep - 1))
                        }
                        disabled={currentStep === 0}
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-white/70 transition-all duration-200"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-gray-500 font-medium px-2">
                        {currentStep + 1} / {steps.length}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentStep(
                            Math.min(steps.length - 1, currentStep + 1)
                          )
                        }
                        disabled={currentStep === steps.length - 1}
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-white/70 transition-all duration-200"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="p-6 min-h-96"
                onDrop={(e) => handleFormBuilderDrop(e)}
                onDragOver={(e) => handleFormBuilderDragOver(e)}
                onDragLeave={handleDragLeave}
              >
                <div className="space-y-4">
                  {(steps[currentStep] || []).length === 0 ? (
                    <div
                      className={`text-center py-12 text-gray-500 border-2 border-dashed rounded-xl transition-all duration-200 ${
                        draggedFieldType
                          ? "border-blue-400 bg-blue-50/50 text-blue-600"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="mb-4">
                        <Plus
                          className={`w-12 h-12 mx-auto transition-colors duration-200 ${
                            draggedFieldType ? "text-blue-400" : "text-gray-300"
                          }`}
                        />
                      </div>
                      <p className="text-lg mb-2 font-medium">
                        {draggedFieldType
                          ? "Drop field here"
                          : "No fields added yet"}
                      </p>
                      <p className="text-sm">
                        {draggedFieldType
                          ? "Release to add the field to your form"
                          : "Drag a field type from the sidebar or click to add"}
                      </p>
                    </div>
                  ) : (
                    <>
                      {(steps[currentStep] || []).map((field, index) => (
                        <React.Fragment key={field.id}>
                          {/* Drop zone above each field */}
                          <div
                            className={`h-2 rounded transition-all duration-200 ${
                              dragOverIndex === index && draggedFieldType
                                ? "bg-blue-400 shadow-lg"
                                : "hover:bg-blue-200/50"
                            }`}
                            onDrop={(e) => handleFormBuilderDrop(e, index)}
                            onDragOver={(e) =>
                              handleFormBuilderDragOver(e, index)
                            }
                          />
                          <DraggableField
                            field={field}
                            index={index}
                            stepIndex={currentStep}
                          />
                        </React.Fragment>
                      ))}

                      {/* Drop zone at the end */}
                      <div
                        className={`h-4 rounded transition-all duration-200 ${
                          dragOverIndex === (steps[currentStep] || []).length &&
                          draggedFieldType
                            ? "bg-blue-400 shadow-lg"
                            : "hover:bg-blue-200/50"
                        }`}
                        onDrop={(e) =>
                          handleFormBuilderDrop(
                            e,
                            (steps[currentStep] || []).length
                          )
                        }
                        onDragOver={(e) =>
                          handleFormBuilderDragOver(
                            e,
                            (steps[currentStep] || []).length
                          )
                        }
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Field Properties */}
          <div className="col-span-3">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300">
              <FieldPropertiesPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilderApp;
