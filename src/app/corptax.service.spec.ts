import { TestBed } from '@angular/core/testing';

import { CorptaxService } from './corptax.service';

describe('CorptaxService', () => {
  let service: CorptaxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorptaxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
