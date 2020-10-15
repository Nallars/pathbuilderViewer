import { TestBed } from '@angular/core/testing';

import { DbReaderService } from './db-reader.service';

describe('DbReaderService', () => {
  let service: DbReaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbReaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
