import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

import {
  loginApi,
  registerApi,
  logoutApi,
  getProfileApi,
} from '../../api/auth.api';

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',

  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfileApi();

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },

  {
    condition: (_, { getState }) => {
      const {
        initialized,
        isCheckingAuth,
      } = getState().auth;

      return !initialized && !isCheckingAuth;
    },
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',

  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);

      return response.data.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',

  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerApi(userData);

      return response.data.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',

  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();

      return null;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isCheckingAuth: false,
  initialized: false,
  loading: false,
  error: null,
  errorCode: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
      state.errorCode = null;
    },

    sessionExpired: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isCheckingAuth = false;
      state.initialized = true;
      state.loading = false;
      state.error = null;
      state.errorCode = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
        state.error = null;
        state.errorCode = null;
      })

      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.initialized = true;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
        state.errorCode = null;
      })

      .addCase(checkAuth.rejected, (state, action) => {
        state.isCheckingAuth = false;
        state.initialized = true;

        if (action.payload?.status === 401) {
          state.isAuthenticated = false;
          state.user = null;
          state.error = null;
          state.errorCode = null;

          return;
        }

        state.isAuthenticated = false;
        state.user = null;

        state.error =
          action.payload?.message ||
          'No se ha podido verificar la sesión';

        state.errorCode =
          action.payload?.code ||
          'AUTH_CHECK_ERROR';
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.errorCode = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
        state.errorCode = null;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message ||
          'Error al iniciar sesión';

        state.errorCode =
          action.payload?.code ||
          'LOGIN_ERROR';
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.errorCode = null;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
        state.errorCode = null;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message ||
          'Error al registrar usuario';

        state.errorCode =
          action.payload?.code ||
          'REGISTER_ERROR';
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.errorCode = null;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isCheckingAuth = false;
        state.initialized = true;
        state.loading = false;
        state.error = null;
        state.errorCode = null;
      })

      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload?.message ||
          'Error al cerrar sesión';

        state.errorCode =
          action.payload?.code ||
          'LOGOUT_ERROR';
      });
  },
});

export const {
  clearAuthError,
  sessionExpired,
} = authSlice.actions;

export default authSlice.reducer;