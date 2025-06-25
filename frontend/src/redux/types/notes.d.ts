import { notes } from '../../database';

export interface NoteInitialState {
    note: null | NotesBody;
}

export interface NotesBody extends Omit<
    // Starting model (base prisma model)
    notes,
    // Excluded fields
    'created_at' | 'updated_at'
> {

};