import { getRGBColor } from './color'

describe('getRGBColor', () => {
  it('should convert hex to rgb', () => {
    expect(getRGBColor('#FFFFFF')).toEqual('255, 255, 255')
    expect(getRGBColor('#000000')).toEqual('0, 0, 0')
    expect(getRGBColor('#666EFF')).toEqual('102, 110, 255')
  })
})
