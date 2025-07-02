import styles from './Pet.module.css';
import { pets } from '../../../database/client.ts';
import { FaCat } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface PetProperties {
    pet: pets;
}

export function Pet({ pet }: Readonly<PetProperties>) {
    return (
        <Link to={`/pet/${pet.id}`} className={styles.container}>
            <FaCat />
            <span>{pet.name}</span>
        </Link>
    );
}
