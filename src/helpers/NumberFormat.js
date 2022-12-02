export const convertKiloMega = (value) => {
  if (value > 1000000) {
    return "" + value / 1000000 + "M"
  } else if (value > 1000) {
    return "" + value / 1000 + "K"
  } else {
    return "" + value
  }
}
