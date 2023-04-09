import React, { useEffect, useState } from "react"
import { getHMSfromS, formatInColon } from "../helpers/TimeFormat"

const CountdownTimer = ({ targetDate }) => {
  // hooks state
  const [time, setTime] = useState(null)
  const [hhmmss, setHhmmss] = useState("00:00:00")
  const [tickInterval, setTickInterval] = useState(null)

  // effect
  useEffect(() => {
    if (targetDate && targetDate > Date.now()) {
      // on mount initialize time and start tick interval
      const t = new Date(targetDate)
      t.setMilliseconds(0)

      const interval = setInterval(() => {
        subtractSecond(t)
      }, 1000)
      setTickInterval(interval)
    }
  }, [])

  useEffect(
    () => () => {
      // on unmount clear tick interval
      clearInterval(tickInterval)
    },
    []
  )

  useEffect(() => {
    if (time) {
      const hms = formatInColon(
        getHMSfromS(Math.floor((time.getTime() - Date.now()) / 1000))
      )
      setHhmmss(hms)
    }
  }, [time])

  useEffect(() => {
    if (targetDate > Date.now()) {
      const t = new Date(targetDate)
      t.setMilliseconds(0)
      if (tickInterval) {
        clearInterval(tickInterval)

        const interval = setInterval(() => {
          subtractSecond(t)
        }, 1000)
        setTickInterval(interval)
      }
    }
  }, [targetDate])

  // handle
  const subtractSecond = (time) => {
    if (time.getTime() - 1000 > 0) {
      setTime(new Date(time.getTime() - 1000))
    } else {
      clearInterval(tickInterval)
      setHhmmss("00:00:00")
    }
  }

  return <div className="d-inline-block fs-12px">{hhmmss}</div>
}

export { CountdownTimer }
