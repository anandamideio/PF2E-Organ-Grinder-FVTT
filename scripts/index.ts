import { getRandomItemFromCompendiumWithPrefix } from './util.js';

// @ts-ignore
Hooks.once('init', () => {
  // @ts-ignore
  game.settings.register("pf2e-organ-grinder", 'randomizeAmount', {
    name: "Randomize the amount",
    hint: "Randomize the amount of organs on each monster. (If you turn this off, all monsters will have only one addition.))",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  // @ts-ignore
  game.settings.register("pf2e-organ-grinder", 'maxItemLevel', {
    name: "Max Item Level",
    hint: "How many levels above the creature's level should we generate from? (If you set this to 0, the MAX item level will always be the same level as the creature itself.)",
    scope: "world",
    config: true,
    type: Number,
    default: 2
  });

  // @ts-ignore
  game.settings.register("pf2e-organ-grinder", 'debugMode', {
    name: "Debug Mode",
    hint: "Enable debug mode. (This will log a lot of information to the console.)",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });
});

// Per mxzf#5874's (Discord) advice (Thank you!!), we are using the createToken hook to add items to the actor
// @ts-ignore
Hooks.on("createToken", async(token, data) => { // @ts-ignore
  const DEBUG = game.settings.get("pf2e-organ-grinder", "debugMode"); // @ts-ignore
  const maxItemLevel = game.settings.get("pf2e-organ-grinder", "maxItemLevel");
  if (DEBUG) console.debug('[ORGAN GRINDER::createActor] ->', { token, data })

  try {
    const actor = token.actor;
    if (!actor || actor.type !== 'npc') return;

    const traits = actor.system.traits.value as string[];
    if (!traits || Array.isArray(traits) === false || traits.length === 0) return;

    const creatureSize = actor.data.data.traits.size.value;
    const creatureLevel = actor.system.details.level.value as number;

    const item = await getRandomItemFromCompendiumWithPrefix(
      'beast-parts',
      'Serpentfolk',
      creatureLevel + maxItemLevel,
    );

    if (!item){
      if (DEBUG) {
        console.error('[ORGAN GRINDER::createActor] -> No item found here\'s what we have for that compendium', { // @ts-ignore
          items: game.packs.get(`pf2e-organ-grinder.beast-parts`)
        });
      }
    }

    actor.createEmbeddedDocuments('Item', [item]);
  } catch (error) {
    console.error('[ORGAN GRINDER] Error when attempting to add items ->', { error })
  }
});
