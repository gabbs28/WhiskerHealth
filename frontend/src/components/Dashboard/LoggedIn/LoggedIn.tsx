import styles from './LoggedIn.module.css';
import { useAppDispatch, useAppSelector } from '../../../redux/store.ts';
import { useEffect, useState } from 'react';
import { getAllPetsData } from '../../../redux/pets.ts';
import Pets from '../../Pets';
import { GridLoader } from 'react-spinners';

export function LoggedIn() {
    const dispatch = useAppDispatch();

    const pets = useAppSelector((state) => state.pets.pets);

    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        Promise.all([dispatch(getAllPetsData())]).then(() => setLoaded(true));
    }, [dispatch]);

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <h2 className={styles.header}>Pets</h2>
                <div className={styles.content}>
                    {loaded ? <Pets pets={pets} /> : <GridLoader />}
                </div>
            </div>
            <div className={styles.box}>
                <h2 className={styles.header}>Upcoming Care</h2>
                <div className={styles.content}>{loaded ? <p>Coming Soon</p> : <GridLoader />}</div>
            </div>
            <div className={styles.box}>
                <h2 className={styles.header}>Quick Links</h2>
                <div className={styles.content}>{loaded ? <p>Coming Soon</p> : <GridLoader />}</div>
            </div>
            <div className={styles.box}>
                <h2 className={styles.header}>Member Forum</h2>
                <div className={styles.content}>{loaded ? <p>Coming Soon</p> : <GridLoader />}</div>
            </div>
        </div>
    );
}
