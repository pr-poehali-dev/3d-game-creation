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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let playerX = 0;
    let playerZ = 0;
    const speed = 3;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const getColor = () => {
      switch (character.id) {
        case 'warrior': return '#ea384c';
        case 'mage': return '#9b87f5';
        case 'rogue': return '#7c3aed';
        default: return '#9b87f5';
      }
    };

    const drawWorld = () => {
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = 20;

      // Ground grid
      ctx.strokeStyle = '#1a1a2e';
      ctx.lineWidth = 1;
      for (let i = -20; i <= 20; i++) {
        const x = centerX + (i * scale) - (playerX * scale);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let i = -20; i <= 20; i++) {
        const y = centerY + (i * scale) - (playerZ * scale);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Trees
      const treePositions = [
        [-8, -8], [8, -8], [-8, 8], [8, 8],
        [-12, 0], [12, 0], [0, -12], [0, 12],
      ];

      treePositions.forEach(([tx, tz]) => {
        const screenX = centerX + (tx - playerX) * scale;
        const screenY = centerY + (tz - playerZ) * scale;
        
        // Trunk
        ctx.fillStyle = '#2D1B4E';
        ctx.fillRect(screenX - 5, screenY - 15, 10, 30);
        
        // Crown
        ctx.fillStyle = '#9b87f5';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 40);
        ctx.lineTo(screenX + 20, screenY - 15);
        ctx.lineTo(screenX - 20, screenY - 15);
        ctx.closePath();
        ctx.fill();
      });

      // Ruins
      const ruins = [
        [-15, -15, 30, 40],
        [15, -15, 20, 30],
      ];

      ruins.forEach(([rx, rz, w, h]) => {
        const screenX = centerX + (rx - playerX) * scale;
        const screenY = centerY + (rz - playerZ) * scale;
        
        ctx.fillStyle = '#3D2E5C';
        ctx.fillRect(screenX - w / 2, screenY - h / 2, w, h);
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

      // Direction indicator
      let dirX = 0;
      let dirZ = 0;
      if (keysPressed.current['w'] || keysPressed.current['ц'] || keysPressed.current['arrowup']) dirZ = -1;
      if (keysPressed.current['s'] || keysPressed.current['ы'] || keysPressed.current['arrowdown']) dirZ = 1;
      if (keysPressed.current['a'] || keysPressed.current['ф'] || keysPressed.current['arrowleft']) dirX = -1;
      if (keysPressed.current['d'] || keysPressed.current['в'] || keysPressed.current['arrowright']) dirX = 1;

      if (dirX !== 0 || dirZ !== 0) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX + dirX * 20, centerY + dirZ * 20, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const gameLoop = () => {
      // Update player position
      if (keysPressed.current['w'] || keysPressed.current['ц'] || keysPressed.current['arrowup']) playerZ -= speed * 0.05;
      if (keysPressed.current['s'] || keysPressed.current['ы'] || keysPressed.current['arrowdown']) playerZ += speed * 0.05;
      if (keysPressed.current['a'] || keysPressed.current['ф'] || keysPressed.current['arrowleft']) playerX -= speed * 0.05;
      if (keysPressed.current['d'] || keysPressed.current['в'] || keysPressed.current['arrowright']) playerX += speed * 0.05;

      playerX = Math.max(-20, Math.min(20, playerX));
      playerZ = Math.max(-20, Math.min(20, playerZ));

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
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
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
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-dark-bg rounded text-xs">W</kbd>
            <kbd className="px-2 py-1 bg-dark-bg rounded text-xs">A</kbd>
            <kbd className="px-2 py-1 bg-dark-bg rounded text-xs">S</kbd>
            <kbd className="px-2 py-1 bg-dark-bg rounded text-xs">D</kbd>
          </div>
          <span>Движение</span>
        </div>
      </Card>
    </div>
  );
};

export default Game3DSimple;
