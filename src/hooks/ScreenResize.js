import { useLayoutEffect, useState, useRef } from "react"

export function useDebouncedResize(delay) {
  const [isResize, setIsResize] = useState(false)
  const resizeTimerRef = useRef(null)

  useLayoutEffect(() => {
    const handleResizeStart = () => {
      console.log("start")
      setIsResize(true)
      if (resizeTimerRef.current !== null) {
        clearTimeout(resizeTimerRef.current)
      }
    }

    const handleResizeEnd = () => {
      isResizingRef.current = false
      resizeTimerRef.current = setTimeout(() => {
        console.log("end")
      }, delay)
    }

    window.addEventListener("resize", handleResizeStart)
    window.addEventListener("resize", handleResizeEnd)

    return () => {
      window.removeEventListener("resize", handleResizeStart)
      window.removeEventListener("resize", handleResizeEnd)
      clearTimeout(resizeTimerRef.current)
    }
  }, [delay])

  return isResizingRef.current
}
