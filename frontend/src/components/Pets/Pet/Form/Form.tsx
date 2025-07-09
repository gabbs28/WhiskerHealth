import React, { useState } from 'react';
import { PetsBody } from '../../../../redux/types/pets';
import { pets } from '../../../../database/client.ts';
import styles from './Form.module.css';
import form from '../../../../css/form.module.css';
import EnumerationDropdown from '../../../EnumerationDropdown';
import {
    breed_type,
    color_type,
    fur_pattern_type,
    gender_type,
    hair_length_type,
} from '../../../../database/enums.ts';
import { postPet, putPet } from '../../../../redux/pets.ts';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../../../context/Modal.tsx';
import { ThunkError } from '../../../../redux/error.ts';
import { useAppDispatch } from '../../../../redux/store.ts';

interface FormProperties {
    pet?: pets;
}

export function Form({ pet }: Readonly<FormProperties>) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { setIsLoading, closeModal } = useModal();

    const [name, setName] = useState<string>(pet?.name ?? '');
    const [breed, setBreed] = useState<breed_type | undefined>(pet?.breed);
    const [birthday, setBirthday] = useState<Date>(pet?.birthday ?? new Date());
    const [gender, setGender] = useState<gender_type | undefined>(pet?.gender);
    const [sterilized, setSterilized] = useState<boolean>(pet?.sterilized ?? false);
    const [weight, setWeight] = useState<number>(pet?.weight ?? 0);
    const [color, setColor] = useState<color_type | undefined>(pet?.color);
    const [hair, setHair] = useState<hair_length_type | undefined>(pet?.hair_length);
    const [fur, setFur] = useState<fur_pattern_type | undefined>(pet?.fur_pattern);
    const [allergies, setAllergies] = useState<string>(pet?.allergies?.join('\n') ?? '');
    const [microchip, setMicrochip] = useState<string>(pet?.microchip ?? '');
    const [conditions, setConditions] = useState<string>(pet?.medical_condition?.join('\n') ?? '');

    const [errors, setErrors] = useState<Record<string, string>>({});

    const submit = async (event: React.FormEvent) => {
        // Prevent default action
        event.preventDefault();

        // Clear previous errors
        setErrors({});

        // Validate required fields
        const errors: Record<string, string> = {};

        if (!name.trim()) {
            errors.name = 'Name is required';
        }

        if (!breed) {
            errors.breed = 'Breed is required';
        }

        if (!birthday) {
            errors.birthday = 'Birthday is required';
        }

        if (!gender) {
            errors.gender = 'Gender is required';
        }

        if (weight <= 0) {
            errors.weight = 'Weight must be greater than 0';
        }

        if (!color) {
            errors.color = 'Color is required';
        }

        if (!hair) {
            errors.hair = 'Hair length is required';
        }

        if (!fur) {
            errors.fur = 'Fur pattern is required';
        }

        // Check to see if there are any errors
        if (Object.keys(errors).length > 0) {
            // Update errors
            return setErrors(errors);
        }

        // Set loading
        setIsLoading(true);

        // Create data
        const data: PetsBody = {
            name: name.trim(),
            breed: breed!,
            birthday: birthday,
            gender: gender!,
            sterilized,
            weight,
            color: color!,
            hair_length: hair!,
            fur_pattern: fur!,
            allergies: allergies
                .split('\n')
                .map((allergy: string) => allergy.trim())
                .filter((allergy) => allergy),
            microchip: microchip.trim(),
            medical_condition: conditions
                .split('\n')
                .map((allergy: string) => allergy.trim())
                .filter((allergy) => allergy),
        };

        // Send request
        (pet ? dispatch(putPet(pet.id, data)) : postPet(data))
            .then((instance) => {
                if (pet) {
                    // Close modal
                    closeModal();
                } else {
                    // Load pet
                    navigate(`/pet/${instance.id}`);
                }
            })
            .catch((error) => {
                // Update errors
                if (error instanceof ThunkError) {
                    setErrors(error.errors);
                } else {
                    setErrors({ message: error.message });
                }
            })
            .finally(() => {
                // Clear loading
                setIsLoading(false);
            });
    };

    return (
        <div className={`${form.container} ${styles.container}`}>
            <h1>{pet ? 'Update Pet' : 'Create Pet'}</h1>
            <form className={`${form.form} ${styles.form}`} onSubmit={submit}>
                <div className={`${form.row} ${styles.row}`}>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
                    {errors.name && (
                        <p className={`${form.error} ${styles.error}`}>{errors.name}</p>
                    )}
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <EnumerationDropdown
                        id="breed"
                        label="Breed"
                        values={breed_type}
                        value={breed}
                        onChange={setBreed}
                        error={!!errors.breed}
                        errorMessage={errors.breed}
                    />
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <label htmlFor="birthday">Birthday</label>
                    <input
                        id="birthday"
                        name="birthday"
                        type="date"
                        value={birthday.toISOString().split('T')[0]}
                        onChange={(event) => setBirthday(new Date(event.target.value))}
                        required
                    />
                    {errors.birthday && (
                        <p className={`${form.error} ${styles.error}`}>{errors.birthday}</p>
                    )}
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <EnumerationDropdown
                        id="gender"
                        label="Gender"
                        values={gender_type}
                        value={gender}
                        onChange={setGender}
                        error={!!errors.gender}
                        errorMessage={errors.gender}
                    />
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <label htmlFor="sterilized">Sterilized</label>
                    <input
                        id="sterilized"
                        name="sterilized"
                        type="checkbox"
                        checked={sterilized}
                        onChange={(event) => setSterilized(event.target.checked)}
                    />
                    {errors.sterilized && (
                        <p className={`${form.error} ${styles.error}`}>{errors.sterilized}</p>
                    )}
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <label htmlFor="weight">Weight (lbs)</label>
                    <input
                        id="weight"
                        name="weight"
                        type="number"
                        min="0"
                        step="0.1"
                        value={weight}
                        onChange={(event) => setWeight(parseFloat(event.target.value) || 0)}
                        required
                    />
                    {errors.weight && (
                        <p className={`${form.error} ${styles.error}`}>{errors.weight}</p>
                    )}
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <EnumerationDropdown
                        id="color"
                        label="Color"
                        values={color_type}
                        value={color}
                        onChange={setColor}
                        error={!!errors.color}
                        errorMessage={errors.color}
                    />
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <EnumerationDropdown
                        id="hair_length"
                        label="Hair Length"
                        values={hair_length_type}
                        value={hair}
                        onChange={setHair}
                        error={!!errors.hair}
                        errorMessage={errors.hair}
                    />
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <EnumerationDropdown
                        id="fur_pattern"
                        label="Fur Pattern"
                        values={fur_pattern_type}
                        value={fur}
                        onChange={setFur}
                        error={!!errors.fur}
                        errorMessage={errors.fur}
                    />
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <label htmlFor="microchip">Microchip Number</label>
                    <input
                        id="microchip"
                        name="microchip"
                        type="text"
                        value={microchip}
                        onChange={(event) => setMicrochip(event.target.value)}
                        required
                    />
                    {errors.microchip && (
                        <p className={`${form.error} ${styles.error}`}>{errors.microchip}</p>
                    )}
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <label htmlFor="allergies">Allergies</label>
                    <textarea
                        id="allergies"
                        name="allergies"
                        value={allergies}
                        onChange={(event) => setAllergies(event.target.value)}
                        placeholder="Enter allergies separated by newlines"
                    />
                    {errors.allergies && (
                        <p className={`${form.error} ${styles.error}`}>{errors.allergies}</p>
                    )}
                </div>

                <div className={`${form.row} ${styles.row}`}>
                    <label htmlFor="conditions">Medical Conditions</label>
                    <textarea
                        id="conditions"
                        name="conditions"
                        value={conditions}
                        onChange={(event) => setConditions(event.target.value)}
                        placeholder="Enter medical conditions separated by newlines"
                    />
                    {errors.conditions && (
                        <p className={`${form.error} ${styles.error}`}>{errors.conditions}</p>
                    )}
                </div>

                {errors.message && (
                    <div className={`${form.row} ${styles.row}`}>
                        <p className={`${form.error} ${styles.error}`}>{errors.message}</p>
                    </div>
                )}

                <div className={`${form.buttons} ${styles.buttons}`}>
                    <button
                        type="button"
                        className={`${form.button} ${styles.button}`}
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                    <button type="submit" className={`${form.button} ${styles.button}`}>
                        {pet ? 'Update Pet' : 'Add Pet'}
                    </button>
                </div>
            </form>
        </div>
    );
}
