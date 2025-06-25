import { csrfFetch } from "./csrf";
import { notes } from "../database";
import { NoteInitialState, NotesBody } from "./types/notes";
import { IActionCreator } from "./types/redux";

//define action types
const GET_NOTE = "/notes/getNote"

//define action
const getNoteAction = (note: notes) => {
    return {
        type: GET_NOTE,
        payload: note
    }
}

//define thunks

export const getNoteData = (id:number) => {
    return async (dispatch: any) => {
        //api call
        return csrfFetch(`/api/notes/${id}`)
        .then(response => response.json())
        .then(noteData => {
            dispatch(getNoteAction(noteData));
        })
    }
}

export const postNote = async (note: NotesBody) => {
    return csrfFetch(`/api/notes`, {
        method: 'POST',
        body: JSON.stringify(note)
    })
        .then(response => response.json)
}

export const putNote = async (id: number, note: NotesBody) => {
    return csrfFetch(`/api/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(note)
    })
        .then(response => response.json)
}

export const deleteNote = async (id: number) => {
    return csrfFetch(`/api/notes/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.json)
}

//default state
const initialState: NoteInitialState = {
    note: null
}

//define reducer
function notesReducer(state = initialState, action: IActionCreator): NoteInitialState {
    switch (action.type) {
        case GET_NOTE:
            return {...state, note: action.payload};
        default:
            return state;
    }
}

export default notesReducer