// Pattern generation logic
export type PatternType =
  | 'triangles'
  | 'hexagons'
  | 'circles'
  | 'diamonds'
  | 'waves'
  | 'chevrons'
  | 'squares'
  | 'stars'
  | 'crosses'
  | 'zigzag';

export interface PatternConfig {
  type: PatternType;
  colors: string[];
  density: number; // 1-10
  scale: number; // 0.5-3
  rotation: number; // 0-360
  opacity: number; // 0.1-1
  strokeWidth: number; // 0.5-5
  filled: boolean;
}

export const defaultConfig: PatternConfig = {
  type: 'triangles',
  colors: ['#2563EB', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'],
  density: 5,
  scale: 1,
  rotation: 0,
  opacity: 0.8,
  strokeWidth: 1.5,
  filled: true,
};

export const patternTypes: { id: PatternType; label: string; premium: boolean }[] = [
  { id: 'triangles', label: 'Triángulos', premium: false },
  { id: 'hexagons', label: 'Hexágonos', premium: false },
  { id: 'circles', label: 'Círculos', premium: false },
  { id: 'diamonds', label: 'Diamantes', premium: false },
  { id: 'waves', label: 'Ondas', premium: false },
  { id: 'chevrons', label: 'Chevrons', premium: true },
  { id: 'squares', label: 'Cuadrados', premium: false },
  { id: 'stars', label: 'Estrellas', premium: true },
  { id: 'crosses', label: 'Cruces', premium: true },
  { id: 'zigzag', label: 'Zigzag', premium: true },
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generatePattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: PatternConfig,
  seed: number = 42
) {
  const rand = seededRandom(seed);
  const { type, colors, density, scale, rotation, opacity, strokeWidth, filled } = config;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#FAFAFA';
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-width / 2, -height / 2);

  ctx.globalAlpha = opacity;

  const cellSize = Math.max(20, 80 / (density / 5)) * scale;
  const cols = Math.ceil(width / cellSize) + 2;
  const rows = Math.ceil(height / cellSize) + 2;

  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      const x = col * cellSize;
      const y = row * cellSize;
      const colorIdx = Math.floor(rand() * colors.length);
      const color = colors[colorIdx];

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = strokeWidth;

      switch (type) {
        case 'triangles':
          drawTriangle(ctx, x, y, cellSize * 0.4, filled, rand);
          break;
        case 'hexagons':
          drawHexagon(ctx, x + cellSize / 2, y + cellSize / 2, cellSize * 0.35, filled);
          break;
        case 'circles':
          drawCircle(ctx, x + cellSize / 2, y + cellSize / 2, cellSize * 0.3, filled, rand);
          break;
        case 'diamonds':
          drawDiamond(ctx, x + cellSize / 2, y + cellSize / 2, cellSize * 0.35, filled);
          break;
        case 'waves':
          drawWave(ctx, x, y, cellSize, rand);
          break;
        case 'chevrons':
          drawChevron(ctx, x, y, cellSize, filled);
          break;
        case 'squares':
          drawSquare(ctx, x + cellSize / 2, y + cellSize / 2, cellSize * 0.35, filled, rand);
          break;
        case 'stars':
          drawStar(ctx, x + cellSize / 2, y + cellSize / 2, cellSize * 0.3, filled);
          break;
        case 'crosses':
          drawCross(ctx, x + cellSize / 2, y + cellSize / 2, cellSize * 0.3);
          break;
        case 'zigzag':
          drawZigzag(ctx, x, y, cellSize);
          break;
      }
    }
  }

  ctx.restore();
}

function drawTriangle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  filled: boolean,
  rand: () => number
) {
  const flip = rand() > 0.5 ? 1 : -1;
  ctx.beginPath();
  ctx.moveTo(x + size, y + size * flip);
  ctx.lineTo(x - size, y + size * flip);
  ctx.lineTo(x, y - size * flip);
  ctx.closePath();
  filled ? ctx.fill() : ctx.stroke();
}

function drawHexagon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  filled: boolean
) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  filled ? ctx.fill() : ctx.stroke();
}

function drawCircle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  filled: boolean,
  rand: () => number
) {
  const radius = r * (0.5 + rand() * 0.5);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  filled ? ctx.fill() : ctx.stroke();
}

function drawDiamond(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  filled: boolean
) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.lineTo(cx + size, cy);
  ctx.lineTo(cx, cy + size);
  ctx.lineTo(cx - size, cy);
  ctx.closePath();
  filled ? ctx.fill() : ctx.stroke();
}

function drawWave(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rand: () => number
) {
  const amplitude = size * 0.3 * (0.5 + rand() * 0.5);
  ctx.beginPath();
  ctx.moveTo(x, y + size / 2);
  ctx.bezierCurveTo(
    x + size * 0.25, y + size / 2 - amplitude,
    x + size * 0.75, y + size / 2 + amplitude,
    x + size, y + size / 2
  );
  ctx.stroke();
}

function drawChevron(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  filled: boolean
) {
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.7);
  ctx.lineTo(x + size / 2, y + size * 0.3);
  ctx.lineTo(x + size, y + size * 0.7);
  if (filled) {
    ctx.lineTo(x + size, y + size);
    ctx.lineTo(x + size / 2, y + size * 0.6);
    ctx.lineTo(x, y + size);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.stroke();
  }
}

function drawSquare(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  filled: boolean,
  rand: () => number
) {
  const angle = rand() * Math.PI * 0.5;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  if (filled) {
    ctx.fillRect(-size / 2, -size / 2, size, size);
  } else {
    ctx.strokeRect(-size / 2, -size / 2, size, size);
  }
  ctx.restore();
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  filled: boolean
) {
  const points = 5;
  const innerR = r * 0.4;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? r : innerR;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  filled ? ctx.fill() : ctx.stroke();
}

function drawCross(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number
) {
  const arm = size * 0.3;
  ctx.beginPath();
  ctx.moveTo(cx - arm, cy - size);
  ctx.lineTo(cx + arm, cy - size);
  ctx.lineTo(cx + arm, cy - arm);
  ctx.lineTo(cx + size, cy - arm);
  ctx.lineTo(cx + size, cy + arm);
  ctx.lineTo(cx + arm, cy + arm);
  ctx.lineTo(cx + arm, cy + size);
  ctx.lineTo(cx - arm, cy + size);
  ctx.lineTo(cx - arm, cy + arm);
  ctx.lineTo(cx - size, cy + arm);
  ctx.lineTo(cx - size, cy - arm);
  ctx.lineTo(cx - arm, cy - arm);
  ctx.closePath();
  ctx.fill();
}

function drawZigzag(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.7);
  ctx.lineTo(x + size * 0.25, y + size * 0.3);
  ctx.lineTo(x + size * 0.5, y + size * 0.7);
  ctx.lineTo(x + size * 0.75, y + size * 0.3);
  ctx.lineTo(x + size, y + size * 0.7);
  ctx.stroke();
}

export function generateSVG(
  width: number,
  height: number,
  config: PatternConfig,
  seed: number = 42
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  generatePattern(ctx, width, height, config, seed);
  return canvas.toDataURL('image/png');
}
