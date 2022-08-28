import React from "react"
import { useDispatch, useSelector } from "react-redux"

const RegisterScreen = () => {
  // redux
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  return <div>RegisterScreen</div>
}

export { RegisterScreen }
