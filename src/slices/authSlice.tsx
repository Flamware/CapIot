import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    roles: string[];
    // Add other auth-related state here
}

const initialState: AuthState = {
    isAuthenticated: false,
    roles: [],
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<{ roles: string[] }>) => {
            state.isAuthenticated = true;
            state.roles = action.payload.roles;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.roles = [];
        },
        // You might have other reducers to update auth state
    },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;