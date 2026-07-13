/* eslint-disable react/no-unknown-property */
import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useCubeStore } from "../store/cubeStore";
import Cube from "cubejs";

const COLOR_MAP: Record<string, string> = {
  U: "#ffffff", // White
  R: "#ef4444", // Red
  F: "#3b82f6", // Blue
  D: "#eab308", // Yellow
  L: "#22c55e", // Green
  B: "#f97316", // Orange
  X: "#0f172a", // Internal plastic
};

function applyMoveToState(state: string, move: string): string {
  const cube = Cube.fromString(state);
  cube.move(move);
  return cube.asString();
}

function getInverseMove(move: string): string {
  if (!move || typeof move !== "string") return "";
  if (move.endsWith("'")) {
    return move.slice(0, -1);
  } else if (move.endsWith("2")) {
    return move;
  } else {
    return move + "'";
  }
}

// Map logical facelet index to 3D sticker colors
function getStickerColors(
  cubeState: string,
  cx: number,
  cy: number,
  cz: number,
): string[] {
  const colors = Array(6).fill("X");

  // U Face (y = 1)
  if (cy === 1) {
    const idx = 3 * (cz + 1) + (cx + 1);
    colors[2] = cubeState[idx] || "U";
  }
  // D Face (y = -1)
  if (cy === -1) {
    const idx = 27 + 3 * (1 - cz) + (cx + 1);
    colors[3] = cubeState[idx] || "D";
  }
  // R Face (x = 1)
  if (cx === 1) {
    const idx = 9 + 3 * (1 - cy) + (1 - cz);
    colors[0] = cubeState[idx] || "R";
  }
  // L Face (x = -1)
  if (cx === -1) {
    const idx = 36 + 3 * (1 - cy) + (cz + 1);
    colors[1] = cubeState[idx] || "L";
  }
  // F Face (z = 1)
  if (cz === 1) {
    const idx = 18 + 3 * (1 - cy) + (cx + 1);
    colors[4] = cubeState[idx] || "F";
  }
  // B Face (z = -1)
  if (cz === -1) {
    const idx = 45 + 3 * (1 - cy) + (1 - cx);
    colors[5] = cubeState[idx] || "B";
  }

  return colors.map((c) => COLOR_MAP[c] || COLOR_MAP.X);
}

// Check if a cubie is in the layer of a given move
function isCubieInLayer(
  cx: number,
  cy: number,
  cz: number,
  moveFace: string,
): boolean {
  switch (moveFace) {
    case "U":
      return cy === 1;
    case "D":
      return cy === -1;
    case "R":
      return cx === 1;
    case "L":
      return cx === -1;
    case "F":
      return cz === 1;
    case "B":
      return cz === -1;
    default:
      return false;
  }
}

// Get rotation axis and direction multiplier for a move
function getMoveAxisAndAngle(move: string): {
  axis: THREE.Vector3;
  angle: number;
} {
  if (!move || typeof move !== "string" || move.length === 0) {
    return { axis: new THREE.Vector3(), angle: 0 };
  }
  const face = move[0];
  const isPrime = move.includes("'");
  const isDouble = move.includes("2");

  const axis = new THREE.Vector3();
  let baseAngle = -Math.PI / 2;

  if (isPrime) baseAngle = Math.PI / 2;
  if (isDouble) baseAngle = -Math.PI;

  switch (face) {
    case "U":
      axis.set(0, 1, 0);
      baseAngle = -baseAngle;
      break;
    case "D":
      axis.set(0, 1, 0);
      break;
    case "R":
      axis.set(1, 0, 0);
      baseAngle = -baseAngle;
      break;
    case "L":
      axis.set(1, 0, 0);
      break;
    case "F":
      axis.set(0, 0, 1);
      baseAngle = -baseAngle;
      break;
    case "B":
      axis.set(0, 0, 1);
      break;
  }

  return { axis, angle: baseAngle };
}

type CubieProps = {
  initialPos: [number, number, number];
  colors: string[];
  moveInProgress: string | null;
  animationProgress: number;
};

const Cubie: React.FC<CubieProps> = ({
  initialPos,
  colors,
  moveInProgress,
  animationProgress,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [cx, cy, cz] = initialPos;

  useFrame(() => {
    if (!meshRef.current) return;

    // Reset position and rotation by default
    meshRef.current.position.set(cx, cy, cz);
    meshRef.current.rotation.set(0, 0, 0);

    if (
      moveInProgress &&
      typeof moveInProgress === "string" &&
      moveInProgress.length > 0 &&
      isCubieInLayer(cx, cy, cz, moveInProgress[0])
    ) {
      const { axis, angle } = getMoveAxisAndAngle(moveInProgress);
      const currentAngle = angle * animationProgress;

      // Apply rotation around the center
      const position = new THREE.Vector3(cx, cy, cz);
      position.applyAxisAngle(axis, currentAngle);
      meshRef.current.position.copy(position);

      // Apply rotation to orientation
      const q = new THREE.Quaternion().setFromAxisAngle(axis, currentAngle);
      meshRef.current.quaternion.copy(q);
    } else {
      meshRef.current.quaternion.set(0, 0, 0, 1);
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.96, 0.96, 0.96]} />
      {colors.map((color, i) => (
        <meshStandardMaterial
          key={i}
          attach={`material-${i}`}
          color={color}
          roughness={0.1}
          metalness={0.05}
        />
      ))}
    </mesh>
  );
};

type CubeContainerProps = {
  cubeState: string;
};

const CubeContainer: React.FC<CubeContainerProps> = ({ cubeState }) => {
  const lastMove = useCubeStore((state) => state.lastMove);
  const lastMoveTimestamp = useCubeStore((state) => state.lastMoveTimestamp);

  const [moveInProgress, setMoveInProgress] = useState<string | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const animatingRef = useRef(false);

  useEffect(() => {
    if (lastMove) {
      setMoveInProgress(lastMove);
      setAnimationProgress(0);
      animatingRef.current = true;
    }
  }, [lastMove, lastMoveTimestamp]);

  useFrame((_, delta) => {
    if (animatingRef.current) {
      setAnimationProgress((prev) => {
        const next = prev + delta * 5; // Speed multiplier for rotation (e.g. 5x)
        if (next >= 1) {
          animatingRef.current = false;
          setMoveInProgress(null);
          return 0;
        }
        return next;
      });
    }
  });

  // Calculate pre-move state to show during animation
  const prevCubeState = useMemo(() => {
    if (moveInProgress) {
      try {
        const inv = getInverseMove(moveInProgress);
        return applyMoveToState(cubeState, inv);
      } catch (e) {
        return cubeState;
      }
    }
    return cubeState;
  }, [cubeState, moveInProgress]);

  // Generate 26 cubies with appropriate sticker colors
  const cubies = useMemo(() => {
    const list = [];
    const stateToUse = moveInProgress ? prevCubeState : cubeState;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue;
          list.push({
            key: `${x}-${y}-${z}`,
            pos: [x, y, z] as [number, number, number],
            colors: getStickerColors(stateToUse, x, y, z),
          });
        }
      }
    }
    return list;
  }, [cubeState, moveInProgress, prevCubeState]);

  return (
    <group>
      {cubies.map((c) => (
        <Cubie
          key={c.key}
          initialPos={c.pos}
          colors={c.colors}
          moveInProgress={moveInProgress}
          animationProgress={animationProgress}
        />
      ))}
    </group>
  );
};

type CubeSceneProps = {
  cubeState: string;
};

const CubeScene: React.FC<CubeSceneProps> = ({ cubeState }) => {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [3.2, 3.2, 4.8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={0.9} />
        <directionalLight position={[-5, -8, -5]} intensity={0.3} />
        <CubeContainer cubeState={cubeState} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3.5}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
};

export default CubeScene;
