'use client';

import React, { Suspense, useImperativeHandle, useRef, forwardRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid, ContactShadows } from '@react-three/drei';
import { BrochureModel, BrochureType, CoverPosition } from './BrochureModel';
import * as THREE from 'three';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter';

interface BrochureCanvasProps {
    type: BrochureType;
    coverPosition: CoverPosition;
    foldProgress: number;
    outerTexture: THREE.Texture | null;
    innerTexture: THREE.Texture | null;
    panelHeight: number;
    outerPanelTextures: (THREE.Texture | null)[];
    innerPanelTextures: (THREE.Texture | null)[];
    lightingIntensity: number;
    autoRotate: boolean;
}

export interface BrochureCanvasHandle {
    exportOBJ: () => void;
}

const ExportLayer = forwardRef((props, ref) => {
    const { scene } = useThree();

    useImperativeHandle(ref, () => ({
        exportOBJ: () => {
            const exporter = new OBJExporter();
            const result = exporter.parse(scene);
            const blob = new Blob([result], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'brochure_model.obj';
            link.click();
            URL.revokeObjectURL(url);
        }
    }));

    return null;
});
ExportLayer.displayName = 'ExportLayer';

export const BrochureCanvas = forwardRef<BrochureCanvasHandle, BrochureCanvasProps>(({
    type,
    coverPosition,
    foldProgress,
    outerTexture,
    innerTexture,
    panelHeight,
    outerPanelTextures,
    innerPanelTextures,
    lightingIntensity,
    autoRotate,
}, ref) => {
    const exportRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
        exportOBJ: () => {
            if (exportRef.current) {
                exportRef.current.exportOBJ();
            }
        }
    }));

    return (
        <div className="w-full h-full bg-[#f8fafc] rounded-2xl overflow-hidden relative">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={45} />
                <ExportLayer ref={exportRef} />

                <Suspense fallback={null}>
                    <group position={[0, 0, 0]}>
                        <BrochureModel
                            type={type}
                            coverPosition={coverPosition}
                            foldProgress={foldProgress}
                            outerTexture={outerTexture}
                            innerTexture={innerTexture}
                            panelHeight={panelHeight}
                            outerPanelTextures={outerPanelTextures}
                            innerPanelTextures={innerPanelTextures}
                        />
                    </group>

                    <Environment preset="city" />
                    <ambientLight intensity={0.5 * lightingIntensity} />
                    <pointLight position={[10, 10, 10]} intensity={1 * lightingIntensity} />
                    <spotLight
                        position={[0, 5, 0]}
                        angle={0.15}
                        penumbra={1}
                        intensity={lightingIntensity}
                        castShadow
                    />

                    <ContactShadows
                        position={[0, -1.2, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={2}
                        far={4.5}
                    />

                    <Grid
                        infiniteGrid
                        fadeDistance={10}
                        fadeStrength={5}
                        cellSize={0.5}
                        sectionSize={2.5}
                        sectionColor="#e2e8f0"
                        cellColor="#cbd5e1"
                        position={[0, -1.21, 0]}
                    />
                </Suspense>

                <OrbitControls
                    enablePan={false}
                    minDistance={2}
                    maxDistance={10}
                    autoRotate={autoRotate}
                    autoRotateSpeed={1}
                    makeDefault
                />
            </Canvas>
        </div>
    );
});
BrochureCanvas.displayName = 'BrochureCanvas';
