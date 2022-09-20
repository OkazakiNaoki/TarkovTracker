import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { getIndexOfMatchFieldObjArr } from "../helpers/LoopThrough"

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

export const addCompletedTasks = createAsyncThunk(
  "character/addCompletedTasks",
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
      const newCompleteTasks = await axios.post(
        `/api/player/task/complete`,
        { completeTasks: completeTasks },
        config
      )
      const newCompleteTasksData = newCompleteTasks.data.completeTasks

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
      const newCompleteObjectives = await axios.post(
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
      console.log(error.response.data)
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
      const newObjectiveProgress = await axios.post(
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

export const addCharacterData = createAsyncThunk(
  "character/addCharacterData",
  async (params, { getState }) => {
    const characterLevel = params.characterLevel
    const characterFaction = params.characterFaction
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const newCharacterData = await axios.post(
        `/api/player/character`,
        {
          characterData: {
            characterLevel: characterLevel,
            characterFaction: characterFaction,
          },
        },
        config
      )
      const newCharacterDataData = newCharacterData.data

      return newCharacterDataData
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const updateCharacterData = createAsyncThunk(
  "character/updateCharacterData",
  async (params, { getState }) => {
    const characterLevel = params.characterLevel
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const newCharacterData = await axios.put(
        `/api/player/character`,
        {
          characterData: {
            characterLevel: characterLevel,
            characterFaction: getState().character.playerFaction,
          },
        },
        config
      )
      const newCharacterDataData = newCharacterData.data

      return newCharacterDataData
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const getCharacterData = createAsyncThunk(
  "character/getCharacterData",
  async (params, { getState }) => {
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const characterData = await axios.get(`/api/player/character`, config)

      return { status: characterData.status, data: characterData.data }
    } catch (error) {
      return error.response && error.response.data
        ? error.response.data
        : error.message
    }
  }
)

export const addHideoutLevel = createAsyncThunk(
  "character/addHideoutLevel",
  async (params, { getState }) => {
    const hideoutLevel = params.hideoutLevel
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const newHideoutLevel = await axios.post(
        `/api/player/hideout/level`,
        {
          hideoutLevel: hideoutLevel,
        },
        config
      )
      const newHideoutLevelData = newHideoutLevel.data.hideoutLevel

      return newHideoutLevelData
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const getHideoutLevel = createAsyncThunk(
  "character/getHideoutLevel",
  async (params, { getState }) => {
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const hideoutLevel = await axios.get(`/api/player/hideout/level`, config)

      return {
        status: hideoutLevel.status,
        data: hideoutLevel.data.hideoutLevel,
      }
    } catch (error) {
      return error.response && error.response.data
        ? error.response.data
        : error.message
    }
  }
)

export const updateHideoutLevel = createAsyncThunk(
  "character/updateHideoutLevel",
  async (params, { getState }) => {
    const hideoutLevel = params.hideoutLevel
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const newHideoutLevel = await axios.put(
        `/api/player/hideout/level`,
        {
          hideoutLevel: hideoutLevel,
        },
        config
      )
      const hideoutLevelData = newHideoutLevel.data.hideoutLevel

      return hideoutLevelData
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const addHideoutProgress = createAsyncThunk(
  "character/addHideoutProgress",
  async (params, { getState }) => {
    const hideoutProgress = params.hideoutProgress
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const newHideoutProgress = await axios.post(
        `/api/player/hideout/progress`,
        {
          hideoutProgress: hideoutProgress,
        },
        config
      )
      const newHideoutProgressData = newHideoutProgress.data.hideoutProgress

      return newHideoutProgressData
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
    gameEdition: null, // not use yet
    initSetup: null,
    playerLevel: 0,
    playerFaction: null,
    playerTasksInfo: {},
    playerCompletedObjectives: null,
    playerObjectiveProgress: null,
    unlockedJaeger: false, // not use yet
    traderLoyaltyLevel: {}, // not use yet
    playerHideoutLevel: null,
    playerHideoutProgress: null,
  },
  reducers: {
    setInitSetup: (state, action) => {
      state.initSetup = true
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
      .addCase(addCharacterData.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(addCharacterData.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        state.playerLevel = action.payload.characterLevel
        state.playerFaction = action.payload.characterFaction
      })
      .addCase(addCharacterData.rejected, (state, action) => {})
      .addCase(updateCharacterData.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(updateCharacterData.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        state.playerLevel = action.payload.characterLevel
        state.playerFaction = action.payload.characterFaction
      })
      .addCase(updateCharacterData.rejected, (state, action) => {})
      .addCase(getCharacterData.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getCharacterData.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        if (typeof action.payload === "object") {
          state.playerLevel = action.payload.data.characterLevel
          state.playerFaction = action.payload.data.characterFaction
          state.initSetup = true
        } else {
          state.initSetup = false
        }
      })
      .addCase(getCharacterData.rejected, (state, action) => {})
      .addCase(addHideoutLevel.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(addHideoutLevel.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        state.playerHideoutLevel = action.payload
      })
      .addCase(addHideoutLevel.rejected, (state, action) => {})
      .addCase(getHideoutLevel.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getHideoutLevel.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        state.playerHideoutLevel = action.payload.data
      })
      .addCase(getHideoutLevel.rejected, (state, action) => {})
      .addCase(updateHideoutLevel.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(updateHideoutLevel.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        state.playerHideoutLevel = action.payload
      })
      .addCase(updateHideoutLevel.rejected, (state, action) => {})
      .addCase(addHideoutProgress.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(addHideoutProgress.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        state.playerHideoutProgress = action.payload
      })
      .addCase(addHideoutProgress.rejected, (state, action) => {})
  },
})

export default characterSlice.reducer
export const { setInitSetup, initPlayerTasks } = characterSlice.actions
