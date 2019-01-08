// Maybe change this to have arbitrary keys? so we can infinitely expand, so
// `[key: number]: InventoryItem`

interface InventoryItem {
    id: number,
    internalName: string,
    displayName: string,
    image: HTMLImageElement,
}

interface NumberKeyPresses {
    [key: number]: boolean
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
    patient: LevelPatient,
    dialogue: Array<DialogueLine>,
    endDialogue: Array<DialogueLine>,
    berthas: Array<LevelBertha>,
    Fires: Array<LevelFire>,
    FallingTiles: Array<LevelFallingTile>,
    Accelerators: Array<LevelAccelerator>,
    Trampolines: Array<LevelTrampoline>,
    items: Array<LevelItem>,
    Collisions: Array<LevelCollision>,
    door: LevelDoor
}

interface LevelPlayer {
    sprites: Array<string>,
    location: LevelLocations,
    size: LevelSize,
    gravity: number,
    maxJumps: number,
    jumpHeight: number
}

interface LevelPatient {
    sprites: Array<string>,
    size: LevelSize
}

interface DialogueLine {
    who: "player" | "patient",
    what: string
}

interface LevelBertha {
    sprites: Array<string>,
    location: LevelLocations,
    size: LevelSize,
    gravity: number
}
interface LevelFire {
    sprites: Array<string>,
    location: LevelLocations,
    rotation: number,
    size: LevelSize
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
    size: LevelSize,
    shouldDraw?: boolean
}

interface LevelItem {
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

interface LevelDoor {
    topLeft: LevelLocations,
    bottomRight: LevelLocations
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