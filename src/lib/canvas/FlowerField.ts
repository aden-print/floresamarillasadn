import { FlowerData, FLOWERS_DATA, CONSTELLATIONS_DATA } from '../flowersData';
import { FlowerDrawer } from './FlowerDrawer';
import { ConstellationsRenderer, FlowerInstance } from './Constellations';

export interface FlowerFieldItem extends FlowerData {
  baseX: number;
  baseY: number;
  currentX: number;
  currentY: number;
  currentScale: number;
  rotation: number;
  glowAmount: number;
  isHovered: boolean;
  screenX: number;
  screenY: number;
  renderedRadius: number;
  
  heartTargetX?: number;
  heartTargetY?: number;
}

export class FlowerField {
  private flowers: FlowerFieldItem[] = [];
  private hoveredFlowerId: string | null = null;
  private selectedFlowerId: string | null = null;
  
  private isFinaleActive: boolean = false;
  private finaleProgress: number = 0;

  constructor() {
    this.init();
  }

  private init() {
    this.flowers = FLOWERS_DATA.map((data, index) => {
      const t = (index / FLOWERS_DATA.length) * Math.PI * 2;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      
      const heartX = hx / 18;
      const heartY = hy / 18;

      return {
        ...data,
        baseX: data.x,
        baseY: data.y,
        currentX: data.x,
        currentY: data.y,
        currentScale: data.scale,
        rotation: Math.random() * Math.PI * 2,
        glowAmount: 0,
        isHovered: false,
        screenX: 0,
        screenY: 0,
        renderedRadius: 30,
        heartTargetX: heartX,
        heartTargetY: heartY,
      };
    });
  }

  public activateFinale() {
    this.isFinaleActive = true;
  }

  public resetFinale() {
    this.isFinaleActive = false;
    this.finaleProgress = 0;
  }

  public update(
    time: number,
    width: number,
    height: number,
    mouseOffsetX: number,
    mouseOffsetY: number,
    focusedFlowerId: string | null
  ) {
    this.selectedFlowerId = focusedFlowerId;

    if (this.isFinaleActive && this.finaleProgress < 1.0) {
      this.finaleProgress = Math.min(1.0, this.finaleProgress + 0.015);
    }

    // Adaptación a pantallas móviles para mejor proporción
    const isMobile = width < 640;
    const baseRadius = Math.min(width, height) * (isMobile ? 0.08 : 0.065);

    const activeHoveredFlower = this.flowers.find(f => f.id === this.hoveredFlowerId || f.id === this.selectedFlowerId);
    const activeConstellationGroup = activeHoveredFlower?.constellationGroup;

    this.flowers.forEach(flower => {
      let scaleMult = 1.0;
      if (flower.isCentral) {
        scaleMult = 1.0 + Math.sin(time * 0.002) * 0.04;
      }

      const floatX = Math.sin(time * 0.001 + flower.z * 5) * 0.03;
      const floatY = Math.cos(time * 0.0012 + flower.z * 3) * 0.03;

      let targetX = flower.baseX + floatX;
      let targetY = flower.baseY + floatY;

      if (this.isFinaleActive && flower.heartTargetX !== undefined && flower.heartTargetY !== undefined) {
        targetX = flower.baseX * (1 - this.finaleProgress) + flower.heartTargetX * this.finaleProgress;
        targetY = flower.baseY * (1 - this.finaleProgress) + flower.heartTargetY * this.finaleProgress;
      }

      const parallaxFactor = flower.z * 0.35;
      const posX = targetX + mouseOffsetX * parallaxFactor;
      const posY = targetY + mouseOffsetY * parallaxFactor;

      // En móviles ampliamos ligeramente el margen útil
      const spreadX = width * (isMobile ? 0.44 : 0.42);
      const spreadY = height * (isMobile ? 0.44 : 0.42);

      flower.screenX = width * 0.5 + posX * spreadX;
      flower.screenY = height * 0.5 + posY * spreadY;

      flower.rotation += flower.rotationSpeed;

      const isDirectHover = this.hoveredFlowerId === flower.id || this.selectedFlowerId === flower.id;
      const isGroupMember = activeConstellationGroup && flower.constellationGroup === activeConstellationGroup;
      
      flower.isHovered = Boolean(isDirectHover || isGroupMember);

      const targetGlow = flower.isHovered ? 1.0 : 0.0;
      flower.glowAmount += (targetGlow - flower.glowAmount) * 0.1;

      const hoverScale = isDirectHover ? 1.2 : (isGroupMember ? 1.08 : 1.0);
      flower.currentScale = flower.scale * scaleMult * hoverScale;
      flower.renderedRadius = baseRadius * flower.currentScale * flower.z;
    });

    this.flowers.sort((a, b) => a.z - b.z);
  }

  public draw(ctx: CanvasRenderingContext2D, time: number, width: number, height: number) {
    const flowersMap = new Map<string, FlowerInstance>();
    this.flowers.forEach(f => {
      flowersMap.set(f.id, {
        id: f.id,
        x: f.currentX,
        y: f.currentY,
        screenX: f.screenX,
        screenY: f.screenY,
        radius: f.renderedRadius,
        isHovered: f.isHovered,
        constellationGroup: f.constellationGroup,
      });
    });

    ConstellationsRenderer.drawConstellations(ctx, CONSTELLATIONS_DATA, flowersMap, time, width, height);

    this.flowers.forEach(flower => {
      ctx.save();
      ctx.translate(flower.screenX, flower.screenY);

      let alpha = Math.min(1.0, 0.4 + flower.z * 0.5);
      if (this.selectedFlowerId && this.selectedFlowerId !== flower.id) {
        alpha *= 0.35;
      }

      ctx.globalAlpha = alpha;

      FlowerDrawer.drawFlower(
        ctx,
        flower.type,
        flower.renderedRadius,
        flower.rotation,
        flower.isHovered,
        flower.glowAmount,
        time
      );

      ctx.restore();
    });

    ctx.globalAlpha = 1.0;
  }

  /**
   * Detección de toque táctil optimizada para celular (área generosa de mínimo 36px de radio)
   */
  public hitTest(px: number, py: number): FlowerFieldItem | null {
    const sorted = [...this.flowers].sort((a, b) => b.z - a.z);

    for (const f of sorted) {
      const dx = px - f.screenX;
      const dy = py - f.screenY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // En móviles las estrellas y flores pequeñas ahora tienen un radio mínimo de 36px (72px diámetro)
      const hitRadius = Math.max(f.renderedRadius * 1.35, 36);

      if (dist <= hitRadius) {
        this.hoveredFlowerId = f.id;
        return f;
      }
    }

    this.hoveredFlowerId = null;
    return null;
  }

  public setHoveredFlower(id: string | null) {
    this.hoveredFlowerId = id;
  }

  public getFlowerById(id: string): FlowerFieldItem | undefined {
    return this.flowers.find(f => f.id === id);
  }
}
