/**
 * @module
 * Complements class is a static class to handle string (binary) operations of
 * complement (used to make a formated binary string from a not formated one).
 * @memberof bfcp-lib
 */

/**
 * Complements the binary string with '0' at it begin until have reached the
 * necessary string length.
 * @param  binary The binary string
 * @param  length The necessary length
 * @return        The binary string with the correct length
 */
export function complementBinary(val: number, length: number) {
  const binary = val.toString(2);
  const complement = length - binary.length;
  if (complement <= 0) {
    return binary;
  }
  const complementString = "0".repeat(complement);
  return complementString + binary;
}

/**
 * Complements the binary string with 8 bits of '0' at it end have reached
 * the 32bits format. (padding)
 * @param  content The binary string
 * @return         The binary string with the correct format
 */
export function complementPadding(content: string) {
  while (content.length < 100000 && content.length % 32 !== 0) {
    content = content + "00000000";
  }
  return content;
}
