import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMargenesComercialesComponent } from './detalle-margenes-comerciales.component';

describe('DetalleMargenesComercialesComponent', () => {
  let component: DetalleMargenesComercialesComponent;
  let fixture: ComponentFixture<DetalleMargenesComercialesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleMargenesComercialesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleMargenesComercialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
