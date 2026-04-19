import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({
  count = 300,
  magnetRadius = 6,
  ringRadius = 7,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  particleSize = 1.5,
  lerpSpeed = 0.05,
  color = '#00f2ff',
  autoAnimate = true,
  particleVariance = 1,
}) {
  const mesh = useRef();
  const mouse = useRef(new THREE.Vector3(9999, 9999, 9999));
  const { size, viewport } = useThree();

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const variance = (Math.random() - 0.5) * particleVariance;
      temp.push({
        origin: new THREE.Vector3(
          Math.cos(angle) * (ringRadius + variance),
          Math.sin(angle) * (ringRadius + variance),
          (Math.random() - 0.5) * 0.5
        ),
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 5
        ),
        phase: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, [count, ringRadius, particleVariance]);

  const onMouseMove = useCallback(
    (e) => {
      const aspect = size.width / size.height;
      mouse.current.set(
        ((e.clientX / size.width) * 2 - 1) * viewport.width * 0.5,
        (-(e.clientY / size.height) * 2 + 1) * viewport.height * 0.5,
        0
      );
    },
    [size, viewport]
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      const target = p.origin.clone();

      if (autoAnimate) {
        target.y += Math.sin(t * waveSpeed + p.phase) * waveAmplitude;
        target.x += Math.cos(t * waveSpeed * 0.7 + p.phase) * waveAmplitude * 0.3;
      }

      const dist = p.position.distanceTo(mouse.current);
      if (dist < magnetRadius) {
        const pull = mouse.current.clone().sub(p.position);
        pull.multiplyScalar((1 - dist / magnetRadius) * 0.2);
        target.add(pull);
      }

      p.position.lerp(target, lerpSpeed);

      dummy.position.copy(p.position);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[null, null, count]}
      onPointerMove={onMouseMove}
    >
      <circleGeometry args={[particleSize * 0.02, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.85} />
    </instancedMesh>
  );
}

export default function Antigravity(props) {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 20], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Particles {...props} />
    </Canvas>
  );
}
