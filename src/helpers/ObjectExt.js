// if object is not falsy and key exist
export const safeGet = (obj, key) => {
  return obj ? (obj.hasOwnProperty(key) ? obj[key] : false) : false
}
