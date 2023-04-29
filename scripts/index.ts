import { getRandomItemFromCompendiumWithPrefix } from './util.js';

// @ts-ignore
Hooks.once('init', () => {
  // @ts-ignore
  game.settings.register("pf2e-organ-grinder", true, {
    name: "Randomize the amount",
    hint: "Randomize the amount of organs on each monster. (If you turn this off, all monsters will have only one addition.))",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  })
  // @ts-ignore
  game.settings.register("pf2e-organ-grinder", false, {
    name: "Debug Mode",
    hint: "Enable debug mode. (This will log a lot of information to the console.)",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  })
});

// // @ts-ignore
// Hooks.on("preCreateActor", (actor, data) => {
//   if (actor.type === "npc") {
//     if (actor.system.traits.value && Array.isArray(actor.system.traits.value) && actor.system.traits.value.length > 0) {
//       console.log('[😊 ORGAN GRINDER 😊::preCreateActor] ->', { actor, data });
//       const traits = actor.system.traits.value;
//       const creatureSize = actor.data.data.traits.size.value;

//       if (traits.includes('serpentfolk')) {
//         const item = serpentfolkItems(creatureSize)[Math.floor(Math.random() * serpentfolkItems.length)];

//         // Thank you to Idle#3251 on Discord for helping me understand how to add items
//         actor._source.items.push(item);
//       }
//     }
//   }
// });

// It looks like for complex items (And potentially other things) we need to use the createActor hook and an async
// call to read the compendium as per mxzf#5874's (Discord) advice, also again their advice in regards to the correct hook
// @ts-ignore
Hooks.on("createTokenDocument", async(token, data) => {
  try {
    const actor = token.actor;
    console.log('[ORGAN GRINDER::createActor] ->', { token, data })
    if (actor.type === "npc") {
      if (actor.system.traits.value && Array.isArray(actor.system.traits.value) && actor.system.traits.value.length > 0) {
        const traits = actor.system.traits.value;
        const creatureSize = actor.data.data.traits.size.value;
        const creatureLevel = actor.system.details.level.value;
        console.log('[ORGAN GRINDER::createActor] ->', { actor, data, creatureLevel });
  
        const item = await getRandomItemFromCompendiumWithPrefix('beast-parts', 'Serpentfolk', creatureLevel);
        // @ts-ignore
        if (!item) console.error('[😊 ORGAN GRINDER 😊::createActor] -> No item found here\'s what we have for that compendium', { items: game.packs.get(`pf2e-organ-grinder.beast-parts`) });
        console.log('[😊 ORGAN GRINDER 😊::createActor] ->', { item });
        actor.createEmbeddedDocuments('Item', [item])
      }
    }
  } catch (error) {
    console.error('[ORGAN GRINDER] Error when attempting to add items ->', { error })
  }
});
