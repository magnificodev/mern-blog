import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
        },
        deleteSuccess: (state, action) => {
            state.currentUser = null;
        },
        signOutSuccess: (state, action) => {
            state.currentUser = null;
        },
    },
});

export const { signInSuccess, updateSuccess, deleteSuccess, signOutSuccess } = userSlice.actions;
export default userSlice.reducer;
