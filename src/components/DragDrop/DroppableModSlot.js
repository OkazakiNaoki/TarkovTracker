import React, { useState, useEffect } from "react"
import { useDrop } from "react-dnd"
import classNames from "classnames"
import { ModSlot } from "../ModSlot"
import { ItemSingleGrid } from "../ItemSingleGrid"
import { DraggableMod } from "./DraggableMod"

const DroppableModSlot = ({
  weapon = null,
  slot = null,
  installMod,
  installedModList,
  conflictingModList,
  addInstallableSlots,
  clearInstallableSlots,
  highlighted,
  childModSlotAvailIndex,
  removeMod,
  moveMod,
}) => {
  //// state
  const [installable, setInstallable] = useState(false)
  const [childModInstallable, setChildModInstallable] = useState(false)
  const [installableSlotIndex, setInstallableSlotIndex] = useState(-1)

  //// drop
  const [{ canDrop, isOver, item }, drop] = useDrop(() => {
    return {
      accept: ["mod", "spare mod", "installed mod"],
      drop: (item, monitor) => {
        const notInstalledMod = monitor.getItemType() !== "installed mod"

        if (installable && notInstalledMod) {
          // handbook, sorting table => mod slot
          return {
            type: "mod slot",
            installMethod: installMod,
            slotIndex: slot.slotIndex,
            mod: item.mod,
          }
        } else if (
          childModInstallable &&
          installableSlotIndex !== -1 &&
          notInstalledMod
        ) {
          // handbook, sorting table => mod slot
          setChildModInstallable(false)
          setInstallableSlotIndex(-1)
          return {
            type: "mod slot",
            installMethod: installMod,
            slotIndex: installableSlotIndex,
            mod: item.mod,
          }
        } else if (installable && !notInstalledMod) {
          // mod slot => mod slot
          return {
            type: "mod slot",
            fromSlotIndex: item.modIndex,
            slotIndex: slot.slotIndex,
          }
        }
      },
      collect: (monitor) => ({
        item: monitor.getItem(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }
  }, [installMod, installable, childModInstallable, installableSlotIndex])

  //// effect
  useEffect(() => {
    if (!canDrop && clearInstallableSlots) {
      clearInstallableSlots()
    }
  }, [item, canDrop])

  useEffect(() => {
    if (slot && item) {
      let isInstallable = !slot.installed

      // acceptable mod checking
      if (isInstallable && slot.filters) {
        isInstallable = slot.filters.includes(item.mod.id)
      }

      // this conflicting other installed mods
      if (
        isInstallable &&
        installedModList &&
        installedModList.some((installed) =>
          item.mod.conflictingItems.includes(installed)
        )
      ) {
        isInstallable = false
      }

      // other installed mods conflicting this
      if (
        isInstallable &&
        conflictingModList &&
        conflictingModList.includes(item.mod.id)
      ) {
        isInstallable = false
      }

      if (isInstallable && !slot.installed) {
        addInstallableSlots(slot.slotIndex)
      }
      setInstallable(isInstallable)
    }
  }, [item, slot])

  useEffect(() => {
    setChildModInstallable(highlighted)
    setInstallableSlotIndex(childModSlotAvailIndex)
  }, [highlighted])

  //// handle function

  //// var
  const isMod = canDrop

  return (
    <div
      ref={drop}
      className={classNames(
        "position-relative",
        { "border-1px-transparent": !isOver },
        {
          "item-slot-drop-in-forbid":
            isOver && isMod && (!installable || highlighted),
        },
        {
          "item-slot-drop-in-allow":
            isOver && isMod && (installable || highlighted),
        }
      )}
      style={{ zIndex: 1000 }}
    >
      {weapon && (
        <ItemSingleGrid
          itemId={weapon.id}
          shortName={weapon.shortName}
          bgColor={weapon.backgroundColor}
          useDisableOutline={isOver && isMod}
          useBgCompatible={isMod && highlighted}
        />
      )}
      {!weapon && slot && !slot.installed && (
        <ModSlot
          modType={slot && slot.name}
          image={slot && slot.image}
          installedMod={slot && (slot.installed ?? null)}
        />
      )}
      {!weapon && slot && slot.installed && (
        <DraggableMod
          mod={slot.installed}
          type="installed mod"
          modIndex={slot.installed.partIndex}
          moveMod={moveMod}
          removeMod={removeMod}
        >
          <ItemSingleGrid
            itemId={slot.installed.id}
            shortName={slot.installed.shortName}
            bgColor={slot.installed.backgroundColor}
            useDisableOutline={isOver && isMod}
            useBgCompatible={isMod && highlighted}
          />
        </DraggableMod>
      )}
    </div>
  )
}

export { DroppableModSlot }
