import Item, { ItemSizes } from '../types/item.js';

export type CreatureSizes = 'tiny' | 'sm' | 'medium' | 'lg' | 'huge' | 'grg';

export async function getItemFromCompendium(packName: 'beast-parts' | string, itemName: string) {
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

export async function getRandomItemFromCompendiumWithPrefix(packName: 'beast-parts' | string, prefix: string, maxItemLevel = 10) {
  // @ts-ignore
  const DEBUG = game.settings.get('pf2e-organ-grinder', 'debugMode'); // @ts-ignore
  const pack = game.packs.get(`pf2e-organ-grinder.${packName}`);
  if (!pack) return null;

  const itemIndex = await pack.getIndex();
  const itemEntries = itemIndex.filter((e: { name: string }) => e.name.startsWith(prefix));

  if (itemEntries.length === 0) return null;

  type ItemWithLevel = Item & { system: { details: { level: { value: number } } } };

  const chooseItem = async (maxLevel: number): Promise<ItemWithLevel | null> => {
    try {
      const item = await pack.getDocument(itemEntries[Math.floor(Math.random() * itemEntries.length)]._id) as ItemWithLevel;
      if (!item) return null;
      if (DEBUG) console.debug('[😊 ORGAN GRINDER 😊::getRandomItemFromCompendiumWithPrefix:::chooseItem]', { item });
      if (item.system.level.value > maxLevel) {
        if (DEBUG) {
          console.debug('[😊 ORGAN GRINDER 😊::getRandomItemFromCompendiumWithPrefix:::chooseItem] ->', {
            maxLevel, itemLevel: item.system.level.value,
          });
        }
        return await chooseItem(maxLevel);
      }
      return item;
    } catch (error) {
      console.error('[😊 ORGAN GRINDER 😊::getRandomItemFromCompendiumWithPrefix] ->', { error });
      throw error;
    }
  };

  if (itemEntries) return chooseItem(maxItemLevel);
  return null;
}

export function getSizeModifier(size: CreatureSizes | ItemSizes) {
  const sizes = {
    tiny: 0.25, sm: 0.5, med: 1, medium: 1, lg: 2, huge: 4, grg: 8,
  };
  return sizes[size];
}

export const randomizeAmount = (creatureSize: CreatureSizes, itemSize: ItemSizes, max?: number) => {
  const sizeModifier = getSizeModifier(creatureSize) / getSizeModifier(itemSize);
  const maxAmount = max || 1;
  const randomAmount = Math.floor(Math.random() * maxAmount) + 1;
  const amount = Math.floor(randomAmount * sizeModifier);
  return amount;
};

export function* range(start: number, end: number):Generator<number> {
  // eslint-disable-next-line no-plusplus
  for (let i: number = start; i <= end; i++) {
    yield i;
  }
}

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
