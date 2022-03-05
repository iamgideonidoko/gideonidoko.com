import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config/keys';
import { axiosHeaders } from '../../helper';

// export api redux actions
export const login = createAsyncThunk('/auth/login', async (arg: { body: object }) => {
    try {
        const res = await axios.post(`${config.BEHOST}/auth/login`, arg.body, axiosHeaders());
        return res.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return err?.message || false;
    }
});

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        payload: null,
        userGithubInfo: null,
        payloadLoading: 'notloading',
        userGithubInfoLoading: 'notloading',
        isAttemptingLogin: false,
        isAuthenticated: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                // Add user to the state array
                state.payloadLoading = 'loading';
                state.isAuthenticated = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                // Add user to the state array
                if (action.payload?.status === 'success') {
                    state.payloadLoading = 'loaded';
                } else {
                    state.payloadLoading = 'error';
                }
            })
            .addCase(login.rejected, (state) => {
                // Add user to the state array
                state.payloadLoading = 'error';
                state.isAuthenticated = false;
            });
    },
});

// export actions (without data fetch in them);
/* export const {
    updateCustToken
} = authSlice.actions; */

export default authSlice.reducer;
