import type { Character } from '../types.js';

export type AIActivity =
  | 'IDLE'
  | 'WALK'
  | 'WORK'
  | 'TYPE'
  | 'TALK'
  | 'MEETING'
  | 'EAT'
  | 'DRINK'
  | 'COFFEE'
  | 'SHOP'
  | 'REST'
  | 'SLEEP'
  | 'PRAY'
  | 'WUDHU'
  | 'PHONE'
  | 'READ'
  | 'CLEAN'
  | 'WAITING';

export type AIPlace =
  | 'OFFICE'
  | 'CAFE'
  | 'RESTAURANT'
  | 'SHOP'
  | 'MOSQUE'
  | 'PARK'
  | 'RESIDENCE'
  | 'HOSPITAL'
  | 'SERVER'
  | 'MEETING'
  | 'LIBRARY'
  | 'MAINTENANCE';

export interface AIRelationship {
  targetId: number;
  value: number;
  interactions: number;
  lastInteraction: number;
}

export interface AILifeState {
  hunger: number;
  thirst: number;
  energy: number;
  social: number;
  mood: number;

  activity: AIActivity;

  currentPlace: AIPlace | null;
  destinationPlace: AIPlace | null;

  favoriteFood: string;
  favoriteDrink: string;

  relationships: AIRelationship[];

  activityTimer: number;
  decisionTimer: number;

  sleeping: boolean;
  working: boolean;

  personality: string[];
}

const clamp = (value: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, value));

export function createAILifeState(): AILifeState {
  return {
    hunger: random(10, 35),
    thirst: random(10, 35),
    energy: random(60, 100),
    social: random(50, 100),
    mood: 75,

    activity: 'IDLE',

    currentPlace: 'OFFICE',
    destinationPlace: null,

    favoriteFood: randomChoice([
      'Nasi Goreng',
      'Mie Ayam',
      'Ayam Geprek',
      'Bakso',
      'Sate',
    ]),

    favoriteDrink: randomChoice([
      'Kopi',
      'Teh',
      'Es Teh',
      'Cappuccino',
      'Air Mineral',
    ]),

    relationships: [],

    activityTimer: 0,
    decisionTimer: random(2, 8),

    sleeping: false,
    working: false,

    personality: randomPersonality(),
  };
}

export function updateAILife(
  life: AILifeState,
  dt: number,
  workingTime: boolean,
): void {
  life.activityTimer += dt;
  life.decisionTimer -= dt;

  if (!life.sleeping) {
    life.hunger = clamp(life.hunger + dt * 0.035);
    life.thirst = clamp(life.thirst + dt * 0.06);
    life.energy = clamp(life.energy - dt * 0.018);
    life.social = clamp(life.social - dt * 0.008);
  } else {
    life.energy = clamp(life.energy + dt * 0.08);
    life.hunger = clamp(life.hunger + dt * 0.015);
    life.thirst = clamp(life.thirst + dt * 0.025);
  }

  life.mood = calculateMood(life);

  if (life.decisionTimer <= 0) {
    life.decisionTimer = random(4, 10);

    const next = chooseActivity(life, workingTime);

    if (next !== life.activity) {
      life.activity = next;
      life.activityTimer = 0;
    }
  }
}

function calculateMood(life: AILifeState): number {
  const needs =
    (100 - life.hunger) +
    (100 - life.thirst) +
    life.energy +
    life.social;

  return clamp(needs / 4);
}

export function chooseActivity(
  life: AILifeState,
  workingTime: boolean,
): AIActivity {
  if (life.energy < 10) {
    return 'SLEEP';
  }

  if (life.thirst > 82) {
    return 'DRINK';
  }

  if (life.hunger > 85) {
    return 'EAT';
  }

  if (life.social < 20) {
    return 'TALK';
  }

  if (workingTime) {
    if (life.energy < 25) {
      return 'REST';
    }
    // Realistic phone or coffee quick break while at work
    if (Math.random() < 0.22) {
      return randomChoice(['PHONE', 'COFFEE', 'DRINK', 'TALK']);
    }
    return 'WORK';
  }

  if (life.energy < 30) {
    return 'REST';
  }

  return randomChoice([
    'PHONE',
    'PHONE',
    'COFFEE',
    'DRINK',
    'TALK',
    'WORK',
    'READ',
    'WALK',
    'CLEAN',
    'IDLE',
  ]);
}

export function performActivity(
  life: AILifeState,
  dt: number,
): void {
  switch (life.activity) {
    case 'EAT':
      life.hunger = clamp(life.hunger - dt * 2.5);
      life.energy = clamp(life.energy + dt * 0.2);
      break;

    case 'DRINK':
      life.thirst = clamp(life.thirst - dt * 3);
      break;

    case 'COFFEE':
      life.thirst = clamp(life.thirst - dt * 1.5);
      life.energy = clamp(life.energy + dt * 0.8);
      break;

    case 'REST':
      life.energy = clamp(life.energy + dt * 0.7);
      break;

    case 'SLEEP':
      life.energy = clamp(life.energy + dt * 1.2);
      life.hunger = clamp(life.hunger + dt * 0.01);
      life.thirst = clamp(life.thirst + dt * 0.015);
      break;

    case 'TALK':
      life.social = clamp(life.social + dt * 1.8);
      break;

    case 'WORK':
    case 'TYPE':
      life.energy = clamp(life.energy - dt * 0.025);
      life.social = clamp(life.social - dt * 0.004);
      break;

    default:
      break;
  }
}

export function registerInteraction(
  source: AILifeState,
  target: AILifeState,
  targetId: number,
  now: number,
): void {
  let relationship = source.relationships.find(
    item => item.targetId === targetId,
  );

  if (!relationship) {
    relationship = {
      targetId,
      value: 0,
      interactions: 0,
      lastInteraction: now,
    };

    source.relationships.push(relationship);
  }

  relationship.value = clamp(relationship.value + 1, -100, 100);
  relationship.interactions++;
  relationship.lastInteraction = now;

  target.social = clamp(target.social + 5);
}

function random(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomChoice<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomPersonality(): string[] {
  const traits = [
    'ramah',
    'serius',
    'humoris',
    'pendiam',
    'aktif',
    'santai',
    'teliti',
    'kreatif',
    'ambisius',
    'sabar',
    'penasaran',
    'sosial',
  ];

  const result: string[] = [];

  while (result.length < 3) {
    const trait = randomChoice(traits);

    if (!result.includes(trait)) {
      result.push(trait);
    }
  }

  return result;
}

export function attachAILife(character: Character): void {
  if (!character.life) {
    character.life = createAILifeState();
  }
}
