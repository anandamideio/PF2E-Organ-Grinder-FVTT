import { range, getRandomItemFromCompendiumWithPrefix, getSizeModifier, capitalize, } from './util.js';
import { monsters } from './data/monsters.js';
// @ts-ignore
const debouncedReload = foundry.utils.debounce(() => window.location.reload(), 100);
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
    const DEBUG = game.settings.get('pf2e-organ-grinder', 'debugMode'); // @ts-ignore
    const maxItemLevel = game.settings.get('pf2e-organ-grinder', 'maxItemLevel'); // @ts-ignore
    const randomizeAmount = game.settings.get('pf2e-organ-grinder', 'randomizeAmount');
    if (DEBUG)
        console.debug('[ORGAN GRINDER::createTokenHook] ->', { token, data });
    try {
        const { actor } = token;
        if (!actor || actor.type !== 'npc')
            return;
        const traits = actor.system.traits.value;
        if (!traits || Array.isArray(traits) === false || traits.length === 0)
            return;
        const creatureName = actor.name;
        const creatureSize = actor.data.data.traits.size.value;
        const creatureLevel = actor.system.details.level.value;
        const totalItems = randomizeAmount
            ? Math.floor((getSizeModifier(creatureSize) * creatureLevel) * 0.4)
            : 1;
        const additionalTraits = monsters.find((monster) => monster.name === creatureName)?.additionalTraits;
        const creatureTraits = (Array.isArray(additionalTraits)) ? [...traits, ...additionalTraits] : traits;
        if (DEBUG) {
            console.debug('[ORGAN GRINDER::createToken] ->', {
                creatureName,
                creatureSize,
                creatureLevel,
                creatureTraits,
                totalItems,
            });
        }
        // Lets add total items to the actor
        await Promise.all([...range(0, totalItems)].map(async () => {
            const trait = capitalize(creatureTraits[Math.floor(Math.random() * creatureTraits.length)]);
            const item = await getRandomItemFromCompendiumWithPrefix('beast-parts', trait, creatureLevel + maxItemLevel);
            if (!item) {
                if (DEBUG) {
                    console.error('[ORGAN GRINDER::addingItem] -> No item found with that prefix here\'s what we have for that compendium', {
                        // @ts-ignore
                        items: game.packs.get('pf2e-organ-grinder.beast-parts'),
                        prefix: trait,
                    });
                }
                return;
            }
            if (DEBUG)
                console.debug('[ORGAN GRINDER::addedItem] ->', { item });
            actor.createEmbeddedDocuments('Item', [item]);
        }));
    }
    catch (error) {
        console.error('[ORGAN GRINDER] Error when attempting to add items ->', { error });
    }
});
