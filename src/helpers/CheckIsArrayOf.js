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
