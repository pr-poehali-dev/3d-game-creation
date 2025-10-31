import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Region {
  id: number;
  name: string;
  description: string;
  level: string;
  discovered: boolean;
  icon: string;
  color: string;
  x: string;
  y: string;
}

const WorldMap = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [regions, setRegions] = useState<Region[]>([
    {
      id: 1,
      name: 'Проклятый лес',
      description: 'Древний лес, окутанный тьмой и магией. Здесь обитают теневые существа и заблудшие души.',
      level: '1-10',
      discovered: true,
      icon: 'Trees',
      color: 'bg-primary/20 border-primary',
      x: '25%',
      y: '40%'
    },
    {
      id: 2,
      name: 'Огненные пики',
      description: 'Вулканические горы, где течет раскаленная лава. Родина драконов и огненных элементалей.',
      level: '15-25',
      discovered: true,
      icon: 'Mountain',
      color: 'bg-accent/20 border-accent',
      x: '60%',
      y: '25%'
    },
    {
      id: 3,
      name: 'Ледяная цитадель',
      description: 'Замерзшее королевство вечного холода. Древняя крепость хранит могущественные артефакты.',
      level: '20-30',
      discovered: false,
      icon: 'Snowflake',
      color: 'bg-blue-400/20 border-blue-400',
      x: '15%',
      y: '15%'
    },
    {
      id: 4,
      name: 'Руины забвения',
      description: 'Останки древней цивилизации в пустошах. Здесь скрыты тайны прошлого и проклятые сокровища.',
      level: '25-35',
      discovered: false,
      icon: 'Landmark',
      color: 'bg-yellow-600/20 border-yellow-600',
      x: '75%',
      y: '60%'
    },
    {
      id: 5,
      name: 'Парящие острова',
      description: 'Летающие острова, где правят магия и гравитация. Путь к небесным вратам.',
      level: '30-40',
      discovered: false,
      icon: 'Cloud',
      color: 'bg-purple-400/20 border-purple-400',
      x: '45%',
      y: '70%'
    },
    {
      id: 6,
      name: 'Храм Теней',
      description: 'Священное место темных культистов. Здесь совершаются запретные ритуалы.',
      level: '35-45',
      discovered: false,
      icon: 'Church',
      color: 'bg-violet-600/20 border-violet-600',
      x: '85%',
      y: '40%'
    }
  ]);

  const discoverRegion = (regionId: number) => {
    setRegions(prev => prev.map(r => 
      r.id === regionId ? { ...r, discovered: true } : r
    ));
  };

  const travelToRegion = (region: Region) => {
    if (!region.discovered) {
      discoverRegion(region.id);
    }
    setSelectedRegion(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="font-cinzel text-4xl font-bold text-primary mb-2">Карта мира</h2>
        <p className="text-gray-400">Исследуй тёмные земли и открывай новые локации</p>
      </div>

      <Card className="bg-dark-card border-dark-border p-6 relative overflow-hidden">
        <div 
          className="relative w-full h-[600px] rounded-lg overflow-hidden"
          style={{
            backgroundImage: 'url(https://cdn.poehali.dev/projects/6e5530d4-2397-418a-b7a2-7116b0bfb470/files/c184fefc-21b1-4a3a-acdc-edb80bf8c3ee.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/40 via-transparent to-dark-bg/60"></div>
          
          {regions.map(region => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region)}
              className={`absolute w-16 h-16 rounded-full ${region.color} border-2 flex items-center justify-center transition-all duration-300 hover:scale-125 hover:shadow-glow group ${!region.discovered ? 'opacity-60 animate-pulse' : ''}`}
              style={{ left: region.x, top: region.y, transform: 'translate(-50%, -50%)' }}
            >
              <Icon name={region.icon as any} size={28} className="text-white drop-shadow-lg" />
              
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <div className="bg-dark-card border border-dark-border rounded-lg px-3 py-2 shadow-xl">
                  <p className="font-cinzel text-sm font-bold text-white">{region.name}</p>
                  <p className="text-xs text-gray-400">Уровень {region.level}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regions.map(region => (
          <Card 
            key={region.id}
            className={`bg-dark-card border-dark-border p-4 cursor-pointer transition-all hover:scale-105 hover:shadow-glow ${!region.discovered ? 'opacity-60' : ''}`}
            onClick={() => setSelectedRegion(region)}
          >
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-lg ${region.color} border-2 flex items-center justify-center flex-shrink-0`}>
                <Icon name={region.icon as any} size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-cinzel text-lg font-bold">{region.name}</h3>
                  {!region.discovered && (
                    <Badge variant="outline" className="text-xs">
                      <Icon name="Lock" size={12} className="mr-1" />
                      Закрыто
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-400 mb-2">{region.description}</p>
                <Badge className="text-xs">{region.level} lvl</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedRegion} onOpenChange={() => setSelectedRegion(null)}>
        <DialogContent className="bg-dark-card border-primary/50 border-2 max-w-md">
          {selectedRegion && (
            <>
              <DialogHeader>
                <DialogTitle className="font-cinzel text-2xl text-primary flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg ${selectedRegion.color} border-2 flex items-center justify-center`}>
                    <Icon name={selectedRegion.icon as any} size={24} className="text-white" />
                  </div>
                  {selectedRegion.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <p className="text-gray-300">{selectedRegion.description}</p>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">Рекомендуемый уровень</p>
                    <Badge className="text-lg">{selectedRegion.level}</Badge>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">Статус</p>
                    <Badge variant={selectedRegion.discovered ? 'default' : 'outline'}>
                      {selectedRegion.discovered ? (
                        <>
                          <Icon name="Check" size={14} className="mr-1" />
                          Открыто
                        </>
                      ) : (
                        <>
                          <Icon name="Lock" size={14} className="mr-1" />
                          Закрыто
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => travelToRegion(selectedRegion)}
                    className="flex-1 bg-primary hover:bg-primary/90 shadow-glow"
                  >
                    <Icon name="MapPin" size={18} className="mr-2" />
                    {selectedRegion.discovered ? 'Отправиться' : 'Исследовать'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedRegion(null)}
                    className="border-gray-600"
                  >
                    Закрыть
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorldMap;
