// Maybe change this to have arbitrary keys? so we can infinitely expand, so
// `[key: number]: InventoryItem`
interface Inventory {
    items: Array<InventoryItem>,
}

interface InventoryItem {
    id: number,
    name: string,
}
