import {createSlice} from "@reduxjs/toolkit";
// import axios from "axios";

const initialState = {
    userInfo: {}
}


const features = createSlice({
    name: "EflexPay",
    initialState,

    reducers: {
        UserData: (state, {payload}) => {
            state.userInfo = payload
            console.log(payload)
        }

    }
})




export const {UserData} =
    features.actions;

export default features.reducer;
