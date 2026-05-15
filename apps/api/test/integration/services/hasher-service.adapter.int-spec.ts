import { HashServiceAdapter } from '../../../src/modules/identity/infrastructure/services/hash.service';

describe('HashServiceAdapter Integration', () => {
  let service: HashServiceAdapter;

  beforeEach(() => {
    service = new HashServiceAdapter();
  });

  it('should hash and compare successfully', async () => {
    const value = 'my-password';

    const hash = await service.hash(value);

    const isValid = await service.compare(value, hash);

    expect(isValid).toBe(true);
  });
});
