import styles from './PetProfile.module.css';
import grid from '../../css/grid.module.css';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store.ts';
import { getPet, getPetNotes } from '../../redux/pets.ts';
import { useNavigate, useParams } from 'react-router-dom';
import Pet from '../Pets/Pet/index.ts';
import Notes from '../Notes/index.ts';
import { Loader } from '../common/Loader.tsx';

export function PetProfile() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();

    const user = useAppSelector((state) => state.session.user);
    const pet = useAppSelector((state) => state.pets.pet);
    const notes = useAppSelector((state) => state.pets.notes);

    const [loaded, setLoaded] = useState<boolean>(false);

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
    const petId = BigInt(id ?? -1);

    useEffect(() => {
        // Redirect if logged out
        if (!user) {
            navigate('/', { replace: true });
        } else {
            Promise.all([dispatch(getPet(petId)), dispatch(getPetNotes(petId))]).then(() =>
                setLoaded(true),
            );
        }
    }, [dispatch, navigate, user, petId]);

    return (
        <div className={styles.container}>
            <div className={`${styles.navigation}`}>
                <button onClick={() => navigate('/')}>← Back</button>
            </div>
            <div className={`${grid.container} ${styles.grid}`}>
                <div className={`${grid.box} ${styles.box} pet`}>
                    <h2 className={`${grid.header} ${styles.header}`}>Pet</h2>
                    <div className={`${grid.content} ${styles.content}`}>
                        {loaded && pet ? <Pet pet={pet} mode="large" /> : <Loader />}
                    </div>
                </div>
                <div className={`${grid.box} ${styles.box} notes`}>
                    <h2 className={`${grid.header} ${styles.header}`}>Notes</h2>
                    <div className={`${grid.content} ${styles.content}`}>
                        {loaded ? <Notes petId={petId} notes={notes} /> : <Loader />}
                    </div>
                </div>
            </div>
        </div>
    );
}
