import { getFactorTip } from "./factorTips.js";

const PALETTE = {
  ink: "#20262b",
  paper: "#f6f4ee",
  card: "#ffffff",
  line: "#e2ded2",
  primary: "#2f5f66",
  high: "#3f7a56",
  moderate: "#b8873a",
  low: "#b0503b",
  muted: "#6b6558",
};

const CATEGORY_HEX = { Low: PALETTE.low, Moderate: PALETTE.moderate, High: PALETTE.high };

function formatFeatureName(name) {
  return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(" ");
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);

  const truncated = lines.length > maxLines;
  const finalLines = lines.slice(0, maxLines);

  if (truncated) {
    let last = finalLines[maxLines - 1];
    while (ctx.measureText(`${last}…`).width > maxWidth && last.length > 1) {
      last = last.slice(0, -1);
    }
    finalLines[maxLines - 1] = `${last}…`;
  }

  finalLines.forEach((line, i) => ctx.fillText(line, x, y + i * lineHeight));
  return finalLines.length * lineHeight;
}

export function buildShareCardCanvas({ prediction, score, confidence, top_factors: topFactors = [] }, form = {}) {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const categoryHex = CATEGORY_HEX[prediction] || PALETTE.moderate;
  const clampedScore = Math.max(0, Math.min(100, Number(score) || 0));

  ctx.fillStyle = PALETTE.paper;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = PALETTE.line;
  for (let gx = 40; gx < W; gx += 34) {
    for (let gy = 40; gy < 320; gy += 34) {
      ctx.beginPath();
      ctx.arc(gx, gy, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const margin = 72;

  ctx.textAlign = "left";
  ctx.fillStyle = PALETTE.primary;
  ctx.font = "800 46px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText("ScreenWise", margin, 116);

  ctx.fillStyle = PALETTE.muted;
  ctx.font = "600 22px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText("Digital wellness check", margin, 154);

  ctx.strokeStyle = PALETTE.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(margin, 196);
  ctx.lineTo(W - margin, 196);
  ctx.stroke();

  const cx = W / 2;
  const cy = 470;
  const radius = 172;
  const ringWidth = 30;

  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = PALETTE.line;
  ctx.lineWidth = ringWidth;
  ctx.stroke();

  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + Math.PI * 2 * (clampedScore / 100);
  const gradient = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
  gradient.addColorStop(0, PALETTE.primary);
  gradient.addColorStop(1, categoryHex);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, endAngle);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = ringWidth;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = PALETTE.ink;
  ctx.font = "800 108px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText(String(Math.round(clampedScore)), cx, cy + 20);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = "600 24px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText("out of 100", cx, cy + 62);

  ctx.fillStyle = categoryHex;
  ctx.font = "800 52px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText(`${prediction} Wellness`, cx, cy + radius + 84);

  if (confidence != null) {
    ctx.fillStyle = PALETTE.muted;
    ctx.font = "600 22px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillText(`${Math.round(confidence * 100)}% model confidence`, cx, cy + radius + 122);
  }

  const factorsTop = cy + radius + 190;
  ctx.textAlign = "left";
  ctx.fillStyle = PALETTE.ink;
  ctx.font = "700 30px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText("What mattered most", margin, factorsTop);

  const rowHeight = 148;
  const rowsTop = factorsTop + 40;
  const visibleFactors = topFactors.slice(0, 3);

  visibleFactors.forEach((factor, i) => {
    const rowY = rowsTop + i * rowHeight;
    drawRoundedRect(ctx, margin, rowY, W - margin * 2, rowHeight - 24, 20);
    ctx.fillStyle = PALETTE.card;
    ctx.fill();
    ctx.strokeStyle = PALETTE.line;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(margin + 40, rowY + 40, 9, 0, Math.PI * 2);
    ctx.fillStyle = i === 0 ? categoryHex : PALETTE.primary;
    ctx.fill();

    ctx.textAlign = "left";
    ctx.fillStyle = PALETTE.ink;
    ctx.font = "700 26px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillText(formatFeatureName(factor.feature), margin + 66, rowY + 50);

    const value = form?.[factor.feature];
    ctx.fillStyle = PALETTE.muted;
    ctx.font = "500 22px system-ui, -apple-system, Segoe UI, sans-serif";
    wrapText(
      ctx,
      getFactorTip(factor.feature, value),
      margin + 66,
      rowY + 88,
      W - margin * 2 - 100,
      30,
      2
    );
  });

  ctx.textAlign = "center";
  ctx.fillStyle = PALETTE.muted;
  ctx.font = "500 20px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText(
    "Educational AI/ML project — not a medical or psychological diagnostic tool.",
    cx,
    H - 48
  );

  return canvas;
}

export function downloadCanvas(canvas, filename = "screenwise-result.png") {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Could not generate image."));
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      resolve();
    }, "image/png");
  });
}
