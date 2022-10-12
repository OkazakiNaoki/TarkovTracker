import React from "react"
import ReactPlayer from "react-player"

const YoutubePlayer = ({ url }) => {
  return (
    <div className="position-relative" style={{ aspectRatio: "1.7777" }}>
      <ReactPlayer
        className="position-absolute"
        style={{ top: "0", left: "0" }}
        url={url}
        width="100%"
        height="100%"
        controls={true}
      />
    </div>
  )
}

export { YoutubePlayer }
