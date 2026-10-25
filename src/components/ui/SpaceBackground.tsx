import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  active: boolean;
}

export const SpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Generate stars
    const starCount = Math.min(450, Math.floor((width * height) / 3200));
    const starColors = ['#ffffff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#fef3c7', '#38bdf8'];
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() < 0.8 ? Math.random() * 1.2 + 0.4 : Math.random() * 2.0 + 1.2,
        baseAlpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    // Shooting stars system
    let shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 80,
      speed: 12,
      angle: Math.PI / 4,
      alpha: 0,
      active: false,
    };

    let nextShootingStarTime = Date.now() + 3000 + Math.random() * 5000;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep space background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#020612');
      bgGrad.addColorStop(0.5, '#030816');
      bgGrad.addColorStop(1, '#02040b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render cosmic nebula glows
      // Nebula 1 (Cyan)
      const neb1 = ctx.createRadialGradient(width * 0.2, height * 0.3, 0, width * 0.2, height * 0.3, width * 0.45);
      neb1.addColorStop(0, 'rgba(6, 182, 212, 0.07)');
      neb1.addColorStop(0.5, 'rgba(14, 165, 233, 0.03)');
      neb1.addColorStop(1, 'transparent');
      ctx.fillStyle = neb1;
      ctx.fillRect(0, 0, width, height);

      // Nebula 2 (Deep Blue / Indigo)
      const neb2 = ctx.createRadialGradient(width * 0.8, height * 0.7, 0, width * 0.8, height * 0.7, width * 0.5);
      neb2.addColorStop(0, 'rgba(59, 130, 246, 0.06)');
      neb2.addColorStop(0.6, 'rgba(99, 102, 241, 0.02)');
      neb2.addColorStop(1, 'transparent');
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, width, height);

      // Draw and animate stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.twinklePhase += star.twinkleSpeed;
        const alpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.3;
        const clampedAlpha = Math.max(0.05, Math.min(1, alpha));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = clampedAlpha;
        ctx.fill();

        // Subtle glow around larger stars
        if (star.radius > 1.5) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = clampedAlpha * 0.25;
          ctx.fill();
        }
      }

      // Check shooting star trigger
      const now = Date.now();
      if (!shootingStar.active && now > nextShootingStarTime) {
        shootingStar = {
          x: Math.random() * (width * 0.7),
          y: Math.random() * (height * 0.4),
          length: Math.random() * 90 + 60,
          speed: Math.random() * 8 + 14,
          angle: (Math.PI / 4) + (Math.random() * 0.2 - 0.1),
          alpha: 1.0,
          active: true,
        };
        nextShootingStarTime = now + 6000 + Math.random() * 9000;
      }

      // Render shooting star
      if (shootingStar.active) {
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.alpha -= 0.016;

        if (shootingStar.alpha <= 0 || shootingStar.x > width || shootingStar.y > height) {
          shootingStar.active = false;
        } else {
          ctx.save();
          ctx.globalAlpha = shootingStar.alpha;
          const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
          const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;
          const shootGrad = ctx.createLinearGradient(tailX, tailY, shootingStar.x, shootingStar.y);
          shootGrad.addColorStop(0, 'transparent');
          shootGrad.addColorStop(1, '#ffffff');

          ctx.strokeStyle = shootGrad;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(shootingStar.x, shootingStar.y);
          ctx.stroke();
          ctx.restore();
        }
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1]"
    />
  );
};
