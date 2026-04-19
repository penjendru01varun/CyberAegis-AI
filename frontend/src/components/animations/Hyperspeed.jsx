import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleCount = 2000;

function WarpField({ speed = 1 }) {
  const mesh = useRef();
  const { size } = useThree();

  const [positions, setPositions] = useMemo(() => {
    const pos = new Float32Array(ParticleCount * 3);
    const sets = [];
    for (let i = 0; i < ParticleCount; i++) {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const z = -Math.random() * 200;
        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;
        sets.push({ x, y, z });
    }
    return [pos, sets];
  }, []);

  useFrame((state, delta) => {
    const lines = mesh.current.geometry.attributes.position.array;
    for (let i = 0; i < ParticleCount; i++) {
        lines[i * 3 + 2] += delta * 150 * speed;
        if (lines[i * 3 + 2] > 50) {
            lines[i * 3 + 2] = -200;
        }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color="#00f2ff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

const Hyperspeed = ({ speed = 1 }) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      background: '#000',
      overflow: 'hidden'
    }}>
      <Canvas
        camera={{ position: [0, 0, 50], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        <WarpField speed={speed} />
        <fog attach="fog" args={['#000', 50, 200]} />
      </Canvas>
    </div>
  );
};

export default Hyperspeed;
