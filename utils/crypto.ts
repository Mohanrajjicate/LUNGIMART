/**
 * Simple Base64 encoding to mimic the server's password "encryption".
 * In a real application, never store passwords this way. Use a secure hashing algorithm.
 * @param text The text to encode.
 * @returns The Base64 encoded string.
 */
export const encrypt = (text: string): string => {
    try {
      return btoa(text);
    } catch (e) {
      console.error("Failed to encode string with btoa:", e);
      return text;
    }
};
