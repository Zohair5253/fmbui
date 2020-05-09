import { TestBed } from '@angular/core/testing';

import { ConsumerAccountService } from './consumer-account.service';

describe('ConsumerAccountService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConsumerAccountService = TestBed.get(ConsumerAccountService);
    expect(service).toBeTruthy();
  });
});
