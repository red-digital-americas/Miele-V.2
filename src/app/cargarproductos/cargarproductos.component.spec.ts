import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarproductosComponent } from './cargarproductos.component';

describe('CargarproductosComponent', () => {
  let component: CargarproductosComponent;
  let fixture: ComponentFixture<CargarproductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargarproductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargarproductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
