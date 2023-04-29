import Item, { ItemSizes } from '../types/item.js';

export type CreatureSizes = 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'grg';

export async function getItemFromCompendium(packName: 'beast-parts'|string, itemName: string) {
  // @ts-ignore
  const pack = game.packs.get(`pf2e-organ-grinder.${packName}`);
  if (!pack) return null;

  const itemIndex = await pack.getIndex();
  const itemEntry = itemIndex.find((e: { name: string }) => e.name === itemName);

  if (itemEntry) {
    const item = await pack.getDocument(itemEntry._id);
    console.log('😊 ORGAN GRINDER 😊', { item });
    return item;
  }
  return null;
}

export async function getRandomItemFromCompendiumWithPrefix(packName: 'beast-parts'|string, prefix: string, maxItemLevel = 10) {
  // @ts-ignore
  const pack = game.packs.get(`pf2e-organ-grinder.${packName}`);
  if (!pack) return null;

  const itemIndex = await pack.getIndex();
  const itemEntries = itemIndex.filter((e: { name: string }) => e.name.startsWith(prefix));

  const chooseItem = async(maxLevel: number): Promise<Item & { system: { details: { level: { value: number } } } }> => {
    try {
      const item = await pack.getDocument(itemEntries[Math.floor(Math.random() * itemEntries.length)]._id) as Item & { system: { details: { level: { value: number } } } };
      console.log('😊 ORGAN GRINDER 😊', { item });
      if (item.system.level.value > maxLevel) return chooseItem(maxLevel);
      return item;
    } catch (error) {
      console.error('[😊 ORGAN GRINDER 😊::getRandomItemFromCompendiumWithPrefix] ->', { error })
      throw error;
    }
  }

  if (itemEntries) return chooseItem(maxItemLevel);
  return null;
}

// export function randomizeAmountOfOrgans() {
//   return game.settings.get("pf2e-organ-grinder", "randomizeAmount");
// }

type TreasureStats = Item<'treasure'>['system'];
type TreasureValue = TreasureStats['price']['value'];
type TreasureRarity = TreasureStats['traits']['rarity'];

export function generateTreasure({ img, name, desc, value, quantity, size, rarity }: { img: string, name: string, desc: string, value: TreasureValue, quantity: number, size: ItemSizes, rarity: TreasureRarity }): Item<'treasure'> {
  return {
    "img": img,
    "name": name,
    "system": {
      "baseItem": null,
      "containerId": null,
      "description": {
        "value": desc
      },
      "equippedBulk": {
        "value": ""
      },
      "hardness": 0,
      "hp": {
        "brokenThreshold": 0,
        "max": 0,
        "value": 0
      },
      "level": {
        "value": 0
      },
      "negateBulk": {
        "value": "0"
      },
      "preciousMaterial": {
        "value": ""
      },
      "preciousMaterialGrade": {
        "value": ""
      },
      "price": {
        "value": value,
      },
      "quantity": quantity,
      "rules": [],
      "size": size,
      "source": {
        "value": "PF2E Organ Grinder"
      },
      "stackGroup": null,
      "traits": {
        "rarity": rarity,
        "value": []
      },
      "usage": {
        "value": ""
      },
      "weight": {
        "value": "-"
      }
    },
    "type": "treasure"
  }
}

export const randomizeAmount = (creatureSize: CreatureSizes, itemSize: ItemSizes, max?: number) => {
  const sizes = {
    'tiny': 0.25,
    'small': 0.5,
    'sm': 0.5,
    'med': 1,
    'medium': 1,
    'large': 2,
    'lg': 2,
    'huge': 4,
    'grg': 8,
  }
  const sizeModifier = sizes[creatureSize] / sizes[itemSize];
  const maxAmount = max ? max : 1;
  const randomAmount = Math.floor(Math.random() * maxAmount) + 1;
  const amount = Math.floor(randomAmount * sizeModifier);
  return amount;
}
