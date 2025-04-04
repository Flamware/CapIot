// store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.tsx'; // Import the auth reducer

const store = configureStore({
    reducer: {
        auth: authReducer, // Use the authReducer from the slice
        // Add other reducers here if you have them
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;