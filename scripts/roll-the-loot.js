Hooks.on("updateActor", async (actor, update, diff, user) => {
    if (actor.type !== "npc" || actor.getFlag("core", "sheetClass") === 'dnd5e.LootSheet5eNPC' || update.system.attributes.hp.value > 0)
        return;
    rollForLoot(actor);
    return true;
});

function rollForLoot(actor) {
    const actorName = actor.prototypeToken.name;
    const lootTable = game.tables.find(t => t.name === actorName);
    lootTable.draw({displayChat: false}).then(
        handleRolledItems.bind(null, actor),
        (error) => {console.error(error)}
    );   
}

function handleRolledItems(actor, roll) {
    const rolledDocumentIds = roll.results.map(element => element.documentId);
    const rolledItems = rolledDocumentIds.map(documentId => game.items.find(item => item._id == documentId));
    rolledItems.forEach(rolledItem => {
        actor.items.set(rolledItem._id, rolledItem);
    });
    actor.setFlag("core", "sheetClass", "dnd5e.LootSheet5eNPC").then(
        null,
        (error) => {console.error(error)}
    );
}
