'use client';

import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Sidebar, PaperSize } from '@/components/Sidebar';
import { BrochureCanvas, BrochureCanvasHandle } from '@/components/BrochureCanvas';
import { BrochureType, CoverPosition } from '@/components/BrochureModel';
import * as THREE from 'three';

export default function Home() {
    const [type, setType] = useState<BrochureType>('trifold-c');
    const [coverPosition, setCoverPosition] = useState<CoverPosition>('right');
    const [paperSize, setPaperSize] = useState<PaperSize>('a4');
    const [uploadMode, setUploadMode] = useState<'spread' | 'individual'>('spread');
    const [foldProgress, setFoldProgress] = useState(0.5);
    const [lightingIntensity, setLightingIntensity] = useState(1);
    const [autoRotate, setAutoRotate] = useState(false);

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
        <main className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans antialiased text-slate-900">
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
            />

            <div className="flex-1 p-8 flex flex-col gap-6 relative">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-slate-800">プレビューキャンバス</h2>
                        <p className="text-xs text-slate-400">ドラッグで回転 • スクロールでズーム</p>
                    </div>
                </div>

                <div className="flex-1 min-h-0 shadow-2xl shadow-slate-200/50 rounded-2xl border border-white">
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
        </main>
    );
}
