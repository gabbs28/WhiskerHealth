-- CreateEnum
CREATE TYPE "breed_type" AS ENUM ('Abyssinian', 'American Bobtail', 'American Bobtail Shorthair', 'American Curl', 'American Curl Longhair', 'American Shorthair', 'American Wirehair', 'Australian Mist', 'Balinese', 'Bengal', 'Bengal Longhair', 'Birman', 'Bombay', 'British Longhair', 'British Shorthair', 'Burmese', 'Burmilla', 'Burmilla Longhair', 'Chartreux', 'Chausie', 'Cornish Rex', 'Cymric', 'Devon Rex', 'Donskoy', 'Egyptian Mau', 'Exotic Shorthair', 'Havana', 'Highlander', 'Highlander Shorthair', 'Himalayan', 'Japanese Bobtail', 'Japanese Bobtail Longhair', 'Khao Manee', 'Korat', 'Kurilian Bobtail', 'Kurilian Bobtail Longhair', 'LaPerm', 'LaPerm Shorthair', 'Lykoi', 'Maine Coon', 'Maine Coon Polydactyl', 'Manx', 'Minuet', 'Minuet Longhair', 'Munchkin', 'Munchkin Longhair', 'Nebelung', 'Norwegian Forest', 'Ocicat', 'Oriental Longhair', 'Oriental Shorthair', 'Persian', 'Peterbald', 'Pixie-Bob', 'Pixie-Bob Longhair', 'Ragdoll', 'Russian Blue', 'Savannah', 'Scottish Fold', 'Scottish Fold Longhair', 'Scottish Straight', 'Scottish Straight Longhair', 'Selkirk Rex', 'Selkirk Rex Longhair', 'Siamese', 'Siberian', 'Singapura', 'Snowshoe', 'Somali', 'Sphynx', 'Tennessee Rex', 'Thai', 'Tonkinese', 'Toyger', 'Turkish Angora', 'Turkish Van');

-- CreateEnum
CREATE TYPE "color_type" AS ENUM ('Black', 'Orange', 'Chocolate', 'Cinnamon', 'Grey/Blue', 'White', 'Cream', 'Fawn', 'Lilac');

-- CreateEnum
CREATE TYPE "fecal_color_type" AS ENUM ('Brown', 'Black', 'Red', 'Brown with white spots', 'Yellow', 'Orange', 'Green');

-- CreateEnum
CREATE TYPE "fecal_score_type" AS ENUM ('Very Hard and Dry', 'Firm but not hard', 'Log Shaped with moist surface', 'Very Moist and Soggy', 'Very Moist but Has a distinct shape', 'Has texture but no defined shape', 'Watery/no texture');

-- CreateEnum
CREATE TYPE "fur_pattern_type" AS ENUM ('Solid', 'Bi-Color', 'Calico', 'Mackerel Tabby', 'Classic Tabby', 'Spotted Tabby', 'Tortoiseshell', 'Van', 'Pointed');

-- CreateEnum
CREATE TYPE "gender_type" AS ENUM ('Female', 'Male');

-- CreateEnum
CREATE TYPE "hair_length_type" AS ENUM ('Hairless', 'Short hair', 'Long hair');

-- CreateEnum
CREATE TYPE "level_type" AS ENUM ('None', 'Low', 'Medium', 'High', 'Very High');

-- CreateEnum
CREATE TYPE "urine_color_type" AS ENUM ('Light Yellow', 'Dark Yellow', 'Brown', 'Cloudy', 'Pink or Red');

-- CreateTable
CREATE TABLE "appointments" (
    "id" BIGSERIAL NOT NULL,
    "pet_id" BIGINT NOT NULL,
    "vet_id" BIGINT NOT NULL,
    "info" VARCHAR(100) NOT NULL,
    "date" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charts" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(250) NOT NULL,
    "units" TEXT NOT NULL,
    "upper_bound" DECIMAL NOT NULL,
    "lower_bound" DECIMAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT "charts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_images" (
    "id" BIGSERIAL NOT NULL,
    "note_id" BIGINT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT "note_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_symptoms" (
    "id" BIGSERIAL NOT NULL,
    "note_id" BIGINT NOT NULL,
    "time" TIMESTAMPTZ(6) NOT NULL,
    "symptom" VARCHAR(250) NOT NULL,
    "trigger" VARCHAR(250) NOT NULL,
    "duration" interval NOT NULL,
    "severity" "level_type" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT "note_symptoms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" BIGSERIAL NOT NULL,
    "pet_id" BIGINT NOT NULL,
    "date" TIMESTAMPTZ(6) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "pain_level" "level_type" NOT NULL,
    "fatigue_level" "level_type" NOT NULL,
    "activity_level" "level_type" NOT NULL,
    "appetite_level" "level_type" NOT NULL,
    "water_intake" "level_type" NOT NULL,
    "sleep_level" "level_type" NOT NULL,
    "regular_meds" BOOLEAN NOT NULL,
    "relief_meds" BOOLEAN NOT NULL,
    "fecal_score" "fecal_score_type",
    "fecal_color" "fecal_color_type",
    "urine_color" "urine_color_type",
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet_chart_data" (
    "id" BIGSERIAL NOT NULL,
    "pet_chart_id" BIGINT NOT NULL,
    "date" TIMESTAMPTZ(6) NOT NULL,
    "value" DECIMAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT "pet_chart_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet_charts" (
    "id" BIGSERIAL NOT NULL,
    "chart_id" BIGINT NOT NULL,
    "pet_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT "pet_charts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet_images" (
    "id" BIGSERIAL NOT NULL,
    "pet_id" BIGINT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT "pet_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pets" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "breed" "breed_type" NOT NULL,
    "birthday" DATE NOT NULL,
    "gender" "gender_type" NOT NULL,
    "sterilized" BOOLEAN NOT NULL,
    "weight" REAL NOT NULL,
    "color" "color_type" NOT NULL,
    "hair_length" "hair_length_type" NOT NULL,
    "fur_pattern" "fur_pattern_type" NOT NULL,
    "allergies" TEXT[],
    "microchip" VARCHAR(100) NOT NULL,
    "medical_condition" TEXT[],
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "providers" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "zip" SMALLINT NOT NULL,
    "phone" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT "providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_pets" (
    "user_id" BIGINT NOT NULL,
    "pet_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT "user_pets_pkey" PRIMARY KEY ("user_id","pet_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vets" (
    "id" BIGSERIAL NOT NULL,
    "provider_id" BIGINT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT clock_timestamp(),

    CONSTRAINT "vets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "appointments_pet_id_idx" ON "appointments"("pet_id");

-- CreateIndex
CREATE INDEX "appointments_vet_id_idx" ON "appointments"("vet_id");

-- CreateIndex
CREATE INDEX "note_images_note_id_idx" ON "note_images"("note_id");

-- CreateIndex
CREATE INDEX "note_symptoms_note_id_idx" ON "note_symptoms"("note_id");

-- CreateIndex
CREATE INDEX "notes_pet_id_idx" ON "notes"("pet_id");

-- CreateIndex
CREATE INDEX "pet_chart_data_pet_chart_id_idx" ON "pet_chart_data"("pet_chart_id");

-- CreateIndex
CREATE INDEX "pet_charts_chart_id_idx" ON "pet_charts"("chart_id");

-- CreateIndex
CREATE INDEX "pet_charts_pet_id_idx" ON "pet_charts"("pet_id");

-- CreateIndex
CREATE UNIQUE INDEX "pet_images_pet_id_key" ON "pet_images"("pet_id");

-- CreateIndex
CREATE INDEX "pet_images_pet_id_idx" ON "pet_images"("pet_id");

-- CreateIndex
CREATE INDEX "pets_user_id_idx" ON "pets"("user_id");

-- CreateIndex
CREATE INDEX "user_pets_pet_id_idx" ON "user_pets"("pet_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "vets_provider_id_idx" ON "vets"("provider_id");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "vets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_images" ADD CONSTRAINT "note_images_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_symptoms" ADD CONSTRAINT "note_symptoms_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_chart_data" ADD CONSTRAINT "pet_chart_data_pet_chart_id_fkey" FOREIGN KEY ("pet_chart_id") REFERENCES "pet_charts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_charts" ADD CONSTRAINT "pet_charts_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "charts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_charts" ADD CONSTRAINT "pet_charts_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_images" ADD CONSTRAINT "pet_images_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_pets" ADD CONSTRAINT "user_pets_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_pets" ADD CONSTRAINT "user_pets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vets" ADD CONSTRAINT "vets_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

