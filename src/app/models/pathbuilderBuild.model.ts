export interface Attributes {
    ancestryhp: number;
    classhp: number;
    bonushp: number;
    bonushpPerLevel: number;
    speed: number;
}

export interface Abilities {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
}

export interface Proficiencies {
    classDC: number;
    perception: number;
    fortitude: number;
    reflex: number;
    will: number;
    heavy: number;
    medium: number;
    light: number;
    unarmored: number;
    advanced: number;
    martial: number;
    simple: number;
    unarmed: number;
    castingArcane: number;
    castingDivine: number;
    castingOccult: number;
    castingPrimal: number;
    acrobatics: number;
    arcana: number;
    athletics: number;
    crafting: number;
    deception: number;
    diplomacy: number;
    intimidation: number;
    medicine: number;
    nature: number;
    occultism: number;
    performance: number;
    religion: number;
    society: number;
    stealth: number;
    survival: number;
    thievery: number;
}

export interface SpecificProficiencies {
    trained: string[];
    expert: any[];
    master: any[];
    legendary: any[];
}

export interface Weapon {
    name: string;
    qty: number;
    prof: string;
    die: string;
    pot: number;
    str: string;
    display: string;
    runes: any[];
}

export interface Money {
    pp: number;
    gp: number;
    sp: number;
    cp: number;
}

export interface Armor {
    name: string;
    qty: number;
    prof: string;
    pot: number;
    res: string;
    display: string;
    worn: boolean;
    runes: any[];
    ac: number;
}

export interface Spell {
    spellLevel: number;
    list: string[];
}

export interface SpellCaster {
    name: string;
    magicTradition: string;
    spellcastingType: string;
    ability: string;
    proficiency: number;
    focusPoints: number;
    spells: Spell[];
    perDay: number[];
}

export interface Build {
    name: string;
    class: string;
    level: number;
    ancestry: string;
    heritage: string;
    background: string;
    alignment: string;
    gender: string;
    age: string;
    deity: string;
    size: number;
    keyability: string;
    languages: any[];
    attributes: Attributes;
    abilities: Abilities;
    proficiencies: Proficiencies;
    feats: string[][];
    specials: string[];
    lores: any[][];
    equipment: any[];
    specificProficiencies: SpecificProficiencies;
    weapons: Weapon[];
    money: Money;
    armor: Armor[];
    spellCasters: SpellCaster[];
    formula: any[];
    pets: any[];
}

export interface PathbuilderBuild {
    success: boolean;
    build: Build;
}

