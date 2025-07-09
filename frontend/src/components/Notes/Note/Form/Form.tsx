import React, { useState } from 'react';
import { NotesBody } from '../../../../redux/types/notes';
import { notes } from '../../../../database/client';
import styles from './Form.module.css';
import form from '../../../../css/form.module.css';
import {
    fecal_color_type,
    fecal_score_type,
    level_type,
    urine_color_type,
} from '../../../../database/enums';
import { useModal } from '../../../../context/Modal';
import { ThunkError } from '../../../../redux/error';
import EnumerationDropdown from '../../../EnumerationDropdown';
import { useAppDispatch } from '../../../../redux/store.ts';
import { postPetNote, putPetNote } from '../../../../redux/pets.ts';

interface FormProperties {
    petId: bigint;
    note?: notes;
    onSuccess?: (note: notes) => void;
}

export function Form({ petId, note, onSuccess = () => {} }: Readonly<FormProperties>) {
    const dispatch = useAppDispatch();
    const { setIsLoading, closeModal } = useModal();

    const [date, setDate] = useState<Date>(note?.date ?? new Date());
    const [title, setTitle] = useState<string>(note?.title ?? '');
    const [pain, setPain] = useState<level_type | undefined>(note?.pain_level);
    const [fatigue, setFatigue] = useState<level_type | undefined>(note?.fatigue_level);
    const [activity, setActivity] = useState<level_type | undefined>(note?.activity_level);
    const [appetite, setAppetite] = useState<level_type | undefined>(note?.appetite_level);
    const [waterIntake, setWaterIntake] = useState<level_type | undefined>(note?.water_intake);
    const [sleepLevel, setSleepLevel] = useState<level_type | undefined>(note?.sleep_level);
    const [regular, setRegular] = useState<boolean>(note?.regular_meds ?? false);
    const [relief, setRelief] = useState<boolean>(note?.relief_meds ?? false);
    const [fecalScore, setFecalScore] = useState<fecal_score_type | undefined>(
        note?.fecal_score ?? undefined,
    );
    const [fecalColor, setFecalColor] = useState<fecal_color_type | undefined>(
        note?.fecal_color ?? undefined,
    );
    const [urine, setUrine] = useState<urine_color_type | undefined>(
        note?.urine_color ?? undefined,
    );
    const [notes, setNotes] = useState<string>(note?.notes ?? '');

    const [errors, setErrors] = useState<Record<string, string>>({});

    const submit = async (event: React.FormEvent) => {
        // Prevent default action
        event.preventDefault();

        // Clear previous errors
        setErrors({});

        // Validate required fields
        const errors: Record<string, string> = {};

        if (!date) {
            errors.date = 'Date is required';
        }

        if (!title.trim()) {
            errors.title = 'Title is required';
        }

        if (!pain) {
            errors.pain_level = 'Pain level is required';
        }

        if (!fatigue) {
            errors.fatigue_level = 'Fatigue level is required';
        }

        if (!activity) {
            errors.activity_level = 'Activity level is required';
        }

        if (!appetite) {
            errors.appetite_level = 'Appetite level is required';
        }

        if (!waterIntake) {
            errors.water_intake = 'Water intake is required';
        }

        if (!sleepLevel) {
            errors.sleep_level = 'Sleep level is required';
        }

        if (!notes.trim()) {
            errors.notes = 'Notes are required';
        }

        // Check to see if there are any errors
        if (Object.keys(errors).length > 0) {
            // Update errors
            return setErrors(errors);
        }

        // Set loading
        setIsLoading(true);

        // Create data
        const data: NotesBody = {
            date,
            title: title.trim(),
            pain_level: pain!,
            fatigue_level: fatigue!,
            activity_level: activity!,
            appetite_level: appetite!,
            water_intake: waterIntake!,
            sleep_level: sleepLevel!,
            regular_meds: regular,
            relief_meds: relief,
            fecal_score: fecalScore!,
            fecal_color: fecalColor!,
            urine_color: urine!,
            notes: notes.trim(),
            pet_id: petId,
        };

        // Send request
        (note ? dispatch(putPetNote(note.id, data)) : dispatch(postPetNote(data)))
            .then((instance) => onSuccess(instance))
            .then(() => {
                // Close modal
                closeModal();
            })
            .catch((error) => {
                // Update errors
                if (error instanceof ThunkError) {
                    setErrors(error.errors);
                } else {
                    setErrors({ message: error.message });
                }
            })
            .finally(() => {
                // Clear loading
                setIsLoading(false);
            });
    };

    return (
        <div className={`${form.container} ${styles.container}`}>
            <h1>{note ? 'Update Notes' : 'Create Notes'}</h1>
            <form className={`${form.form} ${styles.form}`} onSubmit={submit}>
                <div className={`${form.row} ${styles.row}`} hidden={true}>
                    <label htmlFor="date">Date</label>
                    <input
                        id="date"
                        type="datetime-local"
                        value={date.toISOString().slice(0, 16)}
                        onChange={(event) => setDate(new Date(event.target.value))}
                        required
                    />
                    {errors.date && (
                        <p className={`${form.error} ${styles.error}`}>{errors.date}</p>
                    )}
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <label htmlFor="title">Title</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        maxLength={100}
                        required
                    />
                    {errors.title && (
                        <p className={`${form.error} ${styles.error}`}>{errors.title}</p>
                    )}
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <EnumerationDropdown
                        id="level_type"
                        label="Pain Level"
                        values={level_type}
                        value={pain}
                        onChange={setPain}
                        error={!!errors.pain_level}
                        errorMessage={errors.pain_level}
                    />
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <EnumerationDropdown
                        id="fatigue_level"
                        label="Fatigue Level"
                        values={level_type}
                        value={fatigue}
                        onChange={setFatigue}
                        error={!!errors.fatigue_level}
                        errorMessage={errors.fatigue_level}
                    />
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <EnumerationDropdown
                        id="activity_level"
                        label="Activity Level"
                        values={level_type}
                        value={activity}
                        onChange={setActivity}
                        error={!!errors.activity_level}
                        errorMessage={errors.activity_level}
                    />
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <EnumerationDropdown
                        id="appetite_level"
                        label="Appetite Level"
                        values={level_type}
                        value={appetite}
                        onChange={setAppetite}
                        error={!!errors.appetite_level}
                        errorMessage={errors.appetite_level}
                    />
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <EnumerationDropdown
                        id="water_intake"
                        label="Water Intake"
                        values={level_type}
                        value={waterIntake}
                        onChange={setWaterIntake}
                        error={!!errors.water_intake}
                        errorMessage={errors.water_intake}
                    />
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <EnumerationDropdown
                        id="sleep_level"
                        label="Sleep Level"
                        values={level_type}
                        value={sleepLevel}
                        onChange={setSleepLevel}
                        error={!!errors.sleep_level}
                        errorMessage={errors.sleep_level}
                    />
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <label htmlFor="regular_meds">Regular Medications Taken</label>
                    <input
                        id="regular_meds"
                        type="checkbox"
                        checked={regular}
                        onChange={(event) => setRegular(event.target.checked)}
                    />
                    {errors.regular_meds && (
                        <p className={`${form.error} ${styles.error}`}>{errors.regular_meds}</p>
                    )}
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <label htmlFor="relief_meds">Relief Medications Taken</label>
                    <input
                        id="relief_meds"
                        type="checkbox"
                        checked={relief}
                        onChange={(event) => setRelief(event.target.checked)}
                    />
                    {errors.relief_meds && (
                        <p className={`${form.error} ${styles.error}`}>{errors.relief_meds}</p>
                    )}
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <EnumerationDropdown
                        id="fecal_score"
                        label="Fecal Score"
                        values={fecal_score_type}
                        value={fecalScore}
                        onChange={setFecalScore}
                        required={false}
                        error={!!errors.fecal_score}
                        errorMessage={errors.fecal_score}
                    />
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <EnumerationDropdown
                        id="fecal_color"
                        label="Fecal Color"
                        values={fecal_color_type}
                        value={fecalColor}
                        onChange={setFecalColor}
                        required={false}
                        error={!!errors.fecal_color}
                        errorMessage={errors.fecal_color}
                    />
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <EnumerationDropdown
                        id="urine_color"
                        label="Urine Color"
                        values={urine_color_type}
                        value={urine}
                        onChange={setUrine}
                        required={false}
                        error={!!errors.urine_color}
                        errorMessage={errors.urine_color}
                    />
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <label htmlFor="notes">Notes</label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        required
                    />
                    {errors.notes && (
                        <p className={`${form.error} ${styles.error}`}>{errors.notes}</p>
                    )}
                </div>

                {errors.message && (
                    <div className={`${form.row} ${styles.row}`}>
                        <p className={`${form.error} ${styles.error}`}>{errors.message}</p>
                    </div>
                )}

                <div className={`${form.buttons} ${styles.buttons}`}>
                    <button
                        type="button"
                        className={`${form.button} ${styles.button}`}
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                    <button type="submit" className={`${form.button} ${styles.button}`}>
                        {note ? 'Update Notes' : 'Create Notes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
