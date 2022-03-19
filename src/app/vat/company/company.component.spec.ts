import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VatCompanyComponent } from './vat-company.component';

describe('VatCompanyComponent', () => {
  let component: VatCompanyComponent;
  let fixture: ComponentFixture<VatCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VatCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VatCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
