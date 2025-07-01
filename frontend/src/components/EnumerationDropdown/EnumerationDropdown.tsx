import React from 'react';
import styles from './EnumerationDropdown.module.css';

// Property interface for the dropdown
interface EnumerationDropdownProperties<T extends string> {
    // HTML id for the select element
    id: string;

    // Text for label element
    label: string;

    // Every possible options for the select from enumeration list
    values: { [key: string]: T };

    // Current value selected
    value?: T;

    // Text to provide additional information to help with making a choice
    // ? means optional
    helperText?: string;

    // What to do when the select is changed/setting the value
    onChange?: (value: T) => void;

    // If there is an error with the select
    error?: boolean;

    // Message to be shown if there is an error
    errorMessage?: string;

    // If the select is a required field
    required?: boolean;

    // Custom formater for the display value of the select
    formatter?: (value: T) => string;
}

// EnumerationDropdown component
export function EnumerationDropdown<T extends string>({
    id,
    label,
    values,
    value,
    helperText,
    onChange = (value: T) => {
        console.log(value);
    },
    error = false,
    errorMessage,
    required = true,
    formatter = (value: T) => value.replace(/_/g, ' '),
    //
}: Readonly<EnumerationDropdownProperties<T>>) {
    // Get possible values from the enumeration
    const options = Object.entries(values);

    // Handlers
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value as T);
    };
    // Remember each enumeration is in its own div
    return (
        <div className={styles.container}>
            <label htmlFor={id}>{label}</label>
            <select id={id} value={value ?? ''} onChange={handleChange} required={required}>
                <option value="" disabled={true}>
                    Select {label}
                </option>
                {options.map(([key, value]) => (
                    <option key={key} value={value}>
                        {formatter(value)}
                    </option>
                ))}
            </select>
            {helperText && <p className={styles.helper}>{helperText}</p>}
            {error && <p className={styles.error}>{errorMessage}</p>}
        </div>
    );
}
