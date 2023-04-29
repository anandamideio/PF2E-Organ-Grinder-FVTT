import { generateTreasure, randomizeAmount } from '../util.js';
export const serpentfolkItems = (creatureSize, shouldRandomize = true) => [
    generateTreasure({
        img: 'systems/pf2e/icons/equipment/consumables/other-consumables/bubbling-scale.webp',
        name: 'Serpentfolk Scales',
        desc: 'The scales of a lizardfolk are a marvel to behold, with their rough texture and vibrant hues. These scales can be harvested from the beast\'s hide, and while they may be of little value to some, to the discerning eye, they hold endless possibilities. They can be fashioned into a shield, a set of armor, or even a hat if one were so inclined. And if the stars align just right, they could even grant you the ability to breathe underwater or turn invisible, or maybe that\'s just for the lizardfolk themselves. One must tread carefully when dealing with such precious resources, for the lizardfolk are not known to take kindly to those who seek to plunder their hides. So, approach with caution and always keep your wits about you, lest you find yourself on the wrong end of a reptilian rage.',
        value: { gp: 2 },
        quantity: shouldRandomize ? randomizeAmount(creatureSize, 'med', 10) : 1,
        size: 'sml',
        rarity: 'uncommon'
    }),
];
