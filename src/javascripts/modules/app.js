/**
 *  User Notes app
 **/

import I18n from '../../javascripts/lib/i18n'
import Manager from './manager'
import { resizeContainer, render } from '../../javascripts/lib/helpers'
import getNotesTemplate from '../../templates/notes'
import getInstallationTemplate from '../../templates/installation'

const MAX_HEIGHT = 1000

class App {
  constructor (client) {
    this._client = client

    this.states = {
      currentUserName: '',
      userId: '',
      notes: [],
      relationships: [],
    }

    this._manager = new Manager(client, this)
    this._appContainer = $('#app-container')

    this._appContainer.on('submit', '#add-note-form', this._addNote.bind(this))
    this._appContainer.on('click', 'li.user-note a', this._deleteNote.bind(this))
    this._appContainer.on('click', '#install-data-structure', this._createSchema.bind(this))

    this.init()
  }

  /**
   * Get currentUser and requesterId from Zaf client.
   * Load translations.
   * Fetch and render notes.
   */
  async init () {
    this.states.userId = (await this._client.get('ticket.requester.id'))['ticket.requester.id']
    const currentUser = (await this._client.get('currentUser')).currentUser
    this.states.currentUserName = currentUser.name

    I18n.loadTranslations(currentUser.locale)

    this._manager.fetchNotes()
  }

  /**
   * Set notes in state and render.
   */
  setNotes (notes) {
    // Add notes to state
    this.states.notes = notes
    // Render
    this._renderNotes()
    // Reset form
    this._getAddNoteText().val('')
    this._getAddNoteButton().removeClass('is-disabled');
  }

  /**
   * Set relationship in state.
   */
  setRelationships (relationships) {
    this.states.relationships = relationships
  }

  /**
   * Render installation instructions to create Sunshine data structure.
   */
  showInstallation () {
    this._appContainer.html(getInstallationTemplate(this.states))
    resizeContainer(this._client, MAX_HEIGHT)
  }

  /**
   * Render installation error.
   */
  showInstallationError () {
    // Show error
    this._getInstallationError().show()
    // Enable button
    this._getCreateSchemaButton().removeClass('is-disabled')
    resizeContainer(this._client, MAX_HEIGHT)
  }

  /**
   * Create data strcuture using Manager.
   */
  _createSchema(event) {
    event.preventDefault()
    // Hide previous error
    this._getInstallationError().hide()
    // Disable button
    this._getCreateSchemaButton().addClass('is-disabled')
    // Create schema
    this._manager.createSchema()
  }

  /**
   * Create note using Manager.
   */
  _addNote(event) {
    event.preventDefault()
    this._getAddNoteButton().addClass('is-disabled');
    this._manager.createNote(this._getAddNoteText().val())
  }

  /**
   * Delete note using Manager.
   */
  _deleteNote(event) {
    event.preventDefault()
    const li = $(event.target).parent()
    const noteId = li.data("note-id")
    li.html('Removing...')
    this._manager.deleteNote(noteId, this._getRelationshipId(noteId))
  }

  /**
   * Get text-area jquery element.
   */
  _getAddNoteText () {
    return this._appContainer.find('#add-note-text')
  }

  /**
   * Get form button jquery element.
   */
  _getAddNoteButton () {
    return this._appContainer.find('#add-note-button')
  }

  /**
   * Get form button jquery element.
   */
  _getCreateSchemaButton () {
    return this._appContainer.find('#install-data-structure')
  }

  /**
   * Get form button jquery element.
   */
  _getInstallationError () {
    return this._appContainer.find('#installation-error')
  }

  /**
   * Get relationshipId from noteId using the relationships collection in states.
   */
  _getRelationshipId (noteId) {
    return this.states.relationships.find(relationship => relationship.target === noteId).id;
  }

  /**
   * Render notes template that includes the list of notes and the form to add.
   */
  _renderNotes () {
    this._appContainer.html(getNotesTemplate(this.states))
    resizeContainer(this._client, MAX_HEIGHT)
  }
}

export default App
