import { ComponentFixture, TestBed } from '@angular/core/testing';
import WeatherBackgroundComponent from './weather-animation';

describe('WeatherAnimationComponent', () => {
  let component: WeatherBackgroundComponent;
  let fixture: ComponentFixture<WeatherBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherBackgroundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherBackgroundComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('debería crearse correctamente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debería renderizar un canvas en el DOM', () => {
    fixture.detectChanges();
    const canvas = fixture.nativeElement.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it('debería usar clear como tipo de clima por defecto', () => {
    expect(component.weatherType()).toBe('clear');
  });

  it('debería aceptar el tipo de clima recibido por input', () => {
    fixture.componentRef.setInput('weatherType', 'rain');
    fixture.detectChanges();
    expect(component.weatherType()).toBe('rain');
  });
});
