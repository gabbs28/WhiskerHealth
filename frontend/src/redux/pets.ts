import { csrfFetch } from './csrf';
import { PetActionPayload, PetInitialState, PetsBody } from './types/pets';
import { notes, pets } from '../database/client';
import { ActionCreator } from './types/redux';
import { AppDispatch, AppThunk } from './store.ts';
import { ThunkError } from './error.ts';

//define types
export enum PetActionTypes {
    GET_ALL_PETS = '/pets/getAllPets',
    GET_PET = '/pets/getPet',
    GET_PET_NOTES = '/pets/getPetNotes',
}

//define actions
const getPetAction = (pet: pets): ActionCreator<PetActionTypes, PetActionPayload> => {
    return {
        type: PetActionTypes.GET_PET,
        payload: pet,
    };
};

const getAllPetsAction = (allPets: pets[]): ActionCreator<PetActionTypes, PetActionPayload> => {
    return {
        type: PetActionTypes.GET_ALL_PETS,
        payload: allPets,
    };
};

const getPetNotesAction = (notes: notes[]): ActionCreator<PetActionTypes, PetActionPayload> => {
    return {
        type: PetActionTypes.GET_PET_NOTES,
        payload: notes,
    };
};

//define thunks
export const getPetData = (id: number): AppThunk => {
    return async (dispatch: AppDispatch) => {
        // Attempt to get a specific pet for the current user
        const response = await csrfFetch(`/api/pets/${id}`);

        // If a response is returned, validate it
        if (response.ok) {
            // Parse response as JSON
            const data = await response.json();

            // If the "error" field is set, return errors
            //?? Nullish coalescing operator, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
            if (data?.error) {
                throw new ThunkError('Get Pets Failure', data.errors ?? {});
            }

            // Update state
            dispatch(getPetAction(data));
        }
    };
};

export const getAllPetsData = (): AppThunk => {
    return async (dispatch: AppDispatch) => {
        // Attempt to get all pets for the current user
        const response = await csrfFetch('/api/pets');

        // If a response is returned, validate it
        if (response.ok) {
            // Parse response as JSON
            const data = await response.json();

            // If the "error" field is set, return errors
            if (data?.error) {
                throw new ThunkError('Get All Pets Failure', data.errors ?? {});
            }

            // Update state
            dispatch(getAllPetsAction(data));
        }
    };
};

export const getPetNotesData = (id: number): AppThunk => {
    return async (dispatch: AppDispatch) => {
        // Attempt to get all notes for a specific pet for the current user
        const response = await csrfFetch(`/api/pets/${id}/notes`);

        // If a response is returned, validate it
        if (response.ok) {
            // Parse response as JSON
            const data = await response.json();

            // If the "error" field is set, return errors
            if (data?.error) {
                throw new ThunkError('Get Pets Notes Failure', data.errors ?? {});
            }

            // Update state
            dispatch(getPetNotesAction(data));
        }
    };
};

export const postPet = async (pet: PetsBody): Promise<pets> => {
    // Attempt to create a pet
    const response = await csrfFetch(`/api/pets`, {
        method: 'POST',
        body: JSON.stringify(pet),
    });

    // If a response is returned, validate it
    if (response.ok) {
        // Parse response as JSON
        const data = await response.json();

        // If the "error" field is set, return errors
        if (data?.error) {
            throw new ThunkError('Create Pets Failure', data.errors ?? {});
        }

        // Return response
        return data;
    } else {
        throw new ThunkError('Update Pets Failure', {
            message: 'An unknown error occurred. Please try again later.',
        });
    }
};

export const putPet = async (id: bigint, pet: PetsBody): Promise<pets> => {
    // Attempt to update a pet
    const response = await csrfFetch(`/api/pets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(pet),
    });

    // If a response is returned, validate it
    if (response.ok) {
        // Parse response as JSON
        const data = await response.json();

        // If the "error" field is set, return errors
        if (data?.error) {
            throw new ThunkError('Update Pets Failure', data.errors ?? {});
        }

        // Return response
        return data;
    } else {
        throw new ThunkError('Update Pets Failure', {
            message: 'An unknown error occurred. Please try again later.',
        });
    }
};

export const deletePet = async (id: number) => {
    return async () => {
        // Attempt to update a pet
        const response = await csrfFetch(`/api/pets/${id}`, {
            method: 'DELETE',
        });

        // If a response is returned, validate it
        if (response.ok) {
            // Parse response as JSON
            const data = await response.json();

            // If the "error" field is set, return errors
            if (data?.error) {
                throw new ThunkError('Delete Pets Failure', data.errors ?? {});
            }
        }
    };
};

//default state
const initialState: PetInitialState = {
    pet: null,
    pets: [],
    notes: [],
};

//define reducer
function petsReducer(
    state = initialState,
    action: ActionCreator<PetActionTypes, PetActionPayload>,
): PetInitialState {
    switch (action.type) {
        case PetActionTypes.GET_PET:
            return { ...state, pet: action.payload };
        case PetActionTypes.GET_ALL_PETS:
            return { ...state, pets: action.payload ?? [] };
        case PetActionTypes.GET_PET_NOTES:
            return { ...state, notes: action.payload ?? [] };
        default:
            return state;
    }
}

export default petsReducer;
