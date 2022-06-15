import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallecotizacionComponent } from './detallecotizacion.component';

describe('DetallecotizacionComponent', () => {
  let component: DetallecotizacionComponent;
  let fixture: ComponentFixture<DetallecotizacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallecotizacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallecotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
