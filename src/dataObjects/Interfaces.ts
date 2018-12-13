// Maybe change this to have arbitrary keys? so we can infinitely expand, so
// `[key: number]: InventoryItem`

interface InventoryItem {
    id: number,
    name: string,
}

interface Level {
    player: LevelPlayer,
    FallingTiles: Array<LevelFallingTile>,
    Accelerators: Array<LevelAccelerator>,
    items: Array<LevelItem>,
    floors: Array<LevelFloor>
}

interface LevelPlayer {
    sprites: Array<string>,
    location: LevelLocations,
    size: LevelSize,
    gravity: number
}

interface LevelFallingTile {
    sprites: Array<string>,
    location: LevelLocations,
    rotation: number,
    size: LevelSize
}

interface LevelAccelerator {
    sprites: Array<string>,
    location: LevelLocations,
    rotation: number,
    size: LevelSize
}

interface LevelItem {
    sprite: string,
    location: LevelLocations,
    rotation: number,
    size: LevelSize,
    name: string
}

interface LevelFloor {
    sprite: string,
    location: LevelLocations,
    rotation: number,
    size: LevelSize
}

interface LevelLocations {
    x: LevelLocation,
    y: LevelLocation
}

interface LevelLocation {
    center: boolean,
    offset: number
}

interface LevelSize {
    x: number,
    y: number
}