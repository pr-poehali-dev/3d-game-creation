import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import WorldMap from '@/components/WorldMap';
import CharacterSelect from '@/components/CharacterSelect';
import Game3DSimple from '@/components/Game3DSimple';
import Game3DWorking from '@/components/Game3DWorking';

interface Quest {
  id: number;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
}

interface DialogOption {
  text: string;
  action: () => void;
}

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

const GameWorld = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [inBattle, setInBattle] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentDialog, setCurrentDialog] = useState('');
  const [dialogOptions, setDialogOptions] = useState<DialogOption[]>([]);
  const [quests, setQuests] = useState<Quest[]>([
    { id: 1, title: 'Тёмное пророчество', description: 'Найди древний артефакт в руинах', progress: 30, completed: false },
    { id: 2, title: 'Охота на тени', description: 'Победи 5 теневых существ', progress: 60, completed: false },
  ]);
  const [combatLog, setCombatLog] = useState<string[]>([]);

  if (!selectedCharacter) {
    return <CharacterSelect onSelectCharacter={setSelectedCharacter} />;
  }

  const startDialog = () => {
    setCurrentDialog('Путник... Ты осмелился войти в эти проклятые земли. Что привело тебя сюда?');
    setDialogOptions([
      {
        text: 'Я ищу древний артефакт',
        action: () => {
          setCurrentDialog('Артефакт... Да, я знаю о чём ты говоришь. Но тебе придётся доказать свою силу.');
          setDialogOptions([
            { text: 'Я готов к испытанию', action: () => { setDialogOpen(false); startBattle(); } },
            { text: 'Расскажи больше', action: () => setCurrentDialog('В древних руинах на востоке хранится то, что ты ищешь. Но путь охраняют тёмные силы.') }
          ]);
        }
      },
      {
        text: 'Просто исследую местность',
        action: () => setCurrentDialog('Любопытство может стоить тебе жизни в этих краях...')
      }
    ]);
    setDialogOpen(true);
  };

  const startBattle = () => {
    setInBattle(true);
    setEnemyHealth(100);
    setCombatLog(['Теневое существо появилось из тьмы!']);
  };

  const playerAttack = () => {
    const damage = Math.floor(Math.random() * 20) + 15;
    const newEnemyHealth = Math.max(0, enemyHealth - damage);
    setEnemyHealth(newEnemyHealth);
    setCombatLog(prev => [...prev, `Ты нанёс ${damage} урона! ⚔️`]);

    if (newEnemyHealth === 0) {
      setCombatLog(prev => [...prev, 'Враг повержен! Победа! 🏆']);
      setTimeout(() => {
        setInBattle(false);
        updateQuestProgress(2, 20);
      }, 1500);
      return;
    }

    setTimeout(() => enemyAttack(), 800);
  };

  const enemyAttack = () => {
    const damage = Math.floor(Math.random() * 15) + 10;
    const newPlayerHealth = Math.max(0, playerHealth - damage);
    setPlayerHealth(newPlayerHealth);
    setCombatLog(prev => [...prev, `Враг нанёс тебе ${damage} урона! 💀`]);

    if (newPlayerHealth === 0) {
      setCombatLog(prev => [...prev, 'Ты повержен...']);
      setTimeout(() => {
        setInBattle(false);
        setPlayerHealth(100);
      }, 2000);
    }
  };

  const updateQuestProgress = (questId: number, amount: number) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId) {
        const newProgress = Math.min(100, q.progress + amount);
        return { ...q, progress: newProgress, completed: newProgress === 100 };
      }
      return q;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg via-dark-secondary to-dark-bg text-white overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(155, 135, 245, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(234, 56, 76, 0.2) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="font-cinzel text-6xl font-bold mb-2 text-shadow-glow bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Тёмное Пророчество
          </h1>
          <p className="text-gray-400 text-lg">Дарк фэнтези приключение</p>
        </header>

        <Tabs defaultValue="3d" className="w-full mb-6">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-dark-card border border-dark-border">
            <TabsTrigger value="3d" className="data-[state=active]:bg-primary">
              <Icon name="Box" size={18} className="mr-2" />
              3D Мир
            </TabsTrigger>
            <TabsTrigger value="game" className="data-[state=active]:bg-primary">
              <Icon name="Swords" size={18} className="mr-2" />
              Игра
            </TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-primary">
              <Icon name="Map" size={18} className="mr-2" />
              Карта мира
            </TabsTrigger>
          </TabsList>

          <TabsContent value="3d" className="mt-6">
            <Game3DSimple character={selectedCharacter} />
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            <WorldMap />
          </TabsContent>

          <TabsContent value="game" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-dark-card border-dark-border p-6 shadow-2xl animate-scale-in">
              <div className="aspect-video bg-gradient-to-br from-dark-secondary to-dark-bg rounded-lg mb-4 relative overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 bg-primary/20 rounded-full animate-pulse absolute -z-10 blur-3xl"></div>
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-glow">
                      <Icon name="Skull" size={48} className="text-white" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon name="Heart" size={16} className="text-accent" />
                        <span className="text-sm">Здоровье игрока</span>
                      </div>
                      <Progress value={playerHealth} className="h-3 bg-dark-bg/50" />
                      <span className="text-xs text-gray-400">{playerHealth}/100</span>
                    </div>
                    {inBattle && (
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon name="Skull" size={16} className="text-primary" />
                          <span className="text-sm">Здоровье врага</span>
                        </div>
                        <Progress value={enemyHealth} className="h-3 bg-dark-bg/50" />
                        <span className="text-xs text-gray-400">{enemyHealth}/100</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                {!inBattle && !dialogOpen && (
                  <>
                    <Button onClick={startDialog} className="bg-primary hover:bg-primary/90 shadow-glow">
                      <Icon name="MessageCircle" size={18} className="mr-2" />
                      Поговорить с NPC
                    </Button>
                    <Button onClick={startBattle} variant="destructive" className="shadow-glow">
                      <Icon name="Swords" size={18} className="mr-2" />
                      Начать бой
                    </Button>
                  </>
                )}
                {inBattle && (
                  <>
                    <Button onClick={playerAttack} className="bg-accent hover:bg-accent/90 shadow-glow" disabled={enemyHealth === 0 || playerHealth === 0}>
                      <Icon name="Sword" size={18} className="mr-2" />
                      Атаковать
                    </Button>
                    <Button variant="outline" className="border-gray-600" disabled={enemyHealth === 0 || playerHealth === 0}>
                      <Icon name="Shield" size={18} className="mr-2" />
                      Защита
                    </Button>
                  </>
                )}
              </div>
            </Card>

            {dialogOpen && (
              <Card className="bg-dark-card border-primary/50 p-6 shadow-2xl animate-fade-in border-2">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Ghost" size={32} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-cinzel text-xl mb-2 text-primary">Загадочный странник</h3>
                    <p className="text-gray-300 italic">"{currentDialog}"</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {dialogOptions.map((option, index) => (
                    <Button
                      key={index}
                      onClick={option.action}
                      variant="outline"
                      className="w-full justify-start border-primary/30 hover:border-primary hover:bg-primary/10 text-left h-auto py-3"
                    >
                      <Icon name="ChevronRight" size={16} className="mr-2 flex-shrink-0" />
                      <span>{option.text}</span>
                    </Button>
                  ))}
                  <Button
                    onClick={() => setDialogOpen(false)}
                    variant="ghost"
                    className="w-full"
                  >
                    Закрыть
                  </Button>
                </div>
              </Card>
            )}

            {inBattle && combatLog.length > 0 && (
              <Card className="bg-dark-card border-dark-border p-4">
                <h3 className="font-cinzel text-lg mb-3 flex items-center gap-2">
                  <Icon name="Scroll" size={20} />
                  Боевой журнал
                </h3>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {combatLog.slice(-5).map((log, index) => (
                    <p key={index} className="text-sm text-gray-400 animate-fade-in">
                      {log}
                    </p>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="bg-dark-card border-dark-border p-6 shadow-2xl animate-scale-in">
              <h3 className="font-cinzel text-2xl mb-4 flex items-center gap-2">
                <Icon name="ScrollText" size={24} className="text-primary" />
                Квесты
              </h3>
              <div className="space-y-4">
                {quests.map(quest => (
                  <div key={quest.id} className="border border-dark-border rounded-lg p-4 bg-dark-bg/30">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-cinzel text-lg text-primary">{quest.title}</h4>
                      {quest.completed && (
                        <Badge className="bg-primary text-white">
                          <Icon name="Check" size={14} className="mr-1" />
                          Выполнено
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{quest.description}</p>
                    <div>
                      <Progress value={quest.progress} className="h-2 mb-1" />
                      <span className="text-xs text-gray-500">{quest.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-dark-card border-dark-border p-6 shadow-2xl">
              <h3 className="font-cinzel text-2xl mb-4 flex items-center gap-2">
                <Icon name="User" size={24} className="text-primary" />
                Персонаж
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Уровень</span>
                  <Badge className="bg-primary">5</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Класс</span>
                  <span className="font-cinzel text-accent">Тёмный рыцарь</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Опыт</span>
                  <span>750 / 1000</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </Card>
          </div>
        </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GameWorld;