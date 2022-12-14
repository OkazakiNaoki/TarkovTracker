export const getIndexOfMatchFieldObjArr = (arr, field, value) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][field] === value) {
      return i
    }
  }
  return -1
}

// if match arr[i]["a"], return arr[i]["b"]
export const getAnotherFieldOfMatchFieldObjArr = (
  arr,
  field,
  value,
  field2
) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][field] === value) {
      return arr[i][field2]
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
