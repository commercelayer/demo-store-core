export const getRGBColor = (hex: string): string => {
  let color = hex.replace(/#/g, '')

  var r = parseInt(color.substring(0, 2), 16)
  var g = parseInt(color.substring(2, 4), 16)
  var b = parseInt(color.substring(4, 6), 16)

  return `${r}, ${g}, ${b}`
}

export const stringToBackground = (string: string): React.CSSProperties => {
  type CSSPropertyKeys = keyof React.CSSProperties
  const hasImageUrl = string.startsWith('http') || string.startsWith('data:image')
  const key: CSSPropertyKeys = string.toLowerCase().includes('gradient') || hasImageUrl ? 'backgroundImage' : 'backgroundColor'
  const value = hasImageUrl ? `url("${string}")` : string

  return {
    [key]: value
  }
}