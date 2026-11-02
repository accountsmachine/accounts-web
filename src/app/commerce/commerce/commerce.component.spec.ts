import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommerceComponent } from './subscriptions.component';

describe('CommerceComponent', () => {
  let component: CommerceComponent;
  let fixture: ComponentFixture<CommerceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CommerceComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
