import React from "react"
import { TarkovButton } from "./TarkovButton"

const LoginFirst = () => {
  return (
    <div
      className="h-100"
      style={{
        backgroundImage: `url(/asset/glow_top.png)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
      }}
    >
      <div className="position-absolute top-50 start-50 translate-middle w-75 text-center">
        <p className="py-3 fs-1 sandbeige">
          You have not log in yet. Please log in or register first.
        </p>

        <TarkovButton useLink={true} to="/login" text="Log in" />
        <TarkovButton useLink={true} to="/register" text="Register" />
      </div>
    </div>
  )
}

export { LoginFirst }
