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
    const gameEdition = params.gameEdition
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
            gameEdition: gameEdition,
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
            gameEdition: getState().character.gameEdition,
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

export const addInventoryItem = createAsyncThunk(
  "character/addInventoryItem",
  async (params, { getState }) => {
    const itemList = params.itemList
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const inventory = await axios.post(
        `/api/player/inventory`,
        {
          itemList: itemList,
        },
        config
      )
      const inventoryData = inventory.data.ownItemList

      return inventoryData
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const getInventoryItem = createAsyncThunk(
  "character/getInventoryItem",
  async (params, { getState }) => {
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const inventory = await axios.get(`/api/player/inventory`, config)

      return {
        status: inventory.status,
        data: inventory.data.ownItemList,
      }
    } catch (error) {
      return error.response && error.response.data
        ? error.response.data
        : error.message
    }
  }
)

export const updateInventoryItem = createAsyncThunk(
  "character/updateInventoryItem",
  async (params, { getState }) => {
    const itemList = params.itemList
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const newInventory = await axios.put(
        `/api/player/inventory`,
        {
          itemList: itemList,
        },
        config
      )
      const newInventoryData = newInventory.data.ownItemList

      return newInventoryData
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const addTraderProgress = createAsyncThunk(
  "character/addTraderProgress",
  async (params, { getState }) => {
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const traderLL = await axios.post(
        `/api/player/trader/LL`,
        {
          traderLL: params.traderLL,
          traderRep: params.traderRep,
          traderSpent: params.traderSpent,
        },
        config
      )

      return traderLL.data
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const getTraderProgress = createAsyncThunk(
  "character/getTraderProgress",
  async (params, { getState }) => {
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const traderLL = await axios.get(`/api/player/trader/LL`, config)

      return traderLL.data
    } catch (error) {
      return error.response && error.response.data
        ? error.response.data
        : error.message
    }
  }
)

export const updateTraderProgress = createAsyncThunk(
  "character/updateTraderProgress",
  async (params, { getState }) => {
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const newTraderLL = await axios.put(
        `/api/player/trader/LL`,
        {
          traderLL: params.traderLL,
          traderRep: params.traderRep,
          traderSpent: params.traderSpent,
        },
        config
      )

      return newTraderLL.data
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
    initSetup: false,
    // player basic data
    playerLevel: 0,
    playerFaction: null,
    gameEdition: null,
    // task progress
    playerTasksInfo: {},
    playerCompletedObjectives: null,
    playerObjectiveProgress: null,
    // trader progress
    unlockedJaeger: false, // not use yet
    traderProgress: null,
    // hideout progress
    playerHideoutLevel: null,
    // inventory
    playerInventory: null,
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasksOfTraderWithLevel.pending, (state, action) => {})
      .addCase(getTasksOfTraderWithLevel.fulfilled, (state, action) => {
        state.playerTasksInfo[`${action.payload.trader}`] = {
          complete: action.payload.completeTasks,
          ongoing: action.payload.ongoingTasks,
          notQualify: action.payload.notQualifyTasks,
        }
      })
      .addCase(getTasksOfTraderWithLevel.rejected, (state, action) => {})
      .addCase(updateCompletedTasks.pending, (state, action) => {})
      .addCase(updateCompletedTasks.fulfilled, (state, action) => {})
      .addCase(updateCompletedTasks.rejected, (state, action) => {})
      .addCase(getCompletedObjectives.pending, (state, action) => {})
      .addCase(getCompletedObjectives.fulfilled, (state, action) => {
        state.playerCompletedObjectives = action.payload.completeObjectives
      })
      .addCase(getCompletedObjectives.rejected, (state, action) => {})
      .addCase(updateCompletedObjectives.pending, (state, action) => {})
      .addCase(updateCompletedObjectives.fulfilled, (state, action) => {
        state.playerCompletedObjectives = action.payload.completeObjectives
      })
      .addCase(updateCompletedObjectives.rejected, (state, action) => {})
      .addCase(addCompletedObjectives.pending, (state, action) => {})
      .addCase(addCompletedObjectives.fulfilled, (state, action) => {
        state.playerCompletedObjectives = action.payload.completeObjectives
      })
      .addCase(addCompletedObjectives.rejected, (state, action) => {})
      .addCase(getObjectiveProgress.pending, (state, action) => {})
      .addCase(getObjectiveProgress.fulfilled, (state, action) => {
        state.playerObjectiveProgress = action.payload.objectiveProgress
      })
      .addCase(getObjectiveProgress.rejected, (state, action) => {})
      .addCase(updateObjectiveProgress.pending, (state, action) => {})
      .addCase(updateObjectiveProgress.fulfilled, (state, action) => {
        state.playerObjectiveProgress = action.payload.objectiveProgress
      })
      .addCase(updateObjectiveProgress.rejected, (state, action) => {})
      .addCase(addObjectiveProgress.pending, (state, action) => {})
      .addCase(addObjectiveProgress.fulfilled, (state, action) => {
        state.playerObjectiveProgress = action.payload.objectiveProgress
      })
      .addCase(addObjectiveProgress.rejected, (state, action) => {})
      .addCase(addCharacterData.pending, (state, action) => {})
      .addCase(addCharacterData.fulfilled, (state, action) => {
        state.playerLevel = action.payload.characterLevel
        state.playerFaction = action.payload.characterFaction
        state.gameEdition = action.payload.gameEdition
      })
      .addCase(addCharacterData.rejected, (state, action) => {})
      .addCase(updateCharacterData.pending, (state, action) => {})
      .addCase(updateCharacterData.fulfilled, (state, action) => {
        state.playerLevel = action.payload.characterLevel
        state.playerFaction = action.payload.characterFaction
      })
      .addCase(updateCharacterData.rejected, (state, action) => {})
      .addCase(getCharacterData.pending, (state, action) => {})
      .addCase(getCharacterData.fulfilled, (state, action) => {
        if (typeof action.payload === "object") {
          state.playerLevel = action.payload.data.characterLevel
          state.playerFaction = action.payload.data.characterFaction
          state.gameEdition = action.payload.data.gameEdition
          state.initSetup = true
        } else {
          state.initSetup = false
        }
      })
      .addCase(getCharacterData.rejected, (state, action) => {})
      .addCase(addHideoutLevel.pending, (state, action) => {})
      .addCase(addHideoutLevel.fulfilled, (state, action) => {
        state.playerHideoutLevel = action.payload
      })
      .addCase(addHideoutLevel.rejected, (state, action) => {})
      .addCase(getHideoutLevel.pending, (state, action) => {})
      .addCase(getHideoutLevel.fulfilled, (state, action) => {
        state.playerHideoutLevel = action.payload.data
      })
      .addCase(getHideoutLevel.rejected, (state, action) => {})
      .addCase(updateHideoutLevel.pending, (state, action) => {})
      .addCase(updateHideoutLevel.fulfilled, (state, action) => {
        state.playerHideoutLevel = action.payload
      })
      .addCase(updateHideoutLevel.rejected, (state, action) => {})
      .addCase(addInventoryItem.pending, (state, action) => {})
      .addCase(addInventoryItem.fulfilled, (state, action) => {
        state.playerInventory = action.payload
      })
      .addCase(addInventoryItem.rejected, (state, action) => {})
      .addCase(getInventoryItem.pending, (state, action) => {})
      .addCase(getInventoryItem.fulfilled, (state, action) => {
        state.playerInventory = action.payload.data
      })
      .addCase(getInventoryItem.rejected, (state, action) => {})
      .addCase(updateInventoryItem.pending, (state, action) => {})
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        state.playerInventory = action.payload
      })
      .addCase(updateInventoryItem.rejected, (state, action) => {})
      .addCase(addTraderProgress.pending, (state, action) => {})
      .addCase(addTraderProgress.fulfilled, (state, action) => {
        state.traderProgress = action.payload
      })
      .addCase(addTraderProgress.rejected, (state, action) => {})
      .addCase(getTraderProgress.pending, (state, action) => {})
      .addCase(getTraderProgress.fulfilled, (state, action) => {
        state.traderProgress = action.payload
      })
      .addCase(getTraderProgress.rejected, (state, action) => {})
      .addCase(updateTraderProgress.pending, (state, action) => {})
      .addCase(updateTraderProgress.fulfilled, (state, action) => {
        state.traderProgress = action.payload
      })
      .addCase(updateTraderProgress.rejected, (state, action) => {})
  },
})

export default characterSlice.reducer
export const { setInitSetup, initPlayerTasks } = characterSlice.actions
