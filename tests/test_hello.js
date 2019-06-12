const assert = require('assert');


const BFCP_HELLO = "20 0b 00 01 00 00 00 01 00 02 00 01 05 04 00 01 00 00";

/*
Binary Floor Control Protocol
    001. .... = Version(ver): 1
    ...0 .... = Transaction Responder (R): False
    .... 0... = Fragmentation (F): False
    Primitive: Hello (11)
    Payload Length: 1
    Conference ID: 1
    Transaction ID: 2
    User ID: 1
    0000 010. = Attribute Type: FloorID (2)
        .... ...1 = Mandatory bit(M): True
        Attribute Length: 4
        FLOOR-ID: 1
    0000 0000 0000 0000 = Padding
 */

// Generate an AssertionError to compare the error message later:
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual'
});

// Verify error output:
try {
  assert.strictEqual(1, 2);
} catch (err) {
  assert(err instanceof assert.AssertionError);
  assert.strictEqual(err.message, message);
  assert.strictEqual(err.name, 'AssertionError');
  assert.strictEqual(err.actual, 1);
  assert.strictEqual(err.expected, 2);
  assert.strictEqual(err.code, 'ERR_ASSERTION');
  assert.strictEqual(err.operator, 'strictEqual');
  assert.strictEqual(err.generatedMessage, true);
}
