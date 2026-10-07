import type { CharacterSprites } from '../sprites/spriteData.js';
import type { Character, SpriteData } from '../types.js';
import { CharacterState } from '../types.js';

export interface CharacterAnimationTransform {
  offsetX: number;
  offsetY: number;

  scaleX: number;
  scaleY: number;

  rotation: number;

  alpha: number;
}

export interface CharacterAnimationFrame {
  sprite: SpriteData;
  transform: CharacterAnimationTransform;
}

const DEFAULT_TRANSFORM: CharacterAnimationTransform = {
  offsetX: 0,
  offsetY: 0,
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  alpha: 1,
};

function frame(
  sprite: SpriteData,
  transform: Partial<CharacterAnimationTransform> = {},
): CharacterAnimationFrame {
  return {
    sprite,
    transform: {
      ...DEFAULT_TRANSFORM,
      ...transform,
    },
  };
}

function phase(ch: Character): number {
  return ch.frameTimer * 6 + ch.frame * 0.7;
}

function sin(ch: Character, speed = 1): number {
  return Math.sin(phase(ch) * speed);
}

function breathing(
  ch: Character,
  sprite: SpriteData,
): CharacterAnimationFrame {
  const movement = sin(ch, 0.8);

  return frame(sprite, {
    offsetY: movement * 0.25,
    scaleY: 1 + movement * 0.008,
  });
}

function walking(
  ch: Character,
  sprites: CharacterSprites,
): CharacterAnimationFrame {
  return frame(
    sprites.walk[ch.dir][ch.frame % 4],
    {
      offsetY:
        Math.abs(
          Math.sin(
            phase(ch) * 1.4,
          ),
        ) * -1.2,
    },
  );
}

function sitting(
  ch: Character,
  sprites: CharacterSprites,
): CharacterAnimationFrame {
  const sprite =
    sprites.typing[ch.dir][ch.frame % 2];

  return frame(sprite, {
    offsetY: 2,
    scaleY: 0.94,
  });
}

function typing(
  ch: Character,
  sprites: CharacterSprites,
): CharacterAnimationFrame {
  return frame(
    sprites.typing[ch.dir][ch.frame % 2],
    {
      offsetY:
        Math.sin(
          phase(ch) * 1.5,
        ) * 0.25,
    },
  );
}

function reading(
  ch: Character,
  sprites: CharacterSprites,
): CharacterAnimationFrame {
  return frame(
    sprites.reading[ch.dir][ch.frame % 2],
    {
      offsetY: Math.sin(
        phase(ch),
      ) * 0.2,
    },
  );
}

function talking(
  ch: Character,
  sprites: CharacterSprites,
): CharacterAnimationFrame {
  const sprite =
    sprites.walk[ch.dir][
      ch.frame % 4
    ];

  const talkMovement =
    Math.sin(
      phase(ch) * 1.8,
    );

  return frame(sprite, {
    offsetY:
      talkMovement * 0.7,
    offsetX:
      talkMovement * 0.35,
    rotation:
      talkMovement * 0.015,
  });
}

function eating(
  ch: Character,
  sprites: CharacterSprites,
): CharacterAnimationFrame {
  const sprite =
    sprites.typing[ch.dir][
      ch.frame % 2
    ];

  const eatingMotion =
    Math.sin(
      phase(ch) * 1.8,
    );

  return frame(sprite, {
    offsetY:
      eatingMotion > 0
        ? -1.5
        : 0,
    rotation:
      eatingMotion * 0.025,
  });
}

function drinking(
  ch: Character,
  sprites: CharacterSprites,
): CharacterAnimationFrame {
  const sprite =
    sprites.typing[ch.dir][
      ch.frame % 2
    ];

  const sip =
    Math.sin(
      phase(ch) * 0.8,
    );

  return frame(sprite, {
    offsetY:
      sip > 0
        ? -1
        : 0,
    rotation:
      sip > 0
        ? -0.06
        : 0,
  });
}

function coffee(
  ch: Character,
  sprites: CharacterSprites,
): CharacterAnimationFrame {
  return drinking(ch, sprites);
}

function phone(
  ch: Character,
  sprites: CharacterSprites,
): CharacterAnimationFrame {
  const sprite =
    sprites.reading[ch.dir][
      ch.frame % 2
    ];

  const movement =
    Math.sin(
      phase(ch) * 0.8,
    );

  return frame(sprite, {
    offsetX:
      movement * 0.5,
    offsetY:
      -0.5 + movement * 0.3,
    rotation:
      movement * 0.02,
  });
}

function thinking(
  ch: Character,
  sprites: CharacterSprites,
): CharacterAnimationFrame {
  const sprite =
    sprites.reading[ch.dir][
      ch.frame % 2
    ];

  return frame(sprite, {
    offsetY:
      -1 +
      Math.sin(
        phase(ch) * 0.4,
      ) * 0.5,
  });
}

function resting(
  ch: Character,
  sprites: CharacterSprites,
): CharacterAnimationFrame {
  return breathing(
    ch,
    sprites.walk[ch.dir][1],
  );
}

function sleeping(
  ch: Character,
  sprites: CharacterSprites,
): CharacterAnimationFrame {
  const sprite =
    sprites.walk[ch.dir][1];

  const breathe =
    Math.sin(
      phase(ch) * 0.35,
    );

  return frame(sprite, {
    offsetY: 2,
    scaleY:
      0.9 +
      breathe * 0.01,
    rotation:
      -0.08,
  });
}

function yawning(
  ch: Character,
  sprites: CharacterSprites,
): CharacterAnimationFrame {
  const sprite =
    sprites.walk[ch.dir][
      ch.frame % 4
    ];

  const amount =
    Math.sin(
      phase(ch) * 0.5,
    );

  return frame(sprite, {
    offsetY:
      -Math.max(
        0,
        amount,
      ) * 2,
    scaleY:
      1 +
      Math.max(
        0,
        amount,
      ) * 0.015,
  });
}

function wudhu(
  ch: Character,
  sprites: CharacterSprites,
): CharacterAnimationFrame {
  const sprite =
    sprites.walk[ch.dir][
      ch.frame % 4
    ];

  const down =
    Math.abs(
      Math.sin(
        phase(ch) * 0.55,
      ),
    );

  return frame(sprite, {
    offsetY:
      down * 3,
    rotation:
      -down * 0.08,
    scaleY:
      1 -
      down * 0.04,
  });
}

function prayer(
  ch: Character,
  sprites: CharacterSprites,
): CharacterAnimationFrame {
  const sprite =
    sprites.walk[ch.dir][1];

  const cycle =
    Math.sin(
      phase(ch) * 0.25,
    );

  return frame(sprite, {
    offsetY:
      cycle * 1.2,
    scaleY:
      0.92 +
      cycle * 0.01,
  });
}

function carrying(
  ch: Character,
  sprites: CharacterSprites,
): CharacterAnimationFrame {
  const sprite =
    sprites.walk[ch.dir][
      ch.frame % 4
    ];

  return frame(sprite, {
    offsetY:
      Math.sin(
        phase(ch) * 1.4,
      ) * -0.8,
  });
}

function cleaning(
  ch: Character,
  sprites: CharacterSprites,
): CharacterAnimationFrame {
  const sprite =
    sprites.walk[ch.dir][
      ch.frame % 4
    ];

  const movement =
    Math.sin(
      phase(ch) * 1.4,
    );

  return frame(sprite, {
    offsetX:
      movement * 1.2,
    rotation:
      movement * 0.04,
  });
}

function entering(
  ch: Character,
  sprites: CharacterSprites,
): CharacterAnimationFrame {
  const sprite =
    sprites.walk[ch.dir][
      ch.frame % 4
    ];

  const progress =
    Math.min(
      1,
      ch.moveProgress,
    );

  return frame(sprite, {
    offsetX:
      progress * 1.5,
    scaleX:
      0.9 +
      progress * 0.1,
    alpha:
      0.65 +
      progress * 0.35,
  });
}

function exiting(
  ch: Character,
  sprites: CharacterSprites,
): CharacterAnimationFrame {
  const sprite =
    sprites.walk[ch.dir][
      ch.frame % 4
    ];

  const progress =
    Math.min(
      1,
      ch.moveProgress,
    );

  return frame(sprite, {
    offsetX:
      -progress * 1.5,
    alpha:
      1 -
      progress * 0.35,
  });
}

function waiting(
  ch: Character,
  sprites: CharacterSprites,
): CharacterAnimationFrame {
  const sprite =
    sprites.walk[ch.dir][1];

  return frame(sprite, {
    offsetY:
      Math.sin(
        phase(ch) * 0.35,
      ) * 0.25,
  });
}

export function getCharacterAnimation(
  ch: Character,
  sprites: CharacterSprites,
): CharacterAnimationFrame {
  switch (ch.state) {
    case CharacterState.WALK:
      return walking(ch, sprites);

    case CharacterState.TYPE:
      return typing(ch, sprites);

    case CharacterState.SIT:
      return sitting(ch, sprites);

    case CharacterState.TALK:
      return talking(ch, sprites);

    case CharacterState.EAT:
      return eating(ch, sprites);

    case CharacterState.DRINK:
      return drinking(ch, sprites);

    case CharacterState.COFFEE:
      return coffee(ch, sprites);

    case CharacterState.PHONE:
      return phone(ch, sprites);

    case CharacterState.READ:
      return reading(ch, sprites);

    case CharacterState.THINK:
      return thinking(ch, sprites);

    case CharacterState.REST:
      return resting(ch, sprites);

    case CharacterState.SLEEP:
      return sleeping(ch, sprites);

    case CharacterState.YAWN:
      return yawning(ch, sprites);

    case CharacterState.WUDHU:
      return wudhu(ch, sprites);

    case CharacterState.PRAY:
      return prayer(ch, sprites);

    case CharacterState.CARRY:
      return carrying(ch, sprites);

    case CharacterState.CLEAN:
      return cleaning(ch, sprites);

    case CharacterState.ENTER_BUILDING:
      return entering(ch, sprites);

    case CharacterState.EXIT_BUILDING:
      return exiting(ch, sprites);

    case CharacterState.WAITING:
      return waiting(ch, sprites);

    case CharacterState.MEETING:
      return talking(ch, sprites);

    case CharacterState.SHOP:
      return walking(ch, sprites);

    case CharacterState.IDLE:
    default:
      return breathing(
        ch,
        sprites.walk[ch.dir][1],
      );
  }
}
