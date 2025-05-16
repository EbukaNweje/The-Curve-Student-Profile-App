import {configureStore} from "@reduxjs/toolkit";
import {setupListeners} from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";
import {persistReducer, persistStore} from "redux-persist";
import {FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from "redux-persist";

import features from "./features";

// Simplified persist configuration
const persistConfig = {
    key: "root",
    storage,
};

// Creating the persisted reducer
const persistedReducer = persistReducer(persistConfig, features);

// Configuring the store with the persisted reducer and middleware
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

// Setup listeners for automatic refetching of queries
setupListeners(store.dispatch);

// Exporting the store and persistor
export const persistor = persistStore(store);
export default store;

