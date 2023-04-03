import { describe, expect, test } from '@jest/globals';

import { isEvenRow } from 'helpers/utils';

describe('isEvenRow', () => {
  test('row 0 - even, row 1 - odd', () => {
    expect(isEvenRow(0)).toBe(true);
  });
});
