import { restoreUser} from "../../utils/auth";
//imports from router files
import userRouter from './users';
import sessionRouter from './session';
import csurf from "csurf";
import petsRouter from './pets'
import notesRouter from './notes'

import express, {Request, Response}  from "express";
import { environment } from '../../config';
const isProduction = environment === 'production';

const router = express.Router()

//route usage
router.use(restoreUser);
router.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "lax",
            httpOnly: true
        }
    })
);
router.use('/session', sessionRouter);
router.use('/users', userRouter);
router.use('/pets', petsRouter)
router.use('/notes', notesRouter)

router.get('/restore-user', async (req:Request, res:Response) => {
    res.json(req.user);
});


export default router;
