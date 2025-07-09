import {
    Action,
    applyMiddleware,
    combineReducers,
    compose,
    legacy_createStore as createStore,
    Middleware,
} from 'redux';
import { createLogger } from 'redux-logger';
import { thunk, ThunkAction, ThunkDispatch } from 'redux-thunk';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import sessionReducer from './session';
import petsReducer from './pets';
import notesReducer from './notes';
import { SessionInitialState } from './types/session';
import { PetInitialState } from './types/pets';
import { NoteInitialState } from './types/notes';

// Combined root state type
export interface RootState {
    session: SessionInitialState;
    pets: PetInitialState;
    notes: NoteInitialState;
}

const rootReducer = combineReducers({
    session: sessionReducer,
    pets: petsReducer,
    notes: notesReducer,
});

// Redux middleware
const middleware: Middleware[] = [thunk];

// Handle Redux DevTools Extension
const composeEnhancers =
    (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

// Add Redux Logger when in development
if (import.meta.env.MODE === 'development') {
    middleware.push(
        createLogger({
            collapsed: true,
            diff: true,
        }) as Middleware<{}, RootState, any>,
    );
}

// Create store
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)));

// Export types
export type AppThunk<ReturnType = void> = ThunkAction<
    Promise<ReturnType>,
    RootState,
    unknown,
    Action
>;
export type AppDispatch = ThunkDispatch<RootState, unknown, Action>;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
