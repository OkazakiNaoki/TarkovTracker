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

      // completed objectives of tasks
      const completeTaskObjectives = await axios.post(
        `/api/player/task/objective`,
        { completeObjectives: [] },
        config
      )
      const completeObjectivesData =
        completeTaskObjectives.data.completeObjectives

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
        completeObjectives: completeObjectivesData,
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
      const allCompleteTasksId = await axios.get(
        `/api/player/task/complete`,
        config
      )
      const allCompleteTasksIdData = allCompleteTasksId.data.completeTasks

      // all tasks from the trader
      const allTasks = await axios.get(`/api/task?trader=${trader}`)
      const allTasksArr = allTasks.data

      const completeTasksArr = []
      for (let i = 0; i < allCompleteTasksIdData.length; i++) {
        const index = getIndexOfMatchFieldObjArr(
          allTasksArr,
          "id",
          allCompleteTasksIdData[i]
        )
        if (index > -1) {
          const task = await axios.get(
            `/api/task/id?id=${allCompleteTasksIdData[i]}`
          )
          completeTasksArr.push(task.data[0])
        }
      }

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

export const updateCompletedTasks = createAsyncThunk(
  "character/updateCompletedTasks",
  async (params, { getState }) => {
    const completeTasks = params.completeTasks
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const newCompleteTasks = await axios.put(
        `/api/player/task/complete`,
        { completeTasks: completeTasks },
        config
      )
      const newCompleteTasksData = newCompleteTasks.data.completeTasks
      console.log(newCompleteTasks)

      return {
        completeTasks: newCompleteTasksData,
      }
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const getCompletedObjectives = createAsyncThunk(
  "character/getCompletedObjectives",
  async (params, { getState }) => {
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const completeObjectives = await axios.get(
        `/api/player/task/objective`,
        config
      )
      const completeObjectivesData = completeObjectives.data.completeObjectives

      return {
        completeObjectives: completeObjectivesData,
      }
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const updateCompletedObjectives = createAsyncThunk(
  "character/updateCompletedObjectives",
  async (params, { getState }) => {
    const completeObjectives = params.completeObjectives
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const newCompleteObjectives = await axios.put(
        `/api/player/task/objective`,
        { completeObjectives: completeObjectives },
        config
      )
      const newCompleteObjectivesData =
        newCompleteObjectives.data.completeObjectives

      return {
        completeObjectives: newCompleteObjectivesData,
      }
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const addCompletedObjectives = createAsyncThunk(
  "character/addCompletedObjectives",
  async (params, { getState }) => {
    const completeObjectives = params.completeObjectives
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const newCompleteObjectives = await axios.put(
        `/api/player/task/objective`,
        { completeObjectives: completeObjectives },
        config
      )
      const newCompleteObjectivesData =
        newCompleteObjectives.data.completeObjectives

      return {
        completeObjectives: newCompleteObjectivesData,
      }
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const getObjectiveProgress = createAsyncThunk(
  "character/getObjectiveProgress",
  async (params, { getState }) => {
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const objectiveProgress = await axios.get(
        `/api/player/task/objective/progress`,
        config
      )
      const objectiveProgressData = objectiveProgress.data.objectiveProgress

      return {
        objectiveProgress: objectiveProgressData,
      }
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const updateObjectiveProgress = createAsyncThunk(
  "character/updateObjectiveProgress",
  async (params, { getState }) => {
    const objectiveProgress = params.objectiveProgress
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const newObjectiveProgress = await axios.put(
        `/api/player/task/objective/progress`,
        { objectiveProgress: objectiveProgress },
        config
      )
      const newObjectiveProgressData =
        newObjectiveProgress.data.objectiveProgress

      return {
        objectiveProgress: newObjectiveProgressData,
      }
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const addObjectiveProgress = createAsyncThunk(
  "character/addObjectiveProgress",
  async (params, { getState }) => {
    const objectiveProgress = params.objectiveProgress
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const newObjectiveProgress = await axios.put(
        `/api/player/task/objective/progress`,
        { objectiveProgress: objectiveProgress },
        config
      )
      const newObjectiveProgressData =
        newObjectiveProgress.data.objectiveProgress

      return {
        objectiveProgress: newObjectiveProgressData,
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
    playerCompletedObjectives: null,
    playerObjectiveProgress: null,
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
      .addCase(updateCompletedTasks.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(updateCompletedTasks.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
      })
      .addCase(updateCompletedTasks.rejected, (state, action) => {})
      .addCase(getCompletedObjectives.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getCompletedObjectives.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        state.playerCompletedObjectives = action.payload.completeObjectives
      })
      .addCase(getCompletedObjectives.rejected, (state, action) => {})
      .addCase(updateCompletedObjectives.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(updateCompletedObjectives.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        state.playerCompletedObjectives = action.payload.completeObjectives
      })
      .addCase(updateCompletedObjectives.rejected, (state, action) => {})
      .addCase(addCompletedObjectives.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(addCompletedObjectives.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        state.playerCompletedObjectives = action.payload.completeObjectives
      })
      .addCase(addCompletedObjectives.rejected, (state, action) => {})
      .addCase(getObjectiveProgress.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getObjectiveProgress.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        state.playerObjectiveProgress = action.payload.objectiveProgress
      })
      .addCase(getObjectiveProgress.rejected, (state, action) => {})
      .addCase(updateObjectiveProgress.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(updateObjectiveProgress.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        state.playerObjectiveProgress = action.payload.objectiveProgress
      })
      .addCase(updateObjectiveProgress.rejected, (state, action) => {})
      .addCase(addObjectiveProgress.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(addObjectiveProgress.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        state.playerObjectiveProgress = action.payload.objectiveProgress
      })
      .addCase(addObjectiveProgress.rejected, (state, action) => {})
  },
})

export default characterSlice.reducer
export const { setPlayerLevel, initPlayerTasks } = characterSlice.actions
