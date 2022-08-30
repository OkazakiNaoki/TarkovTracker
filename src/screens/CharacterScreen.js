import React, { useEffect, useState } from "react"
import { Image } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { TarkovButton } from "../components/TarkovButton"
import buttonImg from "../../public/static/images/button.png"

const CharacterScreen = () => {
  // redux
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  return (
    <>
      <div className="h-100 position-relative">
        {Object.keys(user).length === 0 && (
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
        )}
      </div>
    </>
  )
}

export { CharacterScreen }
