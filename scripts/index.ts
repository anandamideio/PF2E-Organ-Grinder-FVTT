import { getRandomItemFromCompendiumWithPrefix, getSizeModifier } from './util.js';

type Traits = 'humanoid' | 'mutant' | 'serpentfolk' | 'evil' | 'chaotic';

// @ts-ignore
const debouncedReload = foundry.utils.debounce(() => window.location.reload(), 100);

// @ts-ignore
const DEBUG = game.settings.get('pf2e-organ-grinder', 'debugMode') as boolean; // @ts-ignore
const maxItemLevel = game.settings.get('pf2e-organ-grinder', 'maxItemLevel') as number; // @ts-ignore
const randomizeAmount = game.settings.get('pf2e-organ-grinder', 'randomizeAmount') as boolean;

const MODULE_NAME = 'pf2e-organ-grinder';

// @ts-ignore
Hooks.once('init', () => {
  // @ts-ignore
  game.settings.register(MODULE_NAME, 'randomizeAmount', {
    name: 'Randomize the amount',
    hint: 'Randomize the amount of organs on each monster. (If you turn this off, all monsters will have only one addition.))',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
    onChange: debouncedReload,
  });

  // @ts-ignore
  game.settings.register(MODULE_NAME, 'maxItemLevel', {
    name: 'Max Item Level',
    hint: `How many levels above the creature's level should we generate from?
    (If you set this to 0, the MAX item level will always be the same level as the creature itself.)`,
    scope: 'world',
    config: true,
    type: Number,
    default: 2,
    onChange: debouncedReload,
  });

  // @ts-ignore
  game.settings.register(MODULE_NAME, 'debugMode', {
    name: 'Debug Mode',
    hint: 'Enable debug mode. (This will log a lot of information to the console.)',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
    onChange: debouncedReload,
  });
});

// Per mxzf#5874's (Discord) advice (Thank you!!), we are using the createToken hook to add items to the actor
// @ts-ignore
Hooks.on('createToken', async (token, data) => {
  if (DEBUG) console.debug('[ORGAN GRINDER::createActor] ->', { token, data });

  try {
    const { actor } = token;
    if (!actor || actor.type !== 'npc') return;

    const traits = actor.system.traits.value as Array<Traits>;
    if (!traits || Array.isArray(traits) === false || traits.length === 0) return;

    const creatureSize = actor.data.data.traits.size.value;
    const creatureLevel = actor.system.details.level.value as number;
    const totalItems = randomizeAmount
      ? Math.floor((getSizeModifier(creatureSize) * creatureLevel) * 0.4)
      : 1;

    // Lets add total items to the actor
    await Promise.all([...Array(totalItems)].map(async () => {
      const item = await getRandomItemFromCompendiumWithPrefix(
        'beast-parts',
        'Serpentfolk',
        creatureLevel + maxItemLevel,
      );

      if (!item) {
        if (DEBUG) {
          console.error('[ORGAN GRINDER::createActor] -> No item found here\'s what we have for that compendium', { // @ts-ignore
            items: game.packs.get('pf2e-organ-grinder.beast-parts'),
          });
        }
      }

      actor.createEmbeddedDocuments('Item', [item]);
    }));
  } catch (error) {
    console.error('[ORGAN GRINDER] Error when attempting to add items ->', { error });
  }
});
