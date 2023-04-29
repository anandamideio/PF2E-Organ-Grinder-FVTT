

Hooks.once('init', () => {
  game.settings.register("pf2e-organ-grinder", true, {
    name: "Randomize the amount",
    hint: "Randomize the amount of organs on each monster.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  })
});

Hooks.on("preCreateActor", (actor, data, options, id) => {
  const makeLootable = { flags: { pf2e: { lootable: { value: true } } } };

  if (actor.type === "npc") {
    if (actor.system.traits.value && Array.isArray(actor.system.traits.value) && actor.system.traits.value.length > 0) {
      console.log('😊 ORGAN GRINDER 😊', { actor, data });
      const traits = actor.system.traits.value;

      if (traits.includes('serpentfolk')) {
        actor._source.items.push({
          "img": "systems/pf2e/icons/equipment/consumables/other-consumables/bubbling-scale.webp",
          "name": "Serpentfolk Scales",
          "system": {
            "baseItem": null,
            "containerId": null,
            "description": {
              "value": "The scales of a lizardfolk are a marvel to behold, with their rough texture and vibrant hues. These scales can be harvested from the beast's hide, and while they may be of little value to some, to the discerning eye, they hold endless possibilities. They can be fashioned into a shield, a set of armor, or even a hat if one were so inclined. And if the stars align just right, they could even grant you the ability to breathe underwater or turn invisible, or maybe that's just for the lizardfolk themselves. One must tread carefully when dealing with such precious resources, for the lizardfolk are not known to take kindly to those who seek to plunder their hides. So, approach with caution and always keep your wits about you, lest you find yourself on the wrong end of a reptilian rage."
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
              "value": {
                "gp": 2
              }
            },
            "quantity": 1,
            "rules": [],
            "size": "med",
            "source": {
              "value": "PF2E Organ Grinder"
            },
            "stackGroup": null,
            "traits": {
              "rarity": "uncommon",
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
        });
      }
    }
  }
});
