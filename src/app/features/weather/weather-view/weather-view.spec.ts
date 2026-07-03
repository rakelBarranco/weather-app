import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherView } from './weather-view';

describe('WeatherView', () => {
  let component: WeatherView;
  let fixture: ComponentFixture<WeatherView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
