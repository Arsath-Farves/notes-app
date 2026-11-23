import { useState } from "react";
import { Link } from "react-router-dom";

function NoteCard({note, onDelete, onUpdate}){
   const [isEditing,setIsEditing] = useState(false);
   const [title,setTitle] = useState(note.title);
   const [content,setContent] = useState(note.content);

   const handleSave = () => {
    if(!title.trim()===0) return ;
    onUpdate(note.id,{title,content});
    setIsEditing(false);
   };

   const handleCancel = () => {
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(false);
   };

   if(isEditing){
    return(
        <div className="note-card">
            <input value={title} onChange={(e) => setTitle(e.target.value)}/>
            <textarea value={content} onChange={(e) => setContent(e.target.value)}/>
            <button onClick={handleSave}>Save</button>    
            <button onClick={handleCancel}>Cancel</button>
        </div>
    );
   };

   return(
        <div className="note-card">
            <h2><Link to={`/notes/${note.id}`}>{note.title}</Link></h2>
            <p>{note.content}</p>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={() => onDelete(note.id)}>Delete</button>
        </div>
   );
}

export default NoteCard;