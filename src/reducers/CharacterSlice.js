import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { getIndexOfMatchFieldObjArr } from "../helpers/LoopThrough"
import { safeGet } from "../helpers/ObjectExt"

export const getTasksOfTraderWithLevel = createAsyncThunk(
  "character/getTasksOfTraderWithLevel",
  async (params, { getState }) => {
    const { trader = "" } = params
    try {
      const { user } = getState().user
      const { traderProgress, unlockedTraders } = getState().character

      // completed tasks
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const completedTaskId = await axios.get(
        `/api/player/task/complete`,
        config
      )
      const completedTaskIdData = completedTaskId.data.completeTasks

      // all tasks from given trader
      const allTasksArr = [...getState().trader.tasks[trader]]

      // create completed task array according to completed task ID
      const completedTasksArr = []
      for (let i = 0; i < completedTaskIdData.length; i++) {
        const index = getIndexOfMatchFieldObjArr(
          allTasksArr,
          "id",
          completedTaskIdData[i]
        )
        if (index !== -1) {
          const task = await axios.get(
            `/api/task/id?id=${completedTaskIdData[i]}`
          )
          completedTasksArr.push(task.data[0])
        }
      }

      // remove completed task from all tasks arrray
      for (let i = 0; i < completedTasksArr.length; i++) {
        const index = getIndexOfMatchFieldObjArr(
          allTasksArr,
          "id",
          completedTasksArr[i].id
        )
        if (index !== -1) {
          allTasksArr.splice(index, 1)
        }
      }

      // ongoing/not qualify sorting,  it's an O(n^3) loop
      const ongoingTasksArr = []
      const notQualifyTasksArr = []
      for (let i = 0; i < allTasksArr.length; i++) {
        let unlocked = true
        // Fence's negative reputation task, do not push
        if (
          allTasksArr[i].trader.name === "Fence" &&
          allTasksArr[i].name.includes("Compensation for Damage")
        ) {
          continue
        }

        // player level requiement
        if (allTasksArr[i].minPlayerLevel > params.level) {
          notQualifyTasksArr.push(allTasksArr[i])
          continue
        }

        // task requirements
        for (let j = 0; j < allTasksArr[i].taskRequirements.length; j++) {
          if (
            !completedTaskIdData.includes(allTasksArr[i].taskRequirements[j].id)
          ) {
            notQualifyTasksArr.push(allTasksArr[i])
            unlocked = false
            break
          }
        }

        // trader LL requirements
        for (
          let j = 0;
          j < allTasksArr[i].traderLevelRequirements.length;
          j++
        ) {
          if (
            allTasksArr[i].traderLevelRequirements[j].level >
            traderProgress.traderLL[
              allTasksArr[i].traderLevelRequirements[j].trader.name
            ]
          ) {
            notQualifyTasksArr.push(allTasksArr[i])
            unlocked = false
            break
          }
        }

        // task offer trader unlocked
        if (
          unlockedTraders.hasOwnProperty(allTasksArr[i].trader.name) &&
          !unlockedTraders[allTasksArr[i].trader.name]
        ) {
          notQualifyTasksArr.push(allTasksArr[i])
          continue
        }

        if (unlocked) {
          ongoingTasksArr.push(allTasksArr[i])
        }
      }

      return {
        trader: trader,
        ongoingTasks: ongoingTasksArr,
        completeTasks: completedTasksArr,
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
  },
  {
    condition: (params, { getState }) => {
      const fetchStatus =
        getState().character.requests["getCompletedObjectives"]
      if (fetchStatus === "pending" || fetchStatus === "fulfilled") {
        return false
      }
    },
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
  },
  {
    condition: (params, { getState }) => {
      const fetchStatus = getState().character.requests["getObjectiveProgress"]
      if (fetchStatus === "pending" || fetchStatus === "fulfilled") {
        return false
      }
    },
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
  },
  {
    condition: (params, { getState }) => {
      const fetchStatus = getState().character.requests["getCharacterData"]
      if (fetchStatus === "pending" || fetchStatus === "fulfilled") {
        return false
      }
    },
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
  },
  {
    condition: (params, { getState }) => {
      const fetchStatus = getState().character.requests["getHideoutLevel"]
      if (fetchStatus === "pending" || fetchStatus === "fulfilled") {
        return false
      }
    },
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
    const items = params.items
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
          items: items,
        },
        config
      )
      const inventoryData = inventory.data.items

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
        data: inventory.data.items,
      }
    } catch (error) {
      return error.response && error.response.data
        ? error.response.data
        : error.message
    }
  },
  {
    condition: (params, { getState }) => {
      const fetchStatus = getState().character.requests["getInventoryItem"]
      if (fetchStatus === "pending" || fetchStatus === "fulfilled") {
        return false
      }
    },
  }
)

export const updateInventoryItem = createAsyncThunk(
  "character/updateInventoryItem",
  async (params, { getState }) => {
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
          items: params.items,
        },
        config
      )
      const newInventoryData = newInventory.data.items

      return newInventoryData
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

const calcTraderLL = (traders, traderLevels, traderRep, traderSpent) => {
  const LL = {}
  traders.forEach((trader) => {
    for (let i = 1; i < traderLevels[trader.name].length; i++) {
      if (
        traderLevels[trader.name][i].requiredReputation <=
          traderRep[trader.name] &&
        traderLevels[trader.name][i].requiredCommerce <=
          traderSpent[trader.name] * 1000000
      ) {
        LL[trader.name] = i + 1
      } else if (
        traderLevels[trader.name][i].requiredReputation >
          traderRep[trader.name] ||
        traderLevels[trader.name][i].requiredCommerce >
          traderSpent[trader.name] * 1000000
      ) {
        LL[trader.name] = i
        break
      }
    }
  })
  return LL
}

export const addTraderProgress = createAsyncThunk(
  "character/addTraderProgress",
  async (params, { getState }) => {
    try {
      const { user } = getState().user
      const { traders, traderLevels } = getState().trader

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const traderLL = await axios.post(
        `/api/player/trader/LL`,
        {
          traderRep: params.traderRep,
          traderSpent: params.traderSpent,
        },
        config
      )

      const LL = calcTraderLL(
        traders,
        traderLevels,
        traderLL.data.traderRep,
        traderLL.data.traderSpent
      )

      return {
        traderLL: LL,
        traderRep: traderLL.data.traderRep,
        traderSpent: traderLL.data.traderSpent,
      }
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
      const { traders, traderLevels } = getState().trader

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const traderLL = await axios.get(`/api/player/trader/LL`, config)

      // calculate loyalty level base on fetched rep and spent of traders
      const LL = calcTraderLL(
        traders,
        traderLevels,
        traderLL.data.traderRep,
        traderLL.data.traderSpent
      )

      return {
        traderLL: LL,
        traderRep: traderLL.data.traderRep,
        traderSpent: traderLL.data.traderSpent,
      }
    } catch (error) {
      return error.response && error.response.data
        ? error.response.data
        : error.message
    }
  },
  {
    condition: (params, { getState }) => {
      const fetchStatus = getState().character.requests["getTraderProgress"]
      if (fetchStatus === "pending" || fetchStatus === "fulfilled") {
        return false
      }
    },
  }
)

export const updateTraderProgress = createAsyncThunk(
  "character/updateTraderProgress",
  async (params, { getState }) => {
    try {
      const { user } = getState().user
      const { traders, traderLevels } = getState().trader

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const newTraderLL = await axios.put(
        `/api/player/trader/LL`,
        {
          traderName: params.traderName,
          traderRep: params.traderRep,
          traderSpent: params.traderSpent,
        },
        config
      )

      const LL = calcTraderLL(
        traders,
        traderLevels,
        newTraderLL.data.traderRep,
        newTraderLL.data.traderSpent
      )

      return {
        traderLL: LL,
        traderRep: newTraderLL.data.traderRep,
        traderSpent: newTraderLL.data.traderSpent,
      }
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const addSkillProgress = createAsyncThunk(
  "character/addSkillProgress",
  async (params, { getState }) => {
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const skills = await axios.post(
        `/api/player/skill`,
        {
          skills: params.skills,
        },
        config
      )

      return skills.data
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const getSkillProgress = createAsyncThunk(
  "character/getSkillProgress",
  async (params, { getState }) => {
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const skills = await axios.get(`/api/player/skill`, config)

      return skills.data
    } catch (error) {
      return error.response && error.response.data
        ? error.response.data
        : error.message
    }
  },
  {
    condition: (params, { getState }) => {
      const fetchStatus = getState().character.requests["getSkillProgress"]
      if (fetchStatus === "pending" || fetchStatus === "fulfilled") {
        return false
      }
    },
  }
)

export const updateSkillProgress = createAsyncThunk(
  "character/updateSkillProgress",
  async (params, { getState }) => {
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const newSkills = await axios.put(
        `/api/player/skill`,
        {
          skill: { skillName: params.skillName, level: params.level },
        },
        config
      )

      return newSkills.data
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const addUnlockedTrader = createAsyncThunk(
  "character/addUnlockedTrader",
  async (params, { getState }) => {
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const traders = await axios.post(
        `/api/player/trader/unlock`,
        {
          traders: params.traders,
        },
        config
      )

      return traders.data.traders
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const getUnlockedTrader = createAsyncThunk(
  "character/getUnlockedTrader",
  async (params, { getState }) => {
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const traders = await axios.get(`/api/player/trader/unlock`, config)

      return traders.data.traders
    } catch (error) {
      return error.response && error.response.data
        ? error.response.data
        : error.message
    }
  },
  {
    condition: (params, { getState }) => {
      const fetchStatus = getState().character.requests["getUnlockedTrader"]
      if (fetchStatus === "pending" || fetchStatus === "fulfilled") {
        return false
      }
    },
  }
)

export const updateUnlockedTrader = createAsyncThunk(
  "character/updateUnlockedTrader",
  async (params, { getState }) => {
    try {
      const { user } = getState().user

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const newTraders = await axios.put(
        `/api/player/trader/unlock`,
        {
          trader: { name: params.name, unlocked: params.unlocked },
        },
        config
      )

      return newTraders.data.traders
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
    // request record
    requests: {},
    // initialize record
    initSetup: false,
    loadingInitSetup: false,
    // player basic data
    playerLevel: 0,
    playerFaction: null,
    gameEdition: null,
    // task progress
    playerTasksInfo: {},
    playerCompletedObjectives: null,
    playerObjectiveProgress: null,
    // trader progress
    unlockedTraders: null,
    traderProgress: null,
    traderLL: {},
    // hideout progress
    playerHideoutLevel: null,
    // inventory
    playerInventory: null,
    // skill
    playerSkill: null,
    // player input
    itemFilterKeyword: "",
    itemFilterType: "full",
  },
  reducers: {
    resetCharacter: (state, action) => {
      state.requests = {}
      state.initSetup = false
      state.loadingInitSetup = false
      state.playerLevel = 0
      state.playerFaction = null
      state.gameEdition = null
      state.playerTasksInfo = {}
      state.playerCompletedObjectives = null
      state.playerObjectiveProgress = null
      state.unlockedTraders = null
      state.traderProgress = null
      state.traderLL = {}
      state.playerHideoutLevel = null
      state.playerInventory = null
      state.playerSkill = null
    },
    setItemFilterKeyword: (state, action) => {
      state.itemFilterKeyword = action.payload
    },
    setItemFilterType: (state, action) => {
      state.itemFilterType = action.payload
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
      .addCase(getCompletedObjectives.pending, (state, action) => {
        state.requests["getCompletedObjectives"] = "pending"
      })
      .addCase(getCompletedObjectives.fulfilled, (state, action) => {
        state.playerCompletedObjectives = action.payload.completeObjectives
        state.requests["getCompletedObjectives"] = "fulfilled"
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
      .addCase(getObjectiveProgress.pending, (state, action) => {
        state.requests["getObjectiveProgress"] = "pending"
      })
      .addCase(getObjectiveProgress.fulfilled, (state, action) => {
        state.playerObjectiveProgress = action.payload.objectiveProgress
        state.requests["getObjectiveProgress"] = "fulfilled"
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
        state.initSetup = true
      })
      .addCase(addCharacterData.rejected, (state, action) => {})
      .addCase(updateCharacterData.pending, (state, action) => {})
      .addCase(updateCharacterData.fulfilled, (state, action) => {
        state.playerLevel = action.payload.characterLevel
        state.playerFaction = action.payload.characterFaction
      })
      .addCase(updateCharacterData.rejected, (state, action) => {})
      .addCase(getCharacterData.pending, (state, action) => {
        state.loadingInitSetup = true
        state.requests["getCharacterData"] = "pending"
      })
      .addCase(getCharacterData.fulfilled, (state, action) => {
        state.loadingInitSetup = false
        if (typeof action.payload === "object") {
          state.playerLevel = action.payload.data.characterLevel
          state.playerFaction = action.payload.data.characterFaction
          state.gameEdition = action.payload.data.gameEdition
          state.initSetup = true
        }
        state.requests["getCharacterData"] = "fulfilled"
      })
      .addCase(getCharacterData.rejected, (state, action) => {
        state.loadingInitSetup = false
      })
      .addCase(addHideoutLevel.pending, (state, action) => {})
      .addCase(addHideoutLevel.fulfilled, (state, action) => {
        state.playerHideoutLevel = action.payload
      })
      .addCase(addHideoutLevel.rejected, (state, action) => {})
      .addCase(getHideoutLevel.pending, (state, action) => {
        state.requests["getHideoutLevel"] = "pending"
      })
      .addCase(getHideoutLevel.fulfilled, (state, action) => {
        state.playerHideoutLevel = action.payload.data
        state.requests["getHideoutLevel"] = "fulfilled"
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
      .addCase(getInventoryItem.pending, (state, action) => {
        state.requests["getInventoryItem"] = "pending"
      })
      .addCase(getInventoryItem.fulfilled, (state, action) => {
        state.playerInventory = action.payload.data
        state.requests["getInventoryItem"] = "fulfilled"
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
      .addCase(getTraderProgress.pending, (state, action) => {
        state.requests["getTraderProgress"] = "pending"
      })
      .addCase(getTraderProgress.fulfilled, (state, action) => {
        state.traderProgress = action.payload
        state.requests["getTraderProgress"] = "fulfilled"
      })
      .addCase(getTraderProgress.rejected, (state, action) => {})
      .addCase(updateTraderProgress.pending, (state, action) => {})
      .addCase(updateTraderProgress.fulfilled, (state, action) => {
        state.traderProgress = action.payload
      })
      .addCase(updateTraderProgress.rejected, (state, action) => {})
      .addCase(addSkillProgress.pending, (state, action) => {})
      .addCase(addSkillProgress.fulfilled, (state, action) => {
        state.playerSkill = action.payload
      })
      .addCase(addSkillProgress.rejected, (state, action) => {})
      .addCase(getSkillProgress.pending, (state, action) => {
        state.requests["getSkillProgress"] = "pending"
      })
      .addCase(getSkillProgress.fulfilled, (state, action) => {
        state.playerSkill = action.payload
        state.requests["getSkillProgress"] = "fulfilled"
      })
      .addCase(getSkillProgress.rejected, (state, action) => {})
      .addCase(updateSkillProgress.pending, (state, action) => {})
      .addCase(updateSkillProgress.fulfilled, (state, action) => {
        state.playerSkill = action.payload
      })
      .addCase(updateSkillProgress.rejected, (state, action) => {})
      .addCase(addUnlockedTrader.pending, (state, action) => {})
      .addCase(addUnlockedTrader.fulfilled, (state, action) => {
        const traders = {}
        action.payload.forEach((trader) => {
          traders[trader.traderName] = trader.unlocked
        })
        state.unlockedTraders = traders
      })
      .addCase(addUnlockedTrader.rejected, (state, action) => {})
      .addCase(getUnlockedTrader.pending, (state, action) => {
        state.requests["getUnlockedTrader"] = "pending"
      })
      .addCase(getUnlockedTrader.fulfilled, (state, action) => {
        const traders = {}
        action.payload.forEach((trader) => {
          traders[trader.traderName] = trader.unlocked
        })
        state.unlockedTraders = traders
        state.requests["getUnlockedTrader"] = "fulfilled"
      })
      .addCase(getUnlockedTrader.rejected, (state, action) => {})
      .addCase(updateUnlockedTrader.pending, (state, action) => {})
      .addCase(updateUnlockedTrader.fulfilled, (state, action) => {
        const traders = {}
        action.payload.forEach((trader) => {
          traders[trader.traderName] = trader.unlocked
        })
        state.unlockedTraders = traders
      })
      .addCase(updateUnlockedTrader.rejected, (state, action) => {})
  },
})

export default characterSlice.reducer
export const { resetCharacter, setItemFilterKeyword, setItemFilterType } =
  characterSlice.actions
