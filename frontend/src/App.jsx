import './App.css';
import NotesPage from './pages/NotesPage';
import NoteDetail from './pages/NoteDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import { BrowserRouter, Route, Routes , Navigate} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
 return(
     <BrowserRouter>
          <Routes>
               <Route path="/" element={<Navigate to="/notes" replace/>}/>
               <Route path="/login" element={<Login/>}/>
               <Route path="/register" element={<Register/>}/>
               <Route path="/notes" element={<ProtectedRoute><NotesPage/></ProtectedRoute>}/>
               <Route path="/notes/:id" element={<ProtectedRoute><NoteDetail/></ProtectedRoute>}/>

          </Routes>
          
     </BrowserRouter>
 );
}

export default App;
