import mongoose from "mongoose";
const FormEntrySchema = new mongoose.Schema({
  steps: {
    type: Map, 
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, { timestamps: true });

const FormEntry = mongoose.model("FormEntry", FormEntrySchema);
export default FormEntry;
