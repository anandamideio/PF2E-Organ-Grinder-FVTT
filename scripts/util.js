async function getItemFromCompendium(packName, itemName) {
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
