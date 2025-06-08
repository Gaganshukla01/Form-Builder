import { google } from "googleapis";
// import key from "../key.json" assert { type: "json" }; 

const auth = new google.auth.GoogleAuth({
  credentials: "key",
  scopes: ["https://www.googleapis.com/auth/documents", "https://www.googleapis.com/auth/drive"],
});

export const createGoogleDoc = async (req, res) => {
  const { textData } = req.body;
    console.log(textData)
  if (!textData) {
    return res.status(400).json({ message: "Text data is required" });
  }

  try {
    const docs = google.docs({ version: "v1", auth });
    const drive = google.drive({ version: "v3", auth });

   
    const doc = await docs.documents.create({
      requestBody: {
        title: "New Document",
      },
    });

    const docId = doc.data.documentId;
    console.log("Google Doc created with ID:", docId);

  
    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: textData,
            },
          },
        ],
      },
    });

    console.log("Text added to Google Doc.");
  
    await drive.files.update({
      fileId: docId,
      addParents: "1KnrRCdUS1YcwVRo5D6Ce6CNdWO8nHNlX", 
      fields: "id, parents",
    });


  
    return res.status(200).json({
      message: "Document created successfully!",
      docLink: `https://docs.google.com/document/d/${docId}`,
    });

  } catch (error) {
    console.error("Error creating Google Doc:", error);
    return res.status(500).json({ error: "Failed to create Google Doc" });
  }
};
