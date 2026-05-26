// ============================================================
// SHARE REPORT — Generates a professional report card image
// Directly shares via native share (WhatsApp, Insta, etc.)
// No popup — just click and share!
// ============================================================
import { useState } from 'react';
import { Share2, CheckCircle2 } from 'lucide-react';

interface Props {
  playerName: string;
  difficulty: string;
  percentage: number;
  correct: number;
  wrong: number;
  skipped: number;
  total: number;
  avgTime: number;
  grade: string;
  gradeLabel: string;
}

export default function ShareReport({ playerName, difficulty, percentage, correct, wrong, skipped, total, avgTime, grade, gradeLabel }: Props) {
  const [status, setStatus] = useState<'idle' | 'generating' | 'done'>('idle');

  // Build the report card off-screen, capture it, then share directly
  const handleShare = async () => {
    setStatus('generating');

    // Create a hidden DOM element for the report card
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;left:-9999px;top:0;width:600px;z-index:-1;';
    div.innerHTML = buildReportHTML({ playerName, difficulty, percentage, correct, wrong, skipped, total, avgTime, grade, gradeLabel });
    document.body.appendChild(div);

    try {
      // Small delay to let fonts render
      await new Promise(r => setTimeout(r, 300));

      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(div, { backgroundColor: '#0a0a1a', scale: 2, useCORS: true });
      document.body.removeChild(div);

      const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/png'));
      if (!blob) { setStatus('idle'); return; }

      const file = new File([blob], 'varc-arena-report.png', { type: 'image/png' });

      // Try native share (shows WhatsApp, Instagram, etc.)
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'My VARC Arena Score',
          text: `🎯 I scored ${percentage}% on VARC Arena (${difficulty})! Think you can beat me? Join the challenge!`,
          files: [file],
        });
      } else {
        // Fallback: download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'varc-arena-report.png'; a.click();
        URL.revokeObjectURL(url);
      }
      setStatus('done');
      setTimeout(() => setStatus('idle'), 2500);
    } catch {
      document.body.removeChild(div);
      setStatus('idle');
    }
  };

  return (
    <button onClick={handleShare} disabled={status === 'generating'}
      className="flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold transition-all hover:scale-105 active:scale-95 w-full sm:w-auto justify-center disabled:opacity-60"
      style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
      {status === 'generating' ? (
        <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
      ) : status === 'done' ? (
        <><CheckCircle2 className="w-5 h-5" />Shared! ✓</>
      ) : (
        <><Share2 className="w-5 h-5" />Share Results</>
      )}
    </button>
  );
}

// ---- Build the report card as raw HTML (for html2canvas) ----
function buildReportHTML(d: Props) {
  const sc = d.percentage >= 70 ? '#34d399' : d.percentage >= 50 ? '#fbbf24' : '#f87171';
  const gradEmoji = d.percentage >= 70 ? '🏆' : d.percentage >= 50 ? '💪' : '🎯';

  return `
  <div style="font-family:'Inter',system-ui,sans-serif; background:linear-gradient(160deg,#0f0c29,#302b63,#24243e); color:white; padding:48px 40px; border-radius:24px; width:600px;">
    <div style="height:6px; border-radius:3px; background:linear-gradient(90deg,#667eea,#764ba2,#f093fb,#f5576c); margin:-48px -40px 32px; border-radius:0;"></div>

    <!-- Logo -->
    <div style="text-align:center; margin-bottom:24px;">
      <div style="display:inline-flex; align-items:center; gap:10px;">
        <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:white;">V</div>
        <span style="font-size:18px;font-weight:700;letter-spacing:1px;">VARC ARENA</span>
      </div>
      <div style="font-size:11px;color:#94a3b8;margin-top:6px;letter-spacing:2px;">PERFORMANCE REPORT</div>
    </div>

    <!-- Player + difficulty -->
    <div style="text-align:center; margin-bottom:28px;">
      <div style="font-size:28px;font-weight:800;margin-bottom:4px;">${d.playerName || 'Student'}</div>
      <div style="font-size:14px;color:#94a3b8;">${d.difficulty} Level • ${d.total} Questions • ${gradEmoji}</div>
    </div>

    <!-- Score circle -->
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;position:relative;width:140px;height:140px;">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="7"/>
          <circle cx="70" cy="70" r="60" fill="none" stroke="${sc}" stroke-width="7" stroke-linecap="round"
            stroke-dasharray="${d.percentage * 3.77} 377" style="transform:rotate(-90deg);transform-origin:50% 50%;"/>
        </svg>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
          <span style="font-size:36px;font-weight:900;">${d.percentage}%</span>
          <span style="font-size:11px;color:#94a3b8;">Score</span>
        </div>
      </div>
    </div>

    <!-- Grade badge -->
    <div style="text-align:center;margin-bottom:28px;">
      <span style="display:inline-block;padding:10px 28px;border-radius:999px;font-size:16px;font-weight:700;color:white;background:linear-gradient(135deg,#667eea,#764ba2);">Grade: ${d.grade} — ${d.gradeLabel}</span>
    </div>

    <!-- Stats -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px;">
      ${[{l:'Correct',v:d.correct,c:'#34d399'},{l:'Wrong',v:d.wrong,c:'#f87171'},{l:'Skipped',v:d.skipped,c:'#fbbf24'},{l:'Avg Time',v:d.avgTime+'s',c:'#60a5fa'}].map(s=>`
        <div style="text-align:center;padding:16px 8px;border-radius:14px;background:rgba(255,255,255,0.06);">
          <div style="font-size:24px;font-weight:700;color:${s.c};">${s.v}</div>
          <div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-top:4px;">${s.l}</div>
        </div>
      `).join('')}
    </div>

    <!-- CTA -->
    <div style="text-align:center;padding:16px;border-radius:14px;background:linear-gradient(135deg,rgba(102,126,234,0.15),rgba(118,75,162,0.15));border:1px solid rgba(255,255,255,0.08);">
      <div style="font-size:14px;color:#c4b5fd;font-weight:600;">🎯 Think you can beat this score?</div>
      <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Practice CAT VARC at VARC Arena</div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:20px;font-size:10px;color:#475569;">Generated by VARC Arena • ${new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div>
  </div>`;
}
