/*
  TODO: Make Jest work with jQuery and make these tests pass.
*/

/* eslint-env jest, browser */
import App from '../src/javascripts/modules/app'
import { CLIENT, NOTES } from './mocks/mock'
import createRangePolyfill from './polyfills/createRange'

jest.mock('../src/javascripts/lib/i18n', () => {
  return {
    loadTranslations: jest.fn(),
    t: key => key
  }
})

if (!document.createRange) {
  createRangePolyfill()
}

describe('User Notes App', () => {
  let errorSpy
  let app

  describe('Initialization Failure', () => {
    beforeEach((done) => {
      document.body.innerHTML = '<section data-main><img class="loader" src="spinner.gif"/></section>'
      CLIENT.request = jest.fn().mockReturnValueOnce(Promise.reject(new Error('a fake error')))

      app = new App(CLIENT, {})
      errorSpy = jest.spyOn(app, '_handleError')

      app.initializePromise.then(() => {
        done()
      })
    })

    it('should display an error message in the console', () => {
      expect(errorSpy).toBeCalled()
    })
  })

  describe('Initialization Success', () => {
    beforeEach((done) => {
      document.body.innerHTML = '<section data-main><img class="loader" src="spinner.gif"/></section>'
      CLIENT.request = jest.fn().mockReturnValueOnce(Promise.resolve(NOTES))
      CLIENT.invoke = jest.fn().mockReturnValue(Promise.resolve({}))

      app = new App(CLIENT, {})

      app.initializePromise.then(() => {
        done()
      })
    })

    it('should render main stage with data', () => {
      expect(document.querySelector('app-container')).not.toBe(null)
      expect(document.querySelector('h1').textContent).toBe('Ticket Requester')
    })

    it('should retrieve the organizations data', () => {
      expect(app.states.notes).toEqual(NOTES)
    })
  })
})
