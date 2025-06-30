import {notes, pets} from '../../database';

export interface PetInitialState {
    pet: pets | null
    pets: pets[];
    notes: notes[];
}

export type PetActionPayload = pet | pet[] | notes[] | null;

export interface PetsBody extends Omit<
    // Starting model (base prisma model)
    pets,
    // Excluded fields
    'created_at' | 'updated_at'
> {

}