import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MargenesComercialesComponent } from './margenes-comerciales.component';

describe('MargenesComercialesComponent', () => {
  let component: MargenesComercialesComponent;
  let fixture: ComponentFixture<MargenesComercialesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MargenesComercialesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MargenesComercialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
