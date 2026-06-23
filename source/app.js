const { useState, useEffect, useMemo } = React;

const CAB_TYPES = {
    '50x100': { width: 0.5, height: 1.0, weight: 13, peak: 300, avg: 120, stock: 30, boxes: 5 },
    '50x50': { width: 0.5, height: 0.5, weight: 7.5, peak: 150, avg: 60, stock: 0, boxes: 0 }
};

const Icon = ({ name, className = "w-5 h-5", strokeWidth = 2 }) => {
    const icons = {
        box: (
            <React.Fragment>
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
            </React.Fragment>
        ),
        calculator: (
            <React.Fragment>
                <rect width="16" height="20" x="4" y="2" rx="2" />
                <line x1="8" x2="16" y1="6" y2="6" />
                <line x1="16" x2="16" y1="14" y2="18" />
                <path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" />
                <path d="M12 14h.01" /><path d="M8 14h.01" />
                <path d="M12 18h.01" /><path d="M8 18h.01" />
            </React.Fragment>
        ),
        layers: (
            <React.Fragment>
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
            </React.Fragment>
        ),
        check: <polyline points="20 6 9 17 4 12" />,
        alert: (
            <React.Fragment>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
            </React.Fragment>
        ),
        copy: (
            <React.Fragment>
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </React.Fragment>
        ),
        grid: (
            <React.Fragment>
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <line x1="3" x2="21" y1="9" y2="9" />
                <line x1="3" x2="21" y1="15" y2="15" />
                <line x1="9" x2="9" y1="3" y2="21" />
                <line x1="15" x2="15" y1="3" y2="21" />
            </React.Fragment>
        ),
        zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
        weight: (
            <React.Fragment>
                <path d="M7 21a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                <path d="M17 21a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                <path d="M21 21a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                <path d="M15 13a9 9 0 0 1-9 9" />
                <path d="M15 13a9 9 0 0 0 9 9" />
                <path d="M15 13V3" />
            </React.Fragment>
        ),
        whatsapp: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-12.7 8.38 8.38 0 0 1 3.8.9L21 2l-1.5 5.5Z" />
    };
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
            {icons[name] || <circle cx="12" cy="12" r="10" />}
        </svg>
    );
};

const App = () => {
    const [reqWidth, setReqWidth] = useState(4.0);
    const [reqHeight, setReqHeight] = useState(3.0);
    const [cabType, setCabType] = useState('50x100');
    const [isCopied, setIsCopied] = useState(false);

    const activeSpec = CAB_TYPES[cabType];
    const totalStok = activeSpec.stock;

    const cols = Math.max(1, Math.round(reqWidth / activeSpec.width));
    const rows = Math.max(1, Math.round(reqHeight / activeSpec.height));

    const actualWidth = cols * activeSpec.width;
    const actualHeight = rows * activeSpec.height;
    const totalCabinets = cols * rows;
    const boxesNeeded = activeSpec.boxes > 0 ? Math.ceil(totalCabinets / (activeSpec.stock / activeSpec.boxes)) : 0;
    const isPossible = totalCabinets <= totalStok && totalStok > 0;

    const totalWeight = totalCabinets * activeSpec.weight;
    const peakPowerKW = (totalCabinets * activeSpec.peak / 1000);
    const avgPowerKW = (totalCabinets * activeSpec.avg / 1000);

    const peakWatt = (totalCabinets * activeSpec.peak).toLocaleString();
    const avgWatt = (totalCabinets * activeSpec.avg).toLocaleString();
    const peakKVA = (peakPowerKW / 0.8).toFixed(1);
    const avgKVA = (avgPowerKW / 0.8).toFixed(1);

    const lanPaths = Math.min(4, Math.max(1, Math.ceil(totalCabinets / 18)));

    const missingCabinets = totalCabinets - totalStok;
    const missingBoxes = activeSpec.stock > 0 ? Math.ceil(missingCabinets / (activeSpec.stock / activeSpec.boxes)) : 0;
    const missingArea = (missingCabinets * (activeSpec.width * activeSpec.height)).toFixed(1);

    const summaryText = `*ESTIMASI VIDEOTRON (${cabType}) - ELKIFAH PRODUCTION*
----------------------------------------
📍 *Target:* ${reqWidth}m x ${reqHeight}m
✅ *Realisasi:* ${actualWidth}m x ${actualHeight}m
🖥️ *Konfigurasi:* ${cols} Col x ${rows} Row
📦 *Total:* ${totalCabinets} Kabinet

🚛 *LOGISTIK:*
- Jenis: Kabinet ${cabType}
- Bawa: ${totalStok > 0 ? boxesNeeded + ' Case' : 'N/A'}
- Jalur LAN: ${lanPaths} Kabel
- Estimasi: ±${totalWeight} Kg
- Power Peak: ${peakPowerKW.toFixed(1)} kW / ${peakKVA} kVA (${peakWatt} Watt)

Status: ${isPossible ? '✅ TERSEDIA' : (totalStok === 0 ? '❌ STOK KOSONG (MEULABOH)' : `❌ KURANG: ${missingCabinets} Kabinet / ${missingBoxes} Kotak`)}
----------------------------------------`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(summaryText).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const shareWA = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(summaryText)}`, '_blank');
    };

    return (
        <div className="min-h-screen p-3 sm:p-6 md:p-10 flex flex-col items-center overflow-x-hidden">
            <div className="max-w-6xl w-full space-y-4 md:space-y-10">

                {/* Header */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 md:pb-8">
                    <div className="space-y-0.5">
                        <h1 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tighter text-white">
                            ELKIFAH <span className="text-blue-500">PRODUCTION</span>
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[8px] md:text-[10px]">Technical Logistics Calculator</p>
                    </div>
                    <div className="glass-panel px-4 py-3 md:px-6 md:py-4 rounded-2xl md:rounded-3xl border-l-[4px] md:border-l-[6px] border-blue-500 shadow-xl">
                        <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-slate-500 font-black mb-0.5">STOK GUDANG: MEULABOH</p>
                        <p className="text-lg md:text-2xl font-black text-white leading-tight">
                            {totalStok} <span className="text-[10px] font-bold text-slate-500 uppercase ml-1">Unit ({cabType})</span>
                            {activeSpec.boxes > 0 && (
                                <React.Fragment>
                                    <span className="mx-1.5 text-slate-700">/</span>
                                    {activeSpec.boxes} <span className="text-[10px] font-bold text-slate-500 uppercase ml-1">Case</span>
                                </React.Fragment>
                            )}
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
                    {/* Input Panel */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                        <div className="glass-panel p-4 sm:p-8 rounded-[1.5rem] md:rounded-[2.5rem] premium-card h-full flex flex-col">
                            <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <Icon name="calculator" className="w-4 h-4" />
                                </div>
                                Konfigurasi Layar
                            </h2>

                            {/* Cabinet Type Selector */}
                            <div className="mb-6 p-1 bg-white/5 rounded-xl flex gap-1">
                                <button
                                    onClick={() => setCabType('50x100')}
                                    className={`flex-1 py-2 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${cabType === '50x100' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                                >
                                    50x100 cm
                                </button>
                                <button
                                    onClick={() => setCabType('50x50')}
                                    className={`flex-1 py-2 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${cabType === '50x50' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                                >
                                    50x50 cm
                                </button>
                            </div>

                            <div className="space-y-8 flex-grow">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Lebar Target</label>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-blue-500 leading-none">{reqWidth.toFixed(1)}</span>
                                            <span className="text-[10px] font-bold text-slate-500 ml-1 uppercase">M</span>
                                        </div>
                                    </div>
                                    <input type="range" min="1" max="15" step="0.5" value={reqWidth} onChange={(e) => setReqWidth(parseFloat(e.target.value))} className="w-full h-1" />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Tinggi Target</label>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-blue-500 leading-none">{reqHeight.toFixed(1)}</span>
                                            <span className="text-[10px] font-bold text-slate-500 ml-1 uppercase">M</span>
                                        </div>
                                    </div>
                                    <input type="range" min="1" max="10" step="1" value={reqHeight} onChange={(e) => setReqHeight(parseFloat(e.target.value))} className="w-full h-1" />
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-3">
                                <div className="bg-white/[0.02] p-3 md:p-5 rounded-2xl border border-white/5 transition-colors">
                                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Lebar Aktual</p>
                                    <p className="text-lg md:text-2xl font-black text-white leading-none">{actualWidth.toFixed(1)}<span className="text-[10px] font-bold text-slate-600 ml-0.5">M</span></p>
                                    <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase mt-2">
                                        {cols} Kabinet
                                    </div>
                                </div>
                                <div className="bg-white/[0.02] p-3 md:p-5 rounded-2xl border border-white/5 transition-colors">
                                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Tinggi Aktual</p>
                                    <p className="text-lg md:text-2xl font-black text-white leading-none">{actualHeight.toFixed(1)}<span className="text-[10px] font-bold text-slate-600 ml-0.5">M</span></p>
                                    <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase mt-2">
                                        {rows} Kabinet
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Panel */}
                    <div className="lg:col-span-7 flex flex-col gap-4">
                        <div className={`p-4 sm:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl ${isPossible ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20 animate-pulse'}`}>
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-3xl flex items-center justify-center shadow-lg ${isPossible ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                                    <Icon name={isPossible ? "check" : "alert"} className="w-5 h-5 md:w-7 md:h-7" strokeWidth={3} />
                                </div>
                                <div>
                                    <h3 className="text-base md:text-xl font-black uppercase tracking-tight text-white leading-tight mb-0.5">{isPossible ? 'Stok Aman' : (totalStok === 0 ? 'Stok Kosong' : 'Stok Kurang')}</h3>
                                    <p className="text-[10px] md:text-sm font-bold text-slate-400">
                                        {isPossible
                                            ? 'Unit siap dimobilisasi'
                                            : (totalStok === 0 ? `Tipe ${cabType} tidak ada di Meulaboh` : `Butuh +${missingCabinets} Kabinet`)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto">
                                <p className="text-3xl md:text-5xl font-black text-white leading-none">{totalCabinets}</p>
                                <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1 md:mt-2">Kabinet</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2 gap-3 md:gap-4">
                            <div className="glass-panel p-4 md:p-6 rounded-2xl md:rounded-[2rem] hover:bg-white/[0.04] transition-all border-b-2 md:border-b-4 border-b-amber-500/50">
                                <div className="flex justify-between items-center text-amber-500 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                        <Icon name="box" className="w-4 h-4" />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Logistik</span>
                                </div>
                                <div>
                                    <p className="text-xl md:text-3xl font-black text-white leading-none mb-1">{boxesNeeded} <span className="text-[10px] font-bold text-slate-500 uppercase">Case</span></p>
                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Flightcase</p>
                                </div>
                            </div>

                            <div className="glass-panel p-4 md:p-6 rounded-2xl md:rounded-[2rem] hover:bg-white/[0.04] transition-all border-b-2 md:border-b-4 border-b-blue-500/50">
                                <div className="flex justify-between items-center text-blue-500 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        <Icon name="layers" className="w-4 h-4" />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Technical</span>
                                </div>
                                <div>
                                    <p className="text-xl md:text-3xl font-black text-white leading-none mb-1">{lanPaths} <span className="text-[10px] font-bold text-slate-500 uppercase">Kabel</span></p>
                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Jalur LAN</p>
                                </div>
                            </div>

                            <div className="glass-panel p-4 md:p-6 rounded-2xl md:rounded-[2rem] hover:bg-white/[0.04] transition-all border-b-2 md:border-b-4 border-b-purple-500/50">
                                <div className="flex justify-between items-center text-purple-500 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                        <Icon name="weight" className="w-4 h-4" />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Weight</span>
                                </div>
                                <div>
                                    <p className="text-xl md:text-3xl font-black text-white leading-none mb-1">{totalWeight} <span className="text-[10px] font-bold text-slate-500 uppercase">Kg</span></p>
                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Est. Beban</p>
                                </div>
                            </div>

                            <div className="glass-panel p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] hover:bg-white/[0.04] transition-all border-b-2 md:border-b-4 border-b-cyan-500/50">
                                <div className="flex justify-between items-center text-cyan-500 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                                        <Icon name="zap" className="w-4 h-4" />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Power</span>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-baseline justify-between md:justify-start md:gap-2">
                                        <p className="text-lg md:text-2xl font-black text-white leading-none">{peakPowerKW.toFixed(1)}<span className="text-[8px] font-bold text-slate-500 ml-0.5">kW</span></p>
                                        <p className="text-sm md:text-lg font-bold text-blue-500/70">{peakKVA}<span className="text-[8px] ml-0.5">kVA</span></p>
                                    </div>
                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Peak Consumption</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <button onClick={shareWA} className="group relative overflow-hidden bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.97] py-3.5 md:py-5 rounded-2xl md:rounded-3xl flex items-center justify-center gap-2 text-white font-black text-[9px] md:text-xs uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all shadow-xl shadow-emerald-500/20">
                                <Icon name="whatsapp" className="w-4 h-4 md:w-6 md:h-6" /> Share
                            </button>
                            <button onClick={copyToClipboard} className="glass-panel hover:bg-white/10 active:scale-[0.97] py-3.5 md:py-5 rounded-2xl md:rounded-3xl flex items-center justify-center gap-2 text-white font-black text-[9px] md:text-xs uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all border-white/10 border">
                                <Icon name={isCopied ? "check" : "copy"} className={`w-4 h-4 md:w-5 md:h-5 ${isCopied ? "text-emerald-400" : ""}`} /> {isCopied ? 'Tersalin' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Visualizer */}
                <section className="glass-panel p-4 sm:p-10 rounded-[2rem] md:rounded-[3rem] space-y-6 md:space-y-10 shadow-3xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Icon name="grid" className="w-5 h-5 md:w-7 md:h-7" />
                            </div>
                            <div>
                                <h2 className="text-lg md:text-2xl font-black text-white leading-tight">Visualisasi Rakit</h2>
                                <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest italic opacity-50">PHYSICAL REPRESENTATION</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-4">
                            <div className="px-3 py-2 md:px-5 md:py-3 bg-white/5 rounded-xl border border-white/10 flex flex-col">
                                <span className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Surface</span>
                                <span className="text-[10px] md:text-sm font-black text-white uppercase tracking-tighter">{actualWidth}M x {actualHeight}M</span>
                            </div>
                            <div className="px-3 py-2 md:px-5 md:py-3 bg-white/5 rounded-xl border border-white/10 flex flex-col">
                                <span className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Total Area</span>
                                <span className="text-[10px] md:text-sm font-black text-white uppercase tracking-tighter">{(actualWidth * actualHeight).toFixed(1)} m²</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#020617]/50 p-4 sm:p-12 md:p-20 rounded-2xl md:rounded-[3rem] border border-white/5 flex justify-center items-center overflow-x-auto min-h-[300px] md:min-h-[400px] shadow-inner">
                        <div className="led-grid w-fit mx-auto" style={{ gridTemplateColumns: `repeat(${cols}, minmax(25px, 1fr))` }}>
                            {[...Array(totalCabinets)].map((_, i) => (
                                <div key={i} className={`cabinet rounded-sm md:rounded-lg flex flex-col items-center justify-center gap-0.5 text-[6px] md:text-[8px] font-black transition-all ${i < totalStok ? 'text-blue-500/30 border-blue-500/20 shadow-[inset_0_0_10px_rgba(59,130,246,0.05)] bg-blue-500/5' : 'text-red-500 border-red-500/30 bg-red-500/10'} ${cabType === '50x50' ? 'w-6 h-6 sm:w-14 sm:h-14' : 'w-6 h-12 sm:w-14 sm:h-28'} hover:z-10 hover:border-blue-500/50 hover:bg-blue-500/20`}>
                                    <span className="text-[8px] md:text-[10px]">{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 py-3 border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-blue-500/40"></div>
                            <span className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">Tersedia</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500/40 animate-pulse"></div>
                            <span className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">Kurang / Kosong</span>
                        </div>
                    </div>
                </section>

                <footer className="text-center py-4 opacity-30">
                    <p className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                        &copy; 2024 ELKIFAH PRODUCTION
                    </p>
                </footer>
            </div>
        </div>
    );
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
