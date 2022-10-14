import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

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
                items{item{id name} count}
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

      const taskDesc = await axios.get(
        `/api/task/desc?desc_id=${gqlData.descriptionMessageId}`
      )
      const taskDescData = taskDesc.data[0]

      gqlData.image = taskImgData.image
      gqlData.description = taskDescData.description

      return { data: gqlData, taskId: id, traderName }
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
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
  }
)

const traderSlice = createSlice({
  name: "trader",
  initialState: {
    isLoading: true,
    isLoadingTrader: true,
    isLoadingTasks: true,
    traders: [],
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTraders.pending, (state, action) => {
        state.isLoadingTrader = true
      })
      .addCase(getTraders.fulfilled, (state, action) => {
        state.isLoadingTrader = false
        state.traders = action.payload
        action.payload.forEach((trader) => {
          state.tasks[`${trader.name}`] = null
          state.tasksDetail[`${trader.name}`] = {}
          state.tasksDetailFetched[`${trader.name}`] = []
        })
      })
      .addCase(getTraders.rejected, (state, action) => {
        state.isLoadingTrader = false
        throw Error(action.payload)
      })
      .addCase(getTasksOfTrader.pending, (state, action) => {
        state.isLoadingTasks = true
      })
      .addCase(getTasksOfTrader.fulfilled, (state, action) => {
        state.isLoadingTasks = false
        state.tasks[action.payload.trader] = action.payload.tasksArr
      })
      .addCase(getTasksOfTrader.rejected, (state, action) => {
        state.isLoadingTasks = false
        throw Error(action.payload)
      })
      .addCase(getTaskDetail.pending, (state, action) => {
        state.isLoadingTaskDetail = true
      })
      .addCase(getTaskDetail.fulfilled, (state, action) => {
        state.tasksDetail[action.payload.traderName] = {
          ...state.tasksDetail[action.payload.traderName],
          [action.payload.taskId]: action.payload.data,
        }
        state.tasksDetailFetched[action.payload.traderName].push(
          action.payload.taskId
        )
      })
      .addCase(getTaskDetail.rejected, (state, action) => {
        throw Error(action.payload)
      })
      .addCase(getTaskItemRequirements.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getTaskItemRequirements.fulfilled, (state, action) => {
        state.isLoading = false
        state.taskItemRequirement = action.payload
      })
      .addCase(getTaskItemRequirements.rejected, (state, action) => {
        throw Error(action.payload)
      })
  },
})

export default traderSlice.reducer
export const { setTaskCollapse } = traderSlice.actions
