import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VatConfigComponent } from './vat-config.component';

describe('VatConfigComponent', () => {
  let component: VatConfigComponent;
  let fixture: ComponentFixture<VatConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VatConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VatConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
