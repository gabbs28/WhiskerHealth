import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { getAllPetsData, getPetData } from '../redux/pets';
import EnumerationDropdown from './EnumerationDropdown';
import { breed_type, fur_pattern_type } from '../database/enums.ts';

export default function Test({ id }: Readonly<{ id?: number }>) {
    const dispatch = useAppDispatch();

    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const user = useAppSelector((state) => state.session.user);
    const pet = useAppSelector((state) => state.pets.pet);
    const pets = useAppSelector((state) => state.pets.pets);

    // State
    const [breed, setBreed] = useState<breed_type>();
    const [furPattern, setFurPattern] = useState<fur_pattern_type>();

    useEffect(() => {
        const promises = [];

        promises.push(dispatch(getAllPetsData()));

        if (id) {
            promises.push(dispatch(getPetData(id)));
        }

        Promise.all(promises).then(() => setIsLoaded(true));
    }, [dispatch, id]);

    if (isLoaded) {
        console.log(user, pet, pets);
    }

    return (
        <div>
            <h1>Test</h1>
            <EnumerationDropdown
                id="breed"
                label="Breed"
                values={breed_type}
                value={breed}
                onChange={(value) => {
                    setBreed(value);
                    console.log(value);
                }}
                helperText={'Please select a breed.'}
                error={false}
            />
            <EnumerationDropdown
                id="fur-pattern"
                label="Fur Pattern"
                values={fur_pattern_type}
                value={furPattern}
                onChange={(value) => {
                    setFurPattern(value);
                    console.log(value);
                }}
                helperText={'Please select a fur pattern.'}
            />
        </div>
    );
}
