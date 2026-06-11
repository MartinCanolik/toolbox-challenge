import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || ''

export const fetchFiles = createAsyncThunk(
  'files/fetchFiles',
  async ({ fileName } = {}, { rejectWithValue }) => {
    try {
      const url = fileName
        ? `${API_URL}/files/data?fileName=${encodeURIComponent(fileName)}`
        : `${API_URL}/files/data`
      const response = await axios.get(url)
      return response.data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Failed to fetch files'
      )
    }
  }
)

const filesSlice = createSlice({
  name: 'files',
  initialState: {
    items: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
    filter: ''
  },
  reducers: {
    setFilter (state, action) {
      state.filter = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  }
})

export const { setFilter } = filesSlice.actions

export const selectFiles = (state) => state.files.items
export const selectStatus = (state) => state.files.status
export const selectError = (state) => state.files.error
export const selectFilter = (state) => state.files.filter

export default filesSlice.reducer
