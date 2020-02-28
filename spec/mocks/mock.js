export const CLIENT = {
  _origin: 'zendesk.com',
  get: (prop) => {
    if (prop === 'currentUser') {
      return Promise.resolve({
        currentUser: {
          locale: 'en',
          name: 'Ticket Requester'
        }
      })
    } else if (prop === 'ticket.requester.id') {
      return Promise.resolve({
        'ticket.requester.id': '123'
      })
    }
    return Promise.resolve({
      [prop]: null
    })
  }
}

export const NOTES = {
  data: [
    {
      attributes: { text: "note1" },
      created_at: "2019-10-03T02:55:24.135Z",
      external_id: null,
      id: "3ef9d06b-e589-11e9-acad-fde18abc89db",
      type: "user_note",
      updated_at: "2019-10-03T02:55:24.000Z",
    },
    {
      attributes: { text: "note2" },
      created_at: "2019-10-03T02:55:24.135Z",
      external_id: null,
      id: "ab0c226a-e589-11e9-80be-4b49d6f1a2c3",
      type: "user_note",
      updated_at: "2019-10-03T02:55:24.000Z",
    }
  ],
  errors: []
}
