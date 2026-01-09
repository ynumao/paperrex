'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';

export type BrochureType = 'bifold' | 'trifold-c' | 'trifold-z';
export type CoverPosition = 'right' | 'left';

interface BrochureModelProps {
    type: BrochureType;
    coverPosition: CoverPosition;
    foldProgress: number; // 0 to 1
    outerTexture: THREE.Texture | null;
    innerTexture: THREE.Texture | null;
    panelHeight?: number;
    outerPanelTextures?: (THREE.Texture | null)[]; // Optional array for individual panels
    innerPanelTextures?: (THREE.Texture | null)[];
}

const PANEL_WIDTH = 1;
const THICKNESS = 0.005;

export const BrochureModel: React.FC<BrochureModelProps> = ({
    type,
    coverPosition,
    foldProgress,
    outerTexture,
    innerTexture,
    panelHeight = 1.414,
    outerPanelTextures,
    innerPanelTextures,
}) => {
    const groupRef = useRef<THREE.Group>(null);

    return (
        <group ref={groupRef}>
            {type === 'bifold' && (
                <BifoldModel
                    foldProgress={foldProgress}
                    outerTexture={outerTexture}
                    innerTexture={innerTexture}
                    panelHeight={panelHeight}
                    outerPanelTextures={outerPanelTextures}
                    innerPanelTextures={innerPanelTextures}
                    isReverse={coverPosition === 'left'}
                />
            )}
            {type.startsWith('trifold') && (
                <TrifoldModel
                    type={type as 'trifold-c' | 'trifold-z'}
                    foldProgress={foldProgress}
                    outerTexture={outerTexture}
                    innerTexture={innerTexture}
                    panelHeight={panelHeight}
                    outerPanelTextures={outerPanelTextures}
                    innerPanelTextures={innerPanelTextures}
                    isReverse={coverPosition === 'left'}
                />
            )}
        </group>
    );
};

const BifoldModel = ({ foldProgress, outerTexture, innerTexture, panelHeight, outerPanelTextures, innerPanelTextures, isReverse }: any) => {
    const angle = (foldProgress * Math.PI) * 0.95;

    return (
        <group position={[isReverse ? PANEL_WIDTH / 2 : -PANEL_WIDTH / 2, 0, 0]}>
            <PanelSegment
                position={[isReverse ? PANEL_WIDTH / 2 : -PANEL_WIDTH / 2, 0, 0]}
                panelHeight={panelHeight}
                texture={outerTexture}
                innerTexture={innerTexture}
                panelTexture={outerPanelTextures?.[isReverse ? 1 : 0]}
                panelInnerTexture={innerPanelTextures?.[isReverse ? 1 : 0]}
                uvRange={[isReverse ? 0.5 : 0, isReverse ? 1 : 0.5]}
            />

            <group position={[0, 0, 0]} rotation={[0, isReverse ? -angle : angle, 0]}>
                <PanelSegment
                    position={[isReverse ? -PANEL_WIDTH / 2 : PANEL_WIDTH / 2, 0, 0]}
                    panelHeight={panelHeight}
                    texture={outerTexture}
                    innerTexture={innerTexture}
                    panelTexture={outerPanelTextures?.[isReverse ? 0 : 1]}
                    panelInnerTexture={innerPanelTextures?.[isReverse ? 0 : 1]}
                    uvRange={[isReverse ? 0 : 0.5, isReverse ? 0.5 : 1]}
                />
            </group>
        </group>
    );
};

const TrifoldModel = ({ type, foldProgress, outerTexture, innerTexture, panelHeight, outerPanelTextures, innerPanelTextures, isReverse }: any) => {
    const isZFold = type === 'trifold-z';
    const angle = (foldProgress * Math.PI) * 0.98;

    // Indices for trifold panels (0: left, 1: center, 2: right)
    return (
        <group>
            <PanelSegment
                position={[0, 0, 0]}
                panelHeight={panelHeight}
                texture={outerTexture}
                innerTexture={innerTexture}
                panelTexture={outerPanelTextures?.[1]}
                panelInnerTexture={innerPanelTextures?.[1]}
                uvRange={[1 / 3, 2 / 3]}
            />

            <group position={[0.5, 0, 0]} rotation={[0, -angle, 0]}>
                <PanelSegment
                    position={[0.5, 0, 0]}
                    panelHeight={panelHeight}
                    texture={outerTexture}
                    innerTexture={innerTexture}
                    panelTexture={outerPanelTextures?.[2]}
                    panelInnerTexture={innerPanelTextures?.[2]}
                    uvRange={[2 / 3, 1]}
                />
            </group>

            <group position={[-0.5, 0, 0]} rotation={[0, isZFold ? -angle : angle, 0]}>
                <PanelSegment
                    position={[-0.5, 0, 0]}
                    panelHeight={panelHeight}
                    texture={outerTexture}
                    innerTexture={innerTexture}
                    panelTexture={outerPanelTextures?.[0]}
                    panelInnerTexture={innerPanelTextures?.[0]}
                    uvRange={[0, 1 / 3]}
                />
            </group>
        </group>
    );
};

const PanelSegment = ({ position, rotation, texture, innerTexture, panelTexture, panelInnerTexture, uvRange, panelHeight }: any) => {
    const materials = useMemo(() => {
        const mats = Array(6).fill(new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5 }));

        // Outer side (Face 4)
        if (panelTexture) {
            mats[4] = new THREE.MeshStandardMaterial({ map: panelTexture, roughness: 0.5 });
        } else if (texture) {
            const tex = texture.clone();
            tex.repeat.set(uvRange[1] - uvRange[0], 1);
            tex.offset.set(uvRange[0], 0);
            tex.needsUpdate = true;
            mats[4] = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 });
        }

        // Inner side (Face 5)
        if (panelInnerTexture) {
            mats[5] = new THREE.MeshStandardMaterial({ map: panelInnerTexture, roughness: 0.5 });
        } else if (innerTexture) {
            const texInner = innerTexture.clone();
            const innerUVStart = 1 - uvRange[1];
            const innerUVEnd = 1 - uvRange[0];

            texInner.repeat.set(innerUVEnd - innerUVStart, 1);
            texInner.offset.set(innerUVStart, 0);
            texInner.needsUpdate = true;
            mats[5] = new THREE.MeshStandardMaterial({ map: texInner, roughness: 0.5 });
        }

        return mats;
    }, [texture, innerTexture, panelTexture, panelInnerTexture, uvRange]);

    return (
        <mesh position={position} rotation={rotation} material={materials}>
            <boxGeometry args={[PANEL_WIDTH, panelHeight, THICKNESS]} />
        </mesh>
    );
};
