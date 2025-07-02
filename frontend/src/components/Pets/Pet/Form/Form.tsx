import React, { useState } from 'react';
import { PetsBody } from '../../../../redux/types/pets';
import { pets } from '../../../../database/client.ts';
import styles from './Form.module.css';
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

interface FormProperties {
    pet?: pets;
}

export function Form({ pet }: Readonly<FormProperties>) {
    const navigate = useNavigate();
    const { closeModal } = useModal();

    const [name, setName] = useState<string>(pet?.name ?? '');
    const [breed, setBreed] = useState<breed_type | undefined>(pet?.breed);
    const [birthday, setBirthday] = useState<Date | undefined>(pet?.birthday ?? new Date());
    const [gender, setGender] = useState<gender_type | undefined>(pet?.gender);
    const [sterilized, setSterilized] = useState<boolean>(pet?.sterilized ?? false);
    const [weight, setWeight] = useState<number>(pet?.weight ?? 0);
    const [color, setColor] = useState<color_type | undefined>(pet?.color);
    const [hair, setHair] = useState<hair_length_type | undefined>(pet?.hair_length);
    const [fur, setFur] = useState<fur_pattern_type | undefined>(pet?.fur_pattern);
    const [allergies, setAllergies] = useState<string[]>(pet?.allergies ?? []);
    const [microchip, setMicrochip] = useState<string>(pet?.microchip ?? '');
    const [conditions, setConditions] = useState<string[]>(pet?.medical_condition ?? []);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async (event: React.FormEvent) => {
        // Prevent default action
        event.preventDefault();

        // Remove?
        setIsSubmitting(true);

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
            setErrors(errors);

            // Remove?
            setIsSubmitting(false);

            // Abort
            return;
        }

        // Create data
        const data: PetsBody = {
            name: name.trim(),
            breed: breed!,
            birthday: birthday!,
            gender: gender!,
            sterilized,
            weight,
            color: color!,
            hair_length: hair!,
            fur_pattern: fur!,
            allergies,
            microchip: microchip.trim(),
            medical_condition: conditions,
        };

        // Send request
        (pet ? putPet(pet.id, data) : postPet(data))
            .then((pet) => navigate(`/pets/${pet.id}`))
            .catch((error) => {
                if (error instanceof ThunkError) {
                    setErrors(error.errors);
                } else {
                    setErrors({ message: error.message });
                }
                console.log('stephen');
            });
        console.log('Gabby');
    };

    return (
        <>
            <h1>{pet ? 'Update Pet' : 'Create Pet'}</h1>
            <form className={styles.form} onSubmit={submit}>
                <div className={styles.field}>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
                    {errors.name && <p className="error">{errors.name}</p>}
                </div>

                <EnumerationDropdown
                    id="breed"
                    label="Breed"
                    values={breed_type}
                    value={breed}
                    onChange={setBreed}
                    required
                    error={!!errors.breed}
                    errorMessage={errors.breed}
                />

                <div className={styles.field}>
                    <label htmlFor="birthday">Birthday</label>
                    <input
                        id="birthday"
                        name="birthday"
                        type="date"
                        value={birthday?.toISOString().split('T')[0]}
                        onChange={(event) =>
                            setBirthday(new Date(event.target.value + 'T00:00:00'))
                        }
                        required
                    />
                    {errors.birthday && <p className="error">{errors.birthday}</p>}
                </div>

                <EnumerationDropdown
                    id="gender"
                    label="Gender"
                    values={gender_type}
                    value={gender}
                    onChange={setGender}
                    required
                    error={!!errors.gender}
                    errorMessage={errors.gender}
                />

                <div className={styles.field}>
                    <label htmlFor="sterilized">Sterilized</label>
                    <input
                        id="sterilized"
                        name="sterilized"
                        type="checkbox"
                        checked={sterilized}
                        onChange={(event) => setSterilized(event.target.checked)}
                    />
                    {errors.sterilized && <p className="error">{errors.sterilized}</p>}
                </div>

                <div className={styles.field}>
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
                    {errors.weight && <p className="error">{errors.weight}</p>}
                </div>

                <EnumerationDropdown
                    id="color"
                    label="Color"
                    values={color_type}
                    value={color}
                    onChange={setColor}
                    required
                    error={!!errors.color}
                    errorMessage={errors.color}
                />

                <EnumerationDropdown
                    id="hair_length"
                    label="Hair Length"
                    values={hair_length_type}
                    value={hair}
                    onChange={setHair}
                    required
                    error={!!errors.hair}
                    errorMessage={errors.hair}
                />

                <EnumerationDropdown
                    id="fur_pattern"
                    label="Fur Pattern"
                    values={fur_pattern_type}
                    value={fur}
                    onChange={setFur}
                    required
                    error={!!errors.fur}
                    errorMessage={errors.fur}
                />

                <div className={styles.field}>
                    <label htmlFor="microchip">Microchip Number</label>
                    <input
                        id="microchip"
                        name="microchip"
                        type="text"
                        value={microchip}
                        onChange={(event) => setMicrochip(event.target.value)}
                        required
                    />
                    {errors.microchip && <p className="error">{errors.microchip}</p>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="allergies">Allergies</label>
                    <textarea
                        id="allergies"
                        name="allergies"
                        value={allergies.join(', ')}
                        onChange={(event) =>
                            setAllergies(
                                event.target.value
                                    .split(',')
                                    .map((s) => s.trim())
                                    .filter(Boolean),
                            )
                        }
                        placeholder="Enter allergies separated by commas"
                    />
                    {errors.allergies && <p className="error">{errors.allergies}</p>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="conditions">Medical Conditions</label>
                    <textarea
                        id="conditions"
                        name="conditions"
                        value={conditions.join(', ')}
                        onChange={(event) =>
                            setConditions(
                                event.target.value
                                    .split(',')
                                    .map((s) => s.trim())
                                    .filter(Boolean),
                            )
                        }
                        placeholder="Enter medical conditions separated by commas"
                    />
                    {errors.conditions && <p className="error">{errors.conditions}</p>}
                </div>

                <div className={styles.buttons}>
                    <button type="button" onClick={closeModal} disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button type="submit">
                        {isSubmitting ? 'Saving...' : pet ? 'Update Pet' : 'Add Pet'}
                    </button>
                </div>
            </form>
        </>
    );
}
