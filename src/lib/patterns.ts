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

  // Generate pattern at 2x size to ensure it fills the canvas when rotated
  const patternWidth = width * 2;
  const patternHeight = height * 2;

  // Clear and fill background
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Apply rotation around center
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  // Offset to center the larger pattern
  ctx.translate(-patternWidth / 2, -patternHeight / 2);

  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  switch (type) {
    case 'concentricCircles':
      drawConcentricCircles(ctx, patternWidth, patternHeight, color, density, scale);
      break;
    case 'diagonalLines':
      drawDiagonalLines(ctx, patternWidth, patternHeight, color, density, scale);
      break;
    case 'dotGrid':
      drawDotGrid(ctx, patternWidth, patternHeight, color, density, scale);
      break;
    case 'wavyLines':
      drawWavyLines(ctx, patternWidth, patternHeight, color, density, scale);
      break;
    case 'triangleGrid':
      drawTriangleGrid(ctx, patternWidth, patternHeight, color, density, scale);
      break;
    case 'squareSpiral':
      drawSquareSpiral(ctx, patternWidth, patternHeight, color, density, scale);
      break;
    case 'scandinavianCross':
      drawScandinavianCross(ctx, patternWidth, patternHeight, color, density, scale);
      break;
    case 'verticalStripes':
      drawVerticalStripes(ctx, patternWidth, patternHeight, color, density, scale);
      break;
    case 'voronoi':
      drawVoronoi(ctx, patternWidth, patternHeight, color, backgroundColor, density, scale, seed);
      break;
    case 'artDeco':
      drawArtDeco(ctx, patternWidth, patternHeight, color, density, scale);
      break;
    case 'tessellation':
      drawTessellation(ctx, patternWidth, patternHeight, color, density, scale);
      break;
    case 'fractalTree':
      drawFractalTree(ctx, patternWidth, patternHeight, color, density, scale);
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
  const cx = w / 2;
  const cy = h / 2;
  // Make the pattern fill the entire canvas
  const maxRadius = Math.max(w, h) * 0.8 * scale;
  const numCircles = Math.max(3, Math.floor(5 + (density / 100) * 25));
  const spacing = maxRadius / numCircles;

  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, 2 * scale);

  // Draw concentric circles filling the canvas
  for (let i = 1; i <= numCircles; i++) {
    ctx.beginPath();
    ctx.arc(cx, cy, i * spacing, 0, Math.PI * 2);
    ctx.stroke();
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
  const spacing = Math.max(10, 50 - (density / 100) * 40) / scale;
  const radius = Math.max(1.5, (3 + (density / 100) * 4) * scale);

  ctx.fillStyle = color;

  for (let x = spacing / 2; x < w + spacing; x += spacing) {
    for (let y = spacing / 2; y < h + spacing; y += spacing) {
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
  const numLines = Math.max(3, Math.floor(4 + (density / 100) * 16));
  const amplitude = (20 + (density / 100) * 30) * scale;
  const frequency = (0.01 + (density / 100) * 0.03) / scale;
  const spacing = h / (numLines + 1);

  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, 2.5 * scale);

  for (let i = 1; i <= numLines; i++) {
    const baseY = i * spacing;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const y = baseY + Math.sin(x * frequency + i * 0.8) * amplitude;
      if (x === 0) ctx.moveTo(x, y);
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
  const size = Math.max(15, 60 - (density / 100) * 45) / scale;
  const height = size * (Math.sqrt(3) / 2);

  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(0.5, 1.5 * scale);

  let row = 0;
  for (let y = 0; y < h + height * 2; y += height) {
    const offset = row % 2 === 0 ? 0 : size / 2;
    for (let x = -size + offset; x < w + size; x += size) {
      // Upward triangle
      ctx.beginPath();
      ctx.moveTo(x, y + height);
      ctx.lineTo(x + size / 2, y);
      ctx.lineTo(x + size, y + height);
      ctx.closePath();
      ctx.stroke();
    }
    row++;
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
  const cx = w / 2;
  const cy = h / 2;
  const maxSteps = Math.max(10, Math.floor(20 + (density / 100) * 60));
  const stepSize = Math.max(4, 12 * scale);

  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, 2 * scale);

  let x = cx;
  let y = cy;
  let direction = 0; // 0=right, 1=down, 2=left, 3=up
  let stepsInDirection = 1;
  let stepsTaken = 0;
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
      stepsTaken++;
    }
    direction = (direction + 1) % 4;
    directionChanges++;
    if (directionChanges % 2 === 0) {
      stepsInDirection++;
    }
  }
  ctx.stroke();
}

function drawScandinavianCross(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  density: number,
  scale: number
) {
  const spacing = Math.max(25, 80 - (density / 100) * 55) / scale;
  const armLength = spacing * 0.35 * scale;
  const armWidth = Math.max(2, 4 * scale);

  ctx.fillStyle = color;

  for (let x = spacing / 2; x < w + spacing; x += spacing) {
    for (let y = spacing / 2; y < h + spacing; y += spacing) {
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
  const stripeWidth = Math.max(4, 30 - (density / 100) * 25) * scale;
  const gap = Math.max(4, 20 - (density / 100) * 15) * scale;

  ctx.fillStyle = color;

  for (let x = 0; x < w + stripeWidth + gap; x += stripeWidth + gap) {
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
  const numPoints = Math.max(5, Math.floor(8 + (density / 100) * 40));
  const rand = seededRandom(seed);

  // Generate random points
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: rand() * w,
      y: rand() * h,
    });
  }

  // Draw Voronoi-like cells using nearest-point pixel assignment (simplified)
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(0.5, 1.5 * scale);

  // Draw edges by finding midpoints between neighboring points
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[j].x - points[i].x;
      const dy = points[j].y - points[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < (Math.max(w, h) / Math.sqrt(numPoints)) * 1.8) {
        // Draw connecting line
        const mx = (points[i].x + points[j].x) / 2;
        const my = (points[i].y + points[j].y) / 2;

        // Perpendicular line at midpoint
        const angle = Math.atan2(dy, dx) + Math.PI / 2;
        const len = dist * 0.6;

        ctx.beginPath();
        ctx.moveTo(mx - Math.cos(angle) * len, my - Math.sin(angle) * len);
        ctx.lineTo(mx + Math.cos(angle) * len, my + Math.sin(angle) * len);
        ctx.stroke();

        // Draw points
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 3 * scale, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Draw all points
  ctx.fillStyle = color;
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
  const cx = w / 2;
  const cy = h / 2;
  const numRays = Math.max(6, Math.floor(8 + (density / 100) * 24));
  const maxRadius = Math.max(w, h) * 0.7;

  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, 2.5 * scale);

  // Fan rays from bottom center
  for (let i = 0; i <= numRays; i++) {
    const angle = -Math.PI + (Math.PI * i) / numRays;
    ctx.beginPath();
    ctx.moveTo(cx, cy + h * 0.3);
    ctx.lineTo(
      cx + Math.cos(angle) * maxRadius,
      cy + h * 0.3 + Math.sin(angle) * maxRadius
    );
    ctx.stroke();
  }

  // Concentric arcs
  const numArcs = Math.max(3, Math.floor(4 + (density / 100) * 8));
  for (let i = 1; i <= numArcs; i++) {
    const radius = (i / numArcs) * maxRadius * 0.8 * scale;
    ctx.beginPath();
    ctx.arc(cx, cy + h * 0.3, radius, -Math.PI, 0);
    ctx.stroke();
  }

  // Decorative diamond at top
  const diamondSize = 20 * scale;
  ctx.beginPath();
  ctx.moveTo(cx, cy - h * 0.3);
  ctx.lineTo(cx + diamondSize, cy - h * 0.3 + diamondSize);
  ctx.lineTo(cx, cy - h * 0.3 + diamondSize * 2);
  ctx.lineTo(cx - diamondSize, cy - h * 0.3 + diamondSize);
  ctx.closePath();
  ctx.stroke();
}

function drawTessellation(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  density: number,
  scale: number
) {
  const size = Math.max(20, 60 - (density / 100) * 40) / scale;
  const hexHeight = size * Math.sqrt(3);

  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(0.5, 1.5 * scale);

  let row = 0;
  for (let y = -hexHeight; y < h + hexHeight; y += hexHeight * 0.75) {
    const offset = row % 2 === 0 ? 0 : size * 1.5;
    for (let x = -size * 2 + offset; x < w + size * 2; x += size * 3) {
      // Draw hexagon
      drawHexagonShape(ctx, x, y, size);
      // Inner pattern — smaller rotated hexagon
      drawHexagonShape(ctx, x, y, size * 0.5);
      // Connecting lines
      ctx.beginPath();
      ctx.moveTo(x - size * 0.5, y - size * 0.3);
      ctx.lineTo(x + size * 0.5, y + size * 0.3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + size * 0.5, y - size * 0.3);
      ctx.lineTo(x - size * 0.5, y + size * 0.3);
      ctx.stroke();
    }
    row++;
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

  // Generate pattern at 2x size to ensure it fills the canvas when rotated
  const patternWidth = width * 2;
  const patternHeight = height * 2;

  let patternContent = '';
  switch (type) {
    case 'concentricCircles':
      patternContent = svgConcentricCircles(patternWidth, patternHeight, color, density, scale);
      break;
    case 'diagonalLines':
      patternContent = svgDiagonalLines(patternWidth, patternHeight, color, density, scale);
      break;
    case 'dotGrid':
      patternContent = svgDotGrid(patternWidth, patternHeight, color, density, scale);
      break;
    case 'wavyLines':
      patternContent = svgWavyLines(patternWidth, patternHeight, color, density, scale);
      break;
    case 'triangleGrid':
      patternContent = svgTriangleGrid(patternWidth, patternHeight, color, density, scale);
      break;
    case 'squareSpiral':
      patternContent = svgSquareSpiral(patternWidth, patternHeight, color, density, scale);
      break;
    case 'scandinavianCross':
      patternContent = svgScandinavianCross(patternWidth, patternHeight, color, density, scale);
      break;
    case 'verticalStripes':
      patternContent = svgVerticalStripes(patternWidth, patternHeight, color, density, scale);
      break;
    case 'voronoi':
      patternContent = svgVoronoi(patternWidth, patternHeight, color, density, scale, seed);
      break;
    case 'artDeco':
      patternContent = svgArtDeco(patternWidth, patternHeight, color, density, scale);
      break;
    case 'tessellation':
      patternContent = svgTessellation(patternWidth, patternHeight, color, density, scale);
      break;
    case 'fractalTree':
      patternContent = svgFractalTree(patternWidth, patternHeight, color, density, scale);
      break;
  }

  // Calculate offset to center the larger pattern
  const offsetX = (patternWidth - width) / 2;
  const offsetY = (patternHeight - height) / 2;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  <g transform="translate(-${offsetX}, -${offsetY}) rotate(${rotation} ${patternWidth / 2} ${patternHeight / 2})">
    ${patternContent}
  </g>
</svg>`;

  return svg;
}

function svgConcentricCircles(w: number, h: number, color: string, density: number, scale: number): string {
  const cx = w / 2;
  const cy = h / 2;
  const maxRadius = Math.max(w, h) * 0.8 * scale;
  const numCircles = Math.max(3, Math.floor(5 + (density / 100) * 25));
  const spacing = maxRadius / numCircles;
  const strokeWidth = Math.max(1, 2 * scale);

  let circles = '';
  for (let i = 1; i <= numCircles; i++) {
    circles += `<circle cx="${cx}" cy="${cy}" r="${i * spacing}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>`;
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
  const spacing = Math.max(10, 50 - (density / 100) * 40) / scale;
  const radius = Math.max(1.5, (3 + (density / 100) * 4) * scale);

  let dots = '';
  for (let x = spacing / 2; x < w + spacing; x += spacing) {
    for (let y = spacing / 2; y < h + spacing; y += spacing) {
      dots += `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}"/>`;
    }
  }
  return dots;
}

function svgWavyLines(w: number, h: number, color: string, density: number, scale: number): string {
  const numLines = Math.max(3, Math.floor(4 + (density / 100) * 16));
  const amplitude = (20 + (density / 100) * 30) * scale;
  const frequency = (0.01 + (density / 100) * 0.03) / scale;
  const spacing = h / (numLines + 1);
  const strokeWidth = Math.max(1, 2.5 * scale);

  let waves = '';
  for (let i = 1; i <= numLines; i++) {
    const baseY = i * spacing;
    let path = `M 0 ${baseY}`;
    for (let x = 0; x <= w; x += 2) {
      const y = baseY + Math.sin(x * frequency + i * 0.8) * amplitude;
      path += ` L ${x} ${y}`;
    }
    waves += `<path d="${path}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>`;
  }
  return waves;
}

function svgTriangleGrid(w: number, h: number, color: string, density: number, scale: number): string {
  const size = Math.max(15, 60 - (density / 100) * 45) / scale;
  const height = size * (Math.sqrt(3) / 2);
  const strokeWidth = Math.max(0.5, 1.5 * scale);

  let triangles = '';
  let row = 0;
  for (let y = 0; y < h + height * 2; y += height) {
    const offset = row % 2 === 0 ? 0 : size / 2;
    for (let x = -size + offset; x < w + size; x += size) {
      const p1 = `${x},${y + height}`;
      const p2 = `${x + size / 2},${y}`;
      const p3 = `${x + size},${y + height}`;
      triangles += `<polygon points="${p1} ${p2} ${p3}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>`;
    }
    row++;
  }
  return triangles;
}

function svgSquareSpiral(w: number, h: number, color: string, density: number, scale: number): string {
  const cx = w / 2;
  const cy = h / 2;
  const maxSteps = Math.max(10, Math.floor(20 + (density / 100) * 60));
  const stepSize = Math.max(4, 12 * scale);
  const strokeWidth = Math.max(1, 2 * scale);

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

  return `<path d="${path}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>`;
}

function svgScandinavianCross(w: number, h: number, color: string, density: number, scale: number): string {
  const spacing = Math.max(25, 80 - (density / 100) * 55) / scale;
  const armLength = spacing * 0.35 * scale;
  const armWidth = Math.max(2, 4 * scale);

  let crosses = '';
  for (let x = spacing / 2; x < w + spacing; x += spacing) {
    for (let y = spacing / 2; y < h + spacing; y += spacing) {
      crosses += `<rect x="${x - armWidth / 2}" y="${y - armLength}" width="${armWidth}" height="${armLength * 2}" fill="${color}"/>`;
      crosses += `<rect x="${x - armLength}" y="${y - armWidth / 2}" width="${armLength * 2}" height="${armWidth}" fill="${color}"/>`;
    }
  }
  return crosses;
}

function svgVerticalStripes(w: number, h: number, color: string, density: number, scale: number): string {
  const stripeWidth = Math.max(4, 30 - (density / 100) * 25) * scale;
  const gap = Math.max(4, 20 - (density / 100) * 15) * scale;

  let stripes = '';
  for (let x = 0; x < w + stripeWidth + gap; x += stripeWidth + gap) {
    stripes += `<rect x="${x}" y="-10" width="${stripeWidth}" height="${h + 20}" fill="${color}"/>`;
  }
  return stripes;
}

function svgVoronoi(w: number, h: number, color: string, density: number, scale: number, seed: number): string {
  const numPoints = Math.max(5, Math.floor(8 + (density / 100) * 40));
  const rand = seededRandom(seed);
  const strokeWidth = Math.max(0.5, 1.5 * scale);

  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < numPoints; i++) {
    points.push({ x: rand() * w, y: rand() * h });
  }

  let voronoi = '';
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[j].x - points[i].x;
      const dy = points[j].y - points[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < (Math.max(w, h) / Math.sqrt(numPoints)) * 1.8) {
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
  const cx = w / 2;
  const cy = h / 2;
  const numRays = Math.max(6, Math.floor(8 + (density / 100) * 24));
  const maxRadius = Math.max(w, h) * 0.7;
  const strokeWidth = Math.max(1, 2.5 * scale);

  let artDeco = '';

  // Fan rays
  for (let i = 0; i <= numRays; i++) {
    const angle = -Math.PI + (Math.PI * i) / numRays;
    const x2 = cx + Math.cos(angle) * maxRadius;
    const y2 = cy + h * 0.3 + Math.sin(angle) * maxRadius;
    artDeco += `<line x1="${cx}" y1="${cy + h * 0.3}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${strokeWidth}"/>`;
  }

  // Concentric arcs
  const numArcs = Math.max(3, Math.floor(4 + (density / 100) * 8));
  for (let i = 1; i <= numArcs; i++) {
    const radius = (i / numArcs) * maxRadius * 0.8 * scale;
    artDeco += `<path d="M ${cx - radius} ${cy + h * 0.3} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy + h * 0.3}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>`;
  }

  // Diamond
  const diamondSize = 20 * scale;
  const dy = cy - h * 0.3;
  artDeco += `<polygon points="${cx},${dy} ${cx + diamondSize},${dy + diamondSize} ${cx},${dy + diamondSize * 2} ${cx - diamondSize},${dy + diamondSize}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>`;

  return artDeco;
}

function svgTessellation(w: number, h: number, color: string, density: number, scale: number): string {
  const size = Math.max(20, 60 - (density / 100) * 40) / scale;
  const hexHeight = size * Math.sqrt(3);
  const strokeWidth = Math.max(0.5, 1.5 * scale);

  let tessellation = '';
  let row = 0;
  for (let y = -hexHeight; y < h + hexHeight; y += hexHeight * 0.75) {
    const offset = row % 2 === 0 ? 0 : size * 1.5;
    for (let x = -size * 2 + offset; x < w + size * 2; x += size * 3) {
      // Outer hexagon
      tessellation += svgHexagonPath(x, y, size, color, strokeWidth);
      // Inner hexagon
      tessellation += svgHexagonPath(x, y, size * 0.5, color, strokeWidth);
      // Connecting lines
      tessellation += `<line x1="${x - size * 0.5}" y1="${y - size * 0.3}" x2="${x + size * 0.5}" y2="${y + size * 0.3}" stroke="${color}" stroke-width="${strokeWidth}"/>`;
      tessellation += `<line x1="${x + size * 0.5}" y1="${y - size * 0.3}" x2="${x - size * 0.5}" y2="${y + size * 0.3}" stroke="${color}" stroke-width="${strokeWidth}"/>`;
    }
    row++;
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
  const maxDepth = Math.max(3, Math.floor(4 + (density / 100) * 7));
  const branchLength = (60 + (density / 100) * 40) * scale;
  const branchAngle = Math.PI / 6 + (density / 100) * (Math.PI / 6);

  const startX = w / 2;
  const startY = h * 0.85;

  let tree = '';

  // Trunk
  const trunkWidth = Math.max(2, 4 * scale);
  tree += `<line x1="${startX}" y1="${startY}" x2="${startX}" y2="${startY - branchLength * 0.5}" stroke="${color}" stroke-width="${trunkWidth}"/>`;

  // Branches
  tree += svgBranch(startX, startY - branchLength * 0.5, -Math.PI / 2 - branchAngle, branchLength * 0.7, 1, maxDepth, color, scale, branchAngle, density);
  tree += svgBranch(startX, startY - branchLength * 0.5, -Math.PI / 2 + branchAngle, branchLength * 0.7, 1, maxDepth, color, scale, branchAngle, density);
  tree += svgBranch(startX, startY - branchLength * 0.5, -Math.PI / 2, branchLength * 0.8, 1, maxDepth, color, scale, branchAngle, density);

  return tree;
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
  const maxDepth = Math.max(3, Math.floor(4 + (density / 100) * 7));
  const branchLength = (60 + (density / 100) * 40) * scale;
  const branchAngle = Math.PI / 6 + (density / 100) * (Math.PI / 6);

  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, 2 * scale);

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

  // Draw tree from bottom center
  const startX = w / 2;
  const startY = h * 0.85;

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
