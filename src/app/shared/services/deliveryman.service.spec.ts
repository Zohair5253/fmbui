import { TestBed } from '@angular/core/testing';

import { DeliverymanService } from './deliveryman.service';

describe('DeliverymanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeliverymanService = TestBed.get(DeliverymanService);
    expect(service).toBeTruthy();
  });
});
