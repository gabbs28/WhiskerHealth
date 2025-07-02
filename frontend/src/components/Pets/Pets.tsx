import styles from './Pets.module.css';
import { pets } from '../../database/client.ts';
import { FaPlusCircle } from 'react-icons/fa';
import { Pet } from './Pet/Pet.tsx';
import React from 'react';
import { useModal } from '../../context/Modal.tsx';
import Form from './Pet/Form';

interface PetProperties {
    pets: pets[];
}

export function Pets({ pets }: Readonly<PetProperties>) {
    const { setModalContent, closeModal } = useModal();

    const add = (event: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent default action
        event.preventDefault();

        // Show the add pet form
        setModalContent(<Form />);
    };

    return (
        <div className={styles.container}>
            {pets?.map((pet) => (
                <Pet key={pet.id} pet={pet} />
            ))}
            <button className={styles.add} onClick={(event) => add(event)}>
                <FaPlusCircle />
                <span>Add Pet</span>
            </button>
        </div>
    );
}
