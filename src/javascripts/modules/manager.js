/**
 *  Manage Notes
 **/

// API paths
const OBJECT_RECORDS_URL = '/api/sunshine/objects/records';
const RELATIONSHIP_RECORDS_URL = '/api/sunshine/relationships/records';
const OBJECT_TYPES_URL = '/api/sunshine/objects/types';
const RELATIONSHIP_TYPES_URL = '/api/sunshine/relationships/types';

// Types
const OBJECT_TYPE = 'user_note';
const RELATIONSHIP_TYPE = 'user_notes';

class Manager {
  /**
   * Manager constructor
   * @param {ZAFClient} client ZAFClient object
   * @param {App} app object
   */
  constructor (client, app) {
    this._client = client;
    this._app = app;
  }

  /**
   * Fetch note relationships then objects.
   */
  fetchNotes () {
    this._client.request(`${OBJECT_RECORDS_URL}/zen:user:${this._app.states.userId}/relationships/${RELATIONSHIP_TYPE}`)
      .then(this._fetchNoteObjects.bind(this))
      .catch(this._showInstallation.bind(this))
  }

  /**
   * Create sunshine data structure.
   */
  createSchema () {
    var settings = {
      url: OBJECT_TYPES_URL,
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        "data": {
          "key": OBJECT_TYPE,
          "schema": {
            "properties": {
              "text": {
                "type": "string",
                "description": "Note"
              }
            },
            "required": [
              "text"
            ]
          }
        }
      })
    };

    this._client.request(settings)
      .then(this._createRelationshipType.bind(this))
      .catch(this._showInstallationError.bind(this))
  }

  /**
   * Create note object then relationship.
   * @param {String} note text.
   */
  createNote (text) {
    var settings = {
      url: OBJECT_RECORDS_URL,
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        "data": {
          "type": OBJECT_TYPE,
          "attributes": {
            "text": text
          }
        }
      })
    };

    this._client.request(settings)
      .then(this._createRelationship.bind(this))
      .catch(this._handleError.bind(this))
  }

  /**
   * Delete note relationship then object.
   * @param {String} note id.
   * @param {String} relationship id.
   */
  deleteNote (noteId, relationshipId) {
    var settings = {
      url: RELATIONSHIP_RECORDS_URL + '/' + relationshipId,
      type: 'DELETE'
    }

    this._client.request(settings)
      .then(this._deleteObject.bind(this, noteId))
      .catch(this._handleError.bind(this))
  }

  /**
   * Create note relationship between object and user.
   * @param {Hash} response received after creating note object.
   */
  _createRelationship (response) {
    var settings = {
      url: RELATIONSHIP_RECORDS_URL,
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        "data": {
          "relationship_type": RELATIONSHIP_TYPE,
          "source": "zen:user:" + this._app.states.userId,
          "target": response.data.id
        }
      })
    };

    this._client.request(settings)
      .then(this.fetchNotes.bind(this))
      .catch(this._handleError.bind(this))
  }

  /**
   * Delete note object.
   * @param {String} note id.
   */
  _deleteObject (noteId) {
    var settings = {
      url: OBJECT_RECORDS_URL + '/' + noteId,
      type: 'DELETE'
    };

    this._client.request(settings)
      .then(this.fetchNotes.bind(this))
      .catch(this._handleError.bind(this))
  }

  /**
   * Fetch note objects.
   * @param {Hash} response received after fetching relationships.
   */
  _fetchNoteObjects (response) {
    this._app.setRelationships(response.data);
    if (response.data.length !== 0) {
      this._client.request(`${OBJECT_RECORDS_URL}?ids=${response.data.map(relationship => relationship.target)}`)
        .then(this._setNotes.bind(this))
        .catch(this._handleError.bind(this))
    } else {
      this._setNotes(response);
    }
  }

  /**
   * Show installation when we receive 'not found' while fetching notes.
   * @param {Hash} response with failure received while fetching relationships.
   */
  _showInstallation (response) {
    if (response.status === 404) {
      this._app.showInstallation()
    } else {
      this._handleError(response)
    }
  }

  /**
   * Show installation error when something fails during schema creation.
   */
  _showInstallationError () {
    this._app.showInstallationError()
  }

  /**
   * Set notes in app to render the new list.
   * @param {Hash} response received after fetching note objects.
   */
  _setNotes (response) {
    this._app.setNotes(response.data);
  }

  /**
   * Create sunshine relationship type: user_notes.
   */
  _createRelationshipType () {
    var settings = {
      url: RELATIONSHIP_TYPES_URL,
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        "data": {
          "key": RELATIONSHIP_TYPE,
          "source": "zen:user",
          "target": [
            OBJECT_TYPE
          ]
        }
      })
    };

    this._client.request(settings)
      .then(this.fetchNotes.bind(this))
      .catch(this._handleError.bind(this))
  }

  /**
   * Handle error.
   * @param {Hash} response with failure received in the different requests.
   */
  _handleError (response) {
    console.error('There was an error')
    console.log(response)
  }
}

export default Manager
