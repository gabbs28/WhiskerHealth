import styles from './Pet.module.css';
import resource from '../../../css/resource.module.css';
import { pets } from '../../../database/client.ts';
import { FaCat } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import {
    breed_type,
    color_type,
    fur_pattern_type,
    gender_type,
    hair_length_type,
} from '../../../database/enums.ts';
import { formatEnumeration } from '../../../utils/enumeration.ts';
import React from 'react';
import { useModal } from '../../../context/Modal.tsx';
import Form from './Form';
import { deletePet } from '../../../redux/pets.ts';
import { ThunkError } from '../../../redux/error.ts';
import { dateConverter } from '../../../utils/date.ts';

interface PetProperties {
    pet: pets;
    mode?: 'small' | 'large';
}

export function Pet({ pet, mode = 'small' }: Readonly<PetProperties>) {
    const navigate = useNavigate();
    const { setModalContent } = useModal();

    const edit = (event: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent default action
        event.preventDefault();

        // Show the edit pet form
        setModalContent(<Form pet={pet} />);
    };

    const remove = (event: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent default action
        event.preventDefault();

        // Delete pet
        deletePet(pet.id)
            .then(() => navigate('/'))
            .catch((error) => {
                if (error instanceof ThunkError) {
                    alert(error.errors.message);
                } else {
                    alert(error.message);
                }
            });
    };

    // Dashboard
    if (mode === 'small') {
        return (
            <Link
                to={`/pet/${pet.id}`}
                className={`${resource.container} ${resource.small} ${styles.container} ${styles.small}`}
            >
                <FaCat />
                <span>{pet.name}</span>
            </Link>
        );
    }

    // Details
    return (
        <div
            className={`${resource.container} ${resource.large} ${styles.container} ${styles.large}`}
        >
            <h2>{pet.name}</h2>
            <div className={`${resource.details} ${styles.details}`}>
                <div>
                    <span className={`${resource.name} ${styles.name}`}>Breed:</span>
                    <span className={`${resource.value} ${styles.value}`}>
                        {formatEnumeration(breed_type, pet.breed)}
                    </span>
                </div>
                <div>
                    <span className={`${resource.name} ${styles.name}`}>Birthday:</span>
                    <span className={`${resource.value} ${styles.value}`}>
                        {dateConverter(pet.birthday)}
                    </span>
                </div>
                <div>
                    <span className={`${resource.name} ${styles.name}`}>Gender:</span>
                    <span className={`${resource.value} ${styles.value}`}>
                        {formatEnumeration(gender_type, pet.gender)}
                    </span>
                </div>
                <div>
                    <span className={`${resource.name} ${styles.name}`}>Sterilized:</span>
                    <span className={`${resource.value} ${styles.value}`}>
                        {pet.sterilized ? 'Yes' : 'No'}
                    </span>
                </div>
                <div>
                    <span className={`${resource.name} ${styles.name}`}>Weight:</span>
                    <span className={`${resource.value} ${styles.value}`}>{pet.weight} lbs</span>
                </div>
                <div>
                    <span className={`${resource.name} ${styles.name}`}>Color:</span>
                    <span className={`${resource.value} ${styles.value}`}>
                        {formatEnumeration(color_type, pet.color)}
                    </span>
                </div>
                <div>
                    <span className={`${resource.name} ${styles.name}`}>Hair Length:</span>
                    <span className={`${resource.value} ${styles.value}`}>
                        {formatEnumeration(hair_length_type, pet.hair_length)}
                    </span>
                </div>
                <div>
                    <span className={`${resource.name} ${styles.name}`}>Fur Pattern:</span>
                    <span className={`${resource.value} ${styles.value}`}>
                        {formatEnumeration(fur_pattern_type, pet.fur_pattern)}
                    </span>
                </div>
                <div>
                    <span className={`${resource.name} ${styles.name}`}>Microchip:</span>
                    <span className={`${resource.value} ${styles.value}`}>{pet.microchip}</span>
                </div>
                {pet.allergies.length > 0 && (
                    <div>
                        <span className={`${resource.name} ${styles.name}`}>Allergies:</span>
                        <span className={`${resource.value} ${styles.value}`}>
                            {pet.allergies.join(', ')}
                        </span>
                    </div>
                )}
                {pet.medical_condition.length > 0 && (
                    <div>
                        <span className={`${resource.name} ${styles.name}`}>
                            Medical Conditions:
                        </span>
                        <span className={`${resource.value} ${styles.value}`}>
                            {pet.medical_condition.join(', ')}
                        </span>
                    </div>
                )}
            </div>

            <div className={`${resource.buttons} ${styles.buttons}`}>
                <button className={`${resource.button} ${styles.button}`} onClick={remove}>
                    Delete
                </button>
                <button className={`${resource.button} ${styles.button}`} onClick={edit}>
                    Edit
                </button>
            </div>
        </div>
    );
}
