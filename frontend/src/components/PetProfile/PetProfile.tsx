import styles from './PetProfile.module.css';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { getPetData } from '../../redux/pets';
import { getNoteData } from '../../redux/notes';
import { useParams } from 'react-router-dom';
import { GridLoader } from 'react-spinners';

export function PetProfile() {
    const dispatch = useAppDispatch();

    const params = useParams<{ id: string }>();

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
    const petId = BigInt(params.id ?? -1);

    const pets = useAppSelector((state) => state.pets.pets);
    const notes = useAppSelector((state) => state.notes.note);

    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        Promise.all([dispatch(getPetData(petId))]).then(() => setLoaded(true));
    }, [dispatch]);

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.box}>
                    <h2 className={styles.header}> Profile Overview <button className={styles.button} >Edit</button></h2>
                </div>
                <div className={styles.box}>
                    <h2 className={styles.header}> Notes <button className={styles.button} >+</button></h2>
                </div>
            </div>
        </div>
    );
}
