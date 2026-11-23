import  {useState, useEffect} from "react";
import NoteCard from "../components/NoteCard";
import NoteForm from "../components/NoteForm";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function NotesPage() {
    const[notes,  setNotes] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState('');
    const [search,setSearch] = useState("");
    const {logout} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            api.get('notes/',{params:{search}})
            .then((res) => setNotes(res.data.results))
            .catch(() => setError('Could not load notes'))
            .finally(() => setLoading(false));
        },300);
        return () => clearTimeout(timer);
    },[search]);

    const handleDelete = async (id) => {
        try {
        await api.delete(`notes/${id}/`);
        serNotes(notes.filter((n) => n.id !== id));
        } catch {
            setError('could not delete note');
        }
    };

    const updateNote = async (id,data) => {
        try {
        const res = await api.patch(`notes/${id}/`,data);
        setNotes(notes.map((n) => (n,id === id ? {...n,...data}:n)))
        } catch  {
            setError('Could not upadte note');
            
        }
    };

    const addNote = async (data) => {
       try{
        const res = await api.post('notes/',data);
        setNotes([res.data,...notes]);
       }catch{
        setError('could not add note');
       }

    };

    if(loading) return <p>Loading....</p>

    const handeLogout = () => {
        logout();
        navigate("login/");
    }

    return (
        <div>
            <input placeholder="Search  notes" value={search} onChange={(e) => setSearch(e.target.value)}/>
            <button id="logout-btn" onClick={handeLogout}>Logout</button>
            <NoteForm onAdd={addNote}/>
            {error && <p>{error}</p>}
            {notes.length === 0 && <p>No notes yet.</p>}
            {notes.map((note) => (
            <NoteCard key={note.id} note={note} onDelete={handleDelete} onUpdate={updateNote}/>
            ))}
        </div>
    );
}

export default NotesPage;