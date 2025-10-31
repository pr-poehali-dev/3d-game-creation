import { useEffect, useRef, useState } from 'react';
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

interface Game3DSimpleProps {
  character: Character;
}

const Game3DSimple = ({ character }: Game3DSimpleProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, z: 0 });
  const [currentHealth] = useState(character.stats.health);
  const [currentMana] = useState(character.stats.mana);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const animationRef = useRef<number>();
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const cameraOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let playerX = 0;
    let playerZ = 0;
    const speed = 6;
    let targetX: number | null = null;
    let targetZ: number | null = null;
    let lastClickTime = 0;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        setIsDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        cameraOffset.current.x += dx * 0.5;
        cameraOffset.current.y += dy * 0.5;
        dragStart.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        if (!isDragging) {
          const currentTime = Date.now();
          if (currentTime - lastClickTime < 300) {
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const scale = 20;
            
            targetX = playerX + (clickX - centerX - cameraOffset.current.x) / scale;
            targetZ = playerZ + (clickY - centerY - cameraOffset.current.y) / scale;
          }
          lastClickTime = currentTime;
        }
        setIsDragging(false);
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    const getColor = () => {
      switch (character.id) {
        case 'warrior': return '#ea384c';
        case 'mage': return '#9b87f5';
        case 'rogue': return '#7c3aed';
        default: return '#9b87f5';
      }
    };

    // Procedural generation using seed
    const seededRandom = (x: number, z: number, seed: number) => {
      const val = Math.sin(x * 12.9898 + z * 78.233 + seed) * 43758.5453;
      return val - Math.floor(val);
    };

    const generateTrees = (centerX: number, centerY: number, scale: number) => {
      const trees = [];
      const gridSize = 4;
      const viewRange = 30;

      for (let gx = Math.floor(playerX / gridSize) - viewRange; gx < Math.floor(playerX / gridSize) + viewRange; gx++) {
        for (let gz = Math.floor(playerZ / gridSize) - viewRange; gz < Math.floor(playerZ / gridSize) + viewRange; gz++) {
          const rand = seededRandom(gx, gz, 1234);
          
          if (rand > 0.85) {
            const tx = gx * gridSize + (seededRandom(gx, gz, 5678) - 0.5) * 2;
            const tz = gz * gridSize + (seededRandom(gx, gz, 9012) - 0.5) * 2;
            
            const screenX = centerX + (tx - playerX) * scale;
            const screenY = centerY + (tz - playerZ) * scale;
            
            if (screenX > -50 && screenX < canvas.width + 50 && screenY > -50 && screenY < canvas.height + 50) {
              trees.push({ x: screenX, y: screenY, size: seededRandom(gx, gz, 3456) });
            }
          }
        }
      }
      return trees;
    };

    const generateRuins = (centerX: number, centerY: number, scale: number) => {
      const ruins = [];
      const gridSize = 20;
      const viewRange = 5;

      for (let gx = Math.floor(playerX / gridSize) - viewRange; gx < Math.floor(playerX / gridSize) + viewRange; gx++) {
        for (let gz = Math.floor(playerZ / gridSize) - viewRange; gz < Math.floor(playerZ / gridSize) + viewRange; gz++) {
          const rand = seededRandom(gx, gz, 7777);
          
          if (rand > 0.7) {
            const rx = gx * gridSize;
            const rz = gz * gridSize;
            
            const screenX = centerX + (rx - playerX) * scale;
            const screenY = centerY + (rz - playerZ) * scale;
            
            if (screenX > -100 && screenX < canvas.width + 100 && screenY > -100 && screenY < canvas.height + 100) {
              const width = 20 + seededRandom(gx, gz, 8888) * 30;
              const height = 25 + seededRandom(gx, gz, 9999) * 40;
              ruins.push({ x: screenX, y: screenY, w: width, h: height });
            }
          }
        }
      }
      return ruins;
    };

    const drawWorld = () => {
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2 + cameraOffset.current.x;
      const centerY = canvas.height / 2 + cameraOffset.current.y;
      const scale = 20;

      // Smooth procedural terrain with gradients
      const tileSize = scale;
      
      const startTileX = Math.floor((playerX - canvas.width / scale / 2) / 1);
      const startTileZ = Math.floor((playerZ - canvas.height / scale / 2) / 1);
      const tilesX = Math.ceil(canvas.width / tileSize) + 2;
      const tilesZ = Math.ceil(canvas.height / tileSize) + 2;

      for (let tx = 0; tx < tilesX; tx++) {
        for (let tz = 0; tz < tilesZ; tz++) {
          const worldX = startTileX + tx;
          const worldZ = startTileZ + tz;
          
          const screenX = centerX + (worldX - playerX) * tileSize;
          const screenY = centerY + (worldZ - playerZ) * tileSize;
          
          const noise1 = seededRandom(worldX, worldZ, 5555);
          const noise2 = seededRandom(worldX, worldZ, 6666);
          
          const gradient = ctx.createRadialGradient(
            screenX + tileSize / 2, screenY + tileSize / 2, 0,
            screenX + tileSize / 2, screenY + tileSize / 2, tileSize * 0.8
          );
          
          let centerColor, edgeColor;
          if (noise1 < 0.25) {
            centerColor = '#2d5016';
            edgeColor = '#1a3a0f';
          } else if (noise1 < 0.5) {
            centerColor = '#1a3a0f';
            edgeColor = '#2d5016';
          } else if (noise1 < 0.75) {
            centerColor = '#8b4513';
            edgeColor = '#d2691e';
          } else {
            centerColor = '#d2691e';
            edgeColor = '#8b4513';
          }
          
          if (noise2 > 0.7) {
            const temp = centerColor;
            centerColor = edgeColor;
            edgeColor = temp;
          }
          
          gradient.addColorStop(0, centerColor);
          gradient.addColorStop(1, edgeColor);
          
          ctx.fillStyle = gradient;
          ctx.fillRect(screenX, screenY, tileSize, tileSize);
        }
      }

      // Generate ruins
      const ruins = generateRuins(centerX, centerY, scale);
      ruins.forEach(({ x, y, w, h }) => {
        ctx.fillStyle = '#3D2E5C';
        ctx.fillRect(x - w / 2, y - h / 2, w, h);
        
        // Add details
        ctx.fillStyle = '#2D1B4E';
        ctx.fillRect(x - w / 2 + 5, y - h / 2 + 5, w - 10, 5);
      });

      // Generate trees
      const trees = generateTrees(centerX, centerY, scale);
      trees.forEach(({ x, y, size }) => {
        const treeSize = 0.8 + size * 0.4;
        
        // Trunk
        ctx.fillStyle = '#2D1B4E';
        ctx.fillRect(x - 5 * treeSize, y - 15 * treeSize, 10 * treeSize, 30 * treeSize);
        
        // Crown
        ctx.fillStyle = '#9b87f5';
        ctx.beginPath();
        ctx.moveTo(x, y - 40 * treeSize);
        ctx.lineTo(x + 20 * treeSize, y - 15 * treeSize);
        ctx.lineTo(x - 20 * treeSize, y - 15 * treeSize);
        ctx.closePath();
        ctx.fill();
      });

      // Player (always center)
      const playerColor = getColor();
      
      // Glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40);
      gradient.addColorStop(0, playerColor + '80');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(centerX - 40, centerY - 40, 80, 80);

      // Body
      ctx.fillStyle = playerColor;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
      ctx.fill();

      // Target marker
      if (targetX !== null && targetZ !== null) {
        const markerScreenX = centerX + (targetX - playerX) * scale;
        const markerScreenY = centerY + (targetZ - playerZ) * scale;
        
        ctx.strokeStyle = playerColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(markerScreenX, markerScreenY, 10, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(markerScreenX - 8, markerScreenY);
        ctx.lineTo(markerScreenX + 8, markerScreenY);
        ctx.moveTo(markerScreenX, markerScreenY - 8);
        ctx.lineTo(markerScreenX, markerScreenY + 8);
        ctx.stroke();
      }
    };

    const gameLoop = () => {
      // Auto-move to target
      if (targetX !== null && targetZ !== null) {
        const dx = targetX - playerX;
        const dz = targetZ - playerZ;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance > 0.1) {
          const moveSpeed = speed * 0.08;
          playerX += (dx / distance) * moveSpeed;
          playerZ += (dz / distance) * moveSpeed;
        } else {
          targetX = null;
          targetZ = null;
        }
      }

      // Smooth camera return when not dragging
      if (!isDragging) {
        cameraOffset.current.x *= 0.95;
        cameraOffset.current.y *= 0.95;
      }

      setPlayerPosition({ x: playerX, z: playerZ });
      drawWorld();

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [character]);

  return (
    <div className="relative w-full h-screen bg-dark-bg overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />

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
            <Progress value={(currentMana / character.stats.mana) * 100} className="h-2 [&>div]:bg-primary" />
          </div>

          <div className="pt-2 border-t border-dark-border/50">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Icon name="MapPin" size={12} />
              <span>X: {playerPosition.x.toFixed(1)} Z: {playerPosition.z.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-dark-card/90 backdrop-blur-sm border-primary/50 p-3">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Icon name="Mouse" size={16} className="text-primary" />
            <span>Двойной клик - движение</span>
          </div>
          <div className="h-4 w-px bg-dark-border"></div>
          <div className="flex items-center gap-2">
            <Icon name="Hand" size={16} className="text-accent" />
            <span>Зажать ЛКМ - осмотр карты</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Game3DSimple;