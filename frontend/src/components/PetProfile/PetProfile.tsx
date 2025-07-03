import styles from './PetProfile.module.css';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { useModal } from '../../context/Modal';
import { getPetData } from '../../redux/pets';
import { getNoteData } from '../../redux/notes';
import { useParams } from 'react-router-dom';
import { GridLoader } from 'react-spinners';
import Form from '../Pets/Pet/Form';

export function PetProfile() {
    const { setModalContent, closeModal } = useModal();

    const dispatch = useAppDispatch();

    const params = useParams<{ id: string }>();

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
    const petId = BigInt(params.id ?? -1);

    const pet = useAppSelector((state) => state.pets.pet);
    const notes = useAppSelector((state) => state.notes.note);
        console.log(pet)

    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        Promise.all([dispatch(getPetData(petId))]).then(() => setLoaded(true));
    }, [dispatch]);

    const overview = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            // Prevent default action
            event.preventDefault();

            if (pet) {
                // Show the add pet form
                setModalContent(<Form pet={pet}/>);
            }
    
        };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <a className={styles.box} onClick={overview}>
                    <h2 className={styles.header}>Profile Overview</h2>
                </a>
                <div className={styles.box}>
                    <h2 className={styles.header}>Notes</h2>
                </div>
            </div>
        </div>
    );
}
