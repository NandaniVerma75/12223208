export const generateShortcode = () => Math.random().toString(36).substring(2, 8);

export const isCodeUnique = (code, data) => !(code in data);

export const createShortcode = (preferredCode, existingData) => {
  if (preferredCode) {
    if (!isCodeUnique(preferredCode, existingData)) throw new Error('Shortcode already exists');
    return preferredCode;
  }

  let code = generateShortcode();
  while (!isCodeUnique(code, existingData)) {
    code = generateShortcode();
  }
  return code;
};
