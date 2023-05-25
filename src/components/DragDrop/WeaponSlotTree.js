import React, { useState, useEffect } from "react"
import { union } from "lodash"
import { DroppableModSlot } from "./DroppableModSlot"

const WeaponSlotTree = ({
  slotTree,
  installMod,
  installedModList,
  conflictingModList,
  removeMod,
  moveMod,
}) => {
  //// state
  const [installableSlots, setInstallableSlots] = useState([])
  const [installableSlotsParents, setInstallableSlotsParents] = useState([])

  //// effect
  useEffect(() => {
    let totalParentMods = []
    installableSlots.forEach((slotIndex) => {
      const parentMods = getParentModsOfSlot(slotTree, slotIndex)
      totalParentMods = union(totalParentMods, parentMods)
    })
    setInstallableSlotsParents(totalParentMods)
  }, [installableSlots])

  // handle function
  const generateSlotsWithLayer = (slots, layer) => {
    const result = slots.map((slot) => ({ ...slot, layer }))
    const installs = slots.map((slot) => slot.installed).filter(Boolean)
    const subSlots = installs.flatMap((install) =>
      generateSlotsWithLayer(install.slots, layer + 1)
    )
    return result.concat(subSlots)
  }

  const sortLayer = (slots) => {
    const maxLayer = slots.reduce((prev, cur) => {
      return cur.layer > prev ? cur.layer : prev
    }, 0)
    const sortedArr = Array.from({ length: maxLayer }, () => [])

    slots.forEach((slot, i) => {
      sortedArr[slot.layer - 1].push({ ...slot })
    })

    return sortedArr
  }

  const addInstallableSlots = (newSlot) => {
    if (!installableSlots.includes(newSlot)) {
      const copiedInstallableSlots = [...installableSlots]
      copiedInstallableSlots.push(newSlot)
      setInstallableSlots(copiedInstallableSlots)
    }
  }

  const clearInstallableSlots = () => {
    setInstallableSlots([])
    setInstallableSlotsParents([])
  }

  const getParentModsOfSlot = (tree, slotIndex) => {
    let result = []
    if (tree.slots.some((slot) => slot.slotIndex === slotIndex)) {
      result.push(tree.partIndex)
    } else {
      for (let i = 0; i < tree.slots.length; i++) {
        if (tree.slots[i].installed) {
          const ret = getParentModsOfSlot(tree.slots[i].installed, slotIndex)
          if (ret.length > 0) {
            result.push(tree.partIndex)
          }
          result = result.concat(ret)
        }
      }
    }
    return result
  }

  // temp var
  const slotsWithLayer = sortLayer(generateSlotsWithLayer(slotTree.slots, 1))

  return (
    <>
      <div className="d-flex justify-content-center">
        <DroppableModSlot
          weapon={slotTree}
          installMod={installMod}
          highlighted={installableSlotsParents.includes(0)}
          childModSlotAvailIndex={
            installableSlots.length > 0 ? installableSlots[0] : null
          }
        />
      </div>
      {slotsWithLayer.map((slotArr, i) => {
        return (
          <div key={`slot_layer_${i}`} className="d-flex my-2">
            {slotArr.map((slot, j) => {
              return (
                <div key={`slot_${j}`} className="p-1">
                  <DroppableModSlot
                    slot={slot}
                    installMod={installMod}
                    installedModList={installedModList}
                    conflictingModList={conflictingModList}
                    addInstallableSlots={addInstallableSlots}
                    clearInstallableSlots={clearInstallableSlots}
                    highlighted={
                      slot.installed &&
                      installableSlotsParents.includes(slot.installed.partIndex)
                    }
                    childModSlotAvailIndex={
                      installableSlots.length > 0 ? installableSlots[0] : null
                    }
                    removeMod={removeMod}
                    moveMod={moveMod}
                  />
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}

export { WeaponSlotTree }
