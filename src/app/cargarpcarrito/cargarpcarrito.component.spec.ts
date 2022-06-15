import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarpcarritoComponent } from './cargarpcarrito.component';

describe('CargarpcarritoComponent', () => {
  let component: CargarpcarritoComponent;
  let fixture: ComponentFixture<CargarpcarritoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargarpcarritoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargarpcarritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
