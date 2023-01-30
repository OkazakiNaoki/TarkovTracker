import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import qs from "qs"

export const searchItemByName = createAsyncThunk(
  "fleamarket/searchItemByName",
  async (params) => {
    const { handbook = null, keyword = "", page = "", limit } = params
    try {
      const { data } = await axios.get("/api/items", {
        params: {
          handbook,
          keyword,
          page,
          limit,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params)
        },
      })
      return data
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const getItemCategory = createAsyncThunk(
  "fleamarket/getItemCategory",
  async (params) => {
    const { type } = params
    try {
      const { data } = await axios.get(`/api/items/categories?type=${type}`)
      return data
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  },
  {
    condition: (params, { getState }) => {
      const fetchStatus = getState().fleamarket.requests["getItemCategory"]
      if (fetchStatus === "pending" || fetchStatus === "fulfilled") {
        return false
      }
    },
  }
)

export const getItemHandbook = createAsyncThunk(
  "fleamarket/getItemHandbook",
  async (params) => {
    try {
      const { data } = await axios.get("/api/items/handbook")
      return data
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  },
  {
    condition: (params, { getState }) => {
      const fetchStatus = getState().fleamarket.requests["getItemHandbook"]
      if (fetchStatus === "pending" || fetchStatus === "fulfilled") {
        return false
      }
    },
  }
)

export const FleamarketSlice = createSlice({
  name: "fleamarket",
  initialState: {
    requests: {},
    isLoading: false,
    loadingQueue: 0,
    items: [],
    categories: [],
    handbook: [],
    handbookTree: [],
  },
  reducers: {
    clearItems: (state, action) => {
      state.items = []
    },
    setHandbookTree: (state, action) => {
      const copyHandbook = {}
      const tree = []
      state.handbook.forEach((cat) => {
        copyHandbook[cat.handbookCategoryId] = {
          value: cat.handbookCategoryName,
          label: cat.handbookCategoryName,
          icon: cat.handbookCategoryIcon,
          children: [],
        }
      })
      state.handbook.forEach((cat) => {
        if (cat.handbookCategoryParent) {
          copyHandbook[cat.handbookCategoryParent].children.push(
            copyHandbook[cat.handbookCategoryId]
          )
        } else {
          tree.push(copyHandbook[cat.handbookCategoryId])
        }
      })
      state.handbookTree = tree
    },
    resetFleamarket: (state, action) => {
      state.requests = {}
      state.isLoading = false
      state.loadingQueue = 0
      state.items = []
      state.categories = []
      state.handbook = []
      state.handbookTree = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchItemByName.pending, (state, action) => {
        state.loadingQueue += 1
        state.isLoading = true
      })
      .addCase(searchItemByName.fulfilled, (state, action) => {
        state.success = true
        state.loadingQueue -= 1
        if (state.loadingQueue === 0) {
          state.isLoading = false
        }
        state.items = action.payload.items
        state.page = action.payload.page
        state.pages = action.payload.pages
      })
      .addCase(searchItemByName.rejected, (state, action) => {
        state.loadingQueue -= 1
        if (state.loadingQueue === 0) {
          state.isLoading = false
        }
        state.error = action.payload
      })
      .addCase(getItemCategory.pending, (state, action) => {
        state.loadingQueue += 1
        state.isLoading = true
        state.requests["getItemCategory"] = "pending"
      })
      .addCase(getItemCategory.fulfilled, (state, action) => {
        state.success = true
        state.loadingQueue -= 1
        if (state.loadingQueue === 0) {
          state.isLoading = false
        }
        state.categories = action.payload.categories
        state.requests["getItemCategory"] = "fulfilled"
      })
      .addCase(getItemCategory.rejected, (state, action) => {
        state.loadingQueue -= 1
        if (state.loadingQueue === 0) {
          state.isLoading = false
        }
        state.error = action.payload
      })
      .addCase(getItemHandbook.pending, (state, action) => {
        state.loadingQueue += 1
        state.isLoading = true
        state.requests["getItemHandbook"] = "pending"
      })
      .addCase(getItemHandbook.fulfilled, (state, action) => {
        state.success = true
        state.loadingQueue -= 1
        if (state.loadingQueue === 0) {
          state.isLoading = false
        }
        state.handbook = action.payload.handbook
        state.requests["getItemHandbook"] = "fulfilled"
      })
      .addCase(getItemHandbook.rejected, (state, action) => {
        state.loadingQueue -= 1
        if (state.loadingQueue === 0) {
          state.isLoading = false
        }
        state.error = action.payload
      })
  },
})

export default FleamarketSlice.reducer
export const { setHandbookTree, clearItems, resetFleamarket } =
  FleamarketSlice.actions
