import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactConfigComponent } from './contact-config.component';

describe('ContactConfigComponent', () => {
  let component: ContactConfigComponent;
  let fixture: ComponentFixture<ContactConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
