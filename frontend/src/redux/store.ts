import type {AnyAction, Middleware} from 'redux';
import {applyMiddleware, combineReducers, compose, legacy_createStore as createStore,} from "redux";
import {createLogger} from "redux-logger";
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {SessionInitialState} from "./types/session.d.ts";
import {PetInitialState} from "./types/pets.d.ts";
import {NoteInitialState} from "./types/notes.d.ts";
import sessionReducer from "./session";
import petsReducer from "./pets";
import notesReducer from "./notes";

// Combined root state type
export interface RootState {
    session: SessionInitialState;
    pets: PetInitialState;
    notes: NoteInitialState
}

const rootReducer = combineReducers<RootState>({
    session: sessionReducer,
    pets: petsReducer,
    notes: notesReducer
});

// Redux middleware
const middleware: Middleware[] = [thunk];

// Handle Redux DevTools Extension
const composeEnhancers =
    (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

// Add Redux Logger when in development
if (import.meta.env.MODE === "development") {
    middleware.push(
        createLogger({
            collapsed: true,
            diff: true
        }) as Middleware<{}, RootState, any>
    );
}

// Create store
export const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middleware))
);

// Export types
export type AppThunk<ReturnType = void> = ThunkAction<
    Promise<ReturnType>,
    RootState,
    unknown,
    AnyAction
>;
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;