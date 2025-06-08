import React, { useState ,useContext} from "react";
import { Copy, Italic, Trash2, Bold, Underline, Strikethrough } from "lucide-react";
import { AppContent } from "../context/Context";
import { toast } from "react-toastify";
import axios from "axios";

const Notes = () => {
  
  const {backend_url}=useContext(AppContent)
  const [text, setText] = useState("");
  const [isItalic, setIsItalic] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState("text-black");
  const [bgColor, setBgColor] = useState("bg-white");
  const [savedNotes, setSavedNotes] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);

  const handleCopy = () => {
    if (text === "") {
      toast.error("Write something");
      return;
    }
    navigator.clipboard.writeText(text);
    toast.success("Text copied to clipboard!");
  };

  const handleClear = () => {
    setText("");
    toast.info("Text cleared!");
  };


  const handleSave = async() => {
    if (text.trim() === "") {
      toast.error("Cannot save an empty note");
      return;
    }
    const newNote = {
      content: text,
      isItalic,
      isBold,
      isUnderline,
      isStrikethrough,
      fontSize,
      textColor,
      bgColor,
    };

    
          axios.defaults.withCredentials=true
          const {data}= await axios.post(backend_url+'/api/notepad/noteSave',{ textData: text })

          if(data.status=200)
          {
            toast.success(data.message)
          }

    if (editingIndex !== -1) {
      const updatedNotes = savedNotes.map((note, index) =>
        index === editingIndex ? newNote : note
      );
      setSavedNotes(updatedNotes);
      setEditingIndex(-1);
      toast.success("Note updated!");
    } else {
      setSavedNotes([...savedNotes, newNote]);
      toast.success("Note saved!");
    }

    setText("");
  };

  const handleEdit = (index) => {
    const noteToEdit = savedNotes[index];
    setText(noteToEdit.content);
    setIsItalic(noteToEdit.isItalic);
    setIsBold(noteToEdit.isBold);
    setIsUnderline(noteToEdit.isUnderline);
    setIsStrikethrough(noteToEdit.isStrikethrough);
    setFontSize(noteToEdit.fontSize);
    setTextColor(noteToEdit.textColor);
    setBgColor(noteToEdit.bgColor);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updatedNotes = savedNotes.filter((_, i) => i !== index);
    setSavedNotes(updatedNotes);
    toast.success("Note deleted!");
  };



  return (
    <div className="flex items-center justify-center min-h-screen 
    ">
      <div className="max-w-lg w-full p-6 border rounded-lg shadow-lg bg-white">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Notepad</h1>
        <div className="flex items-center mb-4 justify-between">
        <div className="flex flex-wrap gap-2 justify-center">
            <button onClick={handleCopy} className="flex basis-1/2 items-center p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-md">
              <Copy className="mr-1" /> Copy
            </button>
            <button onClick={() => setIsBold(!isBold)} className="flex items-center p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition duration-200 shadow-md">
              <Bold className="mr-1" /> Bold
            </button>
            <button onClick={() => setIsItalic(!isItalic)} className="flex items-center p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 shadow-md">
              <Italic className="mr-1" /> Italic
            </button>
            <button onClick={() => setIsUnderline(!isUnderline)} className="flex items-center p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200 shadow-md">
              <Underline className="mr-1" /> Underline
            </button>
            <button onClick={() => setIsStrikethrough(!isStrikethrough)} className="flex items-center p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 shadow-md">
              <Strikethrough className="mr-1" /> Strikethrough
            </button>
            
            <button onClick={handleClear} className="flex items-center p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 shadow-md">
              <Trash2 className="mr-1" /> Clear
            </button>
            <button onClick={handleSave} className="flex items-center p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 shadow-md">
              {editingIndex !== -1 ? "Update" : "Save"}
            </button>
          </div>
          <select onChange={(e) => setFontSize(e.target.value)} className="p-2 m-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
            <option value="16">16px</option>
             <option value="20">20px</option>
            <option value="24">24px</option>
            <option value="28">28px</option>
          </select>
          <select onChange={(e) => setTextColor(e.target.value)} className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
            <option value="text-black">Black</option>
            <option value="text-red-600">Red</option>
            <option value="text-green-600">Green</option>
            <option value="text-blue-600">Blue</option>
          </select>
          <select onChange={(e) => setBgColor(e.target.value)} className="p-2 m-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
            <option value="bg-white">White</option>
            <option value="bg-gray-200">Gray</option>
            <option value="bg-yellow-200">Yellow</option>
            <option value="bg-blue-200">Light Blue</option>
          </select>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={`w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${textColor} ${bgColor}`}
          style={{ fontSize: `${fontSize}px`, fontStyle: isItalic ? 'italic' : 'normal', fontWeight: isBold ? 'bold' : 'normal', textDecoration: isUnderline ? 'underline' : isStrikethrough ? 'line-through' : 'none' }}
          rows="5"
        />
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Saved Notes</h2>
          {savedNotes.length === 0 ? (
            <p className="text-gray-500">No notes saved yet.</p>
          ) : (
            savedNotes.map((note, index) => (
              <div key={index} className="flex justify-between items-center p-2 border-b border-gray-300">
                <div className={`flex-1 ${note.textColor} ${note.bgColor}`} style={{ fontSize: `${note.fontSize}px`, fontStyle: note.isItalic ? 'italic' : 'normal', fontWeight: note.isBold ? 'bold' : 'normal', textDecoration: note.isUnderline ? 'underline' : note.isStrikethrough ? 'line-through' : 'none' }}>
                  {note.listType === "ordered" ? <ol><li>{note.content}</li></ol> : note.listType === "unordered" ? <ul><li>{note.content}</li></ul> : note.content}
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(index)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(index)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;