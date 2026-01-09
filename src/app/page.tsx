'use client';

import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Sidebar, PaperSize } from '@/components/Sidebar';
import { BrochureCanvas, BrochureCanvasHandle } from '@/components/BrochureCanvas';
import { BrochureType, CoverPosition } from '@/components/BrochureModel';
import * as THREE from 'three';
import { Menu, X } from 'lucide-react';

export default function Home() {
    const [type, setType] = useState<BrochureType>('trifold-c');
    const [coverPosition, setCoverPosition] = useState<CoverPosition>('right');
    const [paperSize, setPaperSize] = useState<PaperSize>('a4');
    const [uploadMode, setUploadMode] = useState<'spread' | 'individual'>('spread');
    const [foldProgress, setFoldProgress] = useState(0.5);
    const [lightingIntensity, setLightingIntensity] = useState(1);
    const [autoRotate, setAutoRotate] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Texture States
    const [outerTexture, setOuterTexture] = useState<THREE.Texture | null>(null);
    const [innerTexture, setInnerTexture] = useState<THREE.Texture | null>(null);
    const [outerPanelTextures, setOuterPanelTextures] = useState<(THREE.Texture | null)[]>([null, null, null]);
    const [innerPanelTextures, setInnerPanelTextures] = useState<(THREE.Texture | null)[]>([null, null, null]);

    const canvasRef = useRef<BrochureCanvasHandle>(null);

    // Paper Size ratio (PANEL_HEIGHT relative to 1.0 width)
    const panelHeight = useMemo(() => {
        switch (paperSize) {
            case 'a4': return 1.414; // 297/210
            case 'a5': return 1.414;
            case 'b5': return 1.407; // 257/182
            case 'square': return 1.0;
            default: return 1.414;
        }
    }, [paperSize]);

    // Upload Handlers
    const loadTexture = (file: File, callback: (tex: THREE.Texture) => void) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                const loader = new THREE.TextureLoader();
                loader.load(e.target.result as string, (tex) => {
                    tex.colorSpace = THREE.SRGBColorSpace;
                    callback(tex);
                });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleUploadOuter = useCallback((file: File) => {
        loadTexture(file, setOuterTexture);
    }, []);

    const handleUploadInner = useCallback((file: File) => {
        loadTexture(file, setInnerTexture);
    }, []);

    const handleUploadOuterPanel = useCallback((index: number, file: File) => {
        loadTexture(file, (tex) => {
            setOuterPanelTextures(prev => {
                const next = [...prev];
                next[index] = tex;
                return next;
            });
        });
    }, []);

    const handleUploadInnerPanel = useCallback((index: number, file: File) => {
        loadTexture(file, (tex) => {
            setInnerPanelTextures(prev => {
                const next = [...prev];
                next[index] = tex;
                return next;
            });
        });
    }, []);

    const handleExportOBJ = useCallback(() => {
        if (canvasRef.current) {
            canvasRef.current.exportOBJ();
        }
    }, []);

    return (
        <main className="flex flex-col md:flex-row h-screen w-full bg-slate-50 overflow-hidden font-sans antialiased text-slate-900">
            {/* Sidebar with mobile transitions */}
            <div className={`
                fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                w-full max-w-[320px] md:w-80 h-full
            `}>
                <Sidebar
                    type={type} setType={setType}
                    coverPosition={coverPosition} setCoverPosition={setCoverPosition}
                    paperSize={paperSize} setPaperSize={setPaperSize}
                    uploadMode={uploadMode} setUploadMode={setUploadMode}
                    foldProgress={foldProgress} setFoldProgress={setFoldProgress}
                    lightingIntensity={lightingIntensity} setLightingIntensity={setLightingIntensity}
                    autoRotate={autoRotate} setAutoRotate={setAutoRotate}
                    onUploadOuter={handleUploadOuter}
                    onUploadInner={handleUploadInner}
                    onUploadOuterPanel={handleUploadOuterPanel}
                    onUploadInnerPanel={handleUploadInnerPanel}
                    onExportOBJ={handleExportOBJ}
                    onClose={() => setIsSidebarOpen(false)}
                />
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0 relative h-full">
                {/* Header with toggle */}
                <header className="p-4 md:p-8 flex justify-between items-center bg-white/50 backdrop-blur-md md:bg-transparent border-b border-slate-200 md:border-none z-30">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-xl bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors md:hidden"
                        >
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <div className="flex flex-col">
                            <h2 className="text-lg md:text-xl font-bold text-slate-800">プレビューキャンバス</h2>
                            <p className="text-[10px] md:text-xs text-slate-400">ドラッグで回転 • スクロールでズーム</p>
                        </div>
                    </div>
                    {/* Desktop Menu Link (optional, showing on mobile too for visibility) */}
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className={`p-2 rounded-xl bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors hidden md:flex ${isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </header>

                <div className="flex-1 min-h-0 p-4 md:p-8 flex flex-col">
                    <div className="flex-1 min-h-0 shadow-2xl shadow-slate-200/50 rounded-2xl border border-white bg-white overflow-hidden">
                        <BrochureCanvas
                            ref={canvasRef}
                            type={type}
                            coverPosition={coverPosition}
                            foldProgress={foldProgress}
                            outerTexture={uploadMode === 'spread' ? outerTexture : null}
                            innerTexture={uploadMode === 'spread' ? innerTexture : null}
                            outerPanelTextures={uploadMode === 'individual' ? outerPanelTextures : []}
                            innerPanelTextures={uploadMode === 'individual' ? innerPanelTextures : []}
                            panelHeight={panelHeight}
                            lightingIntensity={lightingIntensity}
                            autoRotate={autoRotate}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
