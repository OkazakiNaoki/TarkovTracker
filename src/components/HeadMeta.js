import React from "react"
import { Helmet } from "react-helmet"

const HeadMeta = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  )
}

HeadMeta.defaultProps = {
  title: "default title",
  description: "default description",
}

export { HeadMeta }
