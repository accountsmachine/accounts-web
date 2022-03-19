import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsStructureComponent } from './accounts-structure.component';

describe('AccountsStructureComponent', () => {
  let component: AccountsStructureComponent;
  let fixture: ComponentFixture<AccountsStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsStructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
