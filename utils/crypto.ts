// Simple Base64 encoding to simulate encryption.
// In a real app, use a proper crypto library like crypto-js.

export const encrypt = (text: string): string => {
  try {
    // A simple check to avoid trying to encode non-stringified objects
    if (typeof text !== 'string') {
        console.error("Encryption target is not a string:", text);
        return text;
    }
    return btoa(text);
  } catch (e) {
    console.error("Encryption failed", e);
    return text; // Fallback
  }
};

export const decrypt = (data: string): string => {
  try {
    return atob(data);
  } catch (e) {
    console.error("Decryption failed, returning raw data", e);
    return data; // Fallback
  }
};
