import FormEntry from "../model/FormResponseModel";
import transporter from "../config/nodeMailer.js";

export const resFormAdd = async (req, res) => {
  try {

    
    const entry = new FormEntry({ steps: req.body.steps || {} });
    await entry.save();

    // send mail
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Response Received",
      text: "Thank you for your submission. We've received your response.",
    };
    await transporter.sendMail(mailOption);

    
    res.status(201).json({ success: true, id: entry._id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const formRes = async (req, res) => {
  try {
    const entries = await FormEntry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: entries });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = router;
