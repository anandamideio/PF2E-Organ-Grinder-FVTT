

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
  console.log('ORGAN GRINDER :D', { actor });
});
