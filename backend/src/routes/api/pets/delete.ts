import express, {Request, Response} from 'express';
import {prisma, Prisma} from '../../../database/client'
import {isValidPet} from "./helper";
import {generateErrorResponse} from "../../../utils/errors";

const router = express.Router();

// get pets
router.delete('/:id', async (request: Request<{ id: number }>, response: Response) => {
    // Get the id of the user and pet
    const userId = request.user?.id
    const petId = request.params.id;

    // Confirm the pet belongs to the currently logged-in user
    try {
        await isValidPet(userId, petId)
    } catch (error) {
        // Log
        console.log(`user ${userId} tried to access pet ${petId}: ${error}`);

        // Return error response
        return response.json(generateErrorResponse("Forbidden", 403));
    }

    // Get all pets that belong to the current logged-in user
    try {
        await prisma.pets.delete({
            where: {
                id: petId
            }
        })
    } catch (error) {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code ==='P2025')) {
            throw error
        }
    }

    // Success
    response.json({ message: "Pet Deleted" });
});

// Export router
export default router;