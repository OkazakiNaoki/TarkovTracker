import React from "react"

const TarkovGuideButton = ({ children, onClick, className }) => {
  return (
    <button className={`tarkov-guide-btn p-0 ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}

export { TarkovGuideButton }
