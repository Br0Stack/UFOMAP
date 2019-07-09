import { TestBed } from '@angular/core/testing';

import { TopoServiceService } from './topo-service.service';

describe('TopoServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TopoServiceService = TestBed.get(TopoServiceService);
    expect(service).toBeTruthy();
  });
});
