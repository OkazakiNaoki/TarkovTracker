import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { getIndexOfMatchFieldObjArr } from "../helpers/LoopThrough"

export const getTraders = createAsyncThunk(
  "trader/getTraders",
  async (params) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
      const body = {
        query: `{
          traders(lang: en){
            id
            name
          }
        }`,
      }
      const gql = await axios.post(
        `https://api.tarkov.dev/graphql`,
        body,
        config
      )
      const gqlData = gql.data.data.traders
      return gqlData
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const getTasksOfTrader = createAsyncThunk(
  "trader/getTasksOfTrader",
  async (params) => {
    const { trader = "" } = params
    try {
      const { data } = await axios.get(`/api/task?trader=${trader}`)
      return { trader: trader, tasksArr: data }
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

const traderSlice = createSlice({
  name: "trader",
  initialState: {
    isLoading: false,
    traders: [],
    tasks: Array(8).fill([]),
  },
  reducers: {
    setTaskCollapse: (state, action) => {
      const { i, j } = action.payload
      state.tasks[i][j].collapse = !state.tasks[i][j].collapse
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTraders.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getTraders.fulfilled, (state, action) => {
        state.isLoading = false
        state.traders = action.payload
        console.log(action.payload)
      })
      .addCase(getTraders.rejected, (state, action) => {
        throw Error(action.payload)
      })
      .addCase(getTasksOfTrader.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getTasksOfTrader.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        let index = getIndexOfMatchFieldObjArr(
          state.traders,
          "name",
          action.payload.trader
        )
        const copy = [...action.payload.tasksArr]
        copy.forEach((el) => {
          el.collapse = false
        })
        state.tasks[index] = copy
      })
      .addCase(getTasksOfTrader.rejected, (state, action) => {
        throw Error(action.payload)
      })
  },
})

export default traderSlice.reducer
export const { setTaskCollapse } = traderSlice.actions
