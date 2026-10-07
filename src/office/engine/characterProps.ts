import type { Character } from '../types.js';
import { CharacterState } from '../types.js';

/**
 * High-definition pixel-art props & interactive effects attached to characters:
 * - Glowing animated smartphone (Main HP) with scrolling feeds, glowing screen, thumb tapping & floating emojis (❤️, 💬, 🔔, 🎵)
 * - Prayer mats (sajadah) with gold tassels & mihrab arch
 * - Glowing laptop with syntax code lines & blinking cursor
 * - Steaming coffee / boba mugs with rising vapor curls
 * - Running water streams & droplets at Wudhu
 * - Al-Qur'an with gold embossed leather
 * - Broom & mop with dust puffs
 * - Audio speech waves when chatting
 */
export function renderCharacterProps(
  ctx: CanvasRenderingContext2D,
  ch: Character,
  drawX: number,
  drawY: number,
  zoom: number,
): void {
  const z = Math.max(1, zoom);
  const time = (ch.frameTimer || 0) * 10 + (ch.frame || 0);

  // 1. 🕌 Sajadah (Individual Prayer Mat) with Gold Fringe Tassels
  if (ch.state === CharacterState.PRAY) {
    ctx.save();
    const matW = 14 * z;
    const matH = 18 * z;
    const matX = drawX + (16 * z - matW) / 2;
    const matY = drawY + 8 * z;

    // Mat base (deep emerald green)
    ctx.fillStyle = '#14532d';
    ctx.fillRect(matX, matY, matW, matH);

    // Gold outer border
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1 * z;
    ctx.strokeRect(matX, matY, matW, matH);

    // Inner patterned field
    ctx.fillStyle = '#166534';
    ctx.fillRect(matX + 2 * z, matY + 3 * z, matW - 4 * z, matH - 6 * z);

    // Mihrab arch pointed apex
    ctx.fillStyle = '#facc15';
    ctx.fillRect(matX + matW / 2 - 1 * z, matY + 3 * z, 2 * z, 2 * z);

    // Gold fringe tassels (top and bottom edges)
    ctx.fillStyle = '#fef08a';
    for (let i = 0; i < matW; i += 2 * z) {
      ctx.fillRect(matX + i, matY - 1 * z, 1 * z, 1 * z);
      ctx.fillRect(matX + i, matY + matH, 1 * z, 1 * z);
    }
    ctx.restore();
  }

  // 2. 📱 Main HP (Smartphone Scrolling & Glowing Screen with Floating Reactions)
  if (ch.state === CharacterState.PHONE) {
    ctx.save();
    const phoneX = drawX + 9.5 * z;
    const phoneY = drawY + 10 * z;

    // Ambient Screen Glow on Face & Chest
    const glowFlicker = 0.25 + Math.sin(time * 3) * 0.08;
    ctx.fillStyle = `rgba(56, 189, 248, ${glowFlicker})`;
    ctx.beginPath();
    ctx.arc(phoneX + 2 * z, phoneY + 2 * z, 7 * z, 0, Math.PI * 2);
    ctx.fill();

    // Smartphone chassis (Titanium Bezel)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(phoneX, phoneY, 4.5 * z, 6.5 * z);

    // Screen border / notch
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(phoneX + 0.5 * z, phoneY + 0.5 * z, 3.5 * z, 5.5 * z);

    // Active Screen (Blue / Cyan OLED display)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(phoneX + 0.8 * z, phoneY + 0.8 * z, 2.9 * z, 4.9 * z);

    // Scrolling feed lines (Pixel feeds moving up)
    const scrollOffset = (time * 1.5) % 3;
    ctx.fillStyle = '#bae6fd'; // Text line 1
    ctx.fillRect(phoneX + 1.2 * z, phoneY + 1.2 * z + scrollOffset * 0.5 * z, 2.1 * z, 0.8 * z);
    ctx.fillStyle = '#38bdf8'; // Text line 2
    ctx.fillRect(phoneX + 1.2 * z, phoneY + 2.4 * z + scrollOffset * 0.5 * z, 1.8 * z, 0.8 * z);
    ctx.fillStyle = '#f472b6'; // Photo / Media block
    ctx.fillRect(phoneX + 1.2 * z, phoneY + 3.6 * z, 2.1 * z, 1.2 * z);

    // Active thumb scrolling tap
    const thumbY = phoneY + 2.5 * z + Math.sin(time * 4) * 1.2 * z;
    ctx.fillStyle = '#fde047'; // Hand/Thumb skin tone
    ctx.fillRect(phoneX + 3.2 * z, thumbY, 1.2 * z, 1.2 * z);

    // Floating reaction emoji above phone! (Cycles: ❤️, 💬, ⚡, 🔔)
    const cycle = Math.floor(time / 15) % 4;
    const floatY = (time % 15) * 0.5 * z;
    const alpha = Math.max(0, 1 - (time % 15) / 15);

    if (alpha > 0.1) {
      ctx.save();
      ctx.globalAlpha = alpha;
      const emojiX = phoneX + 1 * z;
      const emojiY = phoneY - 4 * z - floatY;

      if (cycle === 0) {
        // Red Heart ❤️
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(emojiX, emojiY, 3 * z, 2.5 * z);
        ctx.fillRect(emojiX + 0.8 * z, emojiY - 0.8 * z, 1.4 * z, 0.8 * z);
      } else if (cycle === 1) {
        // Chat Bubble 💬
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(emojiX - 1 * z, emojiY, 4 * z, 3 * z);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(emojiX, emojiY + 1 * z, 2 * z, 1 * z);
      } else if (cycle === 2) {
        // Lightning Bolt ⚡
        ctx.fillStyle = '#eab308';
        ctx.fillRect(emojiX + 0.5 * z, emojiY - 1 * z, 2 * z, 3 * z);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(emojiX, emojiY + 1 * z, 1.5 * z, 2 * z);
      } else {
        // Star / Like ⭐
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(emojiX, emojiY, 2.5 * z, 2.5 * z);
      }
      ctx.restore();
    }

    ctx.restore();
  }

  // 3. ☕ Coffee / Drink Cup with Rising Spiraling Steam
  if (ch.state === CharacterState.COFFEE || ch.state === CharacterState.DRINK) {
    ctx.save();
    const cupX = drawX + 11 * z;
    const cupY = drawY + 11 * z;

    // Ceramic mug body
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cupX, cupY, 3.8 * z, 4.2 * z);
    // Mug handle
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.9 * z;
    ctx.strokeRect(cupX + 3.2 * z, cupY + 1 * z, 1.4 * z, 2.2 * z);

    // Rich dark coffee / drink
    ctx.fillStyle = ch.state === CharacterState.COFFEE ? '#451a03' : '#0284c7';
    ctx.fillRect(cupX + 0.6 * z, cupY, 2.6 * z, 1.2 * z);

    // Animated rising steam particles
    const steam1 = Math.sin(time * 0.8) * 1.2 * z;
    const steam2 = Math.cos(time * 0.8) * 1.2 * z;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fillRect(cupX + 1 * z + steam1, cupY - 2.5 * z, 1 * z, 1.8 * z);
    ctx.fillRect(cupX + 2.2 * z + steam2, cupY - 4.2 * z, 1.2 * z, 1.8 * z);
    ctx.restore();
  }

  // 4. 🧹 Broom & Cleaning (Sapu & Pel) with Dust & Sparkle
  if (ch.state === CharacterState.CLEAN) {
    ctx.save();
    const broomX = drawX + 12 * z;
    const broomY = drawY + 9 * z;

    // Wooden broom pole
    ctx.fillStyle = '#92400e';
    ctx.fillRect(broomX, broomY, 1.5 * z, 11 * z);

    // Broom bristles
    ctx.fillStyle = '#facc15';
    ctx.fillRect(broomX - 2.5 * z, broomY + 10 * z, 6 * z, 3 * z);

    // Swept dust puff
    ctx.fillStyle = 'rgba(203, 213, 225, 0.6)';
    const dustX = broomX - 3 * z + Math.sin(time * 1.2) * 2 * z;
    ctx.fillRect(dustX, broomY + 12 * z, 1.8 * z, 1.8 * z);
    ctx.restore();
  }

  // 5. 📖 Holy Quran / Book with Gilded Pages
  if (ch.state === CharacterState.READ) {
    ctx.save();
    const bookX = drawX + 8.5 * z;
    const bookY = drawY + 11 * z;

    // Green leather book cover
    ctx.fillStyle = '#15803d';
    ctx.fillRect(bookX, bookY, 6 * z, 5 * z);

    // Golden embossed border & spine
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(bookX + 0.5 * z, bookY + 0.5 * z, 5 * z, 4 * z);
    ctx.fillStyle = '#166534';
    ctx.fillRect(bookX + 1 * z, bookY + 1 * z, 4 * z, 3 * z);

    // Sparkle reflection
    const sparkle = Math.sin(time * 0.7);
    if (sparkle > 0.5) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(bookX + 2 * z, bookY + 1.5 * z, 1 * z, 1 * z);
    }
    ctx.restore();
  }

  // 6. 📦 Carry Box / Parcel
  if (ch.state === CharacterState.CARRY) {
    ctx.save();
    const boxX = drawX + 7.5 * z;
    const boxY = drawY + 11 * z;

    ctx.fillStyle = '#b45309';
    ctx.fillRect(boxX, boxY, 7 * z, 5.5 * z);
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(boxX + 2.5 * z, boxY, 2 * z, 5.5 * z);
    ctx.restore();
  }

  // 7. 🚿 Water drops at Wudhu
  if (ch.state === CharacterState.WUDHU) {
    ctx.save();
    ctx.fillStyle = '#38bdf8';
    const dropY = drawY + 13 * z + (time % 3) * 1.5 * z;
    ctx.fillRect(drawX + 8 * z, dropY, 1.8 * z, 1.8 * z);
    ctx.fillRect(drawX + 11 * z, dropY - 1 * z, 1.5 * z, 1.5 * z);
    // Splash spray
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(drawX + 9.5 * z + Math.sin(time) * 2 * z, drawY + 16 * z, 1.2 * z, 1.2 * z);
    ctx.restore();
  }

  // 8. 💻 Glowing Laptop for Coding / Typing on Desks
  if (ch.state === CharacterState.TYPE) {
    ctx.save();
    const lapX = drawX + 10 * z;
    const lapY = drawY + 12 * z;

    // Screen Glow
    ctx.fillStyle = 'rgba(74, 222, 128, 0.2)';
    ctx.beginPath();
    ctx.arc(lapX + 2 * z, lapY, 6 * z, 0, Math.PI * 2);
    ctx.fill();

    // Laptop Screen Back / Bezel
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(lapX, lapY - 4 * z, 5 * z, 4 * z);

    // Glowing Code Screen (Green terminal matrix)
    ctx.fillStyle = '#14532d';
    ctx.fillRect(lapX + 0.5 * z, lapY - 3.5 * z, 4 * z, 3 * z);

    // Code lines (Syntax green/yellow/cyan)
    const codeTick = (time % 4);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(lapX + 1 * z, lapY - 3 * z, 2.5 * z, 0.6 * z);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(lapX + 1 * z, lapY - 2 * z, 1.8 * z, 0.6 * z);
    ctx.fillStyle = codeTick < 2 ? '#facc15' : '#4ade80';
    ctx.fillRect(lapX + 1 * z, lapY - 1 * z, 2.2 * z, 0.6 * z);

    // Laptop Base / Keyboard
    ctx.fillStyle = '#475569';
    ctx.fillRect(lapX - 0.5 * z, lapY, 6 * z, 1.5 * z);

    ctx.restore();
  }
}
