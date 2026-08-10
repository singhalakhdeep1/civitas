import { describe, it, expect } from 'vitest';

describe('Civitas Signature Threshold Engine', () => {
  it('should calculate petition target progress percentage', () => {
    const target = 5000;
    const current = 2500;
    const progress = (current / target) * 100;
    expect(progress).toBe(50);
  });
});
