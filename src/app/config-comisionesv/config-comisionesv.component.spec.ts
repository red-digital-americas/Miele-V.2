import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigComisionesvComponent } from './config-comisionesv.component';

describe('ConfigComisionesvComponent', () => {
  let component: ConfigComisionesvComponent;
  let fixture: ComponentFixture<ConfigComisionesvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigComisionesvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigComisionesvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
