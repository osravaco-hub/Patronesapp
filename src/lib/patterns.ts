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
  const cx = w / 2;
  const cy = h / 2;
  const maxRadius = Math.max(w, h) * 0.8;
  const numCircles = Math.max(3, Math.floor(5 + (density / 100) * 25));
  const spacing = (maxRadius / numCircles) * scale;

  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, 2 * scale);

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
