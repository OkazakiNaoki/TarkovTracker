import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getLevelReqOfTrader = createAsyncThunk(
  "trader/getLevelReqOfTrader",
  async (params) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
      const traderLevels = await axios.get(
        `/api/trader/levels?trader=${params.trader}`,
        config
      )
      return traderLevels.data[0]
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  },
  {
    condition: (params, { getState }) => {
      const fetchStatus =
        getState().trader.requests[`getLevelReqOfTrader.${params.trader}`]
      if (fetchStatus === "pending" || fetchStatus === "fulfilled") {
        return false
      }
    },
  }
)

export const getTradeResetTime = createAsyncThunk(
  "trader/getTradeResetTime",
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
          traders(lang: en) {
            name
            resetTime
          }
        }`,
      }
      const gql = await axios.post(
        `https://api.tarkov.dev/graphql`,
        body,
        config
      )
      return gql.data.data.traders
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
  },
  {
    condition: (params, { getState }) => {
      const fetchStatus =
        getState().trader.requests[`getTasksOfTrader.${params.trader}`]
      if (fetchStatus === "pending" || fetchStatus === "fulfilled") {
        return false
      }
    },
  }
)

export const getTaskDetail = createAsyncThunk(
  "trader/getTaskDetail",
  async (params) => {
    const { id = "", traderName = "" } = params
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
      const body = {
        query: `{
            task(id: "${id}"){
              id
              experience
              objectives{
                id
                type
                description
                optional
                ... on TaskObjectiveBuildItem{
                  id
                  type
                  description
                  optional
                  item{id name}
                  containsAll{id name}
                  containsOne{id name}
                  attributes{
                    name
                    requirement{
                      compareMethod
                      value
                    }
                  }
                }
                ... on TaskObjectiveExperience{
                  id
                  type
                  description
                  optional
                  healthEffect{
                    bodyParts
                    effects
                    time{
                      compareMethod
                      value
                    }
                  }
                }
                ... on TaskObjectiveExtract{
                  id
                  type
                  description
                  optional
                  exitStatus
                  zoneNames
                }
                ... on TaskObjectiveItem{
                  id
                  type
                  description
                  optional
                  item{id name}
                  count
                  foundInRaid
                  dogTagLevel
                  maxDurability
                  minDurability
                }
                ... on TaskObjectiveMark{
                  id
                  type
                  description
                  optional
                  markerItem{id name}
                }
                ... on TaskObjectivePlayerLevel{
                  id
                  type
                  description
                  optional
                  playerLevel
                }
                ... on TaskObjectiveQuestItem{
                  id
                  type
                  description
                  optional
                  questItem{name}
                  count
                }
                ... on TaskObjectiveShoot{
                  id
                  type
                  description
                  optional
                  target
                  count
                  shotType
                  zoneNames
                  bodyParts
                  usingWeapon{id name}
                  usingWeaponMods{id name}
                  wearing{id name}
                  notWearing{id name}
                  distance{
                    compareMethod
                    value
                  }
                  playerHealthEffect{
                    bodyParts
                    effects
                    time{
                      compareMethod
                      value
                    }
                  }
                  enemyHealthEffect{
                    bodyParts
                    effects
                    time{
                      compareMethod
                      value
                    }
                  }
                }
                ... on TaskObjectiveSkill{
                  id
                  type
                  description
                  optional
                  skillLevel{
                    name
                    level
                  }
                }
                ... on TaskObjectiveTaskStatus{
                  id
                  type
                  description
                  optional
                  task{id name}
                  status
                }
                ... on TaskObjectiveTraderLevel{
                  id
                  type
                  description
                  optional
                  trader{name}
                  level
                }
              }
              startRewards{
                traderStanding{trader{name} standing}
                items{item{id name} count}
                offerUnlock{trader{name} level item{id name}}
                skillLevelReward{name level}
                traderUnlock{name}
              }
              finishRewards{
                traderStanding{trader{name} standing}
                items{item{id name backgroundColor} count}
                offerUnlock{trader{name} level item{id name}}
                skillLevelReward{name level}
                traderUnlock{id name}
              }
              descriptionMessageId
            }
          }`,
      }
      const gql = await axios.post(
        `https://api.tarkov.dev/graphql`,
        body,
        config
      )
      const gqlData = gql.data.data.task

      const taskImg = await axios.get(`/api/task/image?id=${id}`)
      const taskImgData = taskImg.data[0]

      const taskDesc = await axios.get(`/api/task/desc?desc_id=${id}`)
      const taskDescData = taskDesc.data[0]

      gqlData.image = taskImgData.image
      gqlData.description = taskDescData.description

      return { data: gqlData, taskId: id, traderName }
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  },
  {
    condition: (params, { getState }) => {
      const fetchStatus =
        getState().trader.requests[`getTaskDetail.${params.id}`]
      if (fetchStatus === "pending" || fetchStatus === "fulfilled") {
        return false
      }
    },
  }
)

export const getTaskItemRequirements = createAsyncThunk(
  "trader/getTaskItemRequirements",
  async (params) => {
    try {
      const { data } = await axios.get(`/api/task/require/item`)
      return data
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  },
  {
    condition: (params, { getState }) => {
      const fetchStatus = getState().trader.requests["getTaskItemRequirements"]
      if (fetchStatus === "pending" || fetchStatus === "fulfilled") {
        return false
      }
    },
  }
)

const traderSlice = createSlice({
  name: "trader",
  initialState: {
    requests: {},
    initTasks: false,
    isLoading: false,
    isLoadingTasks: false,
    tradeResetTime: {},
    traders: [
      {
        id: "54cb50c76803fa8b248b4571",
        name: "Prapor",
      },
      {
        id: "54cb57776803fa99248b456e",
        name: "Therapist",
      },
      {
        id: "579dc571d53a0658a154fbec",
        name: "Fence",
      },
      {
        id: "58330581ace78e27b8b10cee",
        name: "Skier",
      },
      {
        id: "5935c25fb3acc3127c3d8cd9",
        name: "Peacekeeper",
      },
      {
        id: "5a7c2eca46aef81a7ca2145d",
        name: "Mechanic",
      },
      {
        id: "5ac3b934156ae10c4430e83c",
        name: "Ragman",
      },
      {
        id: "5c0647fdd443bc2504c2d371",
        name: "Jaeger",
      },
    ],
    traderLevels: null,
    tasks: {},
    tasksDetail: {},
    tasksDetailFetched: {},
    taskItemRequirement: [],
  },
  reducers: {
    setTaskCollapse: (state, action) => {
      const { i, j } = action.payload
      state.tasks[i][j].collapse = !state.tasks[i][j].collapse
    },
    initializeTasks: (state, action) => {
      state.traders.forEach((trader) => {
        state.tasksDetail[`${trader.name}`] = {}
        state.tasksDetailFetched[`${trader.name}`] = []
      })
    },
    resetTrader: (state, action) => {
      state.requests = {}
      state.initTasks = false
      state.isLoading = false
      state.isLoadingTasks = false
      state.tradeResetTime = {}
      state.traderLevels = null
      state.tasks = {}
      state.tasksDetail = {}
      state.tasksDetailFetched = {}
      state.taskItemRequirement = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTradeResetTime.pending, (state, action) => {
        state.requests["getTradeResetTime"] = "pending"
      })
      .addCase(getTradeResetTime.fulfilled, (state, action) => {
        action.payload.forEach((trader) => {
          state.tradeResetTime[trader.name] = trader.resetTime
        })
        state.requests["getTradeResetTime"] = "fulfilled"
      })
      .addCase(getTradeResetTime.rejected, (state, action) => {
        throw Error(action.payload)
      })
      .addCase(getTasksOfTrader.pending, (state, action) => {
        state.isLoadingTasks = true
        state.requests[`getTasksOfTrader.${action.meta.arg.trader}`] = "pending"
      })
      .addCase(getTasksOfTrader.fulfilled, (state, action) => {
        state.isLoadingTasks = false
        state.tasks[action.payload.trader] = action.payload.tasksArr
        state.requests[`getTasksOfTrader.${action.meta.arg.trader}`] =
          "fulfilled"
      })
      .addCase(getTasksOfTrader.rejected, (state, action) => {
        state.isLoadingTasks = false
        throw Error(action.payload)
      })
      .addCase(getTaskDetail.pending, (state, action) => {
        state.isLoadingTaskDetail = true
        state.requests[`getTaskDetail.${action.meta.arg.id}`] = "pending"
      })
      .addCase(getTaskDetail.fulfilled, (state, action) => {
        state.tasksDetail[action.payload.traderName] = {
          ...state.tasksDetail[action.payload.traderName],
          [action.payload.taskId]: action.payload.data,
        }
        state.tasksDetailFetched[action.payload.traderName].push(
          action.payload.taskId
        )
        state.requests[`getTaskDetail.${action.meta.arg.id}`] = "fulfilled"
      })
      .addCase(getTaskDetail.rejected, (state, action) => {
        throw Error(action.payload)
      })
      .addCase(getTaskItemRequirements.pending, (state, action) => {
        state.isLoading = true
        state.requests["getTaskItemRequirements"] = "pending"
      })
      .addCase(getTaskItemRequirements.fulfilled, (state, action) => {
        state.isLoading = false
        state.taskItemRequirement = action.payload
        state.requests["getTaskItemRequirements"] = "fulfilled"
      })
      .addCase(getTaskItemRequirements.rejected, (state, action) => {
        throw Error(action.payload)
      })
      .addCase(getLevelReqOfTrader.pending, (state, action) => {
        state.requests[`getLevelReqOfTrader.${action.meta.arg.trader}`] =
          "pending"
      })
      .addCase(getLevelReqOfTrader.fulfilled, (state, action) => {
        if (state.traderLevels === null) {
          const newTraderLevels = {}
          newTraderLevels[action.payload.name] = action.payload.levels
          state.traderLevels = newTraderLevels
        } else {
          state.traderLevels[action.payload.name] = action.payload.levels
        }
        state.requests[`getLevelReqOfTrader.${action.meta.arg.trader}`] =
          "fulfilled"
      })
      .addCase(getLevelReqOfTrader.rejected, (state, action) => {
        throw Error(action.payload)
      })
  },
})

export default traderSlice.reducer
export const { initializeTasks, setTaskCollapse, resetTrader } =
  traderSlice.actions
