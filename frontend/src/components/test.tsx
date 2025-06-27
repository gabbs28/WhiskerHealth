import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { useAppSelector } from "../redux/store"
import { getAllPetsData, postPet } from "../redux/pets";


function Test() {
    const dispatch = useDispatch();
    const user = useAppSelector(state => state.session.user)
    const pets = useAppSelector(state => state.pets.allPets)


    useEffect(() => {
        Promise.all(
            [
                dispatch(getAllPetsData(params.id)),
            ]
        ).then(() => setIsLoaded(true))
    }, [dispatch, params.spotId]);
}