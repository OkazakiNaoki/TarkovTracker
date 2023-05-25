import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import classNames from "classnames"
import { cloneDeep, find } from "lodash"
import { DndProvider } from "react-dnd"
import { TouchBackend } from "react-dnd-touch-backend"
import {
  Button,
  Col,
  Collapse,
  Container,
  Form,
  Image,
  InputGroup,
  Row,
} from "react-bootstrap"
import {
  clearFetchedMods,
  getFilterModIds,
  getModByIds,
  getWeapon,
} from "../reducers/ItemSlice"
import { slotIconMap } from "../data/SlotIconMap"
import { GuidingBreadcrumb } from "../components/GuidingBreadcrumb"
import { findTopLevelKey, findKeyPath } from "../helpers/LoopThrough"
import { ItemMultiGrid } from "../components/ItemMultiGrid"
import { Paginate } from "../components/Paginate"
import { DraggableMod } from "../components/DragDrop/DraggableMod"
import { ItemDragLayer } from "../components/DragDrop/ItemDragLayer"
import { WeaponSlotTree } from "../components/DragDrop/WeaponSlotTree"
import { updatePreset } from "../reducers/CustomizationSlice"
import { SavePresetModal } from "../components/SavePresetModal"
import { XLg } from "react-bootstrap-icons"
import { TarkovGuideButton } from "../components/TarkovGuideButton"
import buildSaveIcon from "../../server/public/static/images/build/save_build_icon_big.png"
import { DroppableSortingTable } from "../components/DragDrop/DroppableSortingTable"
import { DroppableTrashCan } from "../components/DragDrop/DroppableTrashCan"
import { LeftSideButton } from "../components/LeftSideButton"
import sortingTableIcon from "../../server/public/static/images/build/icon_sortingtable_big.png"

const WeaponBuildScreen = () => {
  //// router
  const params = useParams()

  //// redux
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const {
    weapons,
    fetchedModFilter,
    currentModFilter,
    fetchedMods,
    modCategories,
    modCategoriesLayer,
    modPages,
    modPage,
    modHandbook,
  } = useSelector((state) => state.item)
  const { presets } = useSelector((state) => state.customization)

  //// state
  const [curWeaponId, setCurWeaponId] = useState(null)
  const [installedModList, setInstalledModList] = useState([])
  const [conflictingModList, setConflictingModList] = useState([])
  const [slotTree, setSlotTree] = useState(null)
  const [currentDepth, setCurrentDepth] = useState(-1)
  const [breadcrumbPath, setBreadcrumbPath] = useState([{ name: "All" }])
  const [breadcrumbDropdown, setBreadcrumbDropdown] = useState([])
  const [filter, setFilter] = useState({
    page: 1,
    handbook: "All",
  })
  const [totalWeaponProp, setTotalWeaponProp] = useState(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [showHandbookFilter, setShowHandbookFilter] = useState(false)
  const [presetName, setPresetName] = useState(null)
  const [weaponName, setWeaponName] = useState(null)
  const [openSortingTable, setOpenSortingTable] = useState(false)

  //// effect
  // calculate weapon property
  useEffect(() => {
    if (curWeaponId && slotTree) {
      const properties = getTotalProperties(curWeaponId, slotTree)
      setTotalWeaponProp(properties)
    }
  }, [curWeaponId, slotTree])

  // set current target weapon and get slots under it
  useEffect(() => {
    let weaponId = null
    let isLoadByPreset = false

    if (params.presetIndex !== undefined) {
      weaponId = presets[params.presetIndex].id
      isLoadByPreset = true
      setPresetName(presets[params.presetIndex].presetName)
    } else {
      weaponId = params.itemId
    }
    setCurWeaponId(weaponId)

    if (weaponId) {
      if (!slotTree && !weapons.hasOwnProperty(weaponId)) {
        dispatch(getWeapon({ id: weaponId }))
      }

      if (
        (!slotTree || (slotTree && slotTree.id !== weaponId)) &&
        weapons.hasOwnProperty(weaponId)
      ) {
        if (!isLoadByPreset) {
          loadWeaponPresetTree(weapons[weaponId])
        } else {
          refuelPreset(params.presetIndex)
        }
      }
    }
  }, [weapons, params])

  // set weapon name if page is loaded with weapon id
  useEffect(() => {
    if (
      weapons.hasOwnProperty(params.itemId) &&
      weaponName !== weapons[params.itemId].name
    ) {
      setWeaponName(weapons[params.itemId].name)
    }
  }, [weapons])

  // update breadcrumb on handbook category changed
  useEffect(() => {
    const newPath = findKeyPath(modCategories, filter.handbook)
    const newBreadcrumbPath = [
      {
        name: "All",
        callback: selectHandbookHandle.bind(null, "All"),
      },
    ]

    if (filter.handbook !== "All") {
      newPath.forEach((path, i) => {
        const cb =
          path !== newPath.length - 1
            ? selectHandbookHandle.bind(null, path)
            : null

        newBreadcrumbPath.push({
          name: path,
          callback: cb,
        })
      })
      setBreadcrumbPath(newBreadcrumbPath)
      const newDropdown = []
      modCategoriesLayer[currentDepth].forEach((path) => {
        newDropdown.push({
          name: path,
          callback: selectHandbookHandle.bind(null, path),
        })
      })
      setBreadcrumbDropdown(newDropdown)
    } else {
      setBreadcrumbPath(newBreadcrumbPath)
      setBreadcrumbDropdown([])
    }
  }, [filter])

  // update mod list on handbook category changed
  useEffect(() => {
    const { handbook, keyword = null, page } = filter
    dispatch(
      getFilterModIds({
        handbook,
        page,
        ...(keyword && { keyword }),
      })
    )
  }, [filter])

  // DEBUG print slotTree
  useEffect(() => {
    // console.log("slotTree updated", slotTree)
    if (slotTree) {
      const saveForm = cloneDeep(slotTree)

      generatePresetSaveForm(saveForm)
      const encoded = new TextEncoder().encode(JSON.stringify(saveForm))
      const size = encoded.length
      const kiloBytes = size / 1024
      // console.log("slotTree save form", saveForm)
      // console.log("slotTree save size", kiloBytes, "KB")
      // console.log("json", stringfied)
    }
  }, [slotTree])

  //// handle function
  // load weapon slots into a tree structure
  const loadWeaponPresetTree = async (weapon) => {
    const root = {}
    root.id = weapon.id
    root.partIndex = 0
    root.nextPartIndex = 1
    root.nextSlotIndex = 0
    root.shortName = weapon.shortName
    root.backgroundColor = weapon.backgroundColor
    root.slots = await copyModSlots(root, weapon)

    if (installedModList.length !== 0) {
      setInstalledModList([])
    }
    if (conflictingModList.length !== 0) {
      setConflictingModList([])
    }
    setSlotTree(root)
  }

  const generatePresetSaveForm = (saveFormPresetTree) => {
    // remove mod part
    delete saveFormPresetTree.shortName
    delete saveFormPresetTree.backgroundColor
    delete saveFormPresetTree.conflictingItems
    delete saveFormPresetTree.width
    delete saveFormPresetTree.height
    delete saveFormPresetTree.properties
    // remove slot part
    const slots = saveFormPresetTree.slots
    if (slots.length > 0) {
      for (let i = 0; i < slots.length; i++) {
        delete slots[i].image
        delete slots[i].filters
        if (slots[i].installed) {
          generatePresetSaveForm(slots[i].installed)
        }
      }
    }
  }

  const savePreset = (presetTree, presetName, assignIndex = null) => {
    if (presets) {
      const saveFormPresetTree = cloneDeep(presetTree)
      generatePresetSaveForm(saveFormPresetTree)
      saveFormPresetTree.presetName = presetName
      if (assignIndex === null) {
        dispatch(updatePreset({ isNew: true, preset: saveFormPresetTree }))
      } else {
        dispatch(
          updatePreset({
            isNew: false,
            preset: saveFormPresetTree,
            index: assignIndex,
          })
        )
      }
    }
  }

  const showSavePresetModalHandle = () => {
    setShowSaveModal(!showSaveModal)
  }

  const refuelPreset = async (presetIndex) => {
    // load base weapon data
    const weaponId = presets[presetIndex].id
    const base = cloneDeep(presets[presetIndex])
    base.shortName = weapons[weaponId].shortName
    base.backgroundColor = weapons[weaponId].backgroundColor
    base.slots.forEach((slot) => {
      const fetchedWeaponSlots = weapons[weaponId].properties.slots
      for (let i = 0; i < fetchedWeaponSlots.length; i++) {
        if (slot.id === fetchedWeaponSlots[i].id) {
          slot.filters = fetchedWeaponSlots[i].filters.allowedItems.map(
            (item) => item.id
          )
          break
        }
      }
    })

    const mods = getModsUnderWeapon(base)
    const slots = getSlotsUnderWeapon(base)

    // if mod data is not fetched
    const modIds = mods.map((mod) => mod.id)
    const missingModsResult = await dispatch(getModByIds({ modIds }))
    const missingMods = missingModsResult.payload

    let modList = []
    let conflictList = []
    mods.forEach((mod) => {
      const fetchedMod = fetchedMods.hasOwnProperty(mod.id)
        ? fetchedMods[mod.id]
        : find(missingMods, (o) => o.id === mod.id)

      modList = modList.concat(mod.id)
      mod.shortName = fetchedMod.shortName
      mod.backgroundColor = fetchedMod.backgroundColor
      mod.width = fetchedMod.width
      mod.height = fetchedMod.height
      mod.conflictingItems = fetchedMod.conflictingItems
      conflictList = conflictList.concat(fetchedMod.conflictingItems)
      mod.properties = copyModProperties(fetchedMod)

      mod.slots.forEach((slot) => {
        const fetchedModSlots = fetchedMod.properties.slots
        for (let i = 0; i < fetchedModSlots.length; i++) {
          if (slot.id === fetchedModSlots[i].id) {
            slot.filters = fetchedModSlots[i].filters.allowedItems.map(
              (item) => item.id
            )
            break
          }
        }
      })
    })

    await Promise.all(
      slots.map(async (slot) => {
        const { default: image } = await import(
          `../../server/public/static/images/slot-type/${
            slotIconMap[slot.name]
          }`
        )
        slot.image = image
      })
    )

    setInstalledModList(modList)
    setConflictingModList(conflictList)
    setSlotTree(base)
  }

  const copyModSlots = async (presetTree, mod) => {
    const copySlots = await Promise.all(
      mod.properties.slots.map(async (slot) => {
        const s = {}
        const { default: image } = await import(
          `../../server/public/static/images/slot-type/${
            slotIconMap[slot.name]
          }`
        )
        s.image = image
        s.id = slot.id
        s.name = slot.name
        s.required = slot.required
        s.filters = slot.filters.allowedItems.map((item) => item.id)
        s.installed = null
        s.slotIndex = presetTree.nextSlotIndex
        presetTree.nextSlotIndex++

        return s
      })
    )
    return copySlots
  }

  const copyMod = (presetTree, mod) => {
    const copyMod = {
      id: mod.id,
      partIndex: presetTree.nextPartIndex,
      shortName: mod.shortName,
      backgroundColor: mod.backgroundColor,
      conflictingItems: mod.conflictingItems,
      width: mod.width,
      height: mod.height,
      properties: copyModProperties(mod),
    }
    presetTree.nextPartIndex += 1
    return copyMod
  }

  // attach mod
  const installMod = async (slotIndex, mod) => {
    // copy whole slot tree
    const copiedSlotTree = cloneDeep(slotTree)
    // search the target slot in the copied tree
    const slot = searchSlotBySlotIndex(copiedSlotTree, slotIndex)

    if (!mod.hasOwnProperty("slots")) {
      const newMod = copyMod(copiedSlotTree, mod)
      newMod.slots = await copyModSlots(copiedSlotTree, mod)
      slot.installed = newMod
    } else {
      const newMod = cloneDeep(mod)
      slot.installed = newMod
    }

    const newModList = getModIdsUnderWeapon(copiedSlotTree)
    const newConflictArr = conflictingModList.concat(mod.conflictingItems)

    setInstalledModList(newModList)
    setConflictingModList(newConflictArr)
    setSlotTree(copiedSlotTree)
  }

  // get or find part/slot
  const copyModProperties = (mod) => {
    const propName = [
      "centerOfImpact",
      "ergonomics",
      "recoilModifier",
      "accuracyModifier",
    ]
    const properties = {}
    for (const [key, value] of Object.entries(mod.properties)) {
      if (propName.includes(key)) {
        properties[key] = value
      }
    }
    return properties
  }

  const searchSlotBySlotIndex = (tree, slotIndex) => {
    const slots = tree.slots
    if (slots.length > 0) {
      for (let i = 0; i < slots.length; i++) {
        if (slots[i].slotIndex === slotIndex) {
          return slots[i]
        } else if (slots[i].installed && slots[i].installed.slots.length > 0) {
          const result = searchSlotBySlotIndex(slots[i].installed, slotIndex)
          if (result) {
            return result
          }
        }
      }
    }
  }

  const searchSlotByPartIndex = (tree, partIndex) => {
    const slots = tree.slots
    if (slots.length > 0) {
      for (let i = 0; i < slots.length; i++) {
        if (slots[i].installed) {
          if (slots[i].installed.partIndex === partIndex) {
            return slots[i]
          } else if (slots[i].installed.slots.length > 0) {
            const result = searchSlotByPartIndex(slots[i].installed, partIndex)
            if (result) {
              return result
            }
          }
        }
      }
    }
  }

  const getModIdsUnderWeapon = (part) => {
    let result = []
    const slots = part.slots
    if (slots.length > 0) {
      for (let i = 0; i < slots.length; i++) {
        if (slots[i].installed) {
          const installedMod = slots[i].installed
          result.push(installedMod.id)
          result = result.concat(getModIdsUnderWeapon(installedMod))
        }
      }
    }
    return result
  }

  const getModsUnderWeapon = (part) => {
    let result = []
    const slots = part.slots
    if (slots.length > 0) {
      for (let i = 0; i < slots.length; i++) {
        if (slots[i].installed) {
          const installedMod = slots[i].installed
          result.push(installedMod)
          result = result.concat(getModsUnderWeapon(installedMod))
        }
      }
    }
    return result
  }

  const getSlotsUnderWeapon = (part) => {
    let result = []
    const slots = part.slots
    if (slots.length > 0) {
      for (let i = 0; i < slots.length; i++) {
        result.push(slots[i])
        if (slots[i].installed) {
          result = result.concat(getSlotsUnderWeapon(slots[i].installed))
        }
      }
    }
    return result
  }

  const findSlotUnderWeapon = (part, slotName) => {
    let result = []
    const slots = part.slots
    if (slots.length > 0) {
      for (let i = 0; i < slots.length; i++) {
        if (slots[i].name === slotName) {
          result.push(slots[i])
        }
        if (slots[i].installed) {
          result = result.concat(
            findSlotUnderWeapon(slots[i].installed, slotName)
          )
        }
      }
    }
    return result
  }

  const checkNoChildPart = (mod) => {
    mod.slots.forEach((slot) => {
      if (slot.installed) {
        return false
      }
    })
    return true
  }

  // remove / move part
  const removeModFromSlotTree = (slotTree, partIndex) => {
    const newSlotTree = cloneDeep(slotTree)
    const slot = searchSlotByPartIndex(newSlotTree, partIndex)
    slot.installed = null
    setSlotTree(newSlotTree)
  }

  const moveModToAnotherSlot = (slotTree, partIndex, nextSlotIndex) => {
    const newSlotTree = cloneDeep(slotTree)
    const curSlot = searchSlotByPartIndex(newSlotTree, partIndex)
    const hasNoChild = checkNoChildPart(curSlot.installed)
    if (hasNoChild && curSlot.slotIndex !== nextSlotIndex) {
      const nextSlot = searchSlotBySlotIndex(newSlotTree, nextSlotIndex)
      nextSlot.installed = curSlot.installed
      curSlot.installed = null
      setSlotTree(newSlotTree)
    }
  }

  // property calculation
  const getTotalProperties = (baseWeaponId, presetTree) => {
    const curWeapon = weapons[baseWeaponId]
    const installedMods = getModsUnderWeapon(presetTree)
    const baseCenterOfImpact = getBaseCenterOfImpact(curWeapon, presetTree)
    const finalCenterOfImpact = calculateAccuracy(
      baseCenterOfImpact,
      installedMods
    )
    const ammoFactor = calculateAmmoFactor(getAmmoAccr())
    const newBaseProp = {
      accuracy: calculateMOA(finalCenterOfImpact * ammoFactor),
      ergonomics: calculateErgo(curWeapon, installedMods),
      ...calculateRecoil(curWeapon, installedMods),
    }

    return newBaseProp
  }

  const getBaseCenterOfImpact = (curWeapon, slotTree) => {
    const barrelSlot = findSlotUnderWeapon(slotTree, "Barrel")
    let installedBarrel = null
    barrelSlot.forEach((slot) => {
      if (slot.installed) {
        installedBarrel = slot.installed
      }
    })
    if (installedBarrel) {
      return installedBarrel.properties.centerOfImpact
    } else {
      return curWeapon.properties.centerOfImpact
    }
  }

  const calculateAccuracy = (baseCenterOfImpact, installedMods) => {
    let accuracy = 0
    installedMods.forEach((mod) => {
      if (mod.properties.hasOwnProperty("accuracyModifier")) {
        accuracy += mod.properties.accuracyModifier
      }
    })
    return baseCenterOfImpact * (1 + -accuracy)
  }

  const getAmmoAccr = () => {
    const chamber = slotTree.slots.find(
      (slot) => slot.name === "chamber" && slot.installed
    )
    if (chamber) {
      return chamber.installed.properties.accuracyModifier
    } else {
      return weapons[curWeaponId].defAmmo.accuracyModifier
    }
  }

  const calculateAmmoFactor = (ammoAccr) => {
    if (ammoAccr <= 0) {
      return (100 + Math.abs(ammoAccr)) / 100
    } else {
      return 100 / (100 + ammoAccr)
    }
  }

  const calculateMOA = (centerOfImpact) => {
    return Math.round(((100 * centerOfImpact) / 2.9089) * 100) / 100
  }

  const calculateErgo = (weapon, installedMods) => {
    let ergo = weapon.properties.ergonomics

    installedMods.forEach((mod) => {
      if (mod.properties.hasOwnProperty("ergonomics")) {
        ergo += mod.properties.ergonomics
      }
    })
    return ergo
  }

  const calculateRecoil = (weapon, installedMods) => {
    let vRecoil = weapon.properties.recoilVertical
    let hRecoil = weapon.properties.recoilHorizontal
    let modifier = 0

    installedMods.forEach((mod) => {
      if (mod.properties.hasOwnProperty("recoilModifier")) {
        modifier += mod.properties.recoilModifier
      }
    })

    return {
      vRecoil: Math.round(vRecoil * (1 + modifier)),
      hRecoil: Math.round(hRecoil * (1 + modifier)),
    }
  }

  // mod filter handles
  const selectHandbookHandle = (cat) => {
    if (cat === "All") {
      setCurrentDepth(-1)
    } else {
      for (let i = 0; i < modCategoriesLayer.length; i++) {
        if (modCategoriesLayer[i].includes(cat)) {
          setCurrentDepth(i)
          break
        }
      }
    }

    // modify handbook filter
    const newFilter = cloneDeep(filter)
    delete newFilter.keyword
    newFilter.handbook = cat
    if (cat !== modHandbook) {
      newFilter.page = 1
    }
    resetSearchHandle()
    setFilter(newFilter)
  }

  const setPageNumHandle = (pageNum) => {
    if (filter.page !== pageNum) {
      // modify page filter
      const newFilter = cloneDeep(filter)
      newFilter.page = pageNum
      setFilter(newFilter)
    }
  }

  // search enter handle
  const enterPressHandle = (e) => {
    if (e.keyCode == 13) {
      if (searchKeyword.length > 0) {
        const newFilter = cloneDeep(filter)
        newFilter.keyword = searchKeyword
        setFilter(newFilter)
      }
    }
  }

  const resetSearchHandle = () => {
    setSearchKeyword("")
    setFilter({
      page: 1,
      handbook: "All",
    })
  }

  return (
    <Container className="my-5">
      <SavePresetModal
        show={showSaveModal}
        closeHandle={showSavePresetModalHandle}
        confirmHandle={savePreset.bind(null, slotTree)}
        presets={presets}
      />
      {weaponName && <h1 className="mb-5">{weaponName}</h1>}
      {presetName && <h1 className="mb-5">{presetName}</h1>}

      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
        <ItemDragLayer />

        {/* mod slots */}
        <div className="mb-5 bg-black5">
          <div className="position-relative">
            <div className="position-absolute top-0 start-0 p-2">
              {Object.keys(user).length > 0 && (
                <Image
                  role="button"
                  src={buildSaveIcon}
                  onClick={showSavePresetModalHandle}
                  title="Save preset"
                />
              )}
            </div>
            <div className="position-absolute top-0 end-0 px-2 bg-black user-select-none">
              Drag and drop
            </div>
            <div
              className="position-absolute"
              style={{ left: "-34px", bottom: "32px" }}
            >
              <LeftSideButton
                icon={sortingTableIcon}
                translateX={3}
                translateY={3}
                clickMethod={() => {
                  setOpenSortingTable(!openSortingTable)
                }}
                active={openSortingTable}
              />
            </div>

            <div className="p-5">
              {slotTree && (
                <WeaponSlotTree
                  slotTree={slotTree}
                  installMod={installMod}
                  installedModList={installedModList}
                  conflictingModList={conflictingModList}
                  moveMod={moveModToAnotherSlot.bind(null, slotTree)}
                  removeMod={removeModFromSlotTree.bind(null, slotTree)}
                />
              )}
              <div
                className="position-absolute end-0 translate-middle"
                style={{ zIndex: 1000 }}
              >
                <div className="d-flex">
                  <DroppableTrashCan />
                </div>
              </div>
            </div>
          </div>

          {/* weapon stats */}
          <div className="py-2 bg-black4">
            {totalWeaponProp && (
              <Row className="d-flex">
                <Col className="text-center sand1 tarkov-bold">
                  Accuracy : {totalWeaponProp.accuracy} MOA
                </Col>
                <Col className="text-center sand1 tarkov-bold">
                  Ergonomics : {totalWeaponProp.ergonomics}
                </Col>
                <Col className="text-center sand1 tarkov-bold">
                  Vertical recoil : {totalWeaponProp.vRecoil}
                </Col>
                <Col className="text-center sand1 tarkov-bold">
                  Horizontal recoil : {totalWeaponProp.hRecoil}
                </Col>
              </Row>
            )}
          </div>
        </div>

        <Collapse in={openSortingTable}>
          <div>
            <div className="mb-5">
              <DroppableSortingTable width={5} height={5} />
            </div>
          </div>
        </Collapse>

        {/* handbook category button */}
        <TarkovGuideButton
          onClick={() => {
            setShowHandbookFilter(!showHandbookFilter)
          }}
          className="mb-3"
        >
          <div className="p-2">Handbook filter</div>
        </TarkovGuideButton>
        <Collapse in={showHandbookFilter}>
          <div>
            {modCategoriesLayer.map((layer) => {
              return (
                <div key={`layer_${layer}`} className="mb-3 py-2 bg-black5">
                  {layer.map((cat) => {
                    const parentCat = findTopLevelKey(modCategories, cat)
                    return (
                      <button
                        key={cat}
                        className={classNames(
                          "mx-1",
                          "text-white",
                          { "bg-green1": parentCat === "Gear mods" },
                          { "bg-blue1": parentCat === "Functional mods" },
                          { "bg-orange2": parentCat === "Vital parts" }
                        )}
                        onClick={selectHandbookHandle.bind(null, cat)}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </Collapse>

        {/* breadcrumb */}
        <div>
          <GuidingBreadcrumb
            paths={breadcrumbPath}
            dropdownContent={breadcrumbDropdown}
          />
        </div>

        {/* search bar */}
        <InputGroup size="lg" className="py-3">
          <Form.Control
            className="text-center"
            // size="lg"
            type="text"
            placeholder="Enter mod name"
            onChange={(e) => {
              setSearchKeyword(e.target.value)
            }}
            value={searchKeyword}
            onKeyDown={enterPressHandle}
          />
          {searchKeyword !== "" && (
            <Button variant="danger" onClick={resetSearchHandle}>
              <XLg />
            </Button>
          )}
        </InputGroup>

        {/* mod list */}
        <div>
          {fetchedModFilter.hasOwnProperty(filter.handbook) &&
            fetchedModFilter[filter.handbook].hasOwnProperty(filter.page) && (
              <Row xs={2} md={4} lg={5} className="g-2 mb-3">
                {currentModFilter.map((modId) => {
                  const copyMod = cloneDeep(fetchedMods[modId])
                  return (
                    <Col key={modId} className="d-flex align-items-stretch">
                      <div className="d-flex justify-content-center p-2 bg-dark w-100">
                        <DraggableMod mod={copyMod} type="mod">
                          <ItemMultiGrid
                            itemId={copyMod.id}
                            shortName={copyMod.shortName}
                            bgColor={copyMod.backgroundColor}
                            resolution={64}
                            width={copyMod.width}
                            height={copyMod.height}
                          />
                        </DraggableMod>
                      </div>
                    </Col>
                  )
                })}
              </Row>
            )}
        </div>
        <div className="d-flex justify-content-center mb-5">
          <Paginate
            page={modPage}
            pages={modPages}
            usePageNum={true}
            usePrevNext={true}
            useFirstLast={true}
            setPageNum={setPageNumHandle}
          />
        </div>
      </DndProvider>
    </Container>
  )
}

export { WeaponBuildScreen }
