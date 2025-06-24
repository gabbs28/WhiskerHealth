import { pets, notes } from '../../database';

export interface PetInitialState {
    allPets: null | PetsBody;
    pet: null | PetsBody;
    notes: null | NotesBody;
}

export interface PetsBody extends Omit<
    // Starting model (base prisma model)
    pets,
    // Excluded fields
    'created_at' | 'updated_at'
> {

};

export interface NotesBody extends Omit<
    // Starting model (base prisma model)
    notes,
    // Excluded fields
    'created_at' | 'updated_at'
> {

};