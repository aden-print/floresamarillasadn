// Pre-renderizado en Caché para flores en Canvas 2D (Optimización Extrema a 60 FPS)
export class FlowerDrawer {
  private static cache: Map<string, HTMLCanvasElement> = new Map();
  private static isInitialized = false;

  private static initCache() {
    if (this.isInitialized || typeof document === 'undefined') return;

    const types: Array<'girasol' | 'ramillete' | 'margarita_dorada' | 'flor_estelar'> = [
      'girasol',
      'ramillete',
      'margarita_dorada',
      'flor_estelar',
    ];

    const size = 256;
    const center = size / 2;
    const radius = 90;

    types.forEach(type => {
      // Versión normal y versión con glow
      [false, true].forEach(hasGlow => {
        const offscreen = document.createElement('canvas');
        offscreen.width = size;
        offscreen.height = size;
        const octx = offscreen.getContext('2d');
        if (!octx) return;

        octx.translate(center, center);

        // Aura dorada
        const auraRadius = radius * (hasGlow ? 1.4 : 1.2);
        const auraGrad = octx.createRadialGradient(0, 0, radius * 0.4, 0, 0, auraRadius);
        auraGrad.addColorStop(0, hasGlow ? 'rgba(255, 215, 0, 0.45)' : 'rgba(255, 215, 0, 0.25)');
        auraGrad.addColorStop(0.7, hasGlow ? 'rgba(255, 179, 0, 0.2)' : 'rgba(255, 179, 0, 0.08)');
        auraGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');

        octx.beginPath();
        octx.arc(0, 0, auraRadius, 0, Math.PI * 2);
        octx.fillStyle = auraGrad;
        octx.fill();

        // Renderizado del tipo de flor
        if (type === 'girasol') {
          this.renderSunflowerDirect(octx, radius);
        } else if (type === 'ramillete') {
          this.renderBouquetDirect(octx, radius);
        } else if (type === 'margarita_dorada') {
          this.renderDaisyDirect(octx, radius);
        } else if (type === 'flor_estelar') {
          this.renderStellarDirect(octx, radius);
        }

        const key = `${type}_${hasGlow ? 'glow' : 'normal'}`;
        this.cache.set(key, offscreen);
      });
    });

    this.isInitialized = true;
  }

  public static drawFlower(
    ctx: CanvasRenderingContext2D,
    type: 'girasol' | 'ramillete' | 'margarita_dorada' | 'flor_estelar',
    radius: number,
    rotation: number,
    isHovered: boolean = false,
    glowAmount: number = 0,
    time: number = 0
  ) {
    if (!this.isInitialized) {
      this.initCache();
    }

    const key = `${type}_${isHovered || glowAmount > 0.3 ? 'glow' : 'normal'}`;
    const cachedCanvas = this.cache.get(key);

    ctx.save();
    ctx.rotate(rotation);

    if (cachedCanvas) {
      // Súper rápido: 1 sola llamada de drawImage por flor
      const drawSize = radius * 2.8;
      ctx.drawImage(cachedCanvas, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
    }

    ctx.restore();
  }

  private static renderSunflowerDirect(ctx: CanvasRenderingContext2D, radius: number) {
    const petalCount = 18;
    const innerPetalCount = 14;

    // Pétalos exteriores
    for (let i = 0; i < petalCount; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / petalCount);
      const petalLen = radius * 1.15;
      const petalWidth = radius * 0.28;

      const grad = ctx.createLinearGradient(0, radius * 0.3, 0, petalLen);
      grad.addColorStop(0, '#FFC107');
      grad.addColorStop(0.5, '#FFD700');
      grad.addColorStop(1, '#FFF59D');

      ctx.beginPath();
      ctx.moveTo(0, radius * 0.3);
      ctx.quadraticCurveTo(petalWidth, radius * 0.7, 0, petalLen);
      ctx.quadraticCurveTo(-petalWidth, radius * 0.7, 0, radius * 0.3);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }

    // Pétalos interiores
    for (let i = 0; i < innerPetalCount; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / innerPetalCount + Math.PI / innerPetalCount);
      const petalLen = radius * 0.95;
      const petalWidth = radius * 0.24;

      const grad = ctx.createLinearGradient(0, radius * 0.3, 0, petalLen);
      grad.addColorStop(0, '#FFA000');
      grad.addColorStop(0.6, '#FFCA28');
      grad.addColorStop(1, '#FFF59D');

      ctx.beginPath();
      ctx.moveTo(0, radius * 0.3);
      ctx.quadraticCurveTo(petalWidth, radius * 0.6, 0, petalLen);
      ctx.quadraticCurveTo(-petalWidth, radius * 0.6, 0, radius * 0.3);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }

    // Centro
    const centerRadius = radius * 0.45;
    const centerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, centerRadius);
    centerGrad.addColorStop(0, '#3E2723');
    centerGrad.addColorStop(0.7, '#5D4037');
    centerGrad.addColorStop(1, '#FFB300');

    ctx.beginPath();
    ctx.arc(0, 0, centerRadius, 0, Math.PI * 2);
    ctx.fillStyle = centerGrad;
    ctx.fill();

    // Semillas
    ctx.fillStyle = 'rgba(255, 215, 0, 0.45)';
    for (let i = 0; i < 18; i++) {
      const r = (i / 18) * centerRadius * 0.75;
      const theta = i * 2.4;
      ctx.beginPath();
      ctx.arc(Math.cos(theta) * r, Math.sin(theta) * r, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private static renderBouquetDirect(ctx: CanvasRenderingContext2D, radius: number) {
    ctx.fillStyle = 'rgba(76, 175, 80, 0.5)';
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / 3 + 0.5);
      ctx.beginPath();
      ctx.ellipse(0, radius * 0.8, radius * 0.2, radius * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    const offsets = [
      { x: 0, y: -radius * 0.35, scale: 0.65 },
      { x: -radius * 0.35, y: radius * 0.25, scale: 0.6 },
      { x: radius * 0.35, y: radius * 0.25, scale: 0.6 },
    ];

    offsets.forEach(off => {
      ctx.save();
      ctx.translate(off.x, off.y);
      this.renderDaisyDirect(ctx, radius * off.scale);
      ctx.restore();
    });
  }

  private static renderDaisyDirect(ctx: CanvasRenderingContext2D, radius: number) {
    const petalCount = 12;
    for (let i = 0; i < petalCount; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / petalCount);
      const grad = ctx.createLinearGradient(0, 0, 0, radius);
      grad.addColorStop(0, '#FFC107');
      grad.addColorStop(0.7, '#FFD54F');
      grad.addColorStop(1, '#FFF9C4');

      ctx.beginPath();
      ctx.ellipse(0, radius * 0.6, radius * 0.16, radius * 0.45, 0, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }

    const centerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.3);
    centerGrad.addColorStop(0, '#FF8F00');
    centerGrad.addColorStop(0.8, '#FFB300');
    centerGrad.addColorStop(1, '#FFE082');

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = centerGrad;
    ctx.fill();
  }

  private static renderStellarDirect(ctx: CanvasRenderingContext2D, radius: number) {
    const points = 8;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? radius : radius * 0.4;
      const angle = (i * Math.PI) / points;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    const grad = ctx.createRadialGradient(0, 0, radius * 0.1, 0, 0, radius);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, '#FFF59D');
    grad.addColorStop(1, '#FFD700');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF8E1';
    ctx.fill();
  }
}
