import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarcomisionesComponent } from './buscarcomisiones.component';

describe('BuscarcomisionesComponent', () => {
  let component: BuscarcomisionesComponent;
  let fixture: ComponentFixture<BuscarcomisionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarcomisionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarcomisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
