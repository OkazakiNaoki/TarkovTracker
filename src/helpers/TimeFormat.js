export const getHMSfromS = (s) => {
  let H = Math.floor(s / 3600)
  let M = Math.floor((s % 3600) / 60)
  let S = (s % 3600) % 60
  return { H, M, S }
}

export const formatInColon = (hms) => {
  for (const k in hms) {
    if (hms[k].toString().length < 2) {
      hms[k] = hms[k].toString().padStart(2, "0")
    }
  }
  return hms.H + ":" + hms.M + ":" + hms.S
}

export const formatInHoursMINsec = (hms) => {
  const hours = hms.H > 0 ? hms.H + " Hour(s) " : ""
  const min = hms.M > 0 ? hms.M + " MIN " : ""
  const sec = hms.S > 0 ? hms.S + " sec" : ""
  return hours + min + sec
}
