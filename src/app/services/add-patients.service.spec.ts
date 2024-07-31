import { TestBed } from '@angular/core/testing';

import { AddPatientsService } from './add-patients.service';

describe('AddPatientsService', () => {
  let service: AddPatientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddPatientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
