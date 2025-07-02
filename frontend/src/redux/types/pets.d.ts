import { notes, pets } from '../../database/client';

export interface PetInitialState {
    pet: pets | null;
    pets: pets[];
    notes: notes[];
}

export type PetActionPayload = pet | pet[] | notes[] | null;

export interface PetsBody
    extends Omit<
        // Starting model (base prisma model)
        pets,
        // Excluded fields
        'id' | 'created_at' | 'updated_at'
    > {}
