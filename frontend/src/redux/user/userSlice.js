import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInSuccess: (state, action) => {
            console.log(action.payload)
            state.currentUser = action.payload;
        },
    },
});

export const { signInSuccess } = userSlice.actions;
export default userSlice.reducer;