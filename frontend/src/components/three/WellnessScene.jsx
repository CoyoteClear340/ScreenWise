import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Hero visual: a floating phone showing a live wellness-score dashboard,
 * orbited by the lifestyle signals ScreenWise actually measures (sleep,
 * exercise, heart/wellness, screen time). Rendered with three.js, purely
 * decorative (aria-hidden). Fails silently where WebGL is unavailable
 * (e.g. jsdom in tests) so it never breaks the surrounding page.
 */

const PALETTE = {
  ink: "#20262b",
  paper: "#f6f4ee",
  line: "#e2ded2",
  primary: "#2f5f66",
  primaryDark: "#22484e",
  high: "#3f7a56",
  moderate: "#b8873a",
  low: "#b0503b",
  muted: "#6b6558",
};

const TARGET_SCORE = 82;

function roundedRectShape(width, height, radius) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x, y + radius);
  shape.lineTo(x, y + height - radius);
  shape.quadraticCurveTo(x, y + height, x + radius, y + height);
  shape.lineTo(x + width - radius, y + height);
  shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  shape.lineTo(x + width, y + radius);
  shape.quadraticCurveTo(x + width, y, x + width - radius, y);
  shape.lineTo(x + radius, y);
  shape.quadraticCurveTo(x, y, x, y + radius);
  return shape;
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

function drawDashboard(ctx, w, h, progress) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = PALETTE.paper;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = PALETTE.primary;
  ctx.font = "700 22px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ScreenWise", w / 2, h * 0.09);

  ctx.fillStyle = PALETTE.muted;
  ctx.font = "600 13px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("WELLNESS SCORE", w / 2, h * 0.16);

  const cx = w / 2;
  const cy = h * 0.36;
  const radius = w * 0.26;
  const lineWidth = w * 0.045;

  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = PALETTE.line;
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + Math.PI * 2 * (progress / 100);
  const gradient = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
  gradient.addColorStop(0, PALETTE.primary);
  gradient.addColorStop(1, PALETTE.high);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, endAngle);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  ctx.fillStyle = PALETTE.ink;
  ctx.font = "700 54px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(Math.round(progress)), cx, cy - h * 0.01);
  ctx.font = "600 13px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillStyle = PALETTE.muted;
  ctx.fillText("out of 100", cx, cy + h * 0.055);
  ctx.textBaseline = "alphabetic";

  const label =
    progress > 66 ? "High wellness" : progress > 33 ? "Moderate wellness" : "Low wellness";
  const labelColor = progress > 66 ? PALETTE.high : progress > 33 ? PALETTE.moderate : PALETTE.low;
  ctx.font = "700 15px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillStyle = labelColor;
  ctx.textAlign = "center";
  ctx.fillText(label, cx, cy + radius + h * 0.06);

  const stats = [
    { label: "Sleep", value: "7.2h", color: PALETTE.primary },
    { label: "Exercise", value: "40m", color: PALETTE.high },
    { label: "Screen", value: "5.8h", color: PALETTE.moderate },
  ];
  const rowY = h * 0.72;
  const rowH = h * 0.16;
  const gap = w * 0.04;
  const cardW = (w - gap * 4) / 3;

  stats.forEach((stat, i) => {
    const x = gap + i * (cardW + gap);
    drawRoundedRect(ctx, x, rowY, cardW, rowH, w * 0.025);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + cardW / 2, rowY + rowH * 0.32, w * 0.018, 0, Math.PI * 2);
    ctx.fillStyle = stat.color;
    ctx.fill();

    ctx.fillStyle = PALETTE.ink;
    ctx.font = "700 15px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(stat.value, x + cardW / 2, rowY + rowH * 0.66);

    ctx.fillStyle = PALETTE.muted;
    ctx.font = "500 10px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillText(stat.label, x + cardW / 2, rowY + rowH * 0.9);
  });
}

const ICON_DRAWERS = {
  moon(ctx, size, color) {
    const r = size * 0.24;
    const cx = size / 2;
    const cy = size / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(cx + r * 0.55, cy - r * 0.4, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
  heart(ctx, size, color) {
    const cx = size / 2;
    const top = size * 0.36;
    const w = size * 0.15;
    ctx.beginPath();
    ctx.moveTo(cx, top + w * 0.3);
    ctx.bezierCurveTo(cx, top, cx - w * 2, top, cx - w * 2, top + w * 0.9);
    ctx.bezierCurveTo(cx - w * 2, top + w * 2, cx, top + w * 2.6, cx, top + w * 3.2);
    ctx.bezierCurveTo(cx, top + w * 2.6, cx + w * 2, top + w * 2, cx + w * 2, top + w * 0.9);
    ctx.bezierCurveTo(cx + w * 2, top, cx, top, cx, top + w * 0.3);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  },
  clock(ctx, size, color) {
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.26;
    ctx.lineCap = "round";
    ctx.lineWidth = size * 0.045;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - r * 0.6);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r * 0.45, cy + r * 0.12);
    ctx.stroke();
  },
  activity(ctx, size, color) {
    const cy = size * 0.52;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = size * 0.045;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(size * 0.2, cy);
    ctx.lineTo(size * 0.36, cy);
    ctx.lineTo(size * 0.44, cy - size * 0.18);
    ctx.lineTo(size * 0.56, cy + size * 0.22);
    ctx.lineTo(size * 0.64, cy);
    ctx.lineTo(size * 0.8, cy);
    ctx.stroke();
  },
};

function makeIconSprite(kind, color, bg) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.47, 0, Math.PI * 2);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.lineWidth = size * 0.025;
  ctx.strokeStyle = PALETTE.line;
  ctx.stroke();

  ICON_DRAWERS[kind](ctx, size, color);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.62, 0.62, 0.62);
  return { sprite, material, texture };
}

const ICON_ORBITS = [
  { kind: "moon", color: PALETTE.primary, radius: 2.5, speed: 0.3, tiltX: 0.3, tiltZ: 0.05, phase: 0 },
  { kind: "heart", color: PALETTE.high, radius: 2.9, speed: -0.22, tiltX: -0.45, tiltZ: 0.35, phase: 2.2 },
  { kind: "clock", color: PALETTE.moderate, radius: 2.7, speed: 0.26, tiltX: 0.75, tiltZ: -0.25, phase: 4.1 },
  { kind: "activity", color: PALETTE.low, radius: 3.15, speed: -0.18, tiltX: -0.1, tiltZ: -0.55, phase: 1.4 },
];

export default function WellnessScene({ className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return undefined;
    }

    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || 600;
    const disposables = [];

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.z = 7;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    const phoneGroup = new THREE.Group();
    scene.add(phoneGroup);

    const phoneW = 1.7;
    const phoneH = 3.3;
    const phoneDepth = 0.14;

    const bodyGeometry = new THREE.ExtrudeGeometry(roundedRectShape(phoneW, phoneH, 0.26), {
      depth: phoneDepth,
      bevelEnabled: false,
    });
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: PALETTE.ink });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.z = -phoneDepth / 2;
    const bodyEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(bodyGeometry),
      new THREE.LineBasicMaterial({ color: PALETTE.primary, transparent: true, opacity: 0.6 })
    );
    body.add(bodyEdges);
    phoneGroup.add(body);
    disposables.push(bodyGeometry, bodyMaterial, bodyEdges.geometry, bodyEdges.material);

    const screenW = phoneW - 0.14;
    const screenH = phoneH - 0.14;
    const canvasWidth = 300;
    const canvasHeight = Math.round((screenH / screenW) * canvasWidth);
    const dashboardCanvas = document.createElement("canvas");
    dashboardCanvas.width = canvasWidth;
    dashboardCanvas.height = canvasHeight;
    const dashboardCtx = dashboardCanvas.getContext("2d");
    drawDashboard(dashboardCtx, canvasWidth, canvasHeight, 0);
    const dashboardTexture = new THREE.CanvasTexture(dashboardCanvas);

    const screenGeometry = new THREE.PlaneGeometry(screenW, screenH);
    const screenMaterial = new THREE.MeshBasicMaterial({ map: dashboardTexture });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = phoneDepth / 2 + 0.001;
    phoneGroup.add(screen);
    disposables.push(screenGeometry, screenMaterial, dashboardTexture);

    const notch = new THREE.Mesh(
      new THREE.CircleGeometry(0.045, 24),
      new THREE.MeshBasicMaterial({ color: PALETTE.ink })
    );
    notch.position.set(0, phoneH / 2 - 0.16, phoneDepth / 2 + 0.002);
    phoneGroup.add(notch);
    disposables.push(notch.geometry, notch.material);

    const iconPivots = ICON_ORBITS.map((cfg) => {
      const pivot = new THREE.Object3D();
      pivot.rotation.x = cfg.tiltX;
      pivot.rotation.z = cfg.tiltZ;
      scene.add(pivot);

      const { sprite, material, texture } = makeIconSprite(cfg.kind, cfg.color, "#ffffff");
      sprite.position.set(cfg.radius, 0, 0);
      pivot.add(sprite);
      disposables.push(material, texture);

      return { pivot, sprite, ...cfg };
    });

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let scoreAnimDone = prefersReducedMotion;
    if (prefersReducedMotion) {
      drawDashboard(dashboardCtx, canvasWidth, canvasHeight, TARGET_SCORE);
      dashboardTexture.needsUpdate = true;
    }

    const clock = new THREE.Clock();
    let frameId;
    const animate = () => {
      const t = clock.getElapsedTime();

      if (!scoreAnimDone) {
        const dur = 1.8;
        const progress = Math.min(t / dur, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        drawDashboard(dashboardCtx, canvasWidth, canvasHeight, eased * TARGET_SCORE);
        dashboardTexture.needsUpdate = true;
        if (progress >= 1) scoreAnimDone = true;
      }

      if (!prefersReducedMotion) {
        phoneGroup.rotation.y = Math.sin(t * 0.35) * 0.32;
        phoneGroup.rotation.x = -0.05 + Math.sin(t * 0.5) * 0.05;
        phoneGroup.position.y = Math.sin(t * 0.8) * 0.08;

        iconPivots.forEach(({ pivot, sprite, speed, phase }) => {
          pivot.rotation.y = t * speed + phase;
          sprite.position.y = Math.sin(t * 0.9 + phase) * 0.12;
        });
      }

      camera.position.x += (mouseX * 0.45 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 0.45 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
