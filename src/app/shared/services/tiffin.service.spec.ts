import { TestBed } from '@angular/core/testing';

import { TiffinService } from './tiffin.service';

describe('TiffinService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TiffinService = TestBed.get(TiffinService);
    expect(service).toBeTruthy();
  });
});
