import { TestBed } from '@angular/core/testing';

import { SharedbService } from './sharedb.service';

describe('SharedbService', () => {
  let service: SharedbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
