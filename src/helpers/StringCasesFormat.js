export const titleCase = (str) => {
  return str[0].toUpperCase() + str.slice(1).toLowerCase()
}

export const insertSpaceIntoCamelCase = (str) => {
  return str.replace(
    /([^A-Za-z0-9\.\$])|([A-Z])(?=[A-Z][a-z])|([^\-\$\.0-9])(?=\$?[0-9]+(?:\.[0-9]+)?)|([0-9])(?=[^\.0-9])|([a-z])(?=[A-Z])/g,
    "$2$3$4$5 "
  )
}
