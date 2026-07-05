import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherAnimation } from './weather-animation';

describe('WeatherAnimation', () => {
  let component: WeatherAnimation;
  let fixture: ComponentFixture<WeatherAnimation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherAnimation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherAnimation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
