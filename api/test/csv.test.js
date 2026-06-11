const { expect } = require('chai')
const { parseAndValidate } = require('../src/utils/csv')

describe('parseAndValidate', () => {
  it('parses valid lines correctly', () => {
    const raw = [
      'file,text,number,hex',
      'test1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765',
      'test1.csv,AtjW,6,d33a8ca5d36d3106219f66f939774cf5'
    ].join('\n')

    const result = parseAndValidate(raw)

    expect(result).to.have.length(2)
    expect(result[0]).to.deep.equal({
      file: 'test1.csv',
      text: 'RgTya',
      number: 64075909,
      hex: '70ad29aacf0b690b0467fe2b2767f765'
    })
    expect(result[0].number).to.be.a('number')
  })

  it('skips header line', () => {
    const raw = 'file,text,number,hex\ntest1.csv,abc,123,70ad29aacf0b690b0467fe2b2767f765'
    const result = parseAndValidate(raw)
    expect(result).to.have.length(1)
  })

  it('discards lines with missing fields', () => {
    const raw = [
      'file,text,number,hex',
      'test3.csv,Ftjf,',
      'test3.csv,X,93429,7ca2860955a97c86a6764fb720f1f60a'
    ].join('\n')

    const result = parseAndValidate(raw)
    expect(result).to.have.length(1)
    expect(result[0].text).to.equal('X')
  })

  it('discards lines where number is not numeric', () => {
    const raw = [
      'file,text,number,hex',
      'test1.csv,hello,notanumber,70ad29aacf0b690b0467fe2b2767f765'
    ].join('\n')

    expect(parseAndValidate(raw)).to.have.length(0)
  })

  it('discards lines where hex is not 32 hex chars', () => {
    const raw = [
      'file,text,number,hex',
      'test1.csv,hello,123,shortHex'
    ].join('\n')

    expect(parseAndValidate(raw)).to.have.length(0)
  })

  it('handles CRLF line endings', () => {
    const raw = 'file,text,number,hex\r\ntest1.csv,abc,1,70ad29aacf0b690b0467fe2b2767f765\r\n'
    const result = parseAndValidate(raw)
    expect(result).to.have.length(1)
  })

  it('returns empty array for empty file', () => {
    expect(parseAndValidate('')).to.have.length(0)
    expect(parseAndValidate('file,text,number,hex')).to.have.length(0)
  })

  it('returns number as Number type', () => {
    const raw = 'file,text,number,hex\ntest1.csv,abc,42,70ad29aacf0b690b0467fe2b2767f765'
    const result = parseAndValidate(raw)
    expect(result[0].number).to.equal(42)
    expect(result[0].number).to.be.a('number')
  })
})
