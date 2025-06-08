import Form from "../model/Form.js";
import { v4 as uuidv4 } from 'uuid';

export const formCreate = async (req, res) => {
  try {
    const form = new Form({ ...req.body, shareId: uuidv4() });
    await form.save();
    res.json({ id: form._id, shareId: form.shareId }); 
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


export const getByid=async(req,res)=>{
     try {
    const form = await Form.findById(req.params.id);
    res.json(form);
  } catch (e) {
    res.status(404).json({ error: 'Not found' });
  }
}
export const getShareId=async(req,res)=>{
  try {
    const form = await Form.findOne({ shareId: req.params.shareId });
    res.json(form);
  } catch (e) {
    res.status(404).json({ error: 'Not found' });
  }
}