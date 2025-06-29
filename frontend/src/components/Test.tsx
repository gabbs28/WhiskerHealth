import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../redux/store"
import {getAllPetsData, getPetData} from "../redux/pets";

export default function Test({ id }: Readonly<{ id?: number }>) {
    const dispatch = useAppDispatch();

    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const user = useAppSelector(state => state.session.user)
    const pet = useAppSelector(state => state.pets.pet)
    const pets = useAppSelector(state => state.pets.pets)

    useEffect(() => {
        const promises = [];

        promises.push(dispatch(getAllPetsData()));

        if (id) {
            promises.push(dispatch(getPetData(id)));
        }

        Promise.all(promises)
            .then(() => setIsLoaded(true))

    }, [dispatch, id]);

    if (isLoaded) {
        console.log(user, pet, pets);
    }

    return <h1>Test</h1>
}