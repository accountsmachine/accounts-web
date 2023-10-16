import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNonUkCompanyComponent } from './new-non-uk-company.component';

describe('NewNonUkCompanyComponent', () => {
  let component: NewNonUkCompanyComponent;
  let fixture: ComponentFixture<NewNonUkCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewNonUkCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewNonUkCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
