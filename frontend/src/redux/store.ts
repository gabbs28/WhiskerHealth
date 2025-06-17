import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { SessionInitialState } from "./types/session";
import type { Middleware } from 'redux';


// Combined root state type
export interface RootState {
  session: SessionInitialState;
}


const rootReducer = combineReducers<RootState>({
  session: sessionReducer,
});

// Define middleware array
const middleware: Middleware[] = [thunk];

// Add redux-logger in development

  // if (process.env.NODE_ENV === 'development') {
  //   const { createLogger } = await import('redux-logger');
  //   const logger = createLogger();
  //   middleware.push(logger);
  // }

// Handle Redux DevTools Extension
const composeEnhancers =
  (process.env.NODE_ENV === 'development' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

// Export types
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;

// import {
//   legacy_createStore as createStore,
//   applyMiddleware,
//   compose,
//   combineReducers,
// } from "redux";
// import thunk from "redux-thunk";
// import sessionReducer from "./session";
// import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// const rootReducer = combineReducers({
//   session: sessionReducer,
// });



// let enhancer;
// if (import.meta.env.MODE === "production") {
//   enhancer = applyMiddleware(thunk);
// } else {
//   const logger:any = (await import("redux-logger")).default;
//   const composeEnhancers =
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//   enhancer = composeEnhancers(applyMiddleware(thunk, logger));
// }

// const configureStore = (preloadedState:any) => {
//   return createStore(rootReducer, preloadedState, enhancer);
// };

// const store = configureStore({
//   rootReducer,
//   devTools: import.meta.env.VITE_NODE_ENV !== 'production'
// })

// export const useAppDispatch: () => typeof store.dispatch = useDispatch;
// export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;
// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch

// export default configureStore;
