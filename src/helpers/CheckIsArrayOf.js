export const isArrayAndEmpty = (arr) => {
  if (Array.isArray(arr) && arr.length === 0) return true
  else return false
}

export const isArrayAndNotEmpty = (arr) => {
  if (Array.isArray(arr) && arr.length > 0) return true
  else return false
}

export const isStringArray = (arr) => {
  if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === "string")
    return true
  else return false
}

export const isObjectArray = (arr) => {
  if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === "object")
    return true
  else return false
}

export const isNumArrayArray = (arr) => {
  if (
    Array.isArray(arr) &&
    arr.length !== 0 &&
    Array.isArray(arr[0]) &&
    arr[0].length !== 0 &&
    typeof arr[0][0] === "number"
  ) {
    return true
  } else return false
}
