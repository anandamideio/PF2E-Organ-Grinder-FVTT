import { serpentfolkItems } from './data/serpentfolk.js';
import { getItemFromCompendium } from './util.js';

Hooks.once('init', () => {
  game.settings.register("pf2e-organ-grinder", true, {
    name: "Randomize the amount",
    hint: "Randomize the amount of organs on each monster. (If you turn this off, all monsters will have only one addition.))",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  })
});

Hooks.on("preCreateActor", (actor, data) => {
  if (actor.type === "npc") {
    if (actor.system.traits.value && Array.isArray(actor.system.traits.value) && actor.system.traits.value.length > 0) {
      console.log('[😊 ORGAN GRINDER 😊::preCreateActor] ->', { actor, data });
      const traits = actor.system.traits.value;
      const creatureSize = actor.data.data.traits.size.value;

      if (traits.includes('serpentfolk')) {
        const item = serpentfolkItems(creatureSize)[Math.floor(Math.random() * serpentfolkItems.length)];

        // Thank you to Idle#3251 on Discord for helping me understand how to add items
        actor._source.items.push(item);
      }
    }
  }
});

// It looks like for complex items (And potentially other things) we need to use the createActor hook and an async
// call to read the compendium as per mxzf#5874's (Discord) advice
Hooks.on("createActor", async(actor, data) => {
  try {
    if (actor.type === "npc") {
      if (actor.system.traits.value && Array.isArray(actor.system.traits.value) && actor.system.traits.value.length > 0) {
        console.log('[😊 ORGAN GRINDER 😊::createActor] ->', { actor, data });
  
        const compendiumData = await getItemFromCompendium('beast-parts', 'serpentfolk-scales');
        if (!compendiumData) console.error('[😊 ORGAN GRINDER 😊::createActor] -> No compendium item found here\'s what we have for that compendium', { compendiumData: game.packs.get('beast-parts') });
        console.log('[😊 ORGAN GRINDER 😊::createActor] ->', { compendiumData });
      }
    }
  } catch (error) {
    console.error('[😊 ORGAN GRINDER 😊::createActor] ->', { error })
  }
});