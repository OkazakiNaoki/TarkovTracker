import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const getTasksOfTraderWithLevel = createAsyncThunk(
  "character/getTasksOfTraderWithLevel",
  async (params) => {
    const { trader = "", playerLvl = 1 } = params
    try {
      const { data } = await axios.get(
        `/api/task?trader=${trader}&playerLvl=${playerLvl}`
      )
      return { trader: trader, tasksArr: data }
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

const characterSlice = createSlice({
  name: "character",
  initialState: {
    isLoading: false,
    initSetup: false,
    playerLevel: 40,
    faction: null,
  },
  reducers: {
    setPlayerLevel: (state, action) => {
      state.playerLevel = action.payload
    },
  },
  extraReducers: (builder) => {},
})

export default characterSlice.reducer
export const { setPlayerLevel } = characterSlice.actions
