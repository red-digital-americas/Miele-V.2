import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleComisionesVendedorComponent } from './detalle-comisiones-vendedor.component';

describe('DetalleComisionesVendedorComponent', () => {
  let component: DetalleComisionesVendedorComponent;
  let fixture: ComponentFixture<DetalleComisionesVendedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleComisionesVendedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleComisionesVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
