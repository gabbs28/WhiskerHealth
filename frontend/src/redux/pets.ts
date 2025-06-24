import { csrfFetch } from "./csrf"
import { PetInitialState, Pets, PetsBody } from "./types/pets"
import { pets, notes } from "../database"
import { IActionCreator } from "./types/redux";


//define action types
const GET_ALL_PETS = "/pets/getAllPets"
const GET_PET = "/pets/getPet"
const GET_PET_NOTES = "/pets/getPetNotes"

//define actions
const getAllPetsAction = (allPets: pets[]) => {
    return {
        type: GET_ALL_PETS,
        payload: allPets
    }
}

const getPetAction = (pet: pets) => {
    return {
        type: GET_PET,
        payload: pet
    }
}

const getPetNotesAction =(notes: notes[]) => {
    return {
        type:GET_PET_NOTES,
        payload: notes
    }
}

//define thunks
export const getAllPetsData = () => {
    return async (dispatch: any) => {
        //api call
        return csrfFetch(`/api/pets`)
        .then(response => response.json())
        .then(allPetsData => {
            dispatch(getAllPetsAction(allPetsData));
        })
    }
}

export const getPetData = (id: number) => {
    return async (dispatch: any) => {
        //api call
        return csrfFetch(`/api/pets/${id}`)
        .then(response => response.json())
        .then(petData => {
            dispatch(getPetAction(petData));
        })
    }
}

export const getPetNotesData = (id: number) => {
    return async (dispatch: any) => {
        //api call
        return csrfFetch(`/api/pets/${id}/notes`)
        .then(response => response.json())
        .then(petNotesData => {
            dispatch(getPetNotesAction(petNotesData));
        })
    }
}

export const postPet = async (pet: pets) => {
    return csrfFetch(`/api/pets`, {
        method: 'POST',
        body: JSON.stringify(pet)
    })
        .then(response => response.json)
}

//default state
const initialState: PetInitialState ={
    allPets: null,
    pet: null,
    notes: null
}

//define reducer

function petsReducer(state = initialState, action: IActionCreator): PetInitialState {

    switch (action.type) {
        case GET_ALL_PETS:
            return {...state, allPets: action.payload};
        case GET_PET:
            return {...state, pet: action.payload};
        case GET_PET_NOTES:
            return {...state, notes: action.payload};
        default:
            return state;

    }
}

export default petsReducer