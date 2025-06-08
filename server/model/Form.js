import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema({
  id: String,
  type: String,
  label: String,
  placeholder: String,
  required: Boolean,
  helpText: String,
  options: [String],
  validations: Object
});

const FormSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  steps: [[FieldSchema]],
  shareId: String
}, { timestamps: true });

const Form = mongoose.model('Form', FormSchema);

export default Form;