import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';
import { FieldRenderer } from '../components/FieldRenderer';
const backend_url = import.meta.env.VITE_BACKEND_URI;

const PreviewFormPage = () => {
  const { shareId } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

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

  const handleChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const stepErrors = {};
    form.steps.flat().forEach(field => {
      const value = formData[field.id];
      if (field.required && (!value || value.toString().trim() === '')) {
        stepErrors[field.id] = 'This field is required';
      }
    });
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    alert('Form submitted successfully!');
    console.log('Submitted Data:', formData);
  };

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 animate-pulse">
        Loading form...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50 to-blue-50 px-6 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <a href="/" className="flex items-center text-blue-600 hover:underline">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </a>
          <h1 className="text-xl font-semibold text-gray-800">{form.title}</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.steps.flat().map((field) => (
            <div key={field.id}>
              <FieldRenderer
                field={field}
                onChange={(e) => {
                  const val = field.type === 'checkbox' ? e.target.checked : e.target.value;
                  handleChange(field.id, val);
                }}
                preview={true}
              />
              {errors[field.id] && <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>}
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PreviewFormPage;
