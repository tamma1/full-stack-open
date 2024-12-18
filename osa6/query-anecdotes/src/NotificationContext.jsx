import { createContext, useReducer, useContext } from "react"

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    case 'CLEAR_NOTIFICATION':
      return ''
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, '')

  return ( 
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[1]
}

export const setNotification = (dispatch, message, seconds = 5) => {
  dispatch({ type: 'SET_NOTIFICATION', payload: message })
  setTimeout(() => {
    dispatch({ type: 'CLEAR_NOTIFICATION' })
  }, seconds * 1000)
}

export default NotificationContext