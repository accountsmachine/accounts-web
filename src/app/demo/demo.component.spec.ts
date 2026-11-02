import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NestedComponent } from "./nested.component";

describe( 'NestedComponent', () => {
  let component:NestedComponent;
  let fixture:ComponentFixture<NestedComponent>;

  beforeEach( async( () => {
    TestBed.configureTestingModule( {
    imports: [NestedComponent]
} )
      .compileComponents();
  } ) );

  beforeEach( () => {
    fixture = TestBed.createComponent( NestedComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  } );

  it( 'should be created', () => {
    expect( component ).toBeTruthy();
  } );
} );


