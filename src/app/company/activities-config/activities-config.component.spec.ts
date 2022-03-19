import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesConfigComponent } from './activities-config.component';

describe('ActivitiesConfigComponent', () => {
  let component: ActivitiesConfigComponent;
  let fixture: ComponentFixture<ActivitiesConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitiesConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
