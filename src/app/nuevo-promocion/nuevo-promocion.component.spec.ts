import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoPromocionComponent } from './nuevo-promocion.component';

describe('NuevoPromocionComponent', () => {
  let component: NuevoPromocionComponent;
  let fixture: ComponentFixture<NuevoPromocionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevoPromocionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoPromocionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
