import React, { useEffect, useState } from "react"
import { Image } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
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

              <div className="position-relative my-3">
                <Link to="/login">
                  <Image src={buttonImg} />
                  <div className="position-absolute top-50 start-50 translate-middle text-center text-dark fs-2 fw-bold">
                    Log in
                  </div>
                </Link>
              </div>

              <div className="position-relative my-3">
                <Link to="/register">
                  <Image src={buttonImg} />
                  <div className="position-absolute top-50 start-50 translate-middle text-center text-dark fs-2 fw-bold">
                    Register
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export { CharacterScreen }
