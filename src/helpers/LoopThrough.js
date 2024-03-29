import { findKey } from "lodash"

export const findTopLevelKey = (obj, targetKey) => {
  let result = null
  for (let key in obj) {
    if (key === targetKey) {
      return key
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      const found = findTopLevelKey(obj[key], targetKey)
      if (found !== null) {
        result = key
        break
      }
    }
  }
  return result
}

export const findKeyPath = (obj, targetKey, path = []) => {
  for (let key in obj) {
    if (key === targetKey) {
      path.push(key)
      return path
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      const found = findKeyPath(obj[key], targetKey, path.concat(key))
      if (found !== null) {
        return found
      }
    }
  }
  return null
}

const resolvePath = (object, path, defaultValue) =>
  path.split(".").reduce((o, p) => (o && o[p] ? o[p] : defaultValue), object)

export const getIndexOfObjArrWhereFieldEqualTo = (arr, field, value) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][field] === value) {
      return i
    }
  }
  return -1
}

// if match arr[i]["a"], return arr[i]["b"]
export const getArrObjFieldBWhereFieldAEqualTo = (
  arr,
  fieldA,
  value,
  fieldB
) => {
  for (let i = 0; i < arr.length; i++) {
    if (resolvePath(arr[i], fieldA, null) === value) {
      return resolvePath(arr[i], fieldB, null)
    }
  }
  return null
}

// compareArr = [a,b], and if you have [a,b,c] then true
export const haveAdditionalElementFromCompareArr = (
  objArr,
  field,
  compareArr
) => {
  const arr = objArr.map((obj) => obj[field])
  return arr.some((el) => !compareArr.includes(el))
}

export const haveZeroPropertyEqualTo = (obj, value) => {
  for (const key in obj) {
    if (obj[key] === value) {
      return false
    }
  }
  return true
}
