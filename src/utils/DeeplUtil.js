export async function fetchLanguages(authenticationKey) {
  const requestOptions = {
    method: 'GET'
  };

  const url = getUrl('/v2/languages', 'https://api-free.deepl.com', [
    [ 'auth_key', authenticationKey ]
  ]);

  const response = await fetch(url, requestOptions);

  if (response.status >= 200 && response.status <= 299) {
    const resultJSON = await response.json();

    console.log('fetched languages', resultJSON);

    return resultJSON.map(language => {
      return {
        ...language,
        language: language.language.toLowerCase()
      };
    });
  } else {
    throw new Error('Could not fetch supported languages.');
  }
}

export async function fetchTranslations(sourceTranslationsJSON, sourceLanguage, targetLanguage, authenticationKey) {
  const requestOptions = {
    method: 'POST'
  };

  const url = getUrl('/v2/translate', 'https://api-free.deepl.com', [
    [ 'auth_key', authenticationKey ],
    [ 'source_lang', sourceLanguage ? sourceLanguage.toUpperCase() : 'EN' ],
    [ 'target_lang', targetLanguage.toUpperCase() ],
    ...Object.values(sourceTranslationsJSON).map(translation => {
      return [ 'text', translation ];
    })
  ]);

  const response = await fetch(url, requestOptions);

  const resultJSON = await response.json();

  console.log('fetched translations', resultJSON);

  const sourceTranslationsJSONKeys = Object.keys(sourceTranslationsJSON);

  const targetTranslationsJSON = Object.values(resultJSON.translations).reduce((targetTranslationsJSON, translation, index) => {
    return {
      ...targetTranslationsJSON,
      [ sourceTranslationsJSONKeys[ index ] ]: translation.text
    };
  }, {});

  console.log(targetTranslationsJSON);

  return targetTranslationsJSON;
}

function getUrl(path, endpoint, searchParams) {
  const { origin } = new URL(endpoint);

  const url = new URL(path, origin);

  if (searchParams) {
    url.search = new URLSearchParams(searchParams);
  }

  return url.toString();
}