import React from "react"
import { useNavigate } from "react-router-dom"
import { TarkovStyleButton } from "./TarkovStyleButton"

const LoginFirst = () => {
  const navigate = useNavigate()

  const goToPage = (path) => {
    navigate(path)
  }

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
        <div className="mb-3 d-flex justify-content-center">
          <TarkovStyleButton
            text="Log in"
            clickHandle={() => {
              goToPage("/login")
            }}
            height={80}
            fs={36}
          />
        </div>
        <div className="d-flex justify-content-center">
          <TarkovStyleButton
            text="Register"
            clickHandle={() => {
              goToPage("/register")
            }}
            height={80}
            fs={36}
          />
        </div>
      </div>
    </div>
  )
}

export { LoginFirst }
