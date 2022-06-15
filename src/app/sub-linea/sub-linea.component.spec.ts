import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubLineaComponent } from './sub-linea.component';

describe('SubLineaComponent', () => {
  let component: SubLineaComponent;
  let fixture: ComponentFixture<SubLineaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubLineaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubLineaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
