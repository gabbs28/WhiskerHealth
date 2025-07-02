import { notes } from '../../database/client';

export interface NoteInitialState {
    note: notes | null;
}

export type NoteActionPayload = notes | null;

export interface NotesBody
    extends Omit<
        // Starting model (base prisma model)
        notes,
        // Excluded fields
        'id' | 'created_at' | 'updated_at'
    > {}
