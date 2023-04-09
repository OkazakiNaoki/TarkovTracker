import React from "react"
import ReactPlayer from "react-player"

const YoutubePlayer = ({ url }) => {
  return (
    <div className="position-relative aspect-ratio-16-9">
      <ReactPlayer
        className="position-absolute top-0 start-0"
        url={url}
        width="100%"
        height="100%"
        controls={true}
      />
    </div>
  )
}

export { YoutubePlayer }
