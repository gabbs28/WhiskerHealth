import styles from './Notes.module.css';
import { notes } from '../../database/client.ts';
import React from 'react';
import { useModal } from '../../context/Modal.tsx';
import Form from './Note/Form';
import Note from './Note';
import row from '../../css/row.module.css';

interface NotesProperties {
    petId: bigint;
    notes: Map<bigint, notes>;
}

export function Notes({ petId, notes }: Readonly<NotesProperties>) {
    const { setModalContent } = useModal();

    const add = (event: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent default action
        event.preventDefault();

        // Show the add note form
        setModalContent(<Form petId={petId} />);
    };

    // Convert notes from a map into an array of notes sorted by the date of the note
    const sorted = Array.from(notes.values()).sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <div className={`${row.container} ${styles.container}`}>
            <button className={`${row.add} ${styles.add}`} onClick={add}>
                Add Note
            </button>
            {sorted.map((note) => (
                <Note key={note.id} petId={note.pet_id} note={note} mode="large" />
            ))}
        </div>
    );
}
