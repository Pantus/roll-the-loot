Hooks.on("updateActor", async (actor, update, diff, user) => {
    const currentHp = getProperty(update, 'system.attributes.hp.value');
    if (actor.type !== "npc" || actor.sheet.id.startsWith('LootSheet5eNPC') || currentHp === undefined || currentHp > 0)
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
    if (rolledItems.length === 0 || rolledItems[0] === undefined) {
        return;
    }
    actor.items.clear();
    rolledItems.forEach(rolledItem => {
        if(rolledItem !== undefined) {
            actor.items.set(rolledItem._id, rolledItem);
        }
    });
    actor.setFlag("core", "sheetClass", "dnd5e.LootSheet5eNPC").then(
        (ret) => console.debug("Sheet Class succesfully set to: " + ret.getFlag("core", "sheetClass")),
        (error) => {console.error(error)}
    );
}
