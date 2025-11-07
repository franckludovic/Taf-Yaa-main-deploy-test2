export const lottieMappings = {
  treeDataLoader: 'Big Tree.json',
  generalDataLoader: 'Sandy Loading.json',
  loginLoader: 'Fingerprint Verification.json',
  dataNotFound1: 'Not Found.json',
  dataNotFound2: 'No-Data.json',
  treeCreationLoader: 'tree.json',
  treeCreationLoader2: 'Animated plant loader.json',
  signUploader: 'Thank you.json',
  noTreeFoundLoader: 'Brown Leaves.json',
};

// Simple in-memory cache
const _lottieCache = new Map();

// Vite: lazy import all JSON files in this directory as JSON modules
const _importers = import.meta.glob('./*.json', { as: 'json' });

export const getLottieUrl = (name) => {
  const fileName = lottieMappings[name];
  if (!fileName) {
    console.warn(`No Lottie mapping found for: ${name}`);
    return null;
  }

  try {
    return new URL(`./${fileName}`, import.meta.url).href;
  } catch (err) {
    console.error('Error resolving Lottie file URL:', err);
    return null;
  }
};

// Returns parsed JSON for the named animation. Uses Vite's dynamic imports (fast, avoids runtime fetch).
// Caches results in memory.
export const getLottieData = async (name) => {
  const fileName = lottieMappings[name];
  if (!fileName) {
    console.warn(`No Lottie mapping found for: ${name}`);
    return null;
  }

  if (_lottieCache.has(fileName)) {
    return _lottieCache.get(fileName);
  }

  const importerKey = `./${fileName}`;
  const importer = _importers[importerKey];
  if (!importer) {
    console.error(`Lottie file not found in assets folder: ${fileName}`);
    return null;
  }

  try {
    const json = await importer();
    // importers with { as: 'json' } return the JSON directly
    _lottieCache.set(fileName, json);
    return json;
  } catch (err) {
    console.error(`Error importing Lottie "${fileName}":`, err);
    return null;
  }
};

export const availableLottieNames = Object.keys(lottieMappings);
