CREATE TABLE users
(
    id            BIGSERIAL    NOT NULL PRIMARY KEY,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(100) NOT NULL UNIQUE,
    username      VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,

    created_at    TIMESTAMPTZ  NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TYPE breed_type AS ENUM ('Abyssinian', 'American Bobtail', 'American Bobtail Shorthair', 'American Curl', 'American Curl Longhair', 'American Shorthair', 'American Wirehair', 'Australian Mist', 'Balinese', 'Bengal', 'Bengal Longhair', 'Birman', 'Bombay', 'British Longhair', 'British Shorthair', 'Burmese', 'Burmilla', 'Burmilla Longhair', 'Chartreux', 'Chausie', 'Cornish Rex', 'Cymric', 'Devon Rex', 'Donskoy', 'Egyptian Mau', 'Exotic Shorthair', 'Havana', 'Highlander', 'Highlander Shorthair', 'Himalayan', 'Japanese Bobtail', 'Japanese Bobtail Longhair', 'Khao Manee', 'Korat', 'Kurilian Bobtail', 'Kurilian Bobtail Longhair', 'LaPerm', 'LaPerm Shorthair', 'Lykoi', 'Maine Coon', 'Maine Coon Polydactyl', 'Manx', 'Minuet', 'Minuet Longhair', 'Munchkin', 'Munchkin Longhair', 'Nebelung', 'Norwegian Forest', 'Ocicat', 'Oriental Longhair', 'Oriental Shorthair', 'Persian', 'Peterbald', 'Pixie-Bob', 'Pixie-Bob Longhair', 'Ragdoll', 'Russian Blue', 'Savannah', 'Scottish Fold', 'Scottish Fold Longhair', 'Scottish Straight', 'Scottish Straight Longhair', 'Selkirk Rex', 'Selkirk Rex Longhair', 'Siamese', 'Siberian', 'Singapura', 'Snowshoe', 'Somali', 'Sphynx', 'Tennessee Rex', 'Thai', 'Tonkinese', 'Toyger', 'Turkish Angora', 'Turkish Van');
CREATE TYPE gender_type AS ENUM ('Female', 'Male');
CREATE TYPE color_type AS ENUM ('Black', 'Orange', 'Chocolate', 'Cinnamon', 'Grey/Blue', 'White', 'Cream', 'Fawn', 'Lilac');
CREATE TYPE hair_length_type AS ENUM ('Hairless', 'Short hair', 'Long hair');
CREATE TYPE fur_pattern_type AS ENUM ('Solid', 'Bi-Color', 'Calico', 'Mackerel Tabby', 'Classic Tabby', 'Spotted Tabby', 'Tortoiseshell', 'Van', 'Pointed');

CREATE TABLE pets
(
    id                BIGSERIAL        NOT NULL PRIMARY KEY,
    name              VARCHAR(100)     NOT NULL,
    breed             breed_type       NOT NULL,
    birthday          DATE             NOT NULL,
    gender            gender_type      NOT NULL,
    sterilized        BOOLEAN          NOT NULL,
    weight            REAL             NOT NULL,
    color             color_type       NOT NULL,
    hair_length       hair_length_type NOT NULL,
    fur_pattern       fur_pattern_type NOT NULL,
    allergies         TEXT[]           NOT NULL,
    microchip         VARCHAR(100)     NOT NULL,
    medical_condition TEXT[]           NOT NULL,

    created_at        TIMESTAMPTZ      NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at        TIMESTAMPTZ      NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE pet_images
(
    id         BIGSERIAL   NOT NULL PRIMARY KEY,
    pet_id     BIGINT      NOT NULL UNIQUE,
    url        TEXT        NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),

    FOREIGN KEY (pet_id) REFERENCES pets (id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX ON pet_images (pet_id);

CREATE TABLE user_pets
(
    user_id    BIGINT      NOT NULL,
    pet_id     BIGINT      NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),

    PRIMARY KEY (user_id, pet_id),

    FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pets (id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX ON user_pets (pet_id);

CREATE TABLE providers
(
    id         BIGSERIAL    NOT NULL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    address    VARCHAR(100) NOT NULL,
    city       VARCHAR(100) NOT NULL,
    state      VARCHAR(100) NOT NULL,
    zip        SMALLINT     NOT NULL,
    phone      VARCHAR(100) NOT NULL,

    created_at TIMESTAMPTZ  NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE vets
(
    id          BIGSERIAL    NOT NULL PRIMARY KEY,
    provider_id BIGINT       NOT NULL,
    name        VARCHAR(100) NOT NULL,

    created_at  TIMESTAMPTZ  NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT CLOCK_TIMESTAMP(),

    FOREIGN KEY (provider_id) REFERENCES providers (id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX ON vets (provider_id);

CREATE TABLE appointments
(
    id         BIGSERIAL    NOT NULL PRIMARY KEY,
    pet_id     BIGINT       NOT NULL,
    vet_id     BIGINT       NOT NULL,
    info       VARCHAR(100) NOT NULL,
    date       TIMESTAMPTZ  NOT NULL,

    created_at TIMESTAMPTZ  NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT CLOCK_TIMESTAMP(),

    FOREIGN KEY (pet_id) REFERENCES pets (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (vet_id) REFERENCES vets (id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX ON appointments (pet_id);
CREATE INDEX ON appointments (vet_id);

CREATE TYPE level_type AS ENUM ('None', 'Low', 'Medium', 'High', 'Very High');
CREATE TYPE fecal_score_type AS ENUM ('Very Hard and Dry', 'Firm but not hard', 'Log Shaped with moist surface', 'Very Moist and Soggy', 'Very Moist but Has a distinct shape', 'Has texture but no defined shape', 'Watery/no texture');
CREATE TYPE fecal_color_type AS ENUM ('Brown', 'Black', 'Red', 'Brown with white spots', 'Yellow', 'Orange', 'Green');
CREATE TYPE urine_color_type AS ENUM ('Light Yellow', 'Dark Yellow', 'Brown', 'Cloudy', 'Pink or Red');

CREATE TABLE notes
(
    id             BIGSERIAL    NOT NULL PRIMARY KEY,
    pet_id         BIGINT       NOT NULL,
    date           TIMESTAMPTZ  NOT NULL,
    title          VARCHAR(100) NOT NULL,
    pain_level     level_type   NOT NULL,
    fatigue_level  level_type   NOT NULL,
    activity_level level_type   NOT NULL,
    appetite_level level_type   NOT NULL,
    water_intake   level_type   NOT NULL,
    sleep_level    level_type   NOT NULL,
    regular_meds   BOOLEAN      NOT NULL,
    relief_meds    BOOLEAN      NOT NULL,
    fecal_score    fecal_score_type,
    fecal_color    fecal_color_type,
    urine_color    urine_color_type,
    notes          TEXT,

    created_at     TIMESTAMPTZ  NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT CLOCK_TIMESTAMP(),

    FOREIGN KEY (pet_id) REFERENCES pets (id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX ON notes (pet_id);

CREATE TABLE note_symptoms
(
    id         BIGSERIAL    NOT NULL PRIMARY KEY,
    note_id    BIGINT       NOT NULL,
    time       TIMESTAMPTZ  NOT NULL,
    symptom    VARCHAR(250) NOT NULL,
    trigger    VARCHAR(250) NOT NULL,
    duration   INTERVAL     NOT NULL,
    severity   level_type   NOT NULL,

    created_at TIMESTAMPTZ  NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT CLOCK_TIMESTAMP(),

    FOREIGN KEY (note_id) REFERENCES notes (id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX ON note_symptoms (note_id);

CREATE TABLE note_images
(
    id         BIGSERIAL   NOT NULL PRIMARY KEY,
    note_id    BIGINT      NOT NULL,
    url        TEXT        NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),

    FOREIGN KEY (note_id) REFERENCES notes (id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX ON note_images (note_id);

CREATE TABLE charts
(
    id          BIGSERIAL    NOT NULL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(250) NOT NULL,
    units       TEXT         NOT NULL,
    upper_bound NUMERIC      NOT NULL,
    lower_bound NUMERIC      NOT NULL,

    created_at  TIMESTAMPTZ  NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT CLOCK_TIMESTAMP()
);

CREATE TABLE pet_charts
(
    id         BIGSERIAL   NOT NULL PRIMARY KEY,
    chart_id   BIGINT      NOT NULL,
    pet_id     BIGINT      NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),

    FOREIGN KEY (chart_id) REFERENCES charts (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pets (id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX ON pet_charts (chart_id);
CREATE INDEX ON pet_charts (pet_id);

CREATE TABLE pet_chart_data
(
    id           BIGSERIAL   NOT NULL PRIMARY KEY,
    pet_chart_id BIGINT      NOT NULL,
    date         TIMESTAMPTZ NOT NULL,
    value        NUMERIC     NOT NULL,

    created_at   TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT CLOCK_TIMESTAMP(),

    FOREIGN KEY (pet_chart_id) REFERENCES pet_charts (id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX ON pet_chart_data (pet_chart_id);