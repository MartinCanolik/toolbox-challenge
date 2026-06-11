process.env.API_KEY = 'test-secret'

const { expect } = require('chai')
const nock = require('nock')
const request = require('supertest')
const app = require('../src/app')

const BASE_URL = 'https://echo-serv.tbxnet.com'
const AUTH_HEADER = `Bearer ${process.env.API_KEY}`

const VALID_CSV = [
  'file,text,number,hex',
  'test1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765',
  'test1.csv,AtjW,6,d33a8ca5d36d3106219f66f939774cf5'
].join('\n')

const MIXED_CSV = [
  'file,text,number,hex',
  'test2.csv,GoodLine,123,aaaabbbbccccddddaaaabbbbccccdddd',
  'test2.csv,BadLine,',
  'test2.csv,AnotherGood,456,11112222333344441111222233334444'
].join('\n')

before(() => {
  nock.disableNetConnect()
  nock.enableNetConnect('127.0.0.1')
})
after(() => nock.enableNetConnect())

afterEach(() => {
  nock.cleanAll()
})

describe('GET /files/data', () => {
  it('returns formatted data from valid files', async () => {
    nock(BASE_URL)
      .get('/v1/secret/files')
      .matchHeader('authorization', AUTH_HEADER)
      .reply(200, { files: ['test1.csv'] })

    nock(BASE_URL)
      .get('/v1/secret/file/test1.csv')
      .matchHeader('authorization', AUTH_HEADER)
      .reply(200, VALID_CSV)

    const res = await request(app).get('/files/data')

    expect(res.status).to.equal(200)
    expect(res.body).to.be.an('array').with.length(1)
    expect(res.body[0].file).to.equal('test1.csv')
    expect(res.body[0].lines).to.have.length(2)
    expect(res.body[0].lines[0]).to.deep.equal({
      text: 'RgTya',
      number: 64075909,
      hex: '70ad29aacf0b690b0467fe2b2767f765'
    })
  })

  it('discards invalid lines and keeps valid ones', async () => {
    nock(BASE_URL)
      .get('/v1/secret/files')
      .reply(200, { files: ['test2.csv'] })

    nock(BASE_URL)
      .get('/v1/secret/file/test2.csv')
      .reply(200, MIXED_CSV)

    const res = await request(app).get('/files/data')

    expect(res.status).to.equal(200)
    expect(res.body[0].lines).to.have.length(2)
  })

  it('ignores files that fail to download', async () => {
    nock(BASE_URL)
      .get('/v1/secret/files')
      .reply(200, { files: ['test1.csv', 'broken.csv'] })

    nock(BASE_URL)
      .get('/v1/secret/file/test1.csv')
      .reply(200, VALID_CSV)

    nock(BASE_URL)
      .get('/v1/secret/file/broken.csv')
      .reply(500, 'Internal Error')

    const res = await request(app).get('/files/data')

    expect(res.status).to.equal(200)
    expect(res.body).to.have.length(1)
    expect(res.body[0].file).to.equal('test1.csv')
  })

  it('omits files that have no valid lines', async () => {
    const emptyValidCsv = 'file,text,number,hex\ntest3.csv,Ftjf,'

    nock(BASE_URL)
      .get('/v1/secret/files')
      .reply(200, { files: ['test3.csv'] })

    nock(BASE_URL)
      .get('/v1/secret/file/test3.csv')
      .reply(200, emptyValidCsv)

    const res = await request(app).get('/files/data')

    expect(res.status).to.equal(200)
    expect(res.body).to.deep.equal([])
  })

  it('returns content-type application/json', async () => {
    nock(BASE_URL)
      .get('/v1/secret/files')
      .reply(200, { files: [] })

    const res = await request(app).get('/files/data')

    expect(res.headers['content-type']).to.match(/application\/json/)
  })
})

describe('GET /files/data?fileName=', () => {
  it('returns only the requested file', async () => {
    nock(BASE_URL)
      .get('/v1/secret/files')
      .reply(200, { files: ['test1.csv', 'test2.csv'] })

    nock(BASE_URL)
      .get('/v1/secret/file/test1.csv')
      .reply(200, VALID_CSV)

    const res = await request(app).get('/files/data?fileName=test1.csv')

    expect(res.status).to.equal(200)
    expect(res.body).to.have.length(1)
    expect(res.body[0].file).to.equal('test1.csv')
  })

  it('returns empty array when fileName does not exist', async () => {
    nock(BASE_URL)
      .get('/v1/secret/files')
      .reply(200, { files: ['test1.csv'] })

    const res = await request(app).get('/files/data?fileName=nonexistent.csv')

    expect(res.status).to.equal(200)
    expect(res.body).to.deep.equal([])
  })
})

describe('GET /files/list', () => {
  it('returns the raw list of files', async () => {
    nock(BASE_URL)
      .get('/v1/secret/files')
      .reply(200, { files: ['test1.csv', 'test2.csv', 'test3.csv'] })

    const res = await request(app).get('/files/list')

    expect(res.status).to.equal(200)
    expect(res.body).to.deep.equal({ files: ['test1.csv', 'test2.csv', 'test3.csv'] })
  })
})
