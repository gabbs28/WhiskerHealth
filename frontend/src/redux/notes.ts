import { csrfFetch } from './csrf';
import { notes } from '../database/client.ts';
import { GetNoteAction, NoteActions, NoteInitialState } from './types/notes';
import { AppDispatch, AppThunk } from './store.ts';
import { ThunkError } from './error.ts';
import { z } from 'zod';
import {
    fecal_color_type,
    fecal_score_type,
    level_type,
    urine_color_type,
} from '../database/enums';

//schema
//https://zod.dev/api
//this is not linked to the model directly and will need to change as the model changes
export const NoteSchema = z.object({
    id: z.coerce.bigint(),
    pet_id: z.coerce.bigint(),
    date: z.coerce.date(),
    title: z.string().max(100),
    pain_level: z.nativeEnum(level_type),
    fatigue_level: z.nativeEnum(level_type),
    activity_level: z.nativeEnum(level_type),
    appetite_level: z.nativeEnum(level_type),
    water_intake: z.nativeEnum(level_type),
    sleep_level: z.nativeEnum(level_type),
    regular_meds: z.coerce.boolean(),
    relief_meds: z.coerce.boolean(),
    fecal_score: z.nativeEnum(fecal_score_type).nullable(),
    fecal_color: z.nativeEnum(fecal_color_type).nullable(),
    urine_color: z.nativeEnum(urine_color_type).nullable(),
    notes: z.string().nullable(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

export const NotesSchema = z.array(NoteSchema);

//define type
export enum NoteActionTypes {
    GET_NOTE = '/notes/getNote',
}

//define action
const getNoteAction = (note: notes): GetNoteAction => {
    return {
        type: NoteActionTypes.GET_NOTE,
        payload: note,
    };
};

//define thunks
export const getNoteData = (id: number): AppThunk => {
    return async (dispatch: AppDispatch) => {
        // Attempt to get a specific note for the current user
        const response = await csrfFetch(`/api/notes/${id}`);

        // If a response is returned, validate it
        if (response.ok) {
            // Parse response as JSON
            const data = await response.json();

            // If the "error" field is set, return errors
            if (data?.error) {
                throw new ThunkError('Get Notes Failure', data.errors ?? {});
            }

            // Convert to note
            const parsed = NoteSchema.safeParse(data);

            // If conversion was a success
            if (parsed.success) {
                // Update state
                dispatch(getNoteAction(parsed.data));
            } else {
                // Unable to parse data
                throw new ThunkError('Get Notes Failure', { message: parsed.error?.format() });
            }
        }
    };
};

//default state
const initialState: NoteInitialState = {
    note: null,
};

//define reducer
function notesReducer(state = initialState, action: NoteActions): NoteInitialState {
    switch (action.type) {
        case NoteActionTypes.GET_NOTE:
            return { ...state, note: action.payload };
        default:
            return state;
    }
}

export default notesReducer;
