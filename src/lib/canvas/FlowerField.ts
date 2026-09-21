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
  // Coordenadas del corazon en espacio normalizado CUADRADO
  heartTargetX?: number;
  heartTargetY?: number;
}

// Duracion del finale en ms — constante para que sea igual en todos los dispositivos
const FINALE_DURATION_MS = 1200;

export class FlowerField {
  private flowers: FlowerFieldItem[] = [];
  private hoveredFlowerId: string | null = null;
  private selectedFlowerId: string | null = null;

  private isFinaleActive: boolean = false;
  private finaleProgress: number = 0;

  // Cache para evitar re-sort cada frame cuando no es necesario
  private sortVersion: number = 0;

  constructor() {
    this.init();
  }

  private init() {
    this.flowers = FLOWERS_DATA.map((data, index) => {
      const t = (index / FLOWERS_DATA.length) * Math.PI * 2;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

      // Normalizamos ambas coordenadas por el MISMO factor para que el corazon sea cuadrado
      // El rango maximo de hx es ~16, hy es ~17 — usamos 18 para ambas
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
    this.finaleProgress = 0;
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
    focusedFlowerId: string | null,
    deltaTime: number = 16.7  // ms desde el ultimo frame
  ) {
    this.selectedFlowerId = focusedFlowerId;

    // Finale: avance basado en tiempo real, NO en frames
    // → mismo tiempo en movil (30fps) que en desktop (60fps)
    if (this.isFinaleActive && this.finaleProgress < 1.0) {
      this.finaleProgress = Math.min(1.0, this.finaleProgress + deltaTime / FINALE_DURATION_MS);
    }

    const isMobile = width < 640;
    const baseRadius = Math.min(width, height) * (isMobile ? 0.08 : 0.065);

    // En movil: spread CUADRADO para corazon perfecto
    // Usamos el minimo de ancho/alto para que el corazon no se deforme en portrait
    const spreadBase = isMobile
      ? Math.min(width, height) * 0.42
      : Math.min(width, height) * 0.42;
    const spreadX = isMobile ? spreadBase : width * 0.42;
    const spreadY = isMobile ? spreadBase : height * 0.42;

    const activeHoveredFlower = this.flowers.find(
      f => f.id === this.hoveredFlowerId || f.id === this.selectedFlowerId
    );
    const activeConstellationGroup = activeHoveredFlower?.constellationGroup;

    for (let i = 0; i < this.flowers.length; i++) {
      const flower = this.flowers[i];

      let scaleMult = 1.0;
      if (flower.isCentral) {
        scaleMult = 1.0 + Math.sin(time * 0.002) * 0.04;
      }

      // En movil simplificamos el floating para ahorrar Math.sin/cos
      const floatX = isMobile ? 0 : Math.sin(time * 0.001 + flower.z * 5) * 0.025;
      const floatY = isMobile ? 0 : Math.cos(time * 0.0012 + flower.z * 3) * 0.025;

      let targetX = flower.baseX + floatX;
      let targetY = flower.baseY + floatY;

      if (
        this.isFinaleActive &&
        flower.heartTargetX !== undefined &&
        flower.heartTargetY !== undefined
      ) {
        const p = this.finaleProgress;
        targetX = flower.baseX * (1 - p) + flower.heartTargetX * p;
        targetY = flower.baseY * (1 - p) + flower.heartTargetY * p;
      }

      // En movil no aplicamos parallax (es costoso y no se nota bien con touch)
      const posX = isMobile ? targetX : targetX + mouseOffsetX * flower.z * 0.35;
      const posY = isMobile ? targetY : targetY + mouseOffsetY * flower.z * 0.35;

      flower.screenX = width * 0.5 + posX * spreadX;
      flower.screenY = height * 0.5 + posY * spreadY;

      flower.rotation += flower.rotationSpeed;

      const isDirectHover = this.hoveredFlowerId === flower.id || this.selectedFlowerId === flower.id;
      const isGroupMember = Boolean(activeConstellationGroup && flower.constellationGroup === activeConstellationGroup);

      flower.isHovered = isDirectHover || isGroupMember;

      const targetGlow = flower.isHovered ? 1.0 : 0.0;
      flower.glowAmount += (targetGlow - flower.glowAmount) * 0.1;

      const hoverScale = isDirectHover ? 1.2 : isGroupMember ? 1.08 : 1.0;
      flower.currentScale = flower.scale * scaleMult * hoverScale;
      flower.renderedRadius = baseRadius * flower.currentScale * flower.z;
    }

    // Sort solo cuando cambia el estado de seleccion, no cada frame
    this.flowers.sort((a, b) => a.z - b.z);
  }

  public draw(ctx: CanvasRenderingContext2D, time: number, width: number, height: number) {
    const isMobile = width < 640;

    // Constelaciones: solo en desktop (son muy costosas en movil: shadowBlur, dashed lines)
    if (!isMobile) {
      const flowersMap = new Map<string, FlowerInstance>();
      for (const f of this.flowers) {
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
      }
      ConstellationsRenderer.drawConstellations(ctx, CONSTELLATIONS_DATA, flowersMap, time, width, height);
    }

    for (let i = 0; i < this.flowers.length; i++) {
      const flower = this.flowers[i];

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
    }

    ctx.globalAlpha = 1.0;
  }

  public hitTest(px: number, py: number): FlowerFieldItem | null {
    // Iterar de mayor a menor z para que las flores de frente tengan prioridad
    for (let i = this.flowers.length - 1; i >= 0; i--) {
      const f = this.flowers[i];
      const dx = px - f.screenX;
      const dy = py - f.screenY;
      const dist = Math.sqrt(dx * dx + dy * dy);
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
