import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSoleTraderComponent } from './new-sole-trader.component';

describe('NewSoleTraderComponent', () => {
  let component: NewSoleTraderComponent;
  let fixture: ComponentFixture<NewSoleTraderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSoleTraderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSoleTraderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
