export interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  blinkSpeed: number;
  phase: number;
}

export interface PollenParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

export interface FloatingPetal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  scale: number;
  alpha: number;
  color: string;
}

export class ParticleSystem {
  private width: number = 0;
  private height: number = 0;
  private stars: Star[] = [];
  private pollens: PollenParticle[] = [];
  private petals: FloatingPetal[] = [];
  private isMobile: boolean = false;

  constructor() {}

  public resize(w: number, h: number, isLowSpec: boolean = false) {
    this.width = w;
    this.height = h;
    this.isMobile = isLowSpec;

    // Movil: menos particulas y sin petals para ahorrar CPU
    const starCount = isLowSpec ? 55 : 130;
    const pollenCount = isLowSpec ? 0 : 40;   // Sin pollen en movil (son los arc() mas caros)
    const petalCount = isLowSpec ? 0 : 15;     // Sin petals en movil

    this.stars = [];
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.6 + 0.5,
        baseAlpha: Math.random() * 0.7 + 0.2,
        blinkSpeed: Math.random() * 0.025 + 0.008,
        phase: Math.random() * Math.PI * 2,
      });
    }

    this.pollens = [];
    const colors = ['#FFF59D', '#FFD700', '#FFCA28', '#FFE082'];
    for (let i = 0; i < pollenCount; i++) {
      this.pollens.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2.2 + 1.0,
        alpha: Math.random() * 0.5 + 0.2,
        color: colors[i % colors.length],
      });
    }

    this.petals = [];
    for (let i = 0; i < petalCount; i++) {
      this.petals.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: Math.random() * 0.35 + 0.15,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.015,
        scale: Math.random() * 0.4 + 0.6,
        alpha: Math.random() * 0.4 + 0.3,
        color: colors[i % colors.length],
      });
    }
  }

  public update(time: number, mouseOffsetX: number, mouseOffsetY: number) {
    // Polenes (solo desktop)
    for (let i = 0; i < this.pollens.length; i++) {
      const p = this.pollens[i];
      p.x += p.vx + mouseOffsetX * 0.04;
      p.y += p.vy + mouseOffsetY * 0.04;
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;
    }

    // Pétalos (solo desktop)
    for (let i = 0; i < this.petals.length; i++) {
      const pt = this.petals[i];
      pt.x += pt.vx + Math.sin(time * 0.0015 + pt.rotation) * 0.4 + mouseOffsetX * 0.08;
      pt.y += pt.vy + mouseOffsetY * 0.08;
      pt.rotation += pt.vRot;
      if (pt.y > this.height + 20) {
        pt.y = -20;
        pt.x = Math.random() * this.width;
      }
    }
  }

  public drawBackgroundLayers(ctx: CanvasRenderingContext2D, time: number) {
    const cx = this.width * 0.5;
    const cy = this.height * 0.5;

    // Fondo nebulosa
    const nebGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, Math.max(this.width, this.height) * 0.85);
    nebGrad.addColorStop(0, 'rgba(255, 215, 0, 0.05)');
    nebGrad.addColorStop(0.5, 'rgba(18, 15, 43, 0.35)');
    nebGrad.addColorStop(1, 'rgba(3, 3, 8, 0.98)');
    ctx.fillStyle = nebGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Estrellas — siempre fillRect (3x mas rapido que arc)
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      const alpha = s.baseAlpha + Math.sin(time * s.blinkSpeed + s.phase) * 0.25;
      ctx.fillStyle = `rgba(255,253,231,${Math.max(0.1, alpha)})`;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    }

    // Polen (solo desktop, usa arc)
    if (this.pollens.length > 0) {
      for (let i = 0; i < this.pollens.length; i++) {
        const p = this.pollens[i];
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
    }
  }

  public drawForegroundLayers(ctx: CanvasRenderingContext2D) {
    // Pétalos (solo desktop)
    if (this.petals.length === 0) return;
    for (let i = 0; i < this.petals.length; i++) {
      const pt = this.petals[i];
      ctx.save();
      ctx.translate(pt.x, pt.y);
      ctx.rotate(pt.rotation);
      ctx.scale(pt.scale, pt.scale);
      ctx.fillStyle = pt.color;
      ctx.globalAlpha = pt.alpha;
      ctx.beginPath();
      ctx.ellipse(0, 0, 3.5, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1.0;
  }
}
