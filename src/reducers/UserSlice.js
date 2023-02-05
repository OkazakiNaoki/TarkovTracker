import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const login = createAsyncThunk("user/login", async (params) => {
  const { email, password } = params
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }
    const { data } = await axios.post(
      "/api/user/login",
      { email, password },
      config
    )
    return data
  } catch (error) {
    return error.response && error.response.data
      ? { error: error.response.data }
      : { error: error.message }
  }
})

export const register = createAsyncThunk("user/register", async (params) => {
  const { username, email, password } = params
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }
    const { data } = await axios.post(
      "/api/user",
      { name: username, email, password },
      config
    )
    return data
  } catch (error) {
    return error.response && error.response.data
      ? { error: error.response.data }
      : { error: error.message }
  }
})

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (params, { getState }) => {
    const { user } = getState().user

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.put(
        "/api/user/password",
        { password: params.password },
        config
      )
      return data
    } catch (error) {
      return error.response && error.response.data
        ? { error: error.response.data }
        : { error: error.message }
    }
  }
)

export const addUserPreference = createAsyncThunk(
  "user/addUserPreference",
  async (params, { getState }) => {
    const { user } = getState().user
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.post(
        "/api/user/preference",
        { preference: params.preference },
        config
      )
      return data
    } catch (error) {
      return error.response && error.response.data
        ? { error: error.response.data }
        : { error: error.message }
    }
  }
)

export const getUserPreference = createAsyncThunk(
  "user/getUserPreference",
  async (params, { getState }) => {
    const { user } = getState().user
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.get("/api/user/preference", config)
      return data
    } catch (error) {
      return error.response && error.response.data
        ? { error: error.response.data }
        : { error: error.message }
    }
  }
)

export const updateUserPreference = createAsyncThunk(
  "user/updateUserPreference",
  async (params, { getState }) => {
    const { user, preference } = getState().user
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.put(
        "/api/user/preference",
        { preference: params.preference },
        config
      )
      return data
    } catch (error) {
      return error.response && error.response.data
        ? { error: error.response.data }
        : { error: error.message }
    }
  }
)

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    errorMsg: "",
    successMsg: "",
    user: {},
    preference: null,
  },
  reducers: {
    resetUser: (state, action) => {
      state.user = {}
    },
    resetMsg: (state, action) => {
      state.successMsg = ""
      state.errorMsg = ""
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.isLoading = true
        state.errorMsg = ""
        state.successMsg = ""
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        if ("error" in action.payload) {
          state.errorMsg = action.payload.error
        } else {
          state.user = action.payload
        }
      })
      .addCase(login.rejected, (state, action) => {
        throw new Error("Error:", action.payload)
      })
      .addCase(register.pending, (state, action) => {
        state.isLoading = true
        state.errorMsg = ""
        state.successMsg = ""
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        if ("error" in action.payload) {
          state.errorMsg = action.payload.error
        } else {
          state.user = action.payload
        }
      })
      .addCase(register.rejected, (state, action) => {
        throw new Error(action.payload)
      })
      .addCase(changePassword.pending, (state, action) => {
        state.errorMsg = ""
        state.successMsg = ""
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.token = action.payload.token
        state.successMsg = action.payload.msg
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.errorMsg = action.payload
      })
      .addCase(addUserPreference.pending, (state, action) => {})
      .addCase(addUserPreference.fulfilled, (state, action) => {
        state.preference = action.payload.preference
      })
      .addCase(addUserPreference.rejected, (state, action) => {})
      .addCase(getUserPreference.pending, (state, action) => {})
      .addCase(getUserPreference.fulfilled, (state, action) => {
        state.preference = action.payload.preference
      })
      .addCase(getUserPreference.rejected, (state, action) => {})
      .addCase(updateUserPreference.pending, (state, action) => {
        state.errorMsg = ""
        state.successMsg = ""
      })
      .addCase(updateUserPreference.fulfilled, (state, action) => {
        state.preference = action.payload.preference
        state.successMsg = "User preference saved"
        state.errorMsg = ""
      })
      .addCase(updateUserPreference.rejected, (state, action) => {
        state.errorMsg = "Fail to save user preference"
        state.successMsg = ""
      })
  },
})

export default userSlice.reducer
export const { resetUser, resetMsg } = userSlice.actions
