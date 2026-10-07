import type { Character } from '../types.js';

import {
  attachAILife,
  performActivity,
  updateAILife,
} from './aiLife.js';

import {
  createCityBuildings,
  findBuilding,
  type CityBuilding,
} from './cityBuildings.js';

import {
  createConversation,
  type Conversation,
} from './conversationEngine.js';

import {
  createVehicle,
  updateVehicle,
  type Vehicle,
} from './vehicles.js';

import { trafficLightEngine } from './trafficLight.js';

import {
  getWorldTime,
  type WorldTime,
} from './worldTime.js';

export class CitySimulation {
  buildings: CityBuilding[] = [];

  vehicles: Vehicle[] = [];

  conversations: Conversation[] = [];

  worldTime: WorldTime = getWorldTime();

  private elapsed = 0;

  constructor() {
    this.buildings = createCityBuildings();

    this.vehicles = [
      // Ruby Red Car driving along Central Boulevard
      createVehicle('car-1', 'CAR', 120, 448, '#e11d48', 80, 1180),

      // Yellow City Taxi driving along Central Boulevard
      createVehicle('car-taxi', 'CAR', 600, 448, '#eab308', 80, 1180, '#0f172a'),

      // Fast Cyan Sport Motorcycle riding along Central Boulevard
      createVehicle('motor-1', 'MOTORCYCLE', 950, 456, '#0284c7', 80, 1180),

      // Midnight Blue Car driving along South Boulevard
      createVehicle('car-2', 'CAR', 1100, 848, '#1e3a8a', 80, 1180),

      // Server Maintenance Van (Teknisi Server) patrolling South Boulevard
      createVehicle('van-server', 'VAN', 350, 848, '#f8fafc', 80, 1180, '#0284c7'),

      // Delivery Scooter (Kurir Makanan / Paket) on South Boulevard
      createVehicle('scooter-delivery', 'SCOOTER', 700, 856, '#10b981', 80, 1180),

      // Parked Yellow Scooter at Masjid AI City Parking
      {
        id: 'motor-parked',
        type: 'SCOOTER',
        x: 760,
        y: 384,
        targetX: 760,
        targetY: 384,
        speed: 0,
        direction: 0,
        active: true,
        driverId: null,
        color: '#eab308',
      },

      // Parked Dark SUV at Masjid Parking
      {
        id: 'car-parked',
        type: 'CAR',
        x: 820,
        y: 384,
        targetX: 820,
        targetY: 384,
        speed: 0,
        direction: 0,
        active: true,
        driverId: null,
        color: '#334155',
      },

      // Parked Server Technician Van at AI Server Center
      {
        id: 'van-parked-server',
        type: 'VAN',
        x: 960,
        y: 890,
        targetX: 960,
        targetY: 890,
        speed: 0,
        direction: 0,
        active: true,
        driverId: null,
        color: '#f8fafc',
        secondaryColor: '#0284c7',
      },
    ];
  }

  update(
    characters: Iterable<Character>,
    dt: number,
  ): void {
    this.elapsed += dt;

    this.worldTime = getWorldTime();

    const agents = Array.from(characters);

    for (const character of agents) {
      this.updateAgent(
        character,
        agents,
        dt,
      );
    }

    // Update Traffic Light Controller
    trafficLightEngine.update(dt);

    for (const vehicle of this.vehicles) {
      updateVehicle(
        vehicle,
        dt,
      );
    }

    this.cleanupConversations();
  }

  private updateAgent(
    character: Character,
    allCharacters: Character[],
    dt: number,
  ): void {
    attachAILife(character);

    const life = character.life!;

    updateAILife(
      life,
      dt,
      this.worldTime.isWorkingTime,
    );

    performActivity(
      life,
      dt,
    );

    if (
      life.activity === 'TALK'
    ) {
      this.tryConversation(
        character,
        allCharacters,
      );
    }

    if (
      this.worldTime.isPrayerTime &&
      life.activity !== 'PRAY' &&
      life.activity !== 'WUDHU'
    ) {
      life.destinationPlace = 'MOSQUE';
    }
  }

  private tryConversation(
    character: Character,
    allCharacters: Character[],
  ): void {
    const life = character.life;

    if (!life) {
      return;
    }

    const now = Date.now();

    const nearby = allCharacters.find(
      other => {
        if (
          other.id === character.id
        ) {
          return false;
        }

        const dx =
          other.x - character.x;

        const dy =
          other.y - character.y;

        return (
          dx * dx +
          dy * dy <
          80 * 80
        );
      },
    );

    if (!nearby || !nearby.life) {
      return;
    }

    const alreadyTalking =
      this.conversations.some(
        conversation =>
          conversation.speakerId ===
            character.id &&
          conversation.listenerId ===
            nearby.id,
      );

    if (alreadyTalking) {
      return;
    }

    const conversation =
      createConversation(
        character.id,
        nearby.id,
        life,
        nearby.life,
        now,
      );

    this.conversations.push(
      conversation,
    );
  }

  private cleanupConversations(): void {
    const now = Date.now();

    this.conversations =
      this.conversations.filter(
        conversation =>
          now -
            conversation.createdAt <
          conversation.duration * 1000,
      );
  }

  getBuilding(
    place: Parameters<typeof findBuilding>[1],
  ): CityBuilding | undefined {
    return findBuilding(
      this.buildings,
      place,
    );
  }

  getConversationForAgent(
    id: number,
  ): Conversation | undefined {
    const now = Date.now();

    return this.conversations.find(
      conversation =>
        conversation.speakerId === id &&
        now -
          conversation.createdAt <
          conversation.duration * 1000,
    );
  }
}
