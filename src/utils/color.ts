export const getRGBColor = (hex: string) => {
  let color = hex.replace(/#/g, '')

  var r = parseInt(color.substring(0, 2), 16)
  var g = parseInt(color.substring(2, 4), 16)
  var b = parseInt(color.substring(4, 6), 16)

  return `${r}, ${g}, ${b}`
}
