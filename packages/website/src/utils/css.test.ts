import { getRGBColor, stringToBackground } from './css'

describe('getRGBColor', () => {
  it('should convert hex to rgb', () => {
    expect(getRGBColor('#FFFFFF')).toEqual('255, 255, 255')
    expect(getRGBColor('#000000')).toEqual('0, 0, 0')
    expect(getRGBColor('#666EFF')).toEqual('102, 110, 255')
  })
})

describe('stringToBackground', () => {
  it('should convert a given string to a valid CSS property by checking the content of the given string', () => {
    expect(stringToBackground('#000000')).toEqual({ backgroundColor: '#000000' })
    expect(stringToBackground('linear-gradient(0.25turn, #3f87a6, #ebf8e1, #f69d3c)')).toEqual({ backgroundImage: 'linear-gradient(0.25turn, #3f87a6, #ebf8e1, #f69d3c)' })
    expect(stringToBackground('https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png')).toEqual({ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png")' })
    expect(stringToBackground('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=')).toEqual({ backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=")' })
  })
})