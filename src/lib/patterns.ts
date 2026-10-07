// Pattern generation logic — 12 patterns across 3 tiers
import { UserTier } from './userTier';

export type PatternId =
  // Ultra-básicos (guest, free, premium)
  | 'concentricCircles'
  | 'diagonalLines'
  | 'dotGrid'
  // Básicos (free, premium — bloqueados para guest)
  | 'wavyLines'
  | 'triangleGrid'
  | 'squareSpiral'
  | 'scandinavianCross'
  | 'verticalStripes'
  // Avanzados (solo premium)
  | 'voronoi'
  | 'artDeco'
  | 'tessellation'
  | 'fractalTree';

export type PatternTier = 'ultra-basic' | 'basic' | 'advanced';

export interface PatternConfig {
  type: PatternId;
  color: string;
  backgroundColor: string;
  density: number; // 0-100
  rotation: number; // 0-360
  scale: number; // 0.5-2.0
}

export interface PatternDefinition {
  id: PatternId;
  label: string;
  description: string;
  tier: PatternTier;
  emoji: string;
}

export const PATTERN_DEFINITIONS: PatternDefinition[] = [
  // Ultra-básicos
  { id: 'concentricCircles', label: 'Círculos Concéntricos', description: 'Anillos repetitivos', tier: 'ultra-basic', emoji: '◎' },
  { id: 'diagonalLines', label: 'Líneas Diagonales', description: 'Rayas en ángulo', tier: 'ultra-basic', emoji: '╱' },
  { id: 'dotGrid', label: 'Cuadrícula de Puntos', description: 'Puntos en rejilla', tier: 'ultra-basic', emoji: '⠿' },
  // Básicos
  { id: 'wavyLines', label: 'Líneas Onduladas', description: 'Ondas suaves', tier: 'basic', emoji: '∿' },
  { id: 'triangleGrid', label: 'Triángulos en Grid', description: 'Triángulos repetidos', tier: 'basic', emoji: '△' },
  { id: 'squareSpiral', label: 'Espiral Cuadrada', description: 'Espiral geométrica', tier: 'basic', emoji: '⌘' },
  { id: 'scandinavianCross', label: 'Cruz Escandinava', description: 'Cruces nórdicas', tier: 'basic', emoji: '✚' },
  { id: 'verticalStripes', label: 'Rayas Verticales', description: 'Bandas verticales', tier: 'basic', emoji: '▐' },
  // Avanzados
  { id: 'voronoi', label: 'Voronoi', description: 'Células orgánicas', tier: 'advanced', emoji: '⬡' },
  { id: 'artDeco', label: 'Art Deco', description: 'Líneas geométricas doradas', tier: 'advanced', emoji: '◈' },
  { id: 'tessellation', label: 'Tessellation', description: 'Teselado complejo', tier: 'advanced', emoji: '⬢' },
  { id: 'fractalTree', label: 'Fractal Tree', description: 'Árbol fractal', tier: 'advanced', emoji: '⚘' },
];

export const defaultConfig: PatternConfig = {
  type: 'concentricCircles',
  color: '#2563EB',
  backgroundColor: '#FAFAFA',
  density: 50,
  rotation: 0,
  scale: 1.0,
};

/**
 * Returns whether a pattern is accessible for a given tier.
 */
export function isPatternAvailable(patternId: PatternId, tier: UserTier): boolean {
  const def = PATTERN_DEFINITIONS.find((p) => p.id === patternId);
  if (!def) return false;

  switch (def.tier) {
    case 'ultra-basic':
      return true; // guest, free, premium
    case 'basic':
      return tier === 'free' || tier === 'premium';
    case 'advanced':
      return tier === 'premium';
  }
}

/**
 * Returns the lock message for a given tier/pattern combination.
 */
export function getLockMessage(patternId: PatternId, tier: UserTier): string {
  const def = PATTERN_DEFINITIONS.find((p) => p.id === patternId);
  if (!def) return '';

  if (tier === 'guest' && (def.tier === 'basic' || def.tier === 'ultra-basic')) {
    return 'Regístrate gratis para desbloquear más patrones';
  }
  if (tier === 'free' && def.tier === 'advanced') {
    return 'Desbloquea con Premium';
  }
  if (tier === 'guest' && def.tier === 'advanced') {
    return 'Regístrate gratis para desbloquear más patrones';
  }
  return '';
}

// ─── Seeded random ────────────────────────────────────────
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ─── Main render function ─────────────────────────────────
export function generatePattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: PatternConfig,
  seed: number = 42
) {
  const { type, color, backgroundColor, density, rotation, scale } = config;

  // Clear and fill background
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Apply rotation around center
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-width / 2, -height / 2);

  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  switch (type) {
    case 'concentricCircles':
      drawConcentricCircles(ctx, width, height, color, density, scale);
      break;
    case 'diagonalLines':
      drawDiagonalLines(ctx, width, height, color, density, scale);
      break;
    case 'dotGrid':
      drawDotGrid(ctx, width, height, color, density, scale);
      break;
    case 'wavyLines':
      drawWavyLines(ctx, width, height, color, density, scale);
      break;
    case 'triangleGrid':
      drawTriangleGrid(ctx, width, height, color, density, scale);
      break;
    case 'squareSpiral':
      drawSquareSpiral(ctx, width, height, color, density, scale);
      break;
    case 'scandinavianCross':
      drawScandinavianCross(ctx, width, height, color, density, scale);
      break;
    case 'verticalStripes':
      drawVerticalStripes(ctx, width, height, color, density, scale);
      break;
    case 'voronoi':
      drawVoronoi(ctx, width, height, color, backgroundColor, density, scale, seed);
      break;
    case 'artDeco':
      drawArtDeco(ctx, width, height, color, density, scale);
      break;
    case 'tessellation':
      drawTessellation(ctx, width, height, color, density, scale);
      break;
    case 'fractalTree':
      drawFractalTree(ctx, width, height, color, density, scale);
      break;
  }

  ctx.restore();
}

// ─── ULTRA-BASIC PATTERNS ─────────────────────────────────

function drawConcentricCircles(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  density: number,
  scale: number
) {
  // Calculate tile size based on scale (smaller scale = more tiles)
  const baseTileSize = 150;
  const tileSize = baseTileSize * scale;
  
  // Calculate how many tiles we need to fill the canvas
  const cols = Math.ceil(w / tileSize) + 1;
  const rows = Math.ceil(h / tileSize) + 1;
  
  const numCircles = Math.max(3, Math.floor(5 + (density / 100) * 25));
  const maxRadius = tileSize * 0.45;
  const spacing = maxRadius / numCircles;

  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, 2 * scale);

  // Draw concentric circles in a grid pattern
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * tileSize + tileSize / 2;
      const cy = row * tileSize + tileSize / 2;
      
      for (let i = 1; i <= numCircles; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, i * spacing, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }
}

function drawDiagonalLines(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  density: number,
  scale: number
) {
  const spacing = Math.max(8, 60 - (density / 100) * 50) / scale;
  const diagonal = Math.sqrt(w * w + h * h);

  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, 2 * scale);

  for (let i = -diagonal; i < diagonal * 2; i += spacing) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i - h, h);
    ctx.stroke();
  }
}

function drawDotGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  density: number,
  scale: number
) {
  // Base spacing adjusted by scale and density
  const baseSpacing = 50;
  const spacing = (baseSpacing - (density / 100) * 30) * scale;
  const radius = Math.max(1.5, (3 + (density / 100) * 4) * scale);

  ctx.fillStyle = color;

  // Calculate grid to fill entire canvas with extra margin
  const startX = -spacing;
  const startY = -spacing;
  const endX = w + spacing;
  const endY = h + spacing;

  for (let x = startX; x < endX; x += spacing) {
    for (let y = startY; y < endY; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// ─── BASIC PATTERNS ───────────────────────────────────────

function drawWavyLines(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  density: number,
  scale: number
) {
  // Calculate spacing based on density and scale
  const baseSpacing = 40;
  const spacing = (baseSpacing - (density / 100) * 25) * scale;
  const amplitude = (20 + (density / 100) * 30) * scale;
  const frequency = (0.01 + (density / 100) * 0.03) / scale;

  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, 2.5 * scale);

  // Calculate number of lines needed to fill canvas
  const numLines = Math.ceil(h / spacing) + 2;

  for (let i = 0; i < numLines; i++) {
    const baseY = i * spacing;
    ctx.beginPath();
    // Extend beyond canvas edges to ensure full coverage
    for (let x = -10; x <= w + 10; x += 2) {
      const y = baseY + Math.sin(x * frequency + i * 0.8) * amplitude;
      if (x === -10) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

function drawTriangleGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  density: number,
  scale: number
) {
  // Calculate triangle size based on density and scale
  const baseSize = 60;
  const size = (baseSize - (density / 100) * 40) * scale;
  const triangleHeight = size * (Math.sqrt(3) / 2);

  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(0.5, 1.5 * scale);

  // Calculate grid dimensions to fill canvas
  const cols = Math.ceil(w / size) + 2;
  const rows = Math.ceil(h / triangleHeight) + 2;

  for (let row = 0; row < rows; row++) {
    const offset = row % 2 === 0 ? 0 : size / 2;
    for (let col = -1; col < cols; col++) {
      const x = col * size + offset;
      const y = row * triangleHeight;
      
      // Upward triangle
      ctx.beginPath();
      ctx.moveTo(x, y + triangleHeight);
      ctx.lineTo(x + size / 2, y);
      ctx.lineTo(x + size, y + triangleHeight);
      ctx.closePath();
      ctx.stroke();
    }
  }
}

function drawSquareSpiral(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  density: number,
  scale: number
) {
  // Create a grid of spirals to fill the canvas
  const baseTileSize = 120;
  const tileSize = baseTileSize * scale;
  
  const cols = Math.ceil(w / tileSize) + 1;
  const rows = Math.ceil(h / tileSize) + 1;
  
  const maxSteps = Math.max(10, Math.floor(20 + (density / 100) * 60));
  const stepSize = Math.max(4, 12 * scale);

  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, 2 * scale);

  // Draw spirals in a grid
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * tileSize + tileSize / 2;
      const cy = row * tileSize + tileSize / 2;
      
      let x = cx;
      let y = cy;
      let direction = 0;
      let stepsInDirection = 1;
      let directionChanges = 0;

      ctx.beginPath();
      ctx.moveTo(x, y);

      for (let i = 0; i < maxSteps; i++) {
        for (let s = 0; s < stepsInDirection; s++) {
          switch (direction) {
            case 0: x += stepSize; break;
            case 1: y += stepSize; break;
            case 2: x -= stepSize; break;
            case 3: y -= stepSize; break;
          }
          ctx.lineTo(x, y);
        }
        direction = (direction + 1) % 4;
        directionChanges++;
        if (directionChanges % 2 === 0) {
          stepsInDirection++;
        }
      }
      ctx.stroke();
    }
  }
}

function drawScandinavianCross(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  density: number,
  scale: number
) {
  // Calculate spacing based on density and scale
  const baseSpacing = 80;
  const spacing = (baseSpacing - (density / 100) * 50) * scale;
  const armLength = spacing * 0.35;
  const armWidth = Math.max(2, 4 * scale);

  ctx.fillStyle = color;

  // Calculate grid to fill entire canvas with margin
  const startX = -spacing;
  const startY = -spacing;
  const endX = w + spacing;
  const endY = h + spacing;

  for (let x = startX; x < endX; x += spacing) {
    for (let y = startY; y < endY; y += spacing) {
      // Vertical bar
      ctx.fillRect(x - armWidth / 2, y - armLength, armWidth, armLength * 2);
      // Horizontal bar
      ctx.fillRect(x - armLength, y - armWidth / 2, armLength * 2, armWidth);
    }
  }
}

function drawVerticalStripes(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  density: number,
  scale: number
) {
  // Calculate stripe dimensions based on density and scale
  const baseWidth = 30;
  const baseGap = 20;
  const stripeWidth = (baseWidth - (density / 100) * 20) * scale;
  const gap = (baseGap - (density / 100) * 15) * scale;

  ctx.fillStyle = color;

  // Draw stripes across entire canvas with margin
  const startX = -stripeWidth - gap;
  const endX = w + stripeWidth + gap;

  for (let x = startX; x < endX; x += stripeWidth + gap) {
    ctx.fillRect(x, -10, stripeWidth, h + 20);
  }
}

// ─── ADVANCED PATTERNS ────────────────────────────────────

function drawVoronoi(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  _bgColor: string,
  density: number,
  scale: number,
  seed: number
) {
  // Calculate number of points based on canvas size and density
  const area = w * h;
  const basePointsPerArea = 0.00005;
  const numPoints = Math.max(10, Math.floor(area * basePointsPerArea * (0.5 + density / 100) / (scale * scale)));
  
  const rand = seededRandom(seed);

  // Generate random points with margin to ensure coverage
  const margin = 50 * scale;
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: -margin + rand() * (w + margin * 2),
      y: -margin + rand() * (h + margin * 2),
    });
  }

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(0.5, 1.5 * scale);

  // Draw edges by finding midpoints between neighboring points
  const maxDist = Math.max(w, h) / Math.sqrt(numPoints) * 1.8;
  
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[j].x - points[i].x;
      const dy = points[j].y - points[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxDist) {
        const mx = (points[i].x + points[j].x) / 2;
        const my = (points[i].y + points[j].y) / 2;

        // Perpendicular line at midpoint
        const angle = Math.atan2(dy, dx) + Math.PI / 2;
        const len = dist * 0.6;

        ctx.beginPath();
        ctx.moveTo(mx - Math.cos(angle) * len, my - Math.sin(angle) * len);
        ctx.lineTo(mx + Math.cos(angle) * len, my + Math.sin(angle) * len);
        ctx.stroke();
      }
    }
  }

  // Draw all points
  for (const p of points) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3 * scale, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawArtDeco(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  density: number,
  scale: number
) {
  // Create a grid of Art Deco fans to fill the canvas
  const baseTileSize = 200;
  const tileSize = baseTileSize * scale;
  
  const cols = Math.ceil(w / tileSize) + 1;
  const rows = Math.ceil(h / tileSize) + 1;
  
  const numRays = Math.max(6, Math.floor(8 + (density / 100) * 24));
  const maxRadius = tileSize * 0.7;
  const numArcs = Math.max(3, Math.floor(4 + (density / 100) * 8));

  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, 2.5 * scale);

  // Draw Art Deco fans in a grid
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * tileSize + tileSize / 2;
      const cy = row * tileSize + tileSize / 2;

      // Fan rays
      for (let i = 0; i <= numRays; i++) {
        const angle = -Math.PI + (Math.PI * i) / numRays;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(
          cx + Math.cos(angle) * maxRadius,
          cy + Math.sin(angle) * maxRadius
        );
        ctx.stroke();
      }

      // Concentric arcs
      for (let i = 1; i <= numArcs; i++) {
        const radius = (i / numArcs) * maxRadius * 0.8;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, -Math.PI, 0);
        ctx.stroke();
      }

      // Decorative diamond
      const diamondSize = 20 * scale;
      ctx.beginPath();
      ctx.moveTo(cx, cy - tileSize * 0.3);
      ctx.lineTo(cx + diamondSize, cy - tileSize * 0.3 + diamondSize);
      ctx.lineTo(cx, cy - tileSize * 0.3 + diamondSize * 2);
      ctx.lineTo(cx - diamondSize, cy - tileSize * 0.3 + diamondSize);
      ctx.closePath();
      ctx.stroke();
    }
  }
}

function drawTessellation(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  density: number,
  scale: number
) {
  // Calculate hexagon size based on density and scale
  const baseSize = 60;
  const size = (baseSize - (density / 100) * 35) * scale;
  const hexHeight = size * Math.sqrt(3);

  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(0.5, 1.5 * scale);

  // Calculate grid dimensions to fill canvas
  const rows = Math.ceil(h / (hexHeight * 0.75)) + 2;
  const cols = Math.ceil(w / (size * 3)) + 2;

  for (let row = -1; row < rows; row++) {
    const y = row * hexHeight * 0.75;
    const offset = row % 2 === 0 ? 0 : size * 1.5;
    
    for (let col = -1; col < cols; col++) {
      const x = col * size * 3 + offset;
      
      // Draw outer hexagon
      drawHexagonShape(ctx, x, y, size);
      // Draw inner hexagon
      drawHexagonShape(ctx, x, y, size * 0.5);
      // Draw connecting lines
      ctx.beginPath();
      ctx.moveTo(x - size * 0.5, y - size * 0.3);
      ctx.lineTo(x + size * 0.5, y + size * 0.3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + size * 0.5, y - size * 0.3);
      ctx.lineTo(x - size * 0.5, y + size * 0.3);
      ctx.stroke();
    }
  }
}

function drawHexagonShape(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
}

// ─── SVG GENERATION FUNCTIONS ─────────────────────────────

export function generateSVG(
  width: number,
  height: number,
  config: PatternConfig,
  seed: number = 42,
  transparentBackground: boolean = false
): string {
  const { type, color, backgroundColor, density, rotation, scale } = config;
  const bgColor = transparentBackground ? 'none' : backgroundColor;

  let patternContent = '';
  switch (type) {
    case 'concentricCircles':
      patternContent = svgConcentricCircles(width, height, color, density, scale);
      break;
    case 'diagonalLines':
      patternContent = svgDiagonalLines(width, height, color, density, scale);
      break;
    case 'dotGrid':
      patternContent = svgDotGrid(width, height, color, density, scale);
      break;
    case 'wavyLines':
      patternContent = svgWavyLines(width, height, color, density, scale);
      break;
    case 'triangleGrid':
      patternContent = svgTriangleGrid(width, height, color, density, scale);
      break;
    case 'squareSpiral':
      patternContent = svgSquareSpiral(width, height, color, density, scale);
      break;
    case 'scandinavianCross':
      patternContent = svgScandinavianCross(width, height, color, density, scale);
      break;
    case 'verticalStripes':
      patternContent = svgVerticalStripes(width, height, color, density, scale);
      break;
    case 'voronoi':
      patternContent = svgVoronoi(width, height, color, density, scale, seed);
      break;
    case 'artDeco':
      patternContent = svgArtDeco(width, height, color, density, scale);
      break;
    case 'tessellation':
      patternContent = svgTessellation(width, height, color, density, scale);
      break;
    case 'fractalTree':
      patternContent = svgFractalTree(width, height, color, density, scale);
      break;
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  <g transform="rotate(${rotation} ${width / 2} ${height / 2})">
    ${patternContent}
  </g>
</svg>`;

  return svg;
}

function svgConcentricCircles(w: number, h: number, color: string, density: number, scale: number): string {
  // Calculate tile size based on scale
  const baseTileSize = 150;
  const tileSize = baseTileSize * scale;
  
  const cols = Math.ceil(w / tileSize) + 1;
  const rows = Math.ceil(h / tileSize) + 1;
  
  const numCircles = Math.max(3, Math.floor(5 + (density / 100) * 25));
  const maxRadius = tileSize * 0.45;
  const spacing = maxRadius / numCircles;
  const strokeWidth = Math.max(1, 2 * scale);

  let circles = '';
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * tileSize + tileSize / 2;
      const cy = row * tileSize + tileSize / 2;
      
      for (let i = 1; i <= numCircles; i++) {
        circles += `<circle cx="${cx}" cy="${cy}" r="${i * spacing}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>`;
      }
    }
  }
  return circles;
}

function svgDiagonalLines(w: number, h: number, color: string, density: number, scale: number): string {
  const spacing = Math.max(8, 60 - (density / 100) * 50) / scale;
  const diagonal = Math.sqrt(w * w + h * h);
  const strokeWidth = Math.max(1, 2 * scale);

  let lines = '';
  for (let i = -diagonal; i < diagonal * 2; i += spacing) {
    lines += `<line x1="${i}" y1="0" x2="${i - h}" y2="${h}" stroke="${color}" stroke-width="${strokeWidth}"/>`;
  }
  return lines;
}

function svgDotGrid(w: number, h: number, color: string, density: number, scale: number): string {
  const baseSpacing = 50;
  const spacing = (baseSpacing - (density / 100) * 30) * scale;
  const radius = Math.max(1.5, (3 + (density / 100) * 4) * scale);

  let dots = '';
  const startX = -spacing;
  const startY = -spacing;
  const endX = w + spacing;
  const endY = h + spacing;

  for (let x = startX; x < endX; x += spacing) {
    for (let y = startY; y < endY; y += spacing) {
      dots += `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}"/>`;
    }
  }
  return dots;
}

function svgWavyLines(w: number, h: number, color: string, density: number, scale: number): string {
  const baseSpacing = 40;
  const spacing = (baseSpacing - (density / 100) * 25) * scale;
  const amplitude = (20 + (density / 100) * 30) * scale;
  const frequency = (0.01 + (density / 100) * 0.03) / scale;
  const strokeWidth = Math.max(1, 2.5 * scale);

  const numLines = Math.ceil(h / spacing) + 2;

  let waves = '';
  for (let i = 0; i < numLines; i++) {
    const baseY = i * spacing;
    let path = `M -10 ${baseY}`;
    for (let x = -10; x <= w + 10; x += 2) {
      const y = baseY + Math.sin(x * frequency + i * 0.8) * amplitude;
      path += ` L ${x} ${y}`;
    }
    waves += `<path d="${path}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>`;
  }
  return waves;
}

function svgTriangleGrid(w: number, h: number, color: string, density: number, scale: number): string {
  const baseSize = 60;
  const size = (baseSize - (density / 100) * 40) * scale;
  const triangleHeight = size * (Math.sqrt(3) / 2);
  const strokeWidth = Math.max(0.5, 1.5 * scale);

  const cols = Math.ceil(w / size) + 2;
  const rows = Math.ceil(h / triangleHeight) + 2;

  let triangles = '';
  for (let row = 0; row < rows; row++) {
    const offset = row % 2 === 0 ? 0 : size / 2;
    for (let col = -1; col < cols; col++) {
      const x = col * size + offset;
      const y = row * triangleHeight;
      
      const p1 = `${x},${y + triangleHeight}`;
      const p2 = `${x + size / 2},${y}`;
      const p3 = `${x + size},${y + triangleHeight}`;
      triangles += `<polygon points="${p1} ${p2} ${p3}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>`;
    }
  }
  return triangles;
}

function svgSquareSpiral(w: number, h: number, color: string, density: number, scale: number): string {
  const baseTileSize = 120;
  const tileSize = baseTileSize * scale;
  
  const cols = Math.ceil(w / tileSize) + 1;
  const rows = Math.ceil(h / tileSize) + 1;
  
  const maxSteps = Math.max(10, Math.floor(20 + (density / 100) * 60));
  const stepSize = Math.max(4, 12 * scale);
  const strokeWidth = Math.max(1, 2 * scale);

  let spirals = '';
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * tileSize + tileSize / 2;
      const cy = row * tileSize + tileSize / 2;
      
      let x = cx;
      let y = cy;
      let direction = 0;
      let stepsInDirection = 1;
      let directionChanges = 0;
      let path = `M ${x} ${y}`;

      for (let i = 0; i < maxSteps; i++) {
        for (let s = 0; s < stepsInDirection; s++) {
          switch (direction) {
            case 0: x += stepSize; break;
            case 1: y += stepSize; break;
            case 2: x -= stepSize; break;
            case 3: y -= stepSize; break;
          }
          path += ` L ${x} ${y}`;
        }
        direction = (direction + 1) % 4;
        directionChanges++;
        if (directionChanges % 2 === 0) {
          stepsInDirection++;
        }
      }

      spirals += `<path d="${path}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>`;
    }
  }
  
  return spirals;
}

function svgScandinavianCross(w: number, h: number, color: string, density: number, scale: number): string {
  const baseSpacing = 80;
  const spacing = (baseSpacing - (density / 100) * 50) * scale;
  const armLength = spacing * 0.35;
  const armWidth = Math.max(2, 4 * scale);

  let crosses = '';
  const startX = -spacing;
  const startY = -spacing;
  const endX = w + spacing;
  const endY = h + spacing;

  for (let x = startX; x < endX; x += spacing) {
    for (let y = startY; y < endY; y += spacing) {
      crosses += `<rect x="${x - armWidth / 2}" y="${y - armLength}" width="${armWidth}" height="${armLength * 2}" fill="${color}"/>`;
      crosses += `<rect x="${x - armLength}" y="${y - armWidth / 2}" width="${armLength * 2}" height="${armWidth}" fill="${color}"/>`;
    }
  }
  return crosses;
}

function svgVerticalStripes(w: number, h: number, color: string, density: number, scale: number): string {
  const baseWidth = 30;
  const baseGap = 20;
  const stripeWidth = (baseWidth - (density / 100) * 20) * scale;
  const gap = (baseGap - (density / 100) * 15) * scale;

  let stripes = '';
  const startX = -stripeWidth - gap;
  const endX = w + stripeWidth + gap;

  for (let x = startX; x < endX; x += stripeWidth + gap) {
    stripes += `<rect x="${x}" y="-10" width="${stripeWidth}" height="${h + 20}" fill="${color}"/>`;
  }
  return stripes;
}

function svgVoronoi(w: number, h: number, color: string, density: number, scale: number, seed: number): string {
  const area = w * h;
  const basePointsPerArea = 0.00005;
  const numPoints = Math.max(10, Math.floor(area * basePointsPerArea * (0.5 + density / 100) / (scale * scale)));
  
  const rand = seededRandom(seed);
  const strokeWidth = Math.max(0.5, 1.5 * scale);

  const margin = 50 * scale;
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: -margin + rand() * (w + margin * 2),
      y: -margin + rand() * (h + margin * 2),
    });
  }

  let voronoi = '';
  const maxDist = Math.max(w, h) / Math.sqrt(numPoints) * 1.8;
  
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[j].x - points[i].x;
      const dy = points[j].y - points[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxDist) {
        const mx = (points[i].x + points[j].x) / 2;
        const my = (points[i].y + points[j].y) / 2;
        const angle = Math.atan2(dy, dx) + Math.PI / 2;
        const len = dist * 0.6;

        voronoi += `<line x1="${mx - Math.cos(angle) * len}" y1="${my - Math.sin(angle) * len}" x2="${mx + Math.cos(angle) * len}" y2="${my + Math.sin(angle) * len}" stroke="${color}" stroke-width="${strokeWidth}"/>`;
      }
    }
  }

  for (const p of points) {
    voronoi += `<circle cx="${p.x}" cy="${p.y}" r="${3 * scale}" fill="${color}"/>`;
  }

  return voronoi;
}

function svgArtDeco(w: number, h: number, color: string, density: number, scale: number): string {
  const baseTileSize = 200;
  const tileSize = baseTileSize * scale;
  
  const cols = Math.ceil(w / tileSize) + 1;
  const rows = Math.ceil(h / tileSize) + 1;
  
  const numRays = Math.max(6, Math.floor(8 + (density / 100) * 24));
  const maxRadius = tileSize * 0.7;
  const numArcs = Math.max(3, Math.floor(4 + (density / 100) * 8));
  const strokeWidth = Math.max(1, 2.5 * scale);

  let artDeco = '';

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * tileSize + tileSize / 2;
      const cy = row * tileSize + tileSize / 2;

      // Fan rays
      for (let i = 0; i <= numRays; i++) {
        const angle = -Math.PI + (Math.PI * i) / numRays;
        const x2 = cx + Math.cos(angle) * maxRadius;
        const y2 = cy + Math.sin(angle) * maxRadius;
        artDeco += `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${strokeWidth}"/>`;
      }

      // Concentric arcs
      for (let i = 1; i <= numArcs; i++) {
        const radius = (i / numArcs) * maxRadius * 0.8;
        artDeco += `<path d="M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>`;
      }

      // Diamond
      const diamondSize = 20 * scale;
      const dy = cy - tileSize * 0.3;
      artDeco += `<polygon points="${cx},${dy} ${cx + diamondSize},${dy + diamondSize} ${cx},${dy + diamondSize * 2} ${cx - diamondSize},${dy + diamondSize}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>`;
    }
  }

  return artDeco;
}

function svgTessellation(w: number, h: number, color: string, density: number, scale: number): string {
  const baseSize = 60;
  const size = (baseSize - (density / 100) * 35) * scale;
  const hexHeight = size * Math.sqrt(3);
  const strokeWidth = Math.max(0.5, 1.5 * scale);

  const rows = Math.ceil(h / (hexHeight * 0.75)) + 2;
  const cols = Math.ceil(w / (size * 3)) + 2;

  let tessellation = '';
  for (let row = -1; row < rows; row++) {
    const y = row * hexHeight * 0.75;
    const offset = row % 2 === 0 ? 0 : size * 1.5;
    
    for (let col = -1; col < cols; col++) {
      const x = col * size * 3 + offset;
      
      tessellation += svgHexagonPath(x, y, size, color, strokeWidth);
      tessellation += svgHexagonPath(x, y, size * 0.5, color, strokeWidth);
      tessellation += `<line x1="${x - size * 0.5}" y1="${y - size * 0.3}" x2="${x + size * 0.5}" y2="${y + size * 0.3}" stroke="${color}" stroke-width="${strokeWidth}"/>`;
      tessellation += `<line x1="${x + size * 0.5}" y1="${y - size * 0.3}" x2="${x - size * 0.5}" y2="${y + size * 0.3}" stroke="${color}" stroke-width="${strokeWidth}"/>`;
    }
  }
  return tessellation;
}

function svgHexagonPath(cx: number, cy: number, r: number, color: string, strokeWidth: number): string {
  let points = '';
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points += `${x},${y} `;
  }
  return `<polygon points="${points.trim()}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>`;
}

function svgFractalTree(w: number, h: number, color: string, density: number, scale: number): string {
  const baseTileSize = 180;
  const tileSize = baseTileSize * scale;
  
  const cols = Math.ceil(w / tileSize) + 1;
  const rows = Math.ceil(h / tileSize) + 1;
  
  const maxDepth = Math.max(3, Math.floor(4 + (density / 100) * 7));
  const branchLength = tileSize * 0.3;
  const branchAngle = Math.PI / 6 + (density / 100) * (Math.PI / 6);

  let trees = '';

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const startX = col * tileSize + tileSize / 2;
      const startY = row * tileSize + tileSize * 0.85;

      // Trunk
      const trunkWidth = Math.max(2, 4 * scale);
      trees += `<line x1="${startX}" y1="${startY}" x2="${startX}" y2="${startY - branchLength * 0.5}" stroke="${color}" stroke-width="${trunkWidth}"/>`;

      // Branches
      trees += svgBranch(startX, startY - branchLength * 0.5, -Math.PI / 2 - branchAngle, branchLength * 0.7, 1, maxDepth, color, scale, branchAngle, density);
      trees += svgBranch(startX, startY - branchLength * 0.5, -Math.PI / 2 + branchAngle, branchLength * 0.7, 1, maxDepth, color, scale, branchAngle, density);
      trees += svgBranch(startX, startY - branchLength * 0.5, -Math.PI / 2, branchLength * 0.8, 1, maxDepth, color, scale, branchAngle, density);
    }
  }

  return trees;
}

function svgBranch(x: number, y: number, angle: number, length: number, depth: number, maxDepth: number, color: string, scale: number, branchAngle: number, density: number): string {
  if (depth > maxDepth || length < 3) return '';

  const endX = x + Math.cos(angle) * length;
  const endY = y + Math.sin(angle) * length;
  const strokeWidth = Math.max(0.5, (maxDepth - depth + 1) * 0.8 * scale);

  let branch = `<line x1="${x}" y1="${y}" x2="${endX}" y2="${endY}" stroke="${color}" stroke-width="${strokeWidth}"/>`;

  branch += svgBranch(endX, endY, angle - branchAngle, length * 0.72, depth + 1, maxDepth, color, scale, branchAngle, density);
  branch += svgBranch(endX, endY, angle + branchAngle, length * 0.72, depth + 1, maxDepth, color, scale, branchAngle, density);

  if (density > 50 && depth < maxDepth - 1) {
    branch += svgBranch(endX, endY, angle, length * 0.5, depth + 2, maxDepth, color, scale, branchAngle, density);
  }

  return branch;
}

function drawFractalTree(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  density: number,
  scale: number
) {
  // Create a grid of fractal trees to fill the canvas
  const baseTileSize = 180;
  const tileSize = baseTileSize * scale;
  
  const cols = Math.ceil(w / tileSize) + 1;
  const rows = Math.ceil(h / tileSize) + 1;
  
  const maxDepth = Math.max(3, Math.floor(4 + (density / 100) * 7));
  const branchLength = tileSize * 0.3;
  const branchAngle = Math.PI / 6 + (density / 100) * (Math.PI / 6);

  ctx.strokeStyle = color;

  function drawBranch(x: number, y: number, angle: number, length: number, depth: number) {
    if (depth > maxDepth || length < 3) return;

    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;

    ctx.lineWidth = Math.max(0.5, (maxDepth - depth + 1) * 0.8 * scale);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Branch out
    drawBranch(endX, endY, angle - branchAngle, length * 0.72, depth + 1);
    drawBranch(endX, endY, angle + branchAngle, length * 0.72, depth + 1);

    // Extra branch at higher density
    if (density > 50 && depth < maxDepth - 1) {
      drawBranch(endX, endY, angle, length * 0.5, depth + 2);
    }
  }

  // Draw trees in a grid
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const startX = col * tileSize + tileSize / 2;
      const startY = row * tileSize + tileSize * 0.85;

      // Trunk
      ctx.lineWidth = Math.max(2, 4 * scale);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX, startY - branchLength * 0.5);
      ctx.stroke();

      // Branches
      drawBranch(startX, startY - branchLength * 0.5, -Math.PI / 2 - branchAngle, branchLength * 0.7, 1);
      drawBranch(startX, startY - branchLength * 0.5, -Math.PI / 2 + branchAngle, branchLength * 0.7, 1);
      drawBranch(startX, startY - branchLength * 0.5, -Math.PI / 2, branchLength * 0.8, 1);
    }
  }
}
