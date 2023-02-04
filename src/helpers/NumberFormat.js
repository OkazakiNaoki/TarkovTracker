export const convertKiloMega = (value) => {
  if (value > 1000000) {
    return "" + value / 1000000 + "M"
  } else if (value > 1000) {
    return "" + value / 1000 + "K"
  } else {
    return "" + value
  }
}

export const convertRomanNumeral = (value) => {
  var roman = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  }
  let str = ""

  // start from larger numeral
  for (const k of Object.keys(roman)) {
    if (value >= roman[k]) {
      let q = Math.floor(value / roman[k])
      value -= q * roman[k]
      str += k.repeat(q)
    } else {
      continue
    }
  }

  return str
}
