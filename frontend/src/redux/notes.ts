import {csrfFetch} from "./csrf";
import {notes} from "../database/client.ts";
import {NoteActionPayload, NoteInitialState, NotesBody} from "./types/notes";
import {ActionCreator} from "./types/redux";
import {AppDispatch, AppThunk} from "./store.ts";
import {ThunkError} from "./error.ts";

//define type
export enum NoteActionTypes {
    GET_NOTE = "/notes/getNote",
}

//define action
const getNoteAction = (note: notes): ActionCreator<NoteActionTypes, NoteActionPayload> => {
    return {
        type: NoteActionTypes.GET_NOTE,
        payload: note
    }
}

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
                throw new ThunkError("Get Note Failure", data.errors ?? {});
            }

            // Update state
            dispatch(getNoteAction(data));
        }
    }
}

export const putNote = async (id: number, pet: NotesBody) => {
    return async () => {
        // Attempt to update a pet
        const response = await csrfFetch(`/api/notes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(pet)
        });

        // If a response is returned, validate it
        if (response.ok) {
            // Parse response as JSON
            const data = await response.json();

            // If the "error" field is set, return errors
            if (data?.error) {
                throw new ThunkError("Update Note Failure", data.errors ?? {});
            }
        }
    }
}

export const deleteNote = async (id: number) => {
    return async () => {
        // Attempt to update a pet
        const response = await csrfFetch(`/api/notes/${id}`, {
            method: 'DELETE'
        });

        // If a response is returned, validate it
        if (response.ok) {
            // Parse response as JSON
            const data = await response.json();

            // If the "error" field is set, return errors
            if (data?.error) {
                throw new ThunkError("Delete Note Failure", data.errors ?? {});
            }
        }
    }
}

//default state
const initialState: NoteInitialState = {
    note: null
}

//define reducer
function notesReducer(state = initialState, action: ActionCreator<NoteActionTypes, NoteActionPayload>): NoteInitialState {
    switch (action.type) {
        case NoteActionTypes.GET_NOTE:
            return {...state, note: action.payload};
        default:
            return state;
    }
}

export default notesReducer