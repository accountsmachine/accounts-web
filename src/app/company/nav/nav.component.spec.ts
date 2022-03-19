import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyNavComponent } from './navigator.component';

describe('CompanyNavComponent', () => {
  let component: CompanyNavComponent;
  let fixture: ComponentFixture<CompanyNavComponent>;

  beforeEach(async () => {
    await TestBed.companyureTestingModule({
      declarations: [ CompanyNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
