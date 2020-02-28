import { templatingLoop as loop, escapeSpecialChars as escape } from '../javascripts/lib/helpers.js'
import I18n from '../javascripts/lib/i18n.js'

function noteMarkup (note) {
  return `
    <li class='user-note' data-note-id="${note.id}">
      ${escape(note.attributes.text)} <a href="#" class="delete-note">${I18n.t('notes.delete')}</a>
    </li>
  `
}

function notesMarkup (notes) {
  if (notes.length === 0) {
    return `<p class="empty-state">${I18n.t('notes.empty')}</p>`
  } else {
    return `
      <ul>${loop(notes, noteMarkup)}</ul>
    `
  }
}

export default function (args) {
  return `
    <div>
      <h1>${escape(args.currentUserName)}</h1>
      ${notesMarkup(args.notes)}
        <form id="add-note-form">
          <div><textarea class="c-txt__input c-txt__input--area" id="add-note-text" rows="4"></textarea></div>
          <input id="add-note-button" class="c-btn c-btn--primary" type="submit" value="Add note">
        </form>
    </div>
  `
}
