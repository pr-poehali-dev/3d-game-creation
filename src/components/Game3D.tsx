import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface Character {
  id: string;
  name: string;
  class: string;
  stats: {
    health: number;
    mana: number;
    attack: number;
    defense: number;
  };
  color: string;
}

interface Game3DProps {
  character: Character;
}

function Player({ color, position, onPositionChange }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [moveDirection, setMoveDirection] = useState({ x: 0, z: 0 });
  const speed = 0.1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newDir = { ...moveDirection };
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'ц':
        case 'arrowup':
          newDir.z = -1;
          break;
        case 's':
        case 'ы':
        case 'arrowdown':
          newDir.z = 1;
          break;
        case 'a':
        case 'ф':
        case 'arrowleft':
          newDir.x = -1;
          break;
        case 'd':
        case 'в':
        case 'arrowright':
          newDir.x = 1;
          break;
      }
      setMoveDirection(newDir);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const newDir = { ...moveDirection };
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'ц':
        case 'arrowup':
        case 's':
        case 'ы':
        case 'arrowdown':
          newDir.z = 0;
          break;
        case 'a':
        case 'ф':
        case 'arrowleft':
        case 'd':
        case 'в':
        case 'arrowright':
          newDir.x = 0;
          break;
      }
      setMoveDirection(newDir);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [moveDirection]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x += moveDirection.x * speed;
      meshRef.current.position.z += moveDirection.z * speed;
      
      meshRef.current.position.x = Math.max(-20, Math.min(20, meshRef.current.position.x));
      meshRef.current.position.z = Math.max(-20, Math.min(20, meshRef.current.position.z));

      if (moveDirection.x !== 0 || moveDirection.z !== 0) {
        meshRef.current.rotation.y = Math.atan2(moveDirection.x, moveDirection.z);
      }

      onPositionChange({
        x: meshRef.current.position.x,
        y: meshRef.current.position.y,
        z: meshRef.current.position.z
      });
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh castShadow>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.8} />
      </mesh>
      <pointLight color={color} intensity={2} distance={5} />
    </group>
  );
}

function CameraController({ targetPosition }: any) {
  const { camera } = useThree();

  useFrame(() => {
    const idealPosition = new THREE.Vector3(
      targetPosition.x,
      targetPosition.y + 8,
      targetPosition.z + 10
    );
    
    camera.position.lerp(idealPosition, 0.1);
    camera.lookAt(targetPosition.x, targetPosition.y + 1, targetPosition.z);
  });

  return null;
}

function Ground() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#1a1a2e" />
    </mesh>
  );
}

function Trees() {
  const trees = [];
  const positions = [
    [-8, -8], [8, -8], [-8, 8], [8, 8],
    [-12, 0], [12, 0], [0, -12], [0, 12],
    [-15, -5], [15, 5], [-5, 15], [5, -15]
  ];

  for (let i = 0; i < positions.length; i++) {
    const [x, z] = positions[i];
    trees.push(
      <group key={i} position={[x, 0, z]}>
        <mesh castShadow position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 3]} />
          <meshStandardMaterial color="#2D1B4E" />
        </mesh>
        <mesh castShadow position={[0, 3.5, 0]}>
          <coneGeometry args={[1.5, 3, 8]} />
          <meshStandardMaterial color="#9b87f5" emissive="#9b87f5" emissiveIntensity={0.2} />
        </mesh>
      </group>
    );
  }

  return <>{trees}</>;
}

function Ruins() {
  return (
    <>
      <mesh castShadow position={[-15, 2, -15]}>
        <boxGeometry args={[3, 4, 3]} />
        <meshStandardMaterial color="#3D2E5C" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[15, 1.5, -15]}>
        <boxGeometry args={[2, 3, 2]} />
        <meshStandardMaterial color="#3D2E5C" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[-15, 1, 15]}>
        <cylinderGeometry args={[1, 1, 2, 8]} />
        <meshStandardMaterial color="#3D2E5C" roughness={0.9} />
      </mesh>
    </>
  );
}

const Game3D = ({ character }: Game3DProps) => {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0, z: 0 });
  const [currentHealth, setCurrentHealth] = useState(character.stats.health);
  const [currentMana, setCurrentMana] = useState(character.stats.mana);

  const getCharacterColor = () => {
    switch (character.id) {
      case 'warrior': return '#ea384c';
      case 'mage': return '#9b87f5';
      case 'rogue': return '#7c3aed';
      default: return '#9b87f5';
    }
  };

  return (
    <div className="relative w-full h-screen bg-dark-bg">
      <Canvas shadows camera={{ position: [0, 8, 10], fov: 60 }}>
        <Sky 
          distance={450000}
          sunPosition={[0, 1, 0]}
          inclination={0.6}
          azimuth={0.25}
        />
        
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#9b87f5" />

        <Ground />
        <Trees />
        <Ruins />
        
        <Player 
          color={getCharacterColor()} 
          position={[0, 1, 0]}
          onPositionChange={setPlayerPosition}
        />
        
        <CameraController targetPosition={playerPosition} />
        
        <Environment preset="night" />
      </Canvas>

      <Card className="absolute top-6 left-6 bg-dark-card/90 backdrop-blur-sm border-primary/50 p-4 min-w-[280px]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Icon name="User" size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-cinzel text-lg font-bold text-primary">{character.name}</h3>
            <p className="text-xs text-gray-400">{character.class}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center gap-2">
                <Icon name="Heart" size={14} className="text-accent" />
                <span className="text-gray-400">HP</span>
              </div>
              <span className="text-white font-bold">{currentHealth}/{character.stats.health}</span>
            </div>
            <Progress value={(currentHealth / character.stats.health) * 100} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center gap-2">
                <Icon name="Sparkles" size={14} className="text-primary" />
                <span className="text-gray-400">MP</span>
              </div>
              <span className="text-white font-bold">{currentMana}/{character.stats.mana}</span>
            </div>
            <Progress value={(currentMana / character.stats.mana) * 100} className="h-2 bg-dark-bg/50" />
          </div>
        </div>
      </Card>

      <Card className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-dark-card/90 backdrop-blur-sm border-dark-border p-4">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary/20 border border-primary flex items-center justify-center font-bold">
              W
            </div>
            <span className="text-gray-400">Вперёд</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary/20 border border-primary flex items-center justify-center font-bold">
              S
            </div>
            <span className="text-gray-400">Назад</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary/20 border border-primary flex items-center justify-center font-bold">
              A
            </div>
            <span className="text-gray-400">Влево</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary/20 border border-primary flex items-center justify-center font-bold">
              D
            </div>
            <span className="text-gray-400">Вправо</span>
          </div>
        </div>
      </Card>

      <Card className="absolute top-6 right-6 bg-dark-card/90 backdrop-blur-sm border-dark-border p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Icon name="MapPin" size={16} className="text-primary" />
            <span className="text-gray-400">Позиция:</span>
            <span className="font-mono text-xs">
              X: {playerPosition.x.toFixed(1)} Z: {playerPosition.z.toFixed(1)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Game3D;
