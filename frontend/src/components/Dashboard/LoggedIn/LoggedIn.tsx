import styles from './LoggedIn.module.css';
import grid from '../../../css/grid.module.css';
import { useAppDispatch, useAppSelector } from '../../../redux/store.ts';
import { useEffect, useState } from 'react';
import { getPets } from '../../../redux/pets.ts';
import Pets from '../../Pets';
import { Loader } from '../../common/Loader.tsx';

export function LoggedIn() {
    const dispatch = useAppDispatch();

    const pets = useAppSelector((state) => state.pets.pets);

    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        Promise.all([dispatch(getPets())]).then(() => setLoaded(true));
    }, [dispatch]);

    return (
        <div className={`${grid.container} ${styles.container}`}>
            <div className={`${grid.box} ${styles.box}`}>
                <h2 className={`${grid.header} ${styles.header}`}>Pets</h2>
                <div className={`${grid.content} ${styles.content}`}>
                    {loaded ? <Pets pets={pets} /> : <Loader />}
                </div>
            </div>
            <div className={`${grid.box} ${styles.box}`}>
                <h2 className={`${grid.header} ${styles.header}`}>Upcoming Care</h2>
                <div className={`${grid.content} ${styles.content}`}>
                    {loaded ? <p>Coming Soon</p> : <Loader />}
                </div>
            </div>
            <div className={`${grid.box} ${styles.box}`}>
                <h2 className={`${grid.header} ${styles.header}`}>Quick Links</h2>
                <div className={`${grid.content} ${styles.content}`}>
                    {loaded ? <p>Coming Soon</p> : <Loader />}
                </div>
            </div>
            <div className={`${grid.box} ${styles.box}`}>
                <h2 className={`${grid.header} ${styles.header}`}>Member Forum</h2>
                <div className={`${grid.content} ${styles.content}`}>
                    {loaded ? <p>Coming Soon</p> : <Loader />}
                </div>
            </div>
        </div>
    );
}
