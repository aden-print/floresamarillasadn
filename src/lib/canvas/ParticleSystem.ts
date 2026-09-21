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

  // Cache del gradiente de nebulosa — se recrea solo en resize
  private nebulaGradientCache: CanvasGradient | null = null;
  private nebulaCtxRef: CanvasRenderingContext2D | null = null;

  constructor() {}

  public resize(w: number, h: number, isLowSpec: boolean = false) {
    this.width = w;
    this.height = h;
    this.isMobile = isLowSpec;
    this.nebulaGradientCache = null; // invalidar cache

    // Movil: menos particulas
    const starCount = isLowSpec ? 50 : 120;
    const pollenCount = isLowSpec ? 0 : 38;
    const petalCount = isLowSpec ? 0 : 14;

    this.stars = [];
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.6 + 0.4,
        baseAlpha: Math.random() * 0.65 + 0.2,
        blinkSpeed: Math.random() * 0.02 + 0.006,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const colors = ['#FFF59D', '#FFD700', '#FFCA28', '#FFE082'];

    this.pollens = [];
    for (let i = 0; i < pollenCount; i++) {
      this.pollens.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        radius: Math.random() * 2.0 + 0.8,
        alpha: Math.random() * 0.45 + 0.2,
        color: colors[i % colors.length],
      });
    }

    this.petals = [];
    for (let i = 0; i < petalCount; i++) {
      this.petals.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: Math.random() * 0.3 + 0.12,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.012,
        scale: Math.random() * 0.4 + 0.5,
        alpha: Math.random() * 0.38 + 0.25,
        color: colors[i % colors.length],
      });
    }
  }

  public update(time: number, mouseOffsetX: number, mouseOffsetY: number) {
    for (let i = 0; i < this.pollens.length; i++) {
      const p = this.pollens[i];
      p.x += p.vx + mouseOffsetX * 0.04;
      p.y += p.vy + mouseOffsetY * 0.04;
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;
    }

    for (let i = 0; i < this.petals.length; i++) {
      const pt = this.petals[i];
      pt.x += pt.vx + Math.sin(time * 0.0012 + pt.rotation) * 0.35 + mouseOffsetX * 0.06;
      pt.y += pt.vy + mouseOffsetY * 0.06;
      pt.rotation += pt.vRot;
      if (pt.y > this.height + 20) {
        pt.y = -20;
        pt.x = Math.random() * this.width;
      }
    }
  }

  public drawBackgroundLayers(ctx: CanvasRenderingContext2D, time: number) {
    if (this.isMobile) {
      // Movil: fondo solido simple, sin gradiente (10x mas rapido)
      ctx.fillStyle = '#06050f';
      ctx.fillRect(0, 0, this.width, this.height);
    } else {
      // Desktop: gradiente nebulosa cacheado
      if (!this.nebulaGradientCache || this.nebulaCtxRef !== ctx) {
        const cx = this.width * 0.5;
        const cy = this.height * 0.5;
        const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, Math.max(this.width, this.height) * 0.85);
        grad.addColorStop(0, 'rgba(255, 215, 0, 0.05)');
        grad.addColorStop(0.5, 'rgba(18, 15, 43, 0.35)');
        grad.addColorStop(1, 'rgba(3, 3, 8, 0.98)');
        this.nebulaGradientCache = grad;
        this.nebulaCtxRef = ctx;
      }
      ctx.fillStyle = this.nebulaGradientCache;
      ctx.fillRect(0, 0, this.width, this.height);
    }

    // Estrellas — siempre fillRect (rapido)
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      const alpha = s.baseAlpha + Math.sin(time * s.blinkSpeed + s.phase) * 0.22;
      ctx.fillStyle = `rgba(255,253,231,${Math.max(0.08, alpha)})`;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    }

    // Polen solo desktop
    if (this.pollens.length > 0) {
      ctx.beginPath();
      for (let i = 0; i < this.pollens.length; i++) {
        const p = this.pollens[i];
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
    }
  }

  public drawForegroundLayers(ctx: CanvasRenderingContext2D) {
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
