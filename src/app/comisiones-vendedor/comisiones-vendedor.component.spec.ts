import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionesVendedorComponent } from './comisiones-vendedor.component';

describe('ComisionesVendedorComponent', () => {
  let component: ComisionesVendedorComponent;
  let fixture: ComponentFixture<ComisionesVendedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComisionesVendedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionesVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
