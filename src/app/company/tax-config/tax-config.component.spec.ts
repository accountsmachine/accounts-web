import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxConfigComponent } from './tax-config.component';

describe('TaxConfigComponent', () => {
  let component: TaxConfigComponent;
  let fixture: ComponentFixture<TaxConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
