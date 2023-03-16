import React, { useState, useCallback } from "react"
import { Col, Row } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { updateSkillProgress } from "../reducers/CharacterSlice"
import { EditValueModal } from "./EditValueModal"
import { SkillIcon } from "./SkillIcon"

const SkillPanel = ({ playerSkill }) => {
  //// state
  const [modalStatus, setModalStatus] = useState(false)
  const [targetSkill, setTargetSkill] = useState(null)

  //// redux
  const dispatch = useDispatch()

  //// handle
  const closeModalHandle = useCallback(() => {
    setModalStatus(!modalStatus)
  }, [modalStatus])

  const modalSetValueHandle = (value) => {
    dispatch(
      updateSkillProgress({ skillName: targetSkill.skillName, level: value })
    )
    closeModalHandle()
  }

  const clickSkillIconHandle = (skill) => {
    setTargetSkill(skill)
    closeModalHandle()
  }

  return (
    <>
      <EditValueModal
        title={targetSkill && targetSkill.skillName}
        show={modalStatus}
        value={targetSkill && targetSkill.level}
        maxValue={51}
        setValueHandle={modalSetValueHandle}
        closeHandle={closeModalHandle}
      />
      <Row xs={2} sm={3} md={4} className="g-3">
        {playerSkill &&
          playerSkill.skills &&
          playerSkill.skills.map((skill) => {
            return (
              <Col key={skill.skillName}>
                <div className="d-flex justify-content-center">
                  <div
                    className="d-flex"
                    role="button"
                    onClick={clickSkillIconHandle.bind(null, skill)}
                  >
                    <SkillIcon
                      skillName={skill.skillName}
                      level={skill.level}
                      useNameBox={true}
                    />
                  </div>
                </div>
              </Col>
            )
          })}
      </Row>
    </>
  )
}

export { SkillPanel }
