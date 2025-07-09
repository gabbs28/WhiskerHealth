import { csrfFetch } from './csrf';
import {
    DeletePetNoteAction,
    GetAllPetsAction,
    GetPetAction,
    GetPetNotesAction,
    PetActions,
    PetInitialState,
    PetsBody,
    PostPetNoteAction,
    PutPetAction,
    PutPetNoteAction,
} from './types/pets';
import { notes, pets } from '../database/client';
import { AppDispatch, AppThunk } from './store.ts';
import { ThunkError } from './error.ts';
import z from 'zod';
import {
    breed_type,
    color_type,
    fur_pattern_type,
    gender_type,
    hair_length_type,
} from '../database/enums';
import { NoteSchema, NotesSchema } from './notes.ts';
import { NotesBody } from './types/notes';

//schema
//https://zod.dev/api
//this is not linked to the model directly and will need to change as the model changes
export const PetSchema = z.object({
    id: z.coerce.bigint(),
    name: z.string().max(100),
    breed: z.nativeEnum(breed_type),
    birthday: z.coerce.date(),
    gender: z.nativeEnum(gender_type),
    sterilized: z.coerce.boolean(),
    weight: z.coerce.number().positive(),
    color: z.nativeEnum(color_type),
    hair_length: z.nativeEnum(hair_length_type),
    fur_pattern: z.nativeEnum(fur_pattern_type),
    allergies: z.array(z.string()),
    microchip: z.string().max(100),
    medical_condition: z.array(z.string()),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

export const PetsSchema = z.array(PetSchema);

//define types
export enum PetActionTypes {
    GET_ALL_PETS = '/pets/getAllPets',
    GET_PET = '/pets/getPet',
    GET_PET_NOTES = '/pets/getPetNotes',
    PUT_PET = '/pets/updatePet',
    POST_PET_NOTE = '/pets/addPetNote',
    PUT_PET_NOTE = '/pets/updatePetNote',
    DELETE_PET_NOTE = '/pets/deletePetNote',
}

//define actions
const getPetAction = (pet: pets): GetPetAction => {
    return {
        type: PetActionTypes.GET_PET,
        payload: pet,
    };
};

const getAllPetsAction = (allPets: pets[]): GetAllPetsAction => {
    return {
        type: PetActionTypes.GET_ALL_PETS,
        payload: allPets,
    };
};

const getPetNotesAction = (notes: notes[]): GetPetNotesAction => {
    return {
        type: PetActionTypes.GET_PET_NOTES,
        payload: notes,
    };
};

const updatePetAction = (pet: pets): PutPetAction => {
    return {
        type: PetActionTypes.PUT_PET,
        payload: pet,
    };
};

const addPetNoteAction = (note: notes): PostPetNoteAction => {
    return {
        type: PetActionTypes.POST_PET_NOTE,
        payload: note,
    };
};

const updatePetNoteAction = (note: notes): PutPetNoteAction => {
    return {
        type: PetActionTypes.PUT_PET_NOTE,
        payload: note,
    };
};

const deletePetNoteAction = (id: bigint): DeletePetNoteAction => {
    return {
        type: PetActionTypes.DELETE_PET_NOTE,
        payload: id,
    };
};

//define thunks
export const getPet = (id: bigint): AppThunk => {
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
                throw new ThunkError('Get Pet Failure', data.errors ?? {});
            }

            // Convert to pets
            const parsed = PetSchema.safeParse(data);

            // If conversion was a success
            if (parsed.success) {
                // Update state
                dispatch(getPetAction(parsed.data));
            } else {
                // Unable to parse data
                throw new ThunkError('Get Pet Failure', { message: parsed.error?.format() });
            }
        }
    };
};

export const getPets = (): AppThunk => {
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

            // Convert to pets[]
            const parsed = PetsSchema.safeParse(data);

            // If conversion was a success
            if (parsed.success) {
                // Update state
                dispatch(getAllPetsAction(parsed.data));
            } else {
                // Unable to parse data
                throw new ThunkError('Get All Pets Failure', { message: parsed.error?.format() });
            }
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
            throw new ThunkError('Create Pet Failure', data.errors ?? {});
        }

        // Convert to pets
        const parsed = PetSchema.safeParse(data);

        // If conversion was a success
        if (parsed.success) {
            // Return
            return parsed.data;
        } else {
            // Unable to parse data
            throw new ThunkError('Create Pet Failure', { message: parsed.error?.format() });
        }
    } else {
        throw new ThunkError('Create Pet Failure', {
            message: 'An unknown error occurred. Please try again later.',
        });
    }
};

export const putPet = (id: bigint, pet: PetsBody): AppThunk<pets> => {
    return async (dispatch: AppDispatch): Promise<pets> => {
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
                throw new ThunkError('Update Pet Failure', data.errors ?? {});
            }

            // Convert to pets
            const parsed = PetSchema.safeParse(data);

            // If conversion was a success
            if (parsed.success) {
                // Update state
                dispatch(updatePetAction(parsed.data));

                // Return
                return parsed.data;
            } else {
                // Unable to parse data
                throw new ThunkError('Update Pet Failure', { message: parsed.error?.format() });
            }
        } else {
            throw new ThunkError('Update Pet Failure', {
                message: 'An unknown error occurred. Please try again later.',
            });
        }
    };
};

export const deletePet = async (id: bigint): Promise<void> => {
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
            throw new ThunkError('Delete Pet Failure', data.errors ?? {});
        }

        // Return response
        return data;
    } else {
        throw new ThunkError('Delete Pet Failure', {
            message: 'An unknown error occurred. Please try again later.',
        });
    }
};

export const getPetNotes = (id: bigint): AppThunk => {
    return async (dispatch: AppDispatch) => {
        // Attempt to get all notes for a specific pet for the current user
        const response = await csrfFetch(`/api/pets/${id}/notes`);

        // If a response is returned, validate it
        if (response.ok) {
            // Parse response as JSON
            const data = await response.json();

            // If the "error" field is set, return errors
            if (data?.error) {
                throw new ThunkError('Get Pet Notes Failure', data.errors ?? {});
            }

            // Convert to notes[]
            const parsed = NotesSchema.safeParse(data);

            // If conversion was a success
            if (parsed.success) {
                // Update state
                dispatch(getPetNotesAction(parsed.data));
            } else {
                // Unable to parse data
                throw new ThunkError('Get Pet Notes Failure', { message: parsed.error?.format() });
            }
        }
    };
};

export const postPetNote = (note: NotesBody): AppThunk<notes> => {
    return async (dispatch: AppDispatch) => {
        // Attempt to create a note
        const response = await csrfFetch(`/api/pets/${note.pet_id}/notes`, {
            method: 'POST',
            body: JSON.stringify(note),
        });

        // If a response is returned, validate it
        if (response.ok) {
            // Parse response as JSON
            const data = await response.json();

            // If the "error" field is set, return errors
            if (data?.error) {
                throw new ThunkError('Create Notes Failure', data.errors ?? {});
            }

            // Convert to note
            const parsed = NoteSchema.safeParse(data);

            // If conversion was a success
            if (parsed.success) {
                // Update state
                dispatch(addPetNoteAction(parsed.data));

                // Return
                return parsed.data;
            } else {
                // Unable to parse data
                throw new ThunkError('Create Notes Failure', { message: parsed.error?.format() });
            }
        } else {
            throw new ThunkError('Update Notes Failure', {
                message: 'An unknown error occurred. Please try again later.',
            });
        }
    };
};

export const putPetNote = (id: bigint, note: NotesBody): AppThunk<notes> => {
    return async (dispatch: AppDispatch) => {
        // Attempt to create a note
        const response = await csrfFetch(`/api/notes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(note),
        });

        // If a response is returned, validate it
        if (response.ok) {
            // Parse response as JSON
            const data = await response.json();

            // If the "error" field is set, return errors
            if (data?.error) {
                throw new ThunkError('Update Notes Failure', data.errors ?? {});
            }

            // Convert to note
            const parsed = NoteSchema.safeParse(data);

            // If conversion was a success
            if (parsed.success) {
                // Update state
                dispatch(updatePetNoteAction(parsed.data));

                // Return
                return parsed.data;
            } else {
                // Unable to parse data
                throw new ThunkError('Update Notes Failure', { message: parsed.error?.format() });
            }
        } else {
            throw new ThunkError('Update Notes Failure', {
                message: 'An unknown error occurred. Please try again later.',
            });
        }
    };
};

export const deletePetNote = (id: bigint): AppThunk => {
    return async (dispatch: AppDispatch) => {
        // Attempt to update a pet
        const response = await csrfFetch(`/api/notes/${id}`, {
            method: 'DELETE',
        });

        // If a response is returned, validate it
        if (response.ok) {
            // Parse response as JSON
            const data = await response.json();

            // If the "error" field is set, return errors
            if (data?.error) {
                throw new ThunkError('Delete Notes Failure', data.errors ?? {});
            }

            // Update state
            dispatch(deletePetNoteAction(id));
        } else {
            throw new ThunkError('Delete Notes Failure', {
                message: 'An unknown error occurred. Please try again later.',
            });
        }
    };
};

//default state
const initialState: PetInitialState = {
    pet: null,
    pets: [],
    notes: new Map<bigint, notes>(),
};

//define reducer
function petsReducer(state: PetInitialState = initialState, action: PetActions): PetInitialState {
    switch (action.type) {
        case PetActionTypes.GET_PET:
        case PetActionTypes.PUT_PET:
            return { ...state, pet: action.payload };

        case PetActionTypes.GET_ALL_PETS:
            return { ...state, pets: action.payload };

        case PetActionTypes.GET_PET_NOTES:
            return {
                ...state,
                notes: action.payload.reduce((notes, note) => {
                    // Add the note
                    notes.set(note.id, note);

                    // Return
                    return notes;
                }, new Map<bigint, notes>()),
            };

        case PetActionTypes.POST_PET_NOTE:
        case PetActionTypes.PUT_PET_NOTE: {
            const note = action.payload;
            const updated = new Map(state.notes);

            updated.set(note.id, note);

            return {
                ...state,
                notes: updated,
            };
        }

        case PetActionTypes.DELETE_PET_NOTE: {
            const id = action.payload;
            const updated = new Map(state.notes);

            updated.delete(id);

            return {
                ...state,
                notes: updated,
            };
        }

        default:
            return state;
    }
}

export default petsReducer;
