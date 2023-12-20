Hooks.on("updateActor", async (actor, update, diff, user) => {
    const currentHp = getProperty(update, 'system.attributes.hp.value');
    if (actor.type !== "npc" || actor.sheet.id.startsWith('LootSheet5eNPC') || currentHp === undefined || currentHp > 0) {
        return;
    }        
    const actorName = actor.prototypeToken.name
    await game.itempiles.API.rollItemTable(actorName, {
        timesToRoll: "1",
        targetActor: actor,
        removeExistingActorItems: true
    });
    let token = actor.token
    await game.itempiles.API.turnTokensIntoItemPiles(token);
    return true;
});