import I18n from '../javascripts/lib/i18n.js'

export default function (args) {
  return `
    <div>
      <h1>${I18n.t('installation.title')}</h1>
      <h2>${I18n.t('installation.description')}</h2>
      <p>
        <input id="install-data-structure" class="c-btn c-btn--primary" type="submit" value="${I18n.t('installation.link')}">
      </p>
      <div id="installation-error" class="c-callout c-callout--error" style="display:none">
        ${I18n.t('installation.error')}
      </div>
    </div>
  `
}
