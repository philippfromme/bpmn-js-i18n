import ISO from 'iso-639-1';

export function validateIsoLanguageCode(isoLanguageCode = '') {
  if (isoLanguageCode.length && !ISO.validate(isoLanguageCode)) {
    return 'Must be valid ISO-631-1 language code.';

    // TODO(philippfromme): add link once properties panel supporting HTML is released
    // return 'Must be valid <a href="https://www.iso.org/iso-639-language-codes.html">ISO-631-1</a> language code.';
  }
}