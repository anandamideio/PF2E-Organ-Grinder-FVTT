import Item from '../types/item.js';

export async function getItemFromCompendium(packName, itemName) {
  const pack = game.packs.get(packName);
  console.log('😊 ORGAN GRINDER 😊', { pack, itemName });
  if (!pack) return null;

  const itemIndex = await pack.getIndex();
  console.log('😊 ORGAN GRINDER 😊', { itemIndex });
  const itemEntry = itemIndex.find(e => e.name === itemName);
  console.log('😊 ORGAN GRINDER 😊', { itemEntry });
  if (itemEntry) {
    const item = await pack.getDocument(itemEntry._id);
    console.log('😊 ORGAN GRINDER 😊', { item });
    return item;
  }
  return null;
}

export function randomizeAmountOfOrgans() {
  return game.settings.get("pf2e-organ-grinder", "randomizeAmount");
}

type TreasureStats = Item<'treasure'>['system'];
type TreasureValue = TreasureStats['price']['value'];
type TreasureSize = TreasureStats['size'];
type TreasureRarity = TreasureStats['traits']['rarity'];

export function generateTreasure({ img, name, desc, value, quantity, size, rarity }: { img: string, name: string, desc: string, value: TreasureValue, quantity: number, size: TreasureSize, rarity: TreasureRarity }): Item<'treasure'> {
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
