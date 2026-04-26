import supabase from "../utils/supabase";
import React from "react";
import { useEffect } from "react";

export default function TestNotes() {
    const [notes, setNotes] = React.useState([]);

    useEffect(() => {
        const fetchNotes = async () => {
            const { data, error } = await supabase.from('Note').select('*');
            if (error) {
                console.error("Error fetching notes:", error);
            } else {
                setNotes(data)
            }
        }
        fetchNotes();
    }, [])


    return (
        <div>
            <h2>Test Notes</h2>
            <ul>
                {notes.map(note => (
                    <li key={note.id}>{note.content}</li>
                ))}
            </ul>
            <p>Hello</p>
        </div>
    );
}