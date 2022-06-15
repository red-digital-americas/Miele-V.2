import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarshopComponent } from './carshop.component';

describe('CarshopComponent', () => {
  let component: CarshopComponent;
  let fixture: ComponentFixture<CarshopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarshopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
