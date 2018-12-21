// Maybe change this to have arbitrary keys? so we can infinitely expand, so
// `[key: number]: InventoryItem`

interface InventoryItem {
    id: number,
    name: string,
}

interface ItemDefinition {
    internalName: string,
    displayName: string,
    spriteSrc: string,
}

interface CollisionDirections {
    left: boolean,
    right: boolean,
    top: boolean,
    bottom: boolean
}

interface Level {
    background: string,
    backgroundMusic: string,
    player: LevelPlayer,
    berthas: Array<LevelBertha>,
    FallingTiles: Array<LevelFallingTile>,
    Accelerators: Array<LevelAccelerator>,
    Trampolines: Array<LevelTrampoline>,
    items: Array<LevelItem>,
    Collisions: Array<LevelCollision>
}

interface LevelPlayer {
    sprites: Array<string>,
    location: LevelLocations,
    size: LevelSize,
    gravity: number,
    maxJumps: number,
    jumpHeight: number
}

interface LevelBertha {
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
    size: LevelSize,
    yeet: number
}

interface LevelTrampoline {
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

interface LevelCollision {
    topLeft: LevelLocations,
    bottomRight: LevelLocations,
    rotation: number
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