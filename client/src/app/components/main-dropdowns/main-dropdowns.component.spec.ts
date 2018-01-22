import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDropdownsComponent } from './main-dropdowns.component';

describe('MainDropdownsComponent', () => {
  let component: MainDropdownsComponent;
  let fixture: ComponentFixture<MainDropdownsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainDropdownsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainDropdownsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
