import { afterEach, describe, expect, it, vi } from 'vitest';

import { clone, delay, generateId, hasWindow, readJSON, storage, writeJSON } from '../mockUtils';

describe('mockUtils', () => {
  afterEach(() => {
    vi.useRealTimers();
    storage.remove('bad');
    storage.remove('some');
    storage.remove('delayed');
    vi.restoreAllMocks();
  });

  it('resolves delay promises after the specified duration', async () => {
    vi.useFakeTimers();
    const handler = vi.fn();

    const promise = delay(500).then(handler);

    await vi.advanceTimersByTimeAsync(499);
    expect(handler).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    await promise;

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('parses stored JSON values and logs warnings for invalid payloads', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    writeJSON('some', { value: 42 });
    expect(readJSON<{ value: number }>('some')).toEqual({ value: 42 });

    storage.set('bad', 'not-json');
    expect(readJSON('bad')).toBeNull();
    expect(warn).toHaveBeenCalledWith('Failed to parse JSON from storage', expect.any(SyntaxError));
  });

  it('guards against serialisation errors when persisting JSON', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    writeJSON('bad', BigInt(1) as unknown);

    expect(storage.get('bad')).toBeNull();
    expect(warn).toHaveBeenCalledWith('Failed to persist JSON to storage', expect.any(TypeError));
  });

  it('creates deep clones of JSON-compatible values', () => {
    const original = { nested: { value: 1 } };
    const copy = clone(original);

    expect(copy).toEqual(original);
    expect(copy).not.toBe(original);
    expect(copy.nested).not.toBe(original.nested);
  });

  it('generates ids with the provided prefix', () => {
    const id = generateId('test');

    expect(id.startsWith('test_')).toBe(true);
    expect(id.length).toBeGreaterThan('test_'.length);
  });

  it('detects the absence of a browser window in the test environment', () => {
    expect(hasWindow()).toBe(false);
  });
});
