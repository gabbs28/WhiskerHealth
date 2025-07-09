import styles from './Note.module.css';
import resource from '../../../css/resource.module.css';
import { notes } from '../../../database/client.ts';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useModal } from '../../../context/Modal.tsx';
import Form from './Form';
import { ThunkError } from '../../../redux/error.ts';
import { formatEnumeration } from '../../../utils/enumeration.ts';
import {
    fecal_color_type,
    fecal_score_type,
    level_type,
    urine_color_type,
} from '../../../database/enums.ts';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';
import { datetimeConverter } from '../../../utils/date.ts';
import { useAppDispatch } from '../../../redux/store.ts';
import { deletePetNote } from '../../../redux/pets.ts';

interface NoteProperties {
    petId: bigint;
    note: notes;
    mode?: 'small' | 'large';
}

export function Note({ petId, note, mode = 'small' }: Readonly<NoteProperties>) {
    const dispatch = useAppDispatch();
    const { setModalContent } = useModal();

    const [isExpanded, setIsExpanded] = useState<boolean>(false); // Add state for expansion

    const edit = (event: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent default action
        event.preventDefault();

        // Show the edit pet form
        setModalContent(<Form petId={petId} note={note} />);
    };

    const remove = (event: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent default action
        event.preventDefault();

        // Delete note
        dispatch(deletePetNote(note.id)).catch((error) => {
            if (error instanceof ThunkError) {
                alert(error.errors.message);
            } else {
                alert(error.message);
            }
        });
    };

    const toggle = () => {
        setIsExpanded(!isExpanded);
    };

    // Dashboard
    if (mode === 'small') {
        return (
            <Link
                to={`/note/${note.id}`}
                className={`${resource.container} ${resource.small} ${styles.container} ${styles.small}`}
            >
                <span>{note.title}</span>
                <span>{note.created_at.toLocaleDateString()}</span>
            </Link>
        );
    }

    // Details
    return (
        <div
            className={`${resource.container} ${resource.large} ${styles.container} ${styles.large}`}
        >
            <button
                type="button"
                className={`${resource.header} ${styles.header} invisible`}
                onClick={toggle}
                aria-expanded={isExpanded}
                aria-controls={`note-details-${note.id}`}
            >
                <span>{isExpanded ? <MdKeyboardArrowDown /> : <MdKeyboardArrowRight />}</span>
                <h2>{note.title}</h2>
            </button>

            {isExpanded && (
                <div id={`note-details-${note.id}`}>
                    <div className={`${resource.details} ${styles.details}`}>
                        <div>
                            <span className={`${resource.name} ${styles.name}`}>Date:</span>
                            <span className={`${resource.value} ${styles.value}`}>
                                {datetimeConverter(note.date)}
                            </span>
                        </div>

                        <h3>Health Metrics</h3>
                        <div>
                            <span className={`${resource.name} ${styles.name}`}>Pain Level:</span>
                            <span className={`${resource.value} ${styles.value}`}>
                                {formatEnumeration(level_type, note.pain_level)}
                            </span>
                        </div>
                        <div>
                            <span className={`${resource.name} ${styles.name}`}>
                                Fatigue Level:
                            </span>
                            <span className={`${resource.value} ${styles.value}`}>
                                {formatEnumeration(level_type, note.fatigue_level)}
                            </span>
                        </div>
                        <div>
                            <span className={`${resource.name} ${styles.name}`}>
                                Activity Level:
                            </span>
                            <span className={`${resource.value} ${styles.value}`}>
                                {formatEnumeration(level_type, note.activity_level)}
                            </span>
                        </div>
                        <div>
                            <span className={`${resource.name} ${styles.name}`}>
                                Appetite Level:
                            </span>
                            <span className={`${resource.value} ${styles.value}`}>
                                {formatEnumeration(level_type, note.appetite_level)}
                            </span>
                        </div>
                        <div>
                            <span className={`${resource.name} ${styles.name}`}>Water Intake:</span>
                            <span className={`${resource.value} ${styles.value}`}>
                                {formatEnumeration(level_type, note.water_intake)}
                            </span>
                        </div>
                        <div>
                            <span className={`${resource.name} ${styles.name}`}>Sleep Level:</span>
                            <span className={`${resource.value} ${styles.value}`}>
                                {formatEnumeration(level_type, note.sleep_level)}
                            </span>
                        </div>

                        <h3>Medication</h3>
                        <div>
                            <span className={`${resource.name} ${styles.name}`}>
                                Regular Medications:
                            </span>
                            <span className={`${resource.value} ${styles.value}`}>
                                {note.regular_meds ? 'Taken' : 'Not Taken'}
                            </span>
                        </div>
                        <div>
                            <span className={`${resource.name} ${styles.name}`}>
                                Relief Medications:
                            </span>
                            <span className={`${resource.value} ${styles.value}`}>
                                {note.relief_meds ? 'Taken' : 'Not Taken'}
                            </span>
                        </div>

                        <h3>Waste Monitoring</h3>
                        {note.fecal_score && (
                            <div>
                                <span className={`${resource.name} ${styles.name}`}>
                                    Fecal Score:
                                </span>
                                <span className={`${resource.value} ${styles.value}`}>
                                    {formatEnumeration(fecal_score_type, note.fecal_score)}
                                </span>
                            </div>
                        )}

                        {note.fecal_color && (
                            <div>
                                <span className={`${resource.name} ${styles.name}`}>
                                    Fecal Color:
                                </span>
                                <span className={`${resource.value} ${styles.value}`}>
                                    {formatEnumeration(fecal_color_type, note.fecal_color)}
                                </span>
                            </div>
                        )}

                        {note.urine_color && (
                            <div>
                                <span className={`${resource.name} ${styles.name}`}>
                                    Urine Color:
                                </span>
                                <span className={`${resource.value} ${styles.value}`}>
                                    {formatEnumeration(urine_color_type, note.urine_color)}
                                </span>
                            </div>
                        )}

                        {note.notes && (
                            <div>
                                <h3>Additional Notes</h3>
                                <div>
                                    <span className={`${resource.value} ${styles.value}`}>
                                        {note.notes}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={`${resource.buttons} ${styles.buttons}`}>
                        <button className={`${resource.button} ${styles.button}`} onClick={remove}>
                            Delete
                        </button>
                        <button className={`${resource.button} ${styles.button}`} onClick={edit}>
                            Edit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
