import { ConstellationData } from '../flowersData';

export interface FlowerInstance {
  id: string;
  x: number;
  y: number;
  screenX: number;
  screenY: number;
  radius: number;
  isHovered: boolean;
  constellationGroup?: string;
}

export class ConstellationsRenderer {
  /**
   * Dibuja constelaciones estelares con líneas sutiles doradas y etiquetas sin cajas negras de fondo
   */
  public static drawConstellations(
    ctx: CanvasRenderingContext2D,
    constellations: ConstellationData[],
    flowersMap: Map<string, FlowerInstance>,
    time: number,
    width: number,
    height: number
  ) {
    ctx.save();

    constellations.forEach(c => {
      const coords: { x: number; y: number }[] = [];
      let isGroupHovered = false;

      c.flowerIds.forEach(id => {
        const flower = flowersMap.get(id);
        if (flower) {
          coords.push({ x: flower.screenX, y: flower.screenY });
          if (flower.isHovered) isGroupHovered = true;
        }
      });

      if (coords.length < 2) return;

      const lineAlpha = isGroupHovered ? 0.8 : 0.3;
      const lineWidth = isGroupHovered ? 2.0 : 1.0;
      const glowColor = isGroupHovered ? '#FFD700' : 'rgba(255, 215, 0, 0.4)';

      // 1. Resplandor dorado de la constelación
      if (isGroupHovered) {
        ctx.beginPath();
        ctx.moveTo(coords[0].x, coords[0].y);
        for (let i = 1; i < coords.length; i++) {
          ctx.lineTo(coords[i].x, coords[i].y);
        }
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.25)';
        ctx.lineWidth = 6;
        ctx.stroke();
      }

      // 2. Líneas punteadas doradas elegantes
      ctx.beginPath();
      ctx.moveTo(coords[0].x, coords[0].y);
      for (let i = 1; i < coords.length; i++) {
        ctx.lineTo(coords[i].x, coords[i].y);
      }

      ctx.strokeStyle = `rgba(255, 235, 150, ${lineAlpha})`;
      ctx.lineWidth = lineWidth;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Nodos estelares dorados en cada flor
      coords.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, isGroupHovered ? 4 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = glowColor;
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = isGroupHovered ? 10 : 3;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 4. Etiqueta de texto sutil flotante SIN cajas negras de fondo (para evitar bugs de solapamiento)
      if (c.label) {
        const avgX = coords.reduce((acc, p) => acc + p.x, 0) / coords.length;
        const avgY = coords.reduce((acc, p) => acc + p.y, 0) / coords.length - 28; // Desplazado arriba para no tapar la flor

        ctx.save();
        ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = isGroupHovered ? 12 : 6;

        ctx.fillStyle = isGroupHovered ? '#FFF9C4' : 'rgba(255, 245, 180, 0.75)';
        ctx.fillText(c.label, avgX, avgY);
        ctx.restore();
      }
    });

    ctx.restore();
  }
}
