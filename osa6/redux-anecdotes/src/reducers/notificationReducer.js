import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'initial state',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification(state, action) {
      return ''
    }
  }
})

export const setNotificationWithTimeout = (message, timeout = 5000) => {
  return async (dispatch) => {
    dispatch(setNotification(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeout)
  }
}

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer