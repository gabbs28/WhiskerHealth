import { notes } from '../../database/client';
import { Action } from 'redux';
import { NoteActionTypes } from '../notes.ts';

export interface NoteInitialState {
    note: notes | null;
}

export interface GetNoteAction extends Action<typeof NoteActionTypes.GET_NOTE> {
    payload: notes | null;
}

export type NoteActions = GetNoteAction;

export interface NotesBody
    extends Omit<
        // Starting model (base prisma model)
        notes,
        // Excluded fields
        'id' | 'created_at' | 'updated_at'
    > {}
