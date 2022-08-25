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

export const getTaskDetail = createAsyncThunk(
  "trader/getTaskDetail",
  async (params) => {
    const { id = "", i = -1, j = -1 } = params
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
              experience
              objectives{
                type
                description
                optional
                ... on TaskObjectiveBuildItem{
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
                  type
                  description
                  optional
                  exitStatus
                  zoneNames
                }
                ... on TaskObjectiveItem{
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
                  type
                  description
                  optional
                  markerItem{id name}
                }
                ... on TaskObjectivePlayerLevel{
                  type
                  description
                  optional
                  playerLevel
                }
                ... on TaskObjectiveQuestItem{
                  type
                  description
                  optional
                  questItem{name}
                  count
                }
                ... on TaskObjectiveShoot{
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
                  type
                  description
                  optional
                  skillLevel{
                    name
                    level
                  }
                }
                ... on TaskObjectiveTaskStatus{
                  type
                  description
                  optional
                  task{id name}
                  status
                }
                      ... on TaskObjectiveTraderLevel{
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
                traderUnlock{name}
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

      return { data: gqlData, i, j }
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
    tasksDetail: Array(8).fill([]),
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
        // console.log(action.payload)
        state.isLoading = false
        state.traders = action.payload
      })
      .addCase(getTraders.rejected, (state, action) => {
        throw Error(action.payload)
      })
      .addCase(getTasksOfTrader.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getTasksOfTrader.fulfilled, (state, action) => {
        // console.log(action.payload)
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
        state.tasksDetail[index] = Array(copy.length).fill(null)
      })
      .addCase(getTasksOfTrader.rejected, (state, action) => {
        throw Error(action.payload)
      })
      .addCase(getTaskDetail.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getTaskDetail.fulfilled, (state, action) => {
        console.log(action.payload.data)
        state.isLoading = false
        state.tasksDetail[action.payload.i][action.payload.j] =
          action.payload.data
      })
      .addCase(getTaskDetail.rejected, (state, action) => {
        throw Error(action.payload)
      })
  },
})

export default traderSlice.reducer
export const { setTaskCollapse } = traderSlice.actions
