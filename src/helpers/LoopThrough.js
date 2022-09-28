export const getIndexOfMatchFieldObjArr = (arr, field, value) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][field] === value) {
      return i
    }
  }
  return -1
}

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

export const haveAdditionalElementFromCompareArr = (
  objArr,
  field,
  compareArr
) => {
  const arr = objArr.map((obj) => obj[field])
  return arr.some((el) => !compareArr.includes(el))
}
