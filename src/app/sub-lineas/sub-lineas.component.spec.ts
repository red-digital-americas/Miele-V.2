import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubLineasComponent } from './sub-lineas.component';

describe('SubLineasComponent', () => {
  let component: SubLineasComponent;
  let fixture: ComponentFixture<SubLineasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubLineasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubLineasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
