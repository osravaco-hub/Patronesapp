import { useEffect, useRef, useCallback } from 'react';
import { generatePattern, PatternConfig } from '../lib/patterns';

interface PatternCanvasProps {
  config: PatternConfig;
  seed: number;
  width?: number;
  height?: number;
}

export default function PatternCanvas({ config, seed, width = 600, height = 600 }: PatternCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    generatePattern(ctx, width, height, config, seed);
  }, [config, seed, width, height]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-border bg-white">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-auto block"
        style={{ maxWidth: '100%', aspectRatio: '1/1' }}
      />
      <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium text-text/60">
        {width}×{height}px
      </div>
    </div>
  );
}
