import { useEffect, useRef, useState } from 'react';
import { formatCurrencyPrecise, formatNumber } from '../data/calculator';

interface Props {
  realHourlyWage: number;
  naiveHourlyWage: number;
  percentDrop: number;
  totalHoursPerWeek: number;
}

// Render dimensions. 1080x1080 is the universal social square.
const W = 1080;
const H = 1080;

// Palette (matches site theme)
const CREAM = '#F5F1E8';
const CREAM_DARK = '#EDE7D6';
const INK = '#1A1A1A';
const INK_SOFT = '#2C2C2C';
const BLOOD = '#8B2E1F';
const MUTE = '#6B6359';
const GOLD = '#B8895C';

export default function ShareImage({
  realHourlyWage,
  naiveHourlyWage,
  percentDrop,
  totalHoursPerWeek,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canCopyImage, setCanCopyImage] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Feature detect: can the browser copy images to clipboard?
    setCanCopyImage(
      typeof window !== 'undefined' &&
        typeof ClipboardItem !== 'undefined' &&
        !!navigator.clipboard?.write
    );
  }, []);

  // Draw whenever numbers change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = async () => {
      // Wait for fonts (critical for canvas text to render correctly)
      if (document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // Ignore: fall back to system fonts if fonts API unhappy
        }
      }
      renderCanvas(canvas, {
        realHourlyWage,
        naiveHourlyWage,
        percentDrop,
        totalHoursPerWeek,
      });
    };

    draw();
  }, [realHourlyWage, naiveHourlyWage, percentDrop, totalHoursPerWeek]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `my-real-wage-${Math.round(realHourlyWage)}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      'image/png',
      0.95
    );
  };

  const copyImageToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png', 0.95)
      );
      if (!blob) return;
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy image:', err);
    }
  };

  return (
    <div className="bg-cream-dark/60 border border-ink/15 p-6 md:p-8">
      <p className="font-mono text-xs uppercase tracking-widest text-mute mb-4">
        Your share image
      </p>

      {/* Preview (scaled down) */}
      <div className="mb-6 flex justify-center">
        <div
          className="relative"
          style={{
            maxWidth: '360px',
            width: '100%',
            aspectRatio: '1 / 1',
          }}
        >
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="w-full h-full border border-ink/10 shadow-[0_8px_32px_rgba(26,26,26,0.08)]"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={downloadImage} className="btn-primary">
          Download image
        </button>
        {canCopyImage && (
          <button
            onClick={copyImageToClipboard}
            className="btn-secondary"
            disabled={copied}
          >
            {copied ? 'Copied ✓' : 'Copy to clipboard'}
          </button>
        )}
      </div>

      <p className="font-body text-sm text-mute italic mt-4 max-w-md">
        1080×1080 PNG. Works on Twitter, Instagram, LinkedIn, WhatsApp, Reddit,
        the group chat.
      </p>
    </div>
  );
}

/* ========== Canvas rendering ========== */

interface RenderData {
  realHourlyWage: number;
  naiveHourlyWage: number;
  percentDrop: number;
  totalHoursPerWeek: number;
}

function renderCanvas(canvas: HTMLCanvasElement, d: RenderData) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background: cream with subtle gradient
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, CREAM);
  bg.addColorStop(1, CREAM_DARK);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle noise/texture (we skip heavy texture on canvas for perf; one soft overlay)
  drawSoftVignette(ctx);

  // Top rule line
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 100);
  ctx.lineTo(W - 80, 100);
  ctx.stroke();

  // Small masthead-style header
  ctx.fillStyle = MUTE;
  ctx.font = '500 18px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('A CALCULATOR / VOL. 001', 80, 75);

  ctx.textAlign = 'right';
  ctx.fillText('AFTERWAGE.COM', W - 80, 75);

  // Eyebrow
  ctx.fillStyle = MUTE;
  ctx.font = '500 22px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('MY REAL HOURLY WAGE', 80, 200);

  // THE BIG NUMBER
  ctx.fillStyle = BLOOD;
  ctx.font = '300 260px "Fraunces", Georgia, serif';
  ctx.textAlign = 'left';
  const numberText = formatCurrencyPrecise(d.realHourlyWage);
  ctx.fillText(numberText, 80, 440);

  // "per hour" italic, small, next to or below number
  ctx.fillStyle = MUTE;
  ctx.font = 'italic 300 58px "Fraunces", Georgia, serif';
  const numberWidth = ctx.measureText(numberText).width;
  // Place "per hour" to the right if there's room, otherwise below
  if (80 + numberWidth + 240 < W - 80) {
    ctx.font = 'italic 300 58px "Fraunces", Georgia, serif';
    ctx.fillText('per hour', 80 + numberWidth + 40, 440);
  } else {
    ctx.fillText('per hour', 80, 510);
  }

  // Delta sentence
  // "I thought I made $XX.XX. Reality took a YY% cut."
  ctx.fillStyle = INK_SOFT;
  ctx.font = '400 44px "Newsreader", Georgia, serif';
  const line1 = `I thought I made ${formatCurrencyPrecise(d.naiveHourlyWage)}.`;
  const line2 = `Reality took a ${formatNumber(d.percentDrop, 0)}% cut.`;
  ctx.fillText(line1, 80, 620);
  ctx.fillText(line2, 80, 680);

  // Horizontal divider
  ctx.strokeStyle = INK;
  ctx.globalAlpha = 0.15;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 760);
  ctx.lineTo(W - 80, 760);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Footer block: three small stats, newspaper-column style
  const footerY = 820;

  ctx.fillStyle = MUTE;
  ctx.font = '500 18px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('MY REAL WORK WEEK', 80, footerY);

  ctx.fillStyle = INK;
  ctx.font = '300 72px "Fraunces", Georgia, serif';
  ctx.fillText(`${formatNumber(d.totalHoursPerWeek, 1)} hrs`, 80, footerY + 78);

  // Right column: "Find yours"
  ctx.textAlign = 'right';
  ctx.fillStyle = MUTE;
  ctx.font = '500 18px "JetBrains Mono", monospace';
  ctx.fillText('FIND YOURS', W - 80, footerY);

  ctx.fillStyle = INK;
  ctx.font = 'italic 300 56px "Fraunces", Georgia, serif';
  ctx.fillText('afterwage.com', W - 80, footerY + 78);

  // Bottom rule
  ctx.textAlign = 'left';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(80, H - 60);
  ctx.lineTo(W - 80, H - 60);
  ctx.stroke();

  // Tiny tagline at bottom
  ctx.fillStyle = MUTE;
  ctx.font = 'italic 400 24px "Newsreader", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Your wage, after everything.', W / 2, H - 25);
}

function drawSoftVignette(ctx: CanvasRenderingContext2D) {
  // Warm top-left gradient accent
  const g1 = ctx.createRadialGradient(0, 0, 0, 0, 0, W * 0.9);
  g1.addColorStop(0, 'rgba(184, 137, 92, 0.08)');
  g1.addColorStop(1, 'rgba(184, 137, 92, 0)');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H);

  // Cool bottom-right accent
  const g2 = ctx.createRadialGradient(W, H, 0, W, H, W * 0.9);
  g2.addColorStop(0, 'rgba(139, 46, 31, 0.05)');
  g2.addColorStop(1, 'rgba(139, 46, 31, 0)');
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, W, H);
}
