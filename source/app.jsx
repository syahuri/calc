const { useState } = React;

// ─── Constants ───────────────────────────────────────────────
const CAB_TYPES = {
  '50x100': { width: 0.5, height: 1.0, weight: 13, peak: 300, avg: 120, stock: 36, boxes: 6 }
};

const SIZE_PRESETS = [
  { label: '4×2m', w: 4, h: 2 },
  { label: '4×3m', w: 4, h: 3 },
  { label: '5×3m', w: 5, h: 3 },
  { label: '6×3m', w: 6, h: 3 },
  { label: 'Custom', w: 0, h: 0 }
];

const MULTICAM_PRICES = { 2: 3000000, 3: 5000000, 4: 6000000 };
const OUTPUT_ADDONS = { youtube: 1000000, zoom: 1500000 };
const PRICE_PER_SQM = 1000000;

const fmt = (n) => n.toLocaleString('id-ID');

// ─── Icons (inline SVG) ──────────────────────────────────────
const Icons = {
  chevron: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 transition-transform"><polyline points="6 9 12 15 18 9"/></svg>,
  box:     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>,
  calc:    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>,
  layers:  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  check:   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="20 6 9 17 4 12"/></svg>,
  alert:   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>,
  copy:    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>,
  grid:    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="3" x2="21" y1="15" y2="15"/><line x1="9" x2="9" y1="3" y2="21"/><line x1="15" x2="15" y1="3" y2="21"/></svg>,
  zap:     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  weight:  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M7 21a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="M17 21a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="M21 21a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="M15 13a9 9 0 0 1-9 9"/><path d="M15 13a9 9 0 0 0 9 9"/><path d="M15 13V3"/></svg>,
  wa:      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-12.7 8.38 8.38 0 0 1 3.8.9L21 2l-1.5 5.5Z"/></svg>,
  camera:  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>,
  play:    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  monitor: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>,
  users:   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  mapPin:  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  clock:   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  tag:     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2H2v10l9.3 9.3a1 1 0 0 0 1.4 0l7.7-7.7a1 1 0 0 0 0-1.4L12 2Z"/><path d="M7 7h.01"/></svg>,
  genset:  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 22 4-10 4 10"/></svg>
};

// ─── Accordion Wrapper ──────────────────────────────────────
function Accordion({ title, icon, iconBg, badge, defaultOpen, toggle, children }) {
  const [open, setOpen] = useState(defaultOpen);

  const handleToggle = (e) => {
    e.stopPropagation();
    const newVal = !toggle.value;
    toggle.onChange(newVal);
    setOpen(newVal);
  };

  return React.createElement('div', { className: 'glass-panel rounded-2xl overflow-hidden' },
    // Header
    React.createElement('div', {
      className: 'w-full flex items-center justify-between p-3.5 text-left transition-all hover:bg-white/5 cursor-pointer',
      onClick: () => toggle ? handleToggle({ stopPropagation: () => {} }) : setOpen(!open)
    },
      React.createElement('div', { className: 'flex items-center gap-2.5' },
        React.createElement('span', { className: `w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}` }, icon),
        React.createElement('div', null,
          React.createElement('p', { className: 'text-sm font-black text-white' }, title),
          badge && React.createElement('p', { className: 'text-[9px] text-slate-500 font-bold' }, badge)
        )
      ),
      // Toggle doubles as expand/collapse control (no separate chevron)
      toggle
        ? React.createElement('div', {
            className: `toggle-switch w-11 h-6 rounded-full p-0.5 transition-colors ${toggle.value ? 'bg-blue-500' : 'bg-white/10'}`,
            onClick: handleToggle
          },
            React.createElement('div', { className: `w-5 h-5 rounded-full bg-white transition-transform ${toggle.value ? 'translate-x-5' : ''}` })
          )
        : React.createElement('span', { className: `text-slate-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}` }, Icons.chevron)
    ),
    // Body
    open && React.createElement('div', { className: 'px-3.5 pb-3.5 space-y-3 border-t border-white/5 pt-3' },
      children
    )
  );
}

// ─── Stepper (compact +/- button) ──────────────────────────
function Stepper({ label, value, unit, step, min, max, onChange }) {
  return React.createElement('div', { className: 'space-y-1' },
    React.createElement('p', { className: 'text-[9px] font-bold text-slate-500 uppercase tracking-widest' }, label),
    React.createElement('div', { className: 'flex items-center gap-1' },
      React.createElement('button', {
        onClick: () => onChange(Math.max(min, value - step)),
        className: 'w-9 h-9 rounded-lg bg-white/5 text-white font-black text-lg flex items-center justify-center active:bg-blue-500 shrink-0'
      }, '−'),
      React.createElement('div', { className: 'flex-1 text-center bg-white/[0.03] rounded-lg py-1.5' },
        React.createElement('span', { className: 'text-lg font-black text-blue-400' }, value.toFixed(step < 1 ? 1 : 0)),
        React.createElement('span', { className: 'text-[9px] text-slate-500 ml-0.5' }, unit)
      ),
      React.createElement('button', {
        onClick: () => onChange(Math.min(max, value + step)),
        className: 'w-9 h-9 rounded-lg bg-white/5 text-white font-black text-lg flex items-center justify-center active:bg-blue-500 shrink-0'
      }, '+')
    )
  );
}

// ─── Main App ───────────────────────────────────────────────
function App() {
  // Multicam state
  const [multicamEnabled, setMulticamEnabled] = useState(false);
  const [cameraCount, setCameraCount] = useState(2);
  const [outputs, setOutputs] = useState({ youtube: false, zoom: false });

  // Videotron state
  const [videotronEnabled, setVideotronEnabled] = useState(false);
  const [cabType, setCabType] = useState('50x100');
  const [sizePreset, setSizePreset] = useState(1);
  const [reqWidth, setReqWidth] = useState(4.0);
  const [reqHeight, setReqHeight] = useState(3.0);

  // Shared state
  const [days, setDays] = useState(1);
  const [location, setLocation] = useState('meulaboh');
  const [extraCost, setExtraCost] = useState(0);
  const [extraCostStr, setExtraCostStr] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // ── Calculations ──
  const activeSpec = CAB_TYPES[cabType];
  const cols = Math.max(1, Math.round(reqWidth / activeSpec.width));
  const rows = Math.max(1, Math.round(reqHeight / activeSpec.height));
  const actualWidth = cols * activeSpec.width;
  const actualHeight = rows * activeSpec.height;
  const totalCabinets = cols * rows;
  const videotronArea = actualWidth * actualHeight;

  const boxesNeeded = activeSpec.boxes > 0 ? Math.ceil(totalCabinets / (activeSpec.stock / activeSpec.boxes)) : 0;
  const isPossible = totalCabinets <= activeSpec.stock && activeSpec.stock > 0;
  const missingCabinets = totalCabinets - activeSpec.stock;
  const totalWeight = totalCabinets * activeSpec.weight;
  const peakWatt = totalCabinets * activeSpec.peak;
  const peakAmp = peakWatt / 220;
  const peakPowerKW = peakWatt / 1000;
  const gensetKVA = peakPowerKW / 0.8;
  const gensetRaw = gensetKVA * 1.25;
  const gensetRec = Math.ceil(gensetRaw / 5) * 5;
  const lanPaths = Math.min(4, Math.max(1, Math.ceil(totalCabinets / 18)));

  // Price calculations
  const dayFactor = 1 + Math.max(0, days - 1) * 0.5;
  const videotronPrice = videotronEnabled ? videotronArea * PRICE_PER_SQM : 0;
  const multicamPrice = multicamEnabled ? MULTICAM_PRICES[cameraCount] : 0;
  const youtubePrice = multicamEnabled && outputs.youtube ? OUTPUT_ADDONS.youtube : 0;
  const zoomPrice = multicamEnabled && outputs.zoom ? OUTPUT_ADDONS.zoom : 0;
  const subtotal = (videotronPrice + multicamPrice + youtubePrice + zoomPrice) * dayFactor;
  const total = subtotal + extraCost;

  // ── Handlers ──
  const applyPreset = (i) => {
    setSizePreset(i);
    if (i < 4) { setReqWidth(SIZE_PRESETS[i].w); setReqHeight(SIZE_PRESETS[i].h); }
  };

  const shareWA = () => {
    const lines = ['*ESTIMASI - ELKIFAH PRODUCTION*'];
    if (multicamEnabled) lines.push(`📹 Multicam ${cameraCount} Cam` + (outputs.youtube ? ' + YT' : '') + (outputs.zoom ? ' + Zoom' : ''));
    lines.push(`🖥️ Videotron ${actualWidth}×${actualHeight}m (${totalCabinets} kabinet ${cabType})`);
    lines.push(`⚡ ${fmt(peakWatt)}W | ${peakAmp.toFixed(1)}A | Genset ≥ ${gensetRec}kVA`);
    lines.push(`📦 ${boxesNeeded} case | ${totalWeight}kg | ${lanPaths} LAN`);
    if (days > 1) lines.push(`📅 ${days} hari (×${dayFactor.toFixed(1)})`);
    lines.push(`💰 *TOTAL: Rp ${fmt(total)}*`);
    window.open(`https://wa.me/?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
  };

  const copyToClipboard = () => {
    const text = `ESTIMASI - ELKIFAH PRODUCTION\nVideotron ${actualWidth}×${actualHeight}m (${totalCabinets} kabinet)\nDaya: ${fmt(peakWatt)}W | ${peakAmp.toFixed(1)}A | Genset ${gensetRec}kVA\n${multicamEnabled ? `Multicam ${cameraCount}cam\n` : ''}Total: Rp ${fmt(total)}`;
    navigator.clipboard.writeText(text).then(() => { setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); });
  };

  return React.createElement('div', { className: 'min-h-screen p-3 sm:p-4 max-w-lg mx-auto space-y-3 pb-8' },
    // ── Header ──
    React.createElement('header', { className: 'text-center pt-2 pb-2 border-b border-white/10' },
      React.createElement('h1', { className: 'text-lg font-black tracking-tighter text-white' },
        'ELKIFAH ', React.createElement('span', { className: 'text-blue-500' }, 'PRODUCTION')
      ),
      React.createElement('p', { className: 'text-[8px] text-slate-500 font-bold uppercase tracking-[0.3em]' }, 'Kalkulator Videotron')
    ),

    // ═══════════════════════════════════════════════════════
    // ACCORDION 1: MULTICAM (optional)
    // ═══════════════════════════════════════════════════════
    React.createElement(Accordion, {
      title: 'Multicam Live Streaming',
      icon: Icons.camera,
      iconBg: 'bg-blue-500/10 text-blue-500',
      badge: multicamEnabled ? `${cameraCount} Cam aktif` : 'Opsional — tap untuk aktifkan',
      defaultOpen: false,
      toggle: { value: multicamEnabled, onChange: setMulticamEnabled }
    },

      // Camera count + outputs (only when enabled)
      multicamEnabled && React.createElement(React.Fragment, null,
        // Camera count
        React.createElement('div', { className: 'space-y-2' },
          React.createElement('p', { className: 'text-[9px] font-bold text-slate-500 uppercase tracking-widest' }, 'Jumlah Kamera'),
          React.createElement('div', { className: 'grid grid-cols-3 gap-2' },
            [2, 3, 4].map(n => React.createElement('button', {
              key: n,
              onClick: () => setCameraCount(n),
              className: `p-2.5 rounded-xl text-center transition-all ${cameraCount === n ? 'bg-blue-500 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:text-white'}`
            },
              React.createElement('p', { className: 'text-lg font-black' }, n),
              React.createElement('p', { className: 'text-[8px] uppercase font-bold' }, 'Kamera'),
              React.createElement('p', { className: 'text-[9px] font-bold mt-0.5 text-blue-300' }, 'Rp', (MULTICAM_PRICES[n] / 1000000).toFixed(0), 'jt')
            ))
          )
        ),

        // Output addons
        React.createElement('div', { className: 'space-y-2' },
          React.createElement('p', { className: 'text-[9px] font-bold text-slate-500 uppercase tracking-widest' }, 'Output Tambahan'),
          React.createElement('label', { className: 'flex items-center justify-between p-2.5 rounded-xl bg-white/5 cursor-pointer' },
            React.createElement('div', { className: 'flex items-center gap-2' },
              Icons.play,
              React.createElement('span', { className: 'text-[10px] font-bold text-white' }, 'YouTube Live'),
              React.createElement('span', { className: 'text-[9px] text-emerald-400 font-bold' }, '+Rp 1jt')
            ),
            React.createElement('input', { type: 'checkbox', checked: outputs.youtube, onChange: e => setOutputs({ ...outputs, youtube: e.target.checked }), className: 'w-4 h-4 accent-blue-500' })
          ),
          React.createElement('label', { className: 'flex items-center justify-between p-2.5 rounded-xl bg-white/5 cursor-pointer' },
            React.createElement('div', { className: 'flex items-center gap-2' },
              Icons.users,
              React.createElement('span', { className: 'text-[10px] font-bold text-white' }, 'Zoom Meeting'),
              React.createElement('span', { className: 'text-[9px] text-emerald-400 font-bold' }, '+Rp 1.5jt')
            ),
            React.createElement('input', { type: 'checkbox', checked: outputs.zoom, onChange: e => setOutputs({ ...outputs, zoom: e.target.checked }), className: 'w-4 h-4 accent-blue-500' })
          )
        )
      ) // end multicam content
    ),

    // ═══════════════════════════════════════════════════════
    // ACCORDION 2: VIDEOTRON
    // ═══════════════════════════════════════════════════════
    React.createElement(Accordion, {
      title: 'LED Videotron',
      icon: Icons.monitor,
      iconBg: 'bg-cyan-500/10 text-cyan-500',
      badge: videotronEnabled ? `${actualWidth}×${actualHeight}m · ${totalCabinets} kabinet` : 'Tap untuk aktifkan',
      defaultOpen: false,
      toggle: { value: videotronEnabled, onChange: setVideotronEnabled }
    },
      // Stock badge
      React.createElement('div', { className: 'px-3 py-2 rounded-xl border-l-4 border-blue-500 bg-blue-500/5 flex items-center justify-between' },
        React.createElement('div', null,
          React.createElement('p', { className: 'text-[8px] uppercase tracking-widest text-slate-500 font-bold' }, 'Stok Gudang: Meulaboh'),
          React.createElement('p', { className: 'text-sm font-black text-white' },
            activeSpec.stock, ' unit',
            activeSpec.boxes > 0 && React.createElement('span', { className: 'text-[9px] text-slate-500 ml-1' }, '/ ' + activeSpec.boxes + ' case')
          )
        ),
        React.createElement('div', { className: `px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${isPossible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}` },
          isPossible ? 'Stok Aman' : totalCabinets > activeSpec.stock ? `+${missingCabinets}` : 'Kosong'
        )
      ),

      // Cab type label
      React.createElement('div', { className: 'flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03]' },
        React.createElement('span', { className: 'w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500' }, Icons.calc),
        React.createElement('span', { className: 'text-[10px] font-black text-white uppercase tracking-widest' }, 'Kabinet 50×100 cm')
      ),

      // Size presets
      React.createElement('div', null,
        React.createElement('p', { className: 'text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5' }, 'Ukuran Cepat'),
        React.createElement('div', { className: 'flex flex-wrap gap-1.5' },
          SIZE_PRESETS.map((p, i) => React.createElement('button', {
            key: i,
            onClick: () => applyPreset(i),
            className: `px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${sizePreset === i ? 'bg-blue-500 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:text-white'}`
          }, p.label))
        )
      ),

      // Custom steppers
      sizePreset === 4 && React.createElement('div', { className: 'grid grid-cols-2 gap-2' },
        React.createElement(Stepper, { label: 'Lebar', value: reqWidth, unit: 'm', step: 0.5, min: 1, max: 15, onChange: setReqWidth }),
        React.createElement(Stepper, { label: 'Tinggi', value: reqHeight, unit: 'm', step: 1, min: 1, max: 10, onChange: setReqHeight })
      ),

      // Actual dimensions
      React.createElement('div', { className: 'grid grid-cols-2 gap-2' },
        React.createElement('div', { className: 'bg-white/[0.03] p-2.5 rounded-xl text-center' },
          React.createElement('p', { className: 'text-[7px] text-slate-500 font-bold uppercase tracking-widest' }, 'Lebar Aktual'),
          React.createElement('p', { className: 'text-base font-black text-white' }, actualWidth.toFixed(1), 'm'),
          React.createElement('span', { className: 'text-[9px] text-blue-400 font-bold' }, cols, ' kabinet')
        ),
        React.createElement('div', { className: 'bg-white/[0.03] p-2.5 rounded-xl text-center' },
          React.createElement('p', { className: 'text-[7px] text-slate-500 font-bold uppercase tracking-widest' }, 'Tinggi Aktual'),
          React.createElement('p', { className: 'text-base font-black text-white' }, actualHeight.toFixed(1), 'm'),
          React.createElement('span', { className: 'text-[9px] text-blue-400 font-bold' }, rows, ' kabinet')
        )
      ),

      // ── Logistics mini-cards ──
      React.createElement('div', { className: 'grid grid-cols-3 gap-2' },
        React.createElement('div', { className: 'glass-panel p-2.5 rounded-xl text-center' },
          React.createElement('div', { className: 'flex items-center justify-center text-amber-500 mb-1' },
            React.createElement('span', { className: 'w-5 h-5 rounded-lg bg-amber-500/10 flex items-center justify-center' }, Icons.box)
          ),
          React.createElement('p', { className: 'text-lg font-black text-white leading-none' }, boxesNeeded),
          React.createElement('p', { className: 'text-[7px] text-slate-500 font-bold uppercase tracking-widest mt-0.5' }, 'Case')
        ),
        React.createElement('div', { className: 'glass-panel p-2.5 rounded-xl text-center' },
          React.createElement('div', { className: 'flex items-center justify-center text-purple-500 mb-1' },
            React.createElement('span', { className: 'w-5 h-5 rounded-lg bg-purple-500/10 flex items-center justify-center' }, Icons.weight)
          ),
          React.createElement('p', { className: 'text-lg font-black text-white leading-none' }, totalWeight),
          React.createElement('p', { className: 'text-[7px] text-slate-500 font-bold uppercase tracking-widest mt-0.5' }, 'Kg')
        ),
        React.createElement('div', { className: 'glass-panel p-2.5 rounded-xl text-center' },
          React.createElement('div', { className: 'flex items-center justify-center text-blue-500 mb-1' },
            React.createElement('span', { className: 'w-5 h-5 rounded-lg bg-blue-500/10 flex items-center justify-center' }, Icons.layers)
          ),
          React.createElement('p', { className: 'text-lg font-black text-white leading-none' }, lanPaths),
          React.createElement('p', { className: 'text-[7px] text-slate-500 font-bold uppercase tracking-widest mt-0.5' }, 'LAN')
        )
      ),

      // ── Power panel (Watt + Ampere) ──
      React.createElement('div', { className: 'glass-panel p-3 rounded-2xl space-y-3 border border-cyan-500/20' },
        React.createElement('div', { className: 'flex items-center gap-2 text-cyan-400' },
          React.createElement('span', { className: 'w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center' }, Icons.zap),
          React.createElement('span', { className: 'text-[9px] font-bold uppercase tracking-widest' }, 'Kebutuhan Daya Listrik')
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-2' },
          React.createElement('div', { className: 'bg-cyan-500/5 rounded-xl p-3 text-center border border-cyan-500/10' },
            React.createElement('p', { className: 'text-[7px] text-slate-500 font-bold uppercase tracking-widest mb-1' }, 'Daya Puncak'),
            React.createElement('p', { className: 'text-2xl font-black text-cyan-400 leading-none' }, fmt(peakWatt)),
            React.createElement('p', { className: 'text-[8px] text-slate-500 font-bold mt-1' }, 'Watt')
          ),
          React.createElement('div', { className: 'bg-cyan-500/5 rounded-xl p-3 text-center border border-cyan-500/10' },
            React.createElement('p', { className: 'text-[7px] text-slate-500 font-bold uppercase tracking-widest mb-1' }, 'Arus (220V)'),
            React.createElement('p', { className: 'text-2xl font-black text-cyan-400 leading-none' }, peakAmp.toFixed(1)),
            React.createElement('p', { className: 'text-[8px] text-slate-500 font-bold mt-1' }, 'Ampere')
          )
        )
      ),

      // ── Genset recommendation ──
      React.createElement('div', { className: 'glass-panel p-3 rounded-2xl space-y-2 border border-amber-500/20 bg-amber-500/[0.03]' },
        React.createElement('div', { className: 'flex items-center gap-2 text-amber-400' },
          React.createElement('span', { className: 'w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center' }, Icons.genset),
          React.createElement('span', { className: 'text-[9px] font-bold uppercase tracking-widest' }, 'Rekomendasi Genset')
        ),
        React.createElement('div', { className: 'flex items-center justify-between' },
          React.createElement('div', null,
            React.createElement('p', { className: 'text-[8px] text-slate-500 font-bold' }, 'Daya Apparent'),
            React.createElement('p', { className: 'text-sm font-black text-white' }, gensetKVA.toFixed(1), ' kVA'),
            React.createElement('p', { className: 'text-[7px] text-slate-500' }, '÷ 0.8 pf (real load)')
          ),
          React.createElement('div', { className: 'text-right' },
            React.createElement('p', { className: 'text-[8px] text-slate-500 font-bold' }, '+25% Safety'),
            React.createElement('p', { className: 'text-lg font-black text-amber-400 leading-none' }, gensetRec, ' kVA'),
            React.createElement('p', { className: 'text-[7px] text-slate-500' }, 'Min. genset size')
          )
        ),
        React.createElement('p', { className: 'text-[7px] text-slate-500 italic text-center' }, 'Sewa genset ≥ ', gensetRec, ' kVA agar tidak overload')
      ),

      // ── Visual grid ──
      React.createElement('div', { className: 'glass-panel p-3 rounded-2xl space-y-2' },
        React.createElement('div', { className: 'flex items-center justify-between' },
          React.createElement('h3', { className: 'text-xs font-black text-white flex items-center gap-2' },
            React.createElement('span', { className: 'w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500' }, Icons.grid),
            'Visualisasi'
          ),
          React.createElement('span', { className: 'text-[9px] text-slate-500 font-bold' }, videotronArea.toFixed(1), ' m²')
        ),
        React.createElement('div', { className: 'flex justify-center' },
          React.createElement('div', {
            className: 'led-grid',
            style: { gridTemplateColumns: `repeat(${cols}, minmax(20px, 1fr))` }
          },
            [...Array(totalCabinets)].map((_, i) => React.createElement('div', {
              key: i,
              className: `cabinet rounded flex items-center justify-center text-[7px] font-bold ${i < activeSpec.stock ? 'text-blue-500/30 border-blue-500/20' : 'text-red-500 border-red-500/30 bg-red-500/10'} w-5 h-10`
            }, i + 1))
          )
        )
      ),

      // ── Duration (multiday) ──
      React.createElement('div', { className: 'glass-panel p-2.5 rounded-xl space-y-1.5' },
        React.createElement('p', { className: 'text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5' }, Icons.clock, 'Durasi Sewa'),
        React.createElement('div', { className: 'flex items-center gap-1' },
          React.createElement('button', {
            onClick: () => setDays(Math.max(1, days - 1)),
            className: 'w-9 h-9 rounded-lg bg-white/5 text-white font-black text-lg flex items-center justify-center active:bg-blue-500 shrink-0'
          }, '−'),
          React.createElement('div', { className: 'flex-1 text-center bg-white/[0.03] rounded-lg py-1.5' },
            React.createElement('span', { className: 'text-lg font-black text-blue-400' }, days),
            React.createElement('span', { className: 'text-[9px] text-slate-500 ml-0.5' }, 'hari')
          ),
          React.createElement('button', {
            onClick: () => setDays(Math.min(30, days + 1)),
            className: 'w-9 h-9 rounded-lg bg-white/5 text-white font-black text-lg flex items-center justify-center active:bg-blue-500 shrink-0'
          }, '+')
        ),
        React.createElement('p', { className: 'text-[8px] text-slate-500 text-center' },
          days > 1 ? `H1: 100% + H2+: 50% → faktor ×${dayFactor.toFixed(1)}` : 'Harga 1 hari penuh'
        )
      ),

      // ── Location (Meulaboh / Luar Area) ──
      React.createElement('div', { className: 'glass-panel p-2.5 rounded-xl space-y-2' },
        React.createElement('p', { className: 'text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5' }, Icons.mapPin, 'Lokasi'),
        React.createElement('div', { className: 'grid grid-cols-2 gap-2' },
          React.createElement('button', {
            onClick: () => { setLocation('meulaboh'); setExtraCost(0); setExtraCostStr(''); },
            className: `p-2.5 rounded-xl text-center transition-all ${location === 'meulaboh' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:text-white'}`
          },
            React.createElement('p', { className: 'text-[10px] font-black uppercase' }, 'Meulaboh'),
            React.createElement('p', { className: 'text-[8px] opacity-70' }, 'Harga Basic')
          ),
          React.createElement('button', {
            onClick: () => setLocation('other'),
            className: `p-2.5 rounded-xl text-center transition-all ${location === 'other' ? 'bg-amber-500 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:text-white'}`
          },
            React.createElement('p', { className: 'text-[10px] font-black uppercase' }, 'Luar Area'),
            React.createElement('p', { className: 'text-[8px] opacity-70' }, '+ Biaya')
          )
        ),
        location === 'other' && React.createElement('input', {
          type: 'text', inputMode: 'numeric', value: extraCostStr,
          placeholder: 'Biaya tambahan transport (Rp)',
          onChange: e => { setExtraCostStr(e.target.value); setExtraCost(parseInt(e.target.value.replace(/\D/g, '')) || 0); },
          className: 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-bold'
        })
      )
    ),

    // ═══════════════════════════════════════════════════════
    // RINGKASAN HARGA (always visible)
    // ═══════════════════════════════════════════════════════
    React.createElement('div', { className: 'glass-panel p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3' },
      React.createElement('h3', { className: 'text-sm font-black text-white flex items-center gap-2' },
        React.createElement('span', { className: 'w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500' }, Icons.tag),
        'Ringkasan Estimasi'
      ),
      React.createElement('div', { className: 'space-y-1.5 text-[10px]' },
        // Videotron line
        videotronEnabled && React.createElement('div', { className: 'flex justify-between' },
          React.createElement('span', { className: 'text-slate-400' }, 'Videotron ', videotronArea.toFixed(1), 'm² × Rp 1jt'),
          React.createElement('span', { className: 'text-white font-bold' }, 'Rp', fmt(videotronPrice))
        ),
        // Multicam line
        multicamEnabled && React.createElement('div', { className: 'flex justify-between' },
          React.createElement('span', { className: 'text-slate-400' }, 'Multicam ', cameraCount, ' kamera'),
          React.createElement('span', { className: 'text-white font-bold' }, 'Rp', fmt(multicamPrice))
        ),
        // YouTube line
        multicamEnabled && outputs.youtube && React.createElement('div', { className: 'flex justify-between' },
          React.createElement('span', { className: 'text-slate-400' }, 'YouTube Live'),
          React.createElement('span', { className: 'text-white font-bold' }, 'Rp', fmt(youtubePrice))
        ),
        // Zoom line
        multicamEnabled && outputs.zoom && React.createElement('div', { className: 'flex justify-between' },
          React.createElement('span', { className: 'text-slate-400' }, 'Zoom Meeting'),
          React.createElement('span', { className: 'text-white font-bold' }, 'Rp', fmt(zoomPrice))
        ),
        // Duration factor
        days > 1 && React.createElement('div', { className: 'flex justify-between' },
          React.createElement('span', { className: 'text-slate-400' }, 'Durasi ', days, ' hari (×', dayFactor.toFixed(1), ')'),
          React.createElement('span', { className: 'text-amber-400 font-bold' }, 'Sub: Rp', fmt(subtotal))
        ),
        // Extra cost
        extraCost > 0 && React.createElement('div', { className: 'flex justify-between' },
          React.createElement('span', { className: 'text-slate-400' }, 'Biaya Luar Area'),
          React.createElement('span', { className: 'text-white font-bold' }, 'Rp', fmt(extraCost))
        )
      ),
      // Total
      React.createElement('div', { className: 'flex justify-between pt-2 border-t border-white/10' },
        React.createElement('span', { className: 'text-xs font-black text-white' }, 'TOTAL ESTIMASI'),
        React.createElement('span', { className: 'text-lg font-black text-emerald-400' }, 'Rp', fmt(total))
      ),
      React.createElement('p', { className: 'text-[8px] text-slate-500 italic text-center' }, '* Harga final dapat disesuaikan saat negosiasi')
    ),

    // ── Share buttons ──
    React.createElement('div', { className: 'grid grid-cols-2 gap-2' },
      React.createElement('button', {
        onClick: shareWA,
        className: 'bg-[#25D366] hover:bg-[#20ba59] py-3.5 rounded-2xl flex items-center justify-center gap-2 text-white font-black text-[10px] uppercase tracking-widest transition-all'
      }, Icons.wa, 'Share WA'),
      React.createElement('button', {
        onClick: copyToClipboard,
        className: 'glass-panel hover:bg-white/10 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-white font-black text-[10px] uppercase tracking-widest transition-all border border-white/10'
      }, isCopied ? Icons.check : Icons.copy, isCopied ? 'Tersalin' : 'Copy')
    ),

    // ── Footer ──
    React.createElement('footer', { className: 'text-center py-2 opacity-30' },
      React.createElement('p', { className: 'text-[7px] font-bold uppercase tracking-[0.2em] text-slate-500' }, '© 2024 ELKIFAH PRODUCTION')
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App, null));
