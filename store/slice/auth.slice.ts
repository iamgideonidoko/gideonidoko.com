import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config/keys';
import { axiosHeaders } from '../../helper';
import { AuthState } from '../../interfaces/redux.interface';

// export api redux actions
export const loginUser = createAsyncThunk(
    '/auth/loginUser',
    async (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { body, success, failed }: { body: object; success?: (_: any) => void; failed?: (_: any) => void },
        { rejectWithValue },
    ) => {
        try {
            const res = await axios.post(`${config.baseUrl}/auth/login`, body, axiosHeaders());
            success && success(res.data);
            return res.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (!err.response) {
                throw err;
            }
            failed && failed(err);
            return rejectWithValue(err.response.data);
        }
    },
);

interface GithubUserPayload {
    githubusername: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    success?: (_: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    failed?: (_: any) => void;
}

// export api redux actions
export const getUserGithubInfo = createAsyncThunk(
    '/auth/getUserGithubInfo',
    async ({ githubusername, success, failed }: GithubUserPayload, { rejectWithValue }) => {
        try {
            const res = await axios.get(`https://api.github.com/users/${githubusername}`);
            success && success(res.data);
            return res.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (!err.response) {
                throw err;
            }
            failed && failed(err);
            return rejectWithValue(err.response.data);
        }
    },
);

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userInfo: null,
        userGithubInfo: null,
        isAuthenticated: false,
    } as AuthState,
    reducers: {
        updateTokens: (state, { payload }) => {
            if (state.userInfo?.accessToken && state.userInfo?.refreshToken) {
                // update the existing token with the new token
                state.userInfo.accessToken = payload?.accessToken;
                state.userInfo.refreshToken = payload?.refreshToken;
            }
        },
        logoutUser: (state) => {
            state.isAuthenticated = false;
            state.userGithubInfo = null;
            state.userInfo = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, { payload }) => {
                // Add user to the state array
                if (payload?.status === 'success') {
                    state.userInfo = payload.data?.user;
                    state.isAuthenticated = true;
                }
            })
            .addCase(getUserGithubInfo.fulfilled, (state, { payload }) => {
                // Add user to the state array
                state.userGithubInfo = payload;
            });
    },
});

// export actions (without data fetch in them);
export const { updateTokens, logoutUser } = authSlice.actions;

export default authSlice.reducer;
