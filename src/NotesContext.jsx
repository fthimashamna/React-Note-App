import axios from "axios";
import { createContext ,useEffect,useState} from "react";
const NotesContext=createContext();
function NotesProvider({children}){
    const [notes,setNotes]=useState([]);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState("");
    const [message,setMessage]=useState("");


    //get

    async function fetchNotes(){
        setLoading(true);
        try{
        const response = await axios.get("http://localhost:3001/notes");
        setNotes(response.data);
    }catch(error){
        console.log("Get error:",error);
        setError("failed to load notes");
    }finally{
        setLoading(false);
    }

    }

    //post
    async function createNote(note){
        setLoading(true);
        try{
        const response =await axios.post("http://localhost:3001/notes",note);
        setNotes([...notes,response.data]);
        setMessage("note created succesfully")

        setTimeout(()=>{
            setMessage("");
        },2000);
    }finally{
        setLoading(false);
    }
    }
    //put 
    async function updateNote(id,updateNote){
        setLoading(true);
        try{
        const response= await axios.put(`http://localhost:3001/notes/${id}`,updateNote);
        setNotes(notes.map((note)=> note.id ===id?response.data:note));
        setMessage("note updated succesfully");

        setTimeout(()=>{
            setMessage("");
        },2000);
    }finally{
        setLoading(false);
    }
    }
    //patch -archive
    async function toggleArchive(id,archived){
        setLoading(true);
        try{
        const response = await axios.patch(`http://localhost:3001/notes/${id}`,
            {
                archived:archived
            }
        );
        setNotes(notes.map((note)=>note.id===id?response.data:note));

        setMessage(archived ?"note archived succesfully":"not unarchived succesfully"
          );
          setTimeout(()=>{
            setMessage("");
          },2000);
        }finally{
            setLoading(false);
        }
    }
    //delte

    async function deleteNote(id){
        setLoading(true);
        try{
        await axios.delete(`http://localhost:3001/notes/${id}`);
        setNotes(notes.filter((note)=>note.id!==id));
        setMessage("note deleted succesfully");
        setTimeout(()=>{
            setMessage("");
        },2000);
    }finally{
        setLoading(false);
    }
    }
    //search
    function searchNotes(query){
        return notes.filter((note)=>note.title.toLowerCase().includes(query.toLowerCase()));
    }
    useEffect(()=>{
        fetchNotes();
    },[]);

return(
<NotesContext.Provider
 value={{notes,
    setNotes,
    loading,
    error,
    message,
    fetchNotes,
    createNote,
    updateNote,
    toggleArchive,
    deleteNote,
    searchNotes}}>
{children}
</NotesContext.Provider>
);
}
    
export default NotesContext;
export {NotesProvider};