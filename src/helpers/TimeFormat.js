export const getHMSfromS = (s) => {
  let H = Math.floor(s / 3600)
  let M = Math.floor((s % 3600) / 60)
  let S = (s % 3600) % 60
  return "" + H + "hr " + M + "min " + S + "s"
}
