'use client';

import React from 'react';
import { BrochureType, CoverPosition } from './BrochureModel';
import { Upload, Box, Layers, Sun, Play, Pause, Ruler, Image as ImageIcon } from 'lucide-react';

export type PaperSize = 'a4' | 'a5' | 'b5' | 'square';

interface SidebarProps {
    type: BrochureType;
    setType: (type: BrochureType) => void;
    coverPosition: CoverPosition;
    setCoverPosition: (pos: CoverPosition) => void;
    paperSize: PaperSize;
    setPaperSize: (size: PaperSize) => void;
    uploadMode: 'spread' | 'individual';
    setUploadMode: (mode: 'spread' | 'individual') => void;
    foldProgress: number;
    setFoldProgress: (val: number) => void;
    lightingIntensity: number;
    setLightingIntensity: (val: number) => void;
    autoRotate: boolean;
    setAutoRotate: (val: boolean) => void;
    onUploadOuter: (file: File) => void;
    onUploadInner: (file: File) => void;
    onUploadOuterPanel: (index: number, file: File) => void;
    onUploadInnerPanel: (index: number, file: File) => void;
    onExportOBJ: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    type, setType,
    coverPosition, setCoverPosition,
    paperSize, setPaperSize,
    uploadMode, setUploadMode,
    foldProgress, setFoldProgress,
    lightingIntensity, setLightingIntensity,
    autoRotate, setAutoRotate,
    onUploadOuter, onUploadInner,
    onUploadOuterPanel, onUploadInnerPanel,
    onExportOBJ,
}) => {
    const panelsCount = type === 'bifold' ? 2 : 3;

    return (
        <div className="w-80 h-full flex flex-col gap-8 p-6 bg-white/80 backdrop-blur-md border-r border-slate-200 overflow-y-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    紙見本ジェネレーター
                </h1>
                <p className="text-sm text-slate-500">紙見本を3Dで確認します。</p>
            </div>

            {/* 01. 折りとサイズ */}
            <section className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Layers className="w-4 h-4" />
                    <span>01. 折りの種類とサイズ</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: 'bifold', label: '二つ折り' },
                            { id: 'trifold-c', label: '巻き三つ折り' },
                            { id: 'trifold-z', label: '外三つ折り' }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setType(opt.id as BrochureType)}
                                className={`p-2 text-xs rounded-lg border transition-all ${type === opt.id
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 uppercase">
                            <Ruler className="w-3 h-3" />
                            <span>紙のサイズ</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                            {[
                                { id: 'a4', label: 'A4' },
                                { id: 'a5', label: 'A5' },
                                { id: 'b5', label: 'B5' },
                                { id: 'square', label: '正方形' }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setPaperSize(opt.id as PaperSize)}
                                    className={`p-1.5 text-[10px] rounded-md border transition-all ${paperSize === opt.id
                                        ? 'bg-slate-800 text-white border-slate-800'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 02. 表紙の位置 */}
            <section className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Box className="w-4 h-4" />
                    <span>02. 表紙の位置</span>
                </div>
                <div className="flex gap-2">
                    {[
                        { id: 'right', label: '右表紙' },
                        { id: 'left', label: '左表紙' }
                    ].map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => setCoverPosition(opt.id as CoverPosition)}
                            className={`flex-1 p-2 text-xs rounded-lg border transition-all ${coverPosition === opt.id
                                ? 'bg-slate-800 text-white border-slate-800 shadow-md'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* 03. デザインのアップロード */}
            <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Upload className="w-4 h-4" />
                        <span>03. デザインのアップロード</span>
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {[
                        { id: 'spread', label: '見開き', icon: <ImageIcon className="w-3 h-3" /> },
                        { id: 'individual', label: 'パネル個別', icon: <Layers className="w-3 h-3" /> }
                    ].map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => setUploadMode(opt.id as any)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-medium rounded-md transition-all ${uploadMode === opt.id
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'bg-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {opt.icon}
                            {opt.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-4 max-h-[400px] pr-1 overflow-y-auto">
                    {uploadMode === 'spread' ? (
                        <>
                            <Uploader label="表面 (Spread)" onUpload={onUploadOuter} />
                            <Uploader label="中面 (Spread)" onUpload={onUploadInner} />
                        </>
                    ) : (
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100 pb-1">表面パネル</span>
                                {Array.from({ length: panelsCount }).map((_, i) => (
                                    <Uploader key={`outer-${i}`} label={`パネル ${i + 1}`} onUpload={(f) => onUploadOuterPanel(i, f)} mini />
                                ))}
                            </div>
                            <div className="flex flex-col gap-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100 pb-1">中面パネル</span>
                                {Array.from({ length: panelsCount }).map((_, i) => (
                                    <Uploader key={`inner-${i}`} label={`パネル ${i + 1}`} onUpload={(f) => onUploadInnerPanel(i, f)} mini />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* 04. Controls */}
            <section className="flex flex-col gap-6 pt-4 border-t border-slate-100">
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                        <span>折り具合</span>
                        <span>{Math.round(foldProgress * 100)}%</span>
                    </div>
                    <input
                        type="range" min="0" max="1" step="0.01"
                        value={foldProgress}
                        onChange={(e) => setFoldProgress(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                        <div className="flex items-center gap-1">
                            <Sun className="w-3 h-3" />
                            <span>明るさ</span>
                        </div>
                        <span>{Math.round(lightingIntensity * 100)}%</span>
                    </div>
                    <input
                        type="range" min="0" max="2" step="0.1"
                        value={lightingIntensity}
                        onChange={(e) => setLightingIntensity(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                    />
                </div>

                <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`flex items-center justify-center gap-2 w-full p-2 rounded-lg text-sm font-medium transition-all ${autoRotate
                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                        }`}
                >
                    {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {autoRotate ? '回転中' : '回転を有効にする'}
                </button>

                <button
                    onClick={onExportOBJ}
                    className="flex items-center justify-center gap-2 w-full p-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all"
                >
                    <Box className="w-4 h-4" />
                    OBJ形式でエクスポート
                </button>
            </section>
        </div>
    );
};

const Uploader = ({ label, onUpload, mini }: { label: string, onUpload: (f: File) => void, mini?: boolean }) => {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{label}</span>
            <label className={`group relative flex items-center justify-center w-full ${mini ? 'h-12' : 'h-20'} border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer transition-all overflow-hidden`}>
                <div className="flex flex-col items-center gap-0.5 group-hover:scale-105 transition-transform">
                    <Upload className={`${mini ? 'w-3 h-3' : 'w-5 h-5'} text-slate-400 group-hover:text-blue-500`} />
                    <span className={`${mini ? 'text-[10px]' : 'text-xs'} text-slate-500 group-hover:text-blue-600 font-medium`}>Upload</span>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
                />
            </label>
        </div>
    );
};
