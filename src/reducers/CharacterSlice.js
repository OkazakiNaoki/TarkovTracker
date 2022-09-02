import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { getIndexOfMatchFieldObjArr } from "../helpers/LoopThrough"

export const initializePlayerData = createAsyncThunk(
  "character/initializePlayerData",
  async (params, { getState }) => {
    const { traderNames = [] } = params
    try {
      const { user } = getState().user
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }

      // completed tasks
      const completeTasks = await axios.post(
        `/api/player/task/complete`,
        { completeTasks: [] },
        config
      )
      const completeTasksData = completeTasks.data.completeTasks

      // trader LL
      const llInner = {}
      traderNames.forEach((trader) => {
        llInner[`${trader}`] = 1
      })
      const traderLL = await axios.post(
        `/api/player/trader/LL`,
        {
          LL: llInner,
        },
        config
      )
      const traderLLData = traderLL.data.traderLL

      return {
        completeTasks: completeTasksData,
        traderLL: traderLLData,
      }
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const getTasksOfTraderWithLevel = createAsyncThunk(
  "character/getTasksOfTraderWithLevel",
  async (params, { getState }) => {
    const { trader = "", playerLvl = 1 } = params
    try {
      const { user } = getState().user

      // completed
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const completeTasks = await axios.get(`/api/player/task/complete`, config)
      const completeTasksData = completeTasks.data.completeTasks
      const completeTasksArr = []
      for (let i = 0; i < completeTasksData.length; i++) {
        const task = await axios.get(`/api/task/id?id=${completeTasksData[i]}`)
        completeTasksArr.push(task.data[0])
      }

      // all tasks from the trader
      const allTasks = await axios.get(`/api/task?trader=${trader}`)
      const allTasksArr = allTasks.data

      // remove complete one from tasks
      for (let i = 0; i < completeTasksArr.length; i++) {
        const index = getIndexOfMatchFieldObjArr(
          allTasksArr,
          "id",
          completeTasksArr[i].id
        )
        if (index > -1) {
          allTasksArr.splice(index, 1)
        }
      }

      // ongoing/not qualify sorting,  it's an O(n^3) loop
      const ongoingTasksArr = []
      const notQualifyTasksArr = []
      for (let i = 0; i < allTasksArr.length; i++) {
        let unlocked = false
        if (
          allTasksArr[i].minPlayerLevel <= playerLvl &&
          allTasksArr[i].taskRequirements.length === 0
        ) {
          unlocked = true
        } else {
          for (let j = 0; j < allTasksArr[i].taskRequirements.length; j++) {
            if (
              allTasksArr[i].minPlayerLevel <= playerLvl &&
              getIndexOfMatchFieldObjArr(
                completeTasksArr,
                "id",
                allTasksArr[i].taskRequirements[j].task.id
              ) > -1
            ) {
              unlocked = true
            }
          }
        }
        if (unlocked) {
          ongoingTasksArr.push(allTasksArr[i])
        } else {
          notQualifyTasksArr.push(allTasksArr[i])
        }
      }

      return {
        trader: trader,
        ongoingTasks: ongoingTasksArr,
        completeTasks: completeTasksArr,
        notQualifyTasks: notQualifyTasksArr,
      }
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
    gameEdition: null,
    initSetup: false,
    playerLevel: 6,
    playerFaction: null,
    playerTasksInfo: {},
    unlockedJaeger: false,
    traderLoyaltyLevel: {},
  },
  reducers: {
    setPlayerLevel: (state, action) => {
      state.playerLevel = action.payload
    },
    initPlayerTasks: (state, action) => {
      for (let i = 0; i < action.payload.length; i++) {
        state.playerTasksInfo[`${action.payload[i]}`] = null
      }
    },
    initTraderLoyaltyLevel: (state, action) => {
      for (let i = 0; i < action.payload.length; i++) {
        state.traderLoyaltyLevel[`${action.payload[i]}`] = null
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializePlayerData.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(initializePlayerData.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
      })
      .addCase(initializePlayerData.rejected, (state, action) => {})
      .addCase(getTasksOfTraderWithLevel.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getTasksOfTraderWithLevel.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        state.playerTasksInfo[`${action.payload.trader}`] = {
          complete: action.payload.completeTasks,
          ongoing: action.payload.ongoingTasks,
          notQualify: action.payload.notQualifyTasks,
        }
      })
      .addCase(getTasksOfTraderWithLevel.rejected, (state, action) => {})
  },
})

export default characterSlice.reducer
export const { setPlayerLevel, initPlayerTasks } = characterSlice.actions
