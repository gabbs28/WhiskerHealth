import { notes, pets } from '../../database/client';
import { Action } from 'redux';
import { PetActionTypes } from '../pets.ts';

export interface PetInitialState {
    pet: pets | null;
    pets: pets[];
    notes: Map<bigint, notes>;
}

export interface GetPetAction extends Action<typeof PetActionTypes.GET_PET> {
    payload: pets | null;
}

export interface GetAllPetsAction extends Action<typeof PetActionTypes.GET_ALL_PETS> {
    payload: pets[];
}

export interface GetPetNotesAction extends Action<typeof PetActionTypes.GET_PET_NOTES> {
    payload: notes[];
}

export interface PutPetAction extends Action<typeof PetActionTypes.PUT_PET> {
    payload: pets;
}

export interface PostPetNoteAction extends Action<typeof PetActionTypes.POST_PET_NOTE> {
    payload: notes;
}

export interface PutPetNoteAction extends Action<typeof PetActionTypes.PUT_PET_NOTE> {
    payload: notes;
}

export interface DeletePetNoteAction extends Action<typeof PetActionTypes.DELETE_PET_NOTE> {
    payload: bigint;
}

export type PetActions =
    | GetPetAction
    | GetAllPetsAction
    | GetPetNotesAction
    | PutPetAction
    | PostPetNoteAction
    | PutPetNoteAction
    | DeletePetNoteAction;

export interface PetsBody
    extends Omit<
        // Starting model (base prisma model)
        pets,
        // Excluded fields
        'id' | 'created_at' | 'updated_at'
    > {}
