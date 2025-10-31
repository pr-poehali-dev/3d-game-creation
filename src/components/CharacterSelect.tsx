import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Character {
  id: string;
  name: string;
  class: string;
  description: string;
  stats: {
    health: number;
    mana: number;
    attack: number;
    defense: number;
  };
  image: string;
  color: string;
}

interface CharacterSelectProps {
  onSelectCharacter: (character: Character) => void;
}

const characters: Character[] = [
  {
    id: 'warrior',
    name: 'Тёмный рыцарь',
    class: 'Воин',
    description: 'Могучий воин в тяжёлой броне. Высокая защита и сила, но медлителен.',
    stats: { health: 150, mana: 50, attack: 80, defense: 90 },
    image: 'https://cdn.poehali.dev/projects/6e5530d4-2397-418a-b7a2-7116b0bfb470/files/b8a0918b-0dc0-4da9-b741-e9a8bc9aa6ef.jpg',
    color: 'from-accent to-accent/50'
  },
  {
    id: 'mage',
    name: 'Тёмная колдунья',
    class: 'Маг',
    description: 'Мастер магии теней. Высокий урон заклинаниями, но слабая защита.',
    stats: { health: 80, mana: 150, attack: 100, defense: 40 },
    image: 'https://cdn.poehali.dev/projects/6e5530d4-2397-418a-b7a2-7116b0bfb470/files/68e9e13c-61bd-459e-959a-30befd090751.jpg',
    color: 'from-primary to-primary/50'
  },
  {
    id: 'rogue',
    name: 'Теневой убийца',
    class: 'Разбойник',
    description: 'Быстрый и ловкий ассасин. Критические удары и уклонения.',
    stats: { health: 100, mana: 80, attack: 90, defense: 60 },
    image: 'https://cdn.poehali.dev/projects/6e5530d4-2397-418a-b7a2-7116b0bfb470/files/9e498895-cf78-4d61-b210-9d6ee765bf2e.jpg',
    color: 'from-violet-600 to-violet-600/50'
  }
];

const CharacterSelect = ({ onSelectCharacter }: CharacterSelectProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg via-dark-secondary to-dark-bg text-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="font-cinzel text-6xl font-bold mb-4 text-shadow-glow bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Выбери своего героя
          </h1>
          <p className="text-gray-400 text-xl">Начни своё путешествие в тёмных землях</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {characters.map((character, index) => (
            <Card
              key={character.id}
              className="bg-dark-card border-dark-border overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-glow cursor-pointer group"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onSelectCharacter(character)}
            >
              <div className={`relative h-80 bg-gradient-to-b ${character.color} overflow-hidden`}>
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent"></div>
                <Badge className="absolute top-4 right-4 bg-dark-card/80 backdrop-blur-sm border-primary">
                  {character.class}
                </Badge>
              </div>

              <div className="p-6">
                <h3 className="font-cinzel text-2xl font-bold mb-2 text-primary">
                  {character.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4 min-h-[3rem]">
                  {character.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="Heart" size={16} className="text-accent" />
                      <span className="text-gray-400">Здоровье</span>
                    </div>
                    <span className="font-bold">{character.stats.health}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="Sparkles" size={16} className="text-primary" />
                      <span className="text-gray-400">Мана</span>
                    </div>
                    <span className="font-bold">{character.stats.mana}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="Sword" size={16} className="text-accent" />
                      <span className="text-gray-400">Атака</span>
                    </div>
                    <span className="font-bold">{character.stats.attack}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="Shield" size={16} className="text-primary" />
                      <span className="text-gray-400">Защита</span>
                    </div>
                    <span className="font-bold">{character.stats.defense}</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-primary hover:bg-primary/90 shadow-glow group-hover:scale-105 transition-transform"
                  onClick={() => onSelectCharacter(character)}
                >
                  <Icon name="Play" size={18} className="mr-2" />
                  Выбрать героя
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterSelect;
