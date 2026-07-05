import {Component, ElementRef, OnDestroy, OnInit, input, effect, viewChild} from '@angular/core';
import {WeatherType} from '../../../core/models/weather.model';

interface Particle {
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
}

@Component({
  selector: 'app-weather-animation',
  templateUrl: './weather-animation.html',
  styleUrl: './weather-animation.scss',
})
export default class WeatherBackgroundComponent implements OnInit, OnDestroy {

  private canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  weatherType = input<WeatherType>('clear');

  private ctx!: CanvasRenderingContext2D;
  private animationId = 0;
  private particles: Particle[] = [];

  constructor() {
    effect(() => {
      this.weatherType();
      this.initParticles();
    });
  }

  ngOnInit() {
    const canvas = this.canvasRef().nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', this.resize);
    this.initParticles();
    this.animate();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.resize);
  }

  private resize = () => {
    const canvas = this.canvasRef().nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  private initParticles() {
    this.particles = [];
    const type = this.weatherType();

    const count = type === 'rain' ? 150 : type === 'snow' ? 80 : type === 'mist' ? 30 : type === 'clouds' ? 8 : 0;

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(type));
    }
  }

  private createParticle(type: WeatherType): Particle {
    const canvas = this.canvasRef().nativeElement;
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: type === 'rain' ? 8 + Math.random() * 6 : type === 'snow' ? 1 + Math.random() * 2 : type === 'clouds' ? 0.2 + Math.random() * 0.3 : 0.3,
      size: type === 'rain' ? 1 : type === 'snow' ? 2 + Math.random() * 3 : type === 'clouds' ? 80 + Math.random() * 120 : 40 + Math.random() * 60,
      opacity: 0.3 + Math.random() * 0.5
    };
  }

  private animate = () => {
    const canvas = this.canvasRef().nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    const type = this.weatherType();
    if (type === 'rain') this.drawRain();
    else if (type === 'snow') this.drawSnow();
    else if (type === 'mist') this.drawMist();
    else if (type === 'clouds') this.drawClouds();

    this.animationId = requestAnimationFrame(this.animate);
  };

  private drawRain() {
    const canvas = this.canvasRef().nativeElement;
    this.ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
    this.ctx.lineWidth = 1;

    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y);
      this.ctx.lineTo(p.x, p.y + p.size * 10);
      this.ctx.stroke();

      p.y += p.speed;
      if (p.y > canvas.height) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
    }
  }

  private drawSnow() {
    const canvas = this.canvasRef().nativeElement;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();

      p.y += p.speed;
      p.x += Math.sin(p.y * 0.01) * 0.5;
      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
    }
  }

  private drawMist() {
    const canvas = this.canvasRef().nativeElement;

    for (const p of this.particles) {
      this.ctx.fillStyle = `rgba(200, 200, 210, ${p.opacity * 0.1})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();

      p.x += p.speed;
      if (p.x > canvas.width + p.size) {
        p.x = -p.size;
        p.y = Math.random() * canvas.height;
      }
    }
  }

  private drawClouds() {
    const canvas = this.canvasRef().nativeElement;

    for (const p of this.particles) {
      const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${p.opacity * 0.25})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();

      p.x += p.speed;
      if (p.x > canvas.width + p.size) {
        p.x = -p.size;
        p.y = Math.random() * canvas.height * 0.5;
      }
    }
  }
}
