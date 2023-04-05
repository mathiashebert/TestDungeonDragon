document.addEventListener('DOMContentLoaded', function() {
    recalculerAventure();
    dessinerPosition();
    choisirPosition("position-1");

}, false);

interface Drag {
    element : HTMLElement;
    drag_offset_x: number;
    drag_offset_y: number;
    time: number;
}

interface ResultatCombat {
    message: string;
    hero: Hero;
    caracteristiqueHero: Caracteristique,
    caracteristiqueEnnemi: Caracteristique
}

interface Position {
    id: string;
    message: string;
    combat: string[]; //ce qui est choisi par l'utilisateur
    mouvements: Mouvement[], // rendu calculé
    charmes: Charme[], // rendu calculé
    resultat: ResultatCombat;
    success: boolean;
    inventaire: Inventaire;
    tresor: Inventaire;
    ennemi: Ennemi;
    presentation: string,
    preparations: Preparation[],
    objets: Objet[],
}

enum StatusPreparation {
    preparation_ok,
    preparation_ko
}
enum TypePreparation {
    potion = "potion",
    rune = "rune"
}
interface Preparation {
    id: string;
    type: TypePreparation;
    cible: string;
    status: StatusPreparation;
}

interface Ennemi {
    nom: string;
    attaque: number;
    defense: number;
    vitesse: number;

    ethere: boolean;
}

enum StatusObjet {
    objet_ok,
    objet_ko
}
enum TypeObjet {
    arme = "arme",
    livre = "livre",
    parchemin = "parchemin"
}
interface Objet {
    id: string;
    mouvements: string[];
    niveau: number;
    type: TypeObjet;
    status: StatusObjet;
    details: string;
}

enum StatusMouvement {
    mouvement_ok,
    mouvement_ko
}
enum TypeMouvement {
    technique,
    sort,
    incantation,
    jeter,
    frapper,
    bloquer
}

interface Caracteristique {
    attaqueDistance: number,
    attaque: number,
    defense: number,
    mana: number,
    vitesse: number,
    initiative: number,

    sournois: boolean,
}

interface Valeur {
    id: string;
    status: StatusMouvement;

    attaque: number;
    defense: number;
    mana: number;
    vitesse: number;

    distance: boolean;
    feu: boolean;
    glace: boolean;
}
interface Mouvement extends Valeur {
    type: TypeMouvement;
    objet: string;
}

interface Charme extends Valeur {
    duree: number;
}

interface Inventaire {
    objets: Objet[];
    nbRunes: number;
    nbPotions: number;
}

interface Hero {
    force: number;
    endurance: number;
    vitesse: number;
    mana: number;
}

class _Position implements Position {
    combat: string[] = [];
    ennemi: Ennemi;
    id: string;
    inventaire: Inventaire = null;
    message: string = "";
    mouvements: Mouvement[] = [];
    charmes: Charme[] = [];
    resultat: ResultatCombat = {
        message: "",
        hero: {force: 1, endurance: 1, vitesse: 1, mana: 1},
        caracteristiqueHero: {attaqueDistance: 0, attaque: 0, defense: 0, mana: 0, vitesse: 0, initiative: 0, sournois: false},
        caracteristiqueEnnemi: {attaqueDistance: 0, attaque: 0, defense: 0, mana: 0, vitesse: 0, initiative: 0, sournois: false}
    };
    success: boolean = false;
    tresor: Inventaire;
    presentation: string;
    preparations = [];
    objets = [];

    constructor(id: string) {
        this.id = id;
    }

}

class _Mouvement implements Mouvement {
    attaque: number = 0;
    defense: number = 0;
    distance: boolean = false;
    feu: boolean = false;
    glace: boolean = false;
    id: string;
    mana: number = 0;
    objet: string;
    type: TypeMouvement;
    vitesse: number = 0;
    status: StatusMouvement = StatusMouvement.mouvement_ok;

    constructor(id: string, type: TypeMouvement, objet: string) {
        this.id = id;
        this.type = type;
        this.objet = objet;

        if(type === TypeMouvement.jeter || type === TypeMouvement.sort || type === TypeMouvement.incantation) {
            this.distance = true;
        }
    }

}

class _Objet implements Objet {
    id: string;
    mouvements: string[];
    niveau: number = 1;
    status: StatusObjet = StatusObjet.objet_ok;
    type: TypeObjet;
    details: "";

    constructor(id: string, type: TypeObjet) {
        this.id = id;
        this.type = type;
    }

}


let DRAG : Drag = {
    drag_offset_x: 0,
    drag_offset_y: 0,
    element: undefined,
    time: 0,
}

const OBJETS: Objet[] = [
    {
        ... new _Objet("epee", TypeObjet.arme),
        mouvements: ["epee_frapper"],
        details: "L'EPEE" +
            "<p>L'épée est l'arme classique pour le corps à corps.</p>" +
            "<p>Elle apporte une attaque de 1, majorée par la force du héro. Elle apporte une défense de 1, majorée par la résistance du héro. Chaque rune ajoute également 1 à l'attaque et à la défense."
    },
    {
        ... new _Objet("lance", TypeObjet.arme),
        mouvements: ["lance_frapper", "lance_jeter"],
        details: "LA LANCE" +
            "<p>La lance est une arme offensive efficace.</p>" +
            "<p>Lorsqu'elle est jetée, elle apporte une attaque de 2, majorée par la force du héro, mais n'apporte pas de défense. Chaque rune ajoute encore 2 à l'attaque.</p>" +
            "<p>Si vous frappez au corps à corps, elle apporte une attaque de 2 majorée par la force du héro, et une défense égale à la resistance du héro. Chaque rune ajoute encore 2 à l'attaque (mais rien à la défense)."
    },
    {
        ... new _Objet("bouclier", TypeObjet.arme),
        id: "bouclier",
        mouvements: ["bouclier_bloquer"],
        details: "LE BOUCLIER" +
            "<p>Le bouclier est une arme défensive.</p>" +
            "<p> Il permet de bloquer. Il apporte une défense de 2, majorée par la resistance du héro. Chaque rune ajoute encore 2 à la défense.</p>"
    },
    {
        ... new _Objet("dagueRunique", TypeObjet.arme),
        niveau: 2,
        mouvements: ["dagueRunique_jeter", "dagueRunique_frapper"],
        details: "LA DAGUE RUNIQUE" +
            "<p>La dague runique possède déjà une rune.</p>" +
            "<p>Quand on la jette, elle apporte une attaque de 2, majorée par la force du héro. Chaque rune supplémentaire augmente de 1 l'attaque.</p>" +
            "<p>Quand vous frappez au coprs à corps, elle apporte une attaque de 2, majorée par la force du héro, et une défense égale à la défense du héro. Chaque rune supplémentaire augmente de 1 l'attaque au corps à corps également."
    },
    {
        ... new _Objet("hacheDeGlace", TypeObjet.arme),
        niveau: 1,
        mouvements: ["hacheDeGlace_jeter", "hacheDeGlace_bloquer"],
        details: "LA HACHE DE GLACE" +
            "<p>La hache de glace est une arme magique.</p>" +
            "<p>Elle peut être jetée, dans ce cas elle apporte une attaque de 1 majorée par la force du héro, et chaque rune ajoute encore 1 à l'attaque.</p>" +
            "<p>La hache de glace peut également être utilisée au corps à corps, dans ce cas elle apporte une attaque égale à la force du héro, et une défense égale à la resistance du héro. Les runes n'améliorent pas son utilisation au corps à corps.</p>" +
            "<p>De plus, la valeur de l'attaque (et la défense aussi, pour le corps à corps) diminue d'autant l'attaque de l'ennemi. Si l'attaque de l'ennemi est réduite à 0 (ou moins), l'ennemi est éliminé.</p>"
    },
    {
        ... new _Objet("bouclierDeGlace", TypeObjet.arme),
        niveau: 1,
        mouvements: ["bouclierDeGlace_bloquer"],
        details: "LE BOUCLIER DE GLACE" +
            "<p>Le bouclier de glace est un bouclier magique exceptionnel.</p>" +
            "<p>Il apporte une défense de 2 majorée par la resistance du héro, et chaque rune ajoute encore 2 à la défense.</p>" +
            "<p>De plus, la valeur de la défense diminue d'autant l'attaque de l'ennemi. Si l'attaque de l'ennemi est réduite à 0 (ou moins), l'ennemi est éliminé.</p>"
    },
    {
        ... new _Objet("hacheDeFeu", TypeObjet.arme),
        niveau: 1,
        mouvements: ["hacheDeFeu_jeter", "hacheDeFeu_bloquer"],
        details: "LA HACHE DE FEU" +
            "<p>La hache de feu est une arme magique.</p>" +
            "<p>Elle peut être jetée, dans ce cas elle apporte une attaque de 1 majorée par la force du héro, et chaque rune ajoute encore 1 à l'attaque.</p>" +
            "<p>La hache de feu peut également être utilisée au corps à corps, dans ce cas elle apporte une attaque égale à la force du héro, et une défense égale à la resistance du héro. Les runes n'améliorent pas son utilisation au corps à corps.</p>" +
            "<p>De plus, la valeur de l'attaque (et la défense aussi, pour le corps à corps) diminue d'autant la défense de l'ennemi. Si la défense de l'ennemi est réduite à 0 (ou moins), l'ennemi est éliminé.</p>"
    },
    {
        ... new _Objet("bouclierDeFeu", TypeObjet.arme),
        niveau: 1,
        mouvements: ["bouclierDeFeu_bloquer"],
        details: "LE BOUCLIER DE FEU" +
            "<p>Le bouclier de feu est un bouclier magique exceptionnel.</p>" +
            "<p>Il apporte une défense de 2 majorée par la resistance du héro, et chaque rune ajoute encore 2 à la défense.</p>" +
            "<p>De plus, la valeur de la défense diminue d'autant la défense de l'ennemi. Si la défense de l'ennemi est réduite à 0 (ou moins), l'ennemi est éliminé.</p>"
    },
    {
        ... new _Objet("javelot", TypeObjet.arme),
        niveau: 1,
        mouvements: ["javelot_jeter"],
        details: "LE JAVELOT" +
            "<p>Le javelot est une arme de jet.</p>" +
            "<p>Quand il est jeté, il apporte une attaque de 3, majorée par la force du héro, et chaque rune ajoute encore 3 à l'attaque.</p>"
    },

    {
        ... new _Objet("manuelAventurier", TypeObjet.livre),
        mouvements: ["manuelAventurier_concentration", "manuelAventurier_reflexes", "manuelAventurier_positionDefensive", "manuelAventurier_positionAggressive"],
        details: "LE MANUEL DE L'AVENTURIER" +
            "<p>Le manuel de l'aventurier est un livre expliquant toutes les tratégies de bases, pour survivre dans un dongeon.</p>" +
            "<p>Il est assez polyvalent, et vous permettra de vous adapter à chaque situation, en vous apportant au choix 1 en attaque, en defense, en vitesse, ou en mana.</p>" +
            "<p>Comme les autres livres, plus vous l'utilisez, plus il sera efficace !</p>"
    },
    {
        ... new _Objet("manuelBarbare", TypeObjet.livre),
        mouvements: ["manuelBarbare_baston"],
        details: "LE MANUEL DU BARBARE" +
            "<p>Le manuel du barabre est un livre simple, avec principalement des illustrations. Il explique clairement des méthodes de combat primitives, mais efficaces, qui ont fait leur preuves au cours des âges, comme par exemple \"frapper fort\".</p>" +
            "<p>Choisir cette stratégie vous apporte une attaque de 3, une défense de 3 et une vitesse de 3.</p>" +
            "<p>Cependant, un barabre ne s'interesse qu'à la baston, il ne s'occupe pas de ramasser les objets à la fin du combat. Donc lorsque vous utilisez cette stratégie, vous ne gagnez pas de récompense de combat, et vous ne récupérez pas les armes que vous avez jetées.</p>" +
            "<p>Autre contrainte : il n'est pas possible de lancer de sort quand vous choisissez une stratégie barbare.</p>" +
            "<p>Comme les autres livres, plus vous l'utilisez, plus il sera efficace !</p>"
    },
    {
        ... new _Objet("manuelMage", TypeObjet.livre),
        mouvements: ["manuelMage_charme", "manuelMage_enchantement"],
        details: "LE MANUEL DU MAGE" +
            "<p>Le manuel du mage est un livre compliqué, regorgeant d'inctantations et de techniques magiques en tout genre.</p>" +
            "<p>Avec le manuel du mage, vous pouvez réaliser un rituel. Pour cela vous devez depenser une potion. Vous choisissez un ou plusieurs parchemins (sans limite), et vous les combinez en un sort unique. L'effet du rituel dure autant de tours que le nombre d'utilisations du livre.</p>" +
            "<p>Vous pouvez réaliser un enchantement. Pour cela vous devez en plus dépenser une rune. L'effet de l'enchantement se dissipe à la fin du combat. L'effet de l'enchantement est appliqué à une arme (ce qui la rend très puissante, si l'enchantement a un effet de feu ou de glace (vor les deux).</p>" +
            "<p>Lorsque vous utilisez le manuel du mage, les parchemins (choisis pour le rituel ou l'enchantement) ne sont pas perdus.</p>" +
            "<p>Comme les autres livres, plus vous l'utilisez, plus il sera efficace !</p>" +
            "<p>Par contre, vous ne disposez qu'une seule main libre au corps à corps, lorsque vous utilisez le manuel du mage</p>"
    },
    {
        ... new _Objet("manuelVoleur", TypeObjet.livre),
        mouvements: ["manuelVoleur_attaqueSournoise"],
        details: "LE MANUEL DU VOLEUR" +
            "<p>Le manuel du voleur est un livre détaillant avec précision comment se faufiller dans un dongeon ou derrière un ennemi... et faire ce qu'il faut !</p>" +
            "<p>Le manuel du voleur vous donne dla possibilité de faire une attaque sournoise. L'avantage principale est que votre attaque est doublée !</p>" +
            "<p>Vous ne pouvez pas utiliser de parchemin, ni de bouclier</p>" +
            "<p>Vous avez automatiquement la possibilité de jeter une (et une seule arme), quelque soit votre vitesse ou celle de l'adversaire</p>" +
            "<p>La première fois que vous faites une attaque sournoise, vous ne pouvez utiliser qu'une seule arme. La deuxième fois, vous pouvez en utiliser deux (etc...)</p>"
    },

    {
        ... new _Objet("parcheminProjectileMagique", TypeObjet.parchemin),
        mouvements: ["parcheminProjectileMagique_sort", "parcheminProjectileMagique_incantation"],
        details: "PARCHEMIN DE \"PROJECTILE MAGIQUE\"" +
            "<p>Le sort \"projectile magique\", est un sort simple, qui permet de faire une attaque à distance, égale à la valeur de mana disponible.</p>" +
            "<p>Il n'y a pas de limite au nombre de parchemins que vous pouvez utiliser lors d'un combat. Cependant les parchemins sont des objets à usage unique. Lorsque vous en utilisez un, il ne sera plus disponible pour les ennemis suivants.</p>"
    },
    {
        ... new _Objet("parcheminProtection", TypeObjet.parchemin),
        mouvements: ["parcheminProtection_sort", "parcheminProtection_incantation"],
        details: "PARCHEMIN DE \"PROTECTION\"" +
            "<p>Le sort \"protection\", est un sort défensif, qui apporte une défense égale à la valeur de mana disponible.</p>" +
            "<p>Il n'y a pas de limite au nombre de parchemins que vous pouvez utiliser lors d'un combat. Cependant les parchemins sont des objets à usage unique. Lorsque vous en utilisez un, il ne sera plus disponible pour les ennemis suivants.</p>"
    },
    {
        ... new _Objet("parcheminMurDeGlace", TypeObjet.parchemin),
        mouvements: ["parcheminMurDeGlace_sort", "parcheminMurDeGlace_incantation"],
        details: "PARCHEMIN DE \"MUR DE GLACE\"" +
            "<p>Le sort \"mur de glace\", est un sort défensif, qui apporte une défense égale à la valeur de mana disponible divisée par deux, et qui diminue l'attaque de l'ennemi d'autant (si l'attaque de l'ennemi est réduite à 0 ou moins, il est éliminé)</p>" +
            "<p>Il n'y a pas de limite au nombre de parchemins que vous pouvez utiliser lors d'un combat. Cependant les parchemins sont des objets à usage unique. Lorsque vous en utilisez un, il ne sera plus disponible pour les ennemis suivants.</p>"
    },
    {
        ... new _Objet("parcheminBouleDeFeu", TypeObjet.parchemin),
        mouvements: ["parcheminBouleDeFeu_sort", "parcheminBouleDeFeu_incantation"],
        details: "PARCHEMIN DE \"BOULE DE FEU\"" +
            "<p>Le sort \"boule de feu\", est un sort offensif, qui apporte une attaque égale à la valeur de mana disponible divisée par deux, et qui diminue la defense de l'ennemi d'autant (si la défense de l'ennemi est réduite à 0 ou moins, il est éliminé)</p>" +
            "<p>Il n'y a pas de limite au nombre de parchemins que vous pouvez utiliser lors d'un combat. Cependant les parchemins sont des objets à usage unique. Lorsque vous en utilisez un, il ne sera plus disponible pour les ennemis suivants.</p>"
    },
    {
        ... new _Objet("parcheminRapidite", TypeObjet.parchemin),
        mouvements: ["parcheminRapidite_sort", "parcheminRapidite_incantation"],
        details: "PARCHEMIN \"RAPIDITÉ\"" +
            "<p>Le sort \"rapidité\", est un sort utilitaire, qui apporte une vitesse égale à la valeur de mana disponible.</p>" +
            "<p>Il n'y a pas de limite au nombre de parchemins que vous pouvez utiliser lors d'un combat. Cependant les parchemins sont des objets à usage unique. Lorsque vous en utilisez un, il ne sera plus disponible pour les ennemis suivants.</p>"
    },
]

let POSITION_DECOUVERTE:number = 0; // commence à 0

const POSITIONS: Position[] = [
    {
        ... new _Position("position-1"),
        message: "vous arrivez devant le manoir, armé de votre seule épée. Un squelette garde le portail.",
        tresor: {objets:[trouverObjet("lance"), trouverObjet("bouclier")], nbPotions: 0, nbRunes:0},
        ennemi: {
            nom: "le squelette",
            attaque: 1,
            defense: 1,
            vitesse: 1,
            ethere: false
        },
        presentation: "skeleton",
    },
    {
        ... new _Position("position-2"),
        message: "Vous entrez dans le manoir. Le hall est rempli de zombies, qui se dirigent alors vers vous... lentement...",
        tresor: {objets:[trouverObjet("manuelAventurier"), trouverObjet("parcheminRapidite")], nbPotions: 1, nbRunes:1},
        ennemi: {
            nom: "le zombie",
            attaque: 4,
            defense: 4,
            vitesse: 0,
            ethere: false
        },
        presentation: "zombie",
    },
    {
        ... new _Position("position-3"),
        message: "Vous entrez une petite salle remplie de toiles d'araignées. Une araignée géante vénimeuse vous tombe soudain dessus.",
        tresor: {objets:[trouverObjet("dagueRunique"), trouverObjet("parcheminProjectileMagique")], nbPotions: 0, nbRunes:0},
        ennemi: {
            nom: "l'araignée",
            attaque: 6,
            defense: 4,
            vitesse: 2,
            ethere: false
        },
        presentation: "spider",
    },
    {
        ... new _Position("position-4"),
        message: "Vous avancez dans un long couloir. Un fantôme vous barre la route.",
        tresor: {objets:[trouverObjet("parcheminProtection"), trouverObjet("javelot")], nbPotions: 1, nbRunes:1},
        ennemi: {
            nom: "le fantôme",
            attaque: 5,
            defense: 5,
            vitesse: 1,
            ethere: true
        },
        presentation: "ghost",
    },
    {
        ... new _Position("position-5"),
        message: "Vous entrez dans la cuisine. Une vieille sorcière s'occupe d'un chaudron fumant",
        tresor: {objets:[trouverObjet("hacheDeGlace"), trouverObjet("bouclierDeGlace"), trouverObjet("parcheminMurDeGlace"), trouverObjet("manuelMage")], nbPotions: 2, nbRunes:0},
        ennemi: {
            nom: "la sorcière",
            attaque: 10,
            defense: 5,
            vitesse: 3,
            ethere: false
        },
        presentation: "hag",
    },
    {
        ... new _Position("position-6"),
        message: "Vous descendez à la cave. Une ghoule vous aperçoit, et avance vers vous... lentement...",
        tresor: {objets:[trouverObjet("manuelBarbare")], nbPotions: 0, nbRunes:2},
        ennemi: {
            nom: "la ghoule",
            attaque: 10,
            defense: 20,
            vitesse: 0,
            ethere: false
        },
        presentation: "ghoul",
    },
    {
        ... new _Position("position-7"),
        message: "Vous sortez dans la court, où un épouvantail terrifiant est posé.",
        tresor: {objets:[trouverObjet("hacheDeFeu"), trouverObjet("bouclierDeFeu"), trouverObjet("parcheminBouleDeFeu")], nbPotions: 0, nbRunes:0},
        ennemi: {
            nom: "l'épouvantail",
            attaque: 12,
            defense: 10,
            vitesse: 5,
            ethere: false
        },
        presentation: "scarecrow",
    },
    {
        ... new _Position("position-8"),
        message: "Vous croisez un bonhomme poilu, qui se transforme d'un coup en loup-garoup !",
        tresor: {objets:[trouverObjet("manuelVoleur")], nbPotions: 0, nbRunes:0},
        ennemi: {
            nom: "le loup-garou",
            attaque: 15,
            defense: 15,
            vitesse: 10,
            ethere: false
        },
        presentation: "werewolf",
    },
    {
        ... new _Position("position-9"),
        message: "Devant vous, se tient la banshee",
        tresor: {objets:[], nbPotions: 1, nbRunes:1},
        ennemi: {
            nom: "la banshee",
            attaque: 30,
            defense: 10,
            vitesse: 10,
            ethere: true
        },
        presentation: "banshee",
    },
    {
        ... new _Position("position-10"),
        message: "Vous arrivez enfin devant le boss final : un vampire",
        tresor: {objets:[], nbPotions: 0, nbRunes:0},
        ennemi: {
            nom: "le vampire",
            attaque: 30,
            defense: 30,
            vitesse: 10,
            ethere: false
        },
        presentation: "vampire",
    }


];

let POSITION: Position = POSITIONS[0];

const MOUVEMENTS: Mouvement[] = [
    {... new _Mouvement("manuelAventurier_positionAggressive", TypeMouvement.technique, "manuelAventurier"), attaque: 1},
    {... new _Mouvement("manuelAventurier_positionDefensive", TypeMouvement.technique, "manuelAventurier"), defense: 1},
    {... new _Mouvement("manuelAventurier_reflexes", TypeMouvement.technique, "manuelAventurier"), vitesse: 1},
    {... new _Mouvement("manuelAventurier_concentration", TypeMouvement.technique, "manuelAventurier"), mana: 1},
    {... new _Mouvement("manuelBarbare_baston", TypeMouvement.technique, "manuelBarbare"), attaque: 3, defense: 3, vitesse: 3},
    {... new _Mouvement("manuelVoleur_attaqueSournoise", TypeMouvement.technique, "manuelVoleur")},

    {... new _Mouvement("parcheminProjectileMagique_sort", TypeMouvement.sort, "parcheminProjectileMagique")},
    {... new _Mouvement("parcheminProjectileMagique_incantation", TypeMouvement.incantation, "parcheminProjectileMagique")},
    {... new _Mouvement("parcheminProtection_sort", TypeMouvement.sort, "parcheminProtection")},
    {... new _Mouvement("parcheminProtection_incantation", TypeMouvement.incantation, "parcheminProtection")},
    {... new _Mouvement("parcheminMurDeGlace_sort", TypeMouvement.sort, "parcheminMurDeGlace")},
    {... new _Mouvement("parcheminMurDeGlace_incantation", TypeMouvement.incantation, "parcheminMurDeGlace")},
    {... new _Mouvement("parcheminBouleDeFeu_sort", TypeMouvement.sort, "parcheminBouleDeFeu")},
    {... new _Mouvement("parcheminBouleDeFeu_incantation", TypeMouvement.incantation, "parcheminBouleDeFeu")},
    {... new _Mouvement("parcheminRapidite_sort", TypeMouvement.sort, "parcheminRapidite")},
    {... new _Mouvement("parcheminRapidite_incantation", TypeMouvement.incantation, "parcheminRapidite")},

    {... new _Mouvement("manuelMage_charme", TypeMouvement.technique, "manuelMage")},
    {... new _Mouvement("manuelMage_enchantement", TypeMouvement.technique, "manuelMage")},

    {... new _Mouvement("epee_frapper", TypeMouvement.frapper, "epee"), attaque: 1, defense: 1},
    {... new _Mouvement("lance_frapper", TypeMouvement.frapper, "lance"), attaque: 2},
    {... new _Mouvement("lance_jeter", TypeMouvement.jeter, "lance"), attaque: 2},
    {... new _Mouvement("bouclier_bloquer", TypeMouvement.bloquer, "bouclier"), defense: 3},
    {... new _Mouvement("dagueRunique_jeter", TypeMouvement.jeter, "dagueRunique"), attaque: 1},
    {... new _Mouvement("dagueRunique_frapper", TypeMouvement.frapper, "dagueRunique"), attaque: 1},
    {... new _Mouvement("hacheDeGlace_jeter", TypeMouvement.jeter, "hacheDeGlace"), attaque: 1, glace: true},
    {... new _Mouvement("hacheDeGlace_bloquer", TypeMouvement.frapper, "hacheDeGlace"), glace: true},
    {... new _Mouvement("bouclierDeGlace_bloquer", TypeMouvement.bloquer, "bouclierDeGlace"), defense: 2, glace: true},
    {... new _Mouvement("hacheDeFeu_jeter", TypeMouvement.jeter, "hacheDeFeu"), attaque: 1, feu: true},
    {... new _Mouvement("hacheDeFeu_bloquer", TypeMouvement.frapper, "hacheDeFeu"), feu: true},
    {... new _Mouvement("bouclierDeFeu_bloquer", TypeMouvement.bloquer, "bouclierDeFeu"), defense: 2, feu: true},
    {... new _Mouvement("javelot_jeter", TypeMouvement.jeter, "javelot"), attaque: 3},

]



function documentHeight() {
    const doc = document.documentElement
    doc.style.setProperty('--doc-height', `${window.innerHeight}px`);
    document.getElementById("body").style.fontSize = (window.innerHeight/100)+'px';

}

window.onresize = documentHeight;

window.oncontextmenu = function() {
    return false;
}
window.onload = function() {
    documentHeight();

    document.getElementById("presentation").addEventListener("touchstart", function(e) {
        document.getElementById("scene-presentator").classList.remove("flipped");
        e.stopPropagation();
    });
    document.getElementById("resultat").addEventListener("touchstart", function(e) {
        if(POSITION.success) {
            const index:number = parseInt(POSITION.id.split("-")[1]);
            choisirPosition("position-"+(index+1));
            setTimeout(dessinerPosition, 1000);
            e.stopPropagation();
        }

    });
    document.getElementById("overlay").addEventListener("touchstart", function(e) {
        document.getElementById("overlay").classList.remove("actif");
    });


    const body = document.getElementById('body');

    body.addEventListener('touchstart', function(e) {

        // grab the location of touch
        const touchLocation: Touch = e.targetTouches[0];
        const x = touchLocation.pageX ;
        const y = touchLocation.pageY ;

        const target: any = touchLocation.target;

        // vérifier si c'est un niveau, qui est cliqué
        if(target?.classList?.contains('level')) {
            choisirPosition(target.getAttribute('id'));
            // POSITION = trouverPosition(target.getAttribute('id'));
            setTimeout(dessinerPosition, 1000);
            return;
        }

        const objets = document.getElementsByClassName("deplacable");
        for(let i = 0; i < objets.length; i++) {
            const o = objets.item(i) as HTMLElement;
            const rect = o.getBoundingClientRect();

            if( x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                DRAG.drag_offset_x = x - rect.left;
                DRAG.drag_offset_y = y - rect.top;

                o.classList.add("dragging");
                o.style.left = (x - DRAG.drag_offset_x) + 'px';
                o.style.top = (y - DRAG.drag_offset_y) + 'px';
                DRAG.element = o;
                DRAG.time = new Date().getTime();

                const objetReference = o.getAttribute("tdd-objet");
                if(objetReference === 'potion') {
                    // gérer de pouvoir cibler un attribut
                    const attributs = document.getElementsByClassName("attribut");
                    for(let i = 0; i < attributs.length; i++) {
                        attributs.item(i).classList.add("evidence");
                    }

                    const preparation = o.getAttribute("tdd-preparation");
                    if(preparation) {
                        o.classList.remove(o.getAttribute("tdd-cible"));
                        trouverPreparationDansPosition(POSITION, preparation).cible = null;
                    }
                } else if(objetReference === 'rune') {
                    // gérer de pouvoir cibler une arme
                    const arme = document.getElementsByClassName("arme");
                    for(let i = 0; i < arme.length; i++) {
                        arme.item(i).classList.add("evidence");
                    }

                    const preparation = o.getAttribute("tdd-preparation");
                    if(preparation) {
                        o.classList.remove(o.getAttribute("tdd-cible"));
                        trouverPreparationDansPosition(POSITION, preparation).cible = null;
                    }

                } else {
                    const objet = trouverObjet(objetReference);
                    if(objet) {
                        for(let mouvementId of objet.mouvements) {
                            const mouvement: Mouvement = trouverMouvement(mouvementId);
                            if(o.getAttribute("tdd-mouvement") === mouvement.id) {
                                ajouterAssiette(null); // si le mouvement est déjà celui selectionné, on ajoute l'assiette dans l'inventaire
                            } else {
                                // on ne propose les assiettes des incantation, que si on utlise le manuel du mage
                                if(mouvement.type === TypeMouvement.incantation && POSITION.mouvements.filter(value => value.objet === "manuelMage").length == 0) {
                                    continue;
                                }

                                ajouterAssiette(mouvement); // sinon on ajoute l'assiette normalement
                            }
                        }
                    }
                }
            }
        }

    })

    body.addEventListener('touchmove', function(e) {
        if (!DRAG.element) return;

        // grab the location of touch
        const touchLocation = e.targetTouches[0];

        const x = touchLocation.pageX ;
        const y = touchLocation.pageY ;
        DRAG.element.style.left = (x - DRAG.drag_offset_x) + 'px';
        DRAG.element.style.top = (y - DRAG.drag_offset_y) + 'px';

        const assiettes = document.getElementsByClassName("assiette");
        for(let i = 0; i < assiettes.length; i++) {
            const o = assiettes.item(i) as HTMLElement;
            const rect = o.getBoundingClientRect();

            if( x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                o.classList.add("assiette-hover");
            } else {
                o.classList.remove("assiette-hover");
            }
        }

        const evidences = document.getElementsByClassName("evidence");
        for(let i = 0; i < evidences.length; i++) {
            const o = evidences.item(i) as HTMLElement;
            const rect = o.getBoundingClientRect();

            if( x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                o.classList.add("evidence-hover");
            } else {
                o.classList.remove("evidence-hover");
            }
        }
    })

    body.addEventListener('touchend', function(e) {
        if (!DRAG.element) return;

        if(new Date().getTime() - DRAG.time < 100) {
            // toucher court
            document.getElementById("overlay").classList.add("actif");
            afficherDetails(DRAG.element.getAttribute("tdd-objet"));
        }

        let assiettes = document.getElementsByClassName("assiette-hover");
        if(assiettes.length > 0) {
            const o = assiettes.item(0);
            mettreDansAssiette(DRAG.element, o);
        }

        let evidences = document.getElementsByClassName("evidence-hover");
        if(evidences.length > 0) {
            const o = evidences.item(0);
            choisirEvidence(DRAG.element, o);
        }

        // retirer les évidences
        while(document.getElementsByClassName("evidence").length > 0) {
            const o = document.getElementsByClassName("evidence").item(0);
            o.classList.remove("evidence");
        }
        while(document.getElementsByClassName("evidence-hover").length > 0) {
            const o = document.getElementsByClassName("evidence-hover").item(0);
            o.classList.remove("evidence-hover");
        }

        // retirer les assiettes
        assiettes = document.getElementsByClassName("assiette");
        for(let i = 0; i < assiettes.length; i++) {
            const o = assiettes.item(i);
            o.classList.add("en-construction");
            setTimeout(function (){ o.remove()}, 1000);
        }

        DRAG.element.classList.remove("dragging");
        DRAG.element = null;

        recalculerAventure();
        dessinerPosition();
    })

}

function choisirEvidence(objet: Element, evidence: Element) {

    const attribut = evidence.getAttribute("tdd-attribut");
    const arme = evidence.getAttribute("tdd-objet");
    const preparation = objet.getAttribute("tdd-preparation");
    if(attribut && preparation) {
        trouverPreparationDansPosition(POSITION, preparation).cible = attribut;
    }
    if(arme && preparation) {
        trouverPreparationDansPosition(POSITION, preparation).cible = arme;
    }

}

function mettreDansAssiette(objet: Element, assiette: Element) {

    /*const old_fantome = objet.parentElement;
    old_fantome.classList.add("en-construction");
    setTimeout(function(){
        old_fantome.parentNode.removeChild(old_fantome);
    }, 1000);*/

    // transformer l'assiette en fantome
    assiette.classList.remove("assiette");
    assiette.classList.remove("assiette-hover");
    assiette.classList.add("fantome");

    assiette.prepend(objet);

    // on enlève du combat l'ancien mouvement correspondant (si jamais)
    enleverDuTableau(POSITION.combat, objet.getAttribute("tdd-mouvement"));
    objet.setAttribute("tdd-mouvement", assiette.getAttribute("tdd-mouvement"));
    if(assiette.getAttribute("tdd-mouvement")) {
        // on ajoute au combat le nouveau mouvement correspondant
        POSITION.combat.push(assiette.getAttribute("tdd-mouvement"));
    }


    recalculerAventure();
    dessinerPosition();
}

function dessinerPosition() {

    const pause = document.getElementById("pause-actions");
    pause.innerHTML = '';
    // ecrire la pause
    for(let preparation of POSITION.preparations) {
        pause.append(ajouterObjet(preparation.type, true, null, preparation, null));
    }

    // écrire les attributs
    document.getElementById("attribut-force").innerHTML = String(POSITION.resultat.hero.force);
    document.getElementById("attribut-endurance").innerHTML = String(POSITION.resultat.hero.endurance);
    document.getElementById("attribut-vitesse").innerHTML = String(POSITION.resultat.hero.vitesse);
    document.getElementById("attribut-mana").innerHTML = String(POSITION.resultat.hero.mana);

    // écrire les totaux
    document.getElementById("total-attaque-distance-hero").innerHTML = String(POSITION.resultat.caracteristiqueHero.attaqueDistance);
    document.getElementById("total-attaque-hero").innerHTML = String(POSITION.resultat.caracteristiqueHero.attaque);
    document.getElementById("total-defense-hero").innerHTML = String(POSITION.resultat.caracteristiqueHero.defense);

    document.getElementById("total-defense-ennemi").innerHTML = String(POSITION.resultat.caracteristiqueEnnemi.defense);
    document.getElementById("total-attaque-ennemi").innerHTML = String(POSITION.resultat.caracteristiqueEnnemi.attaque);

    // ecrire le resultat
    const resultat = document.getElementById('resultat');
    const resultatMessage = document.getElementById('resultat-message');
    resultatMessage.innerHTML = POSITION.resultat.message + "<span class='continue'>-></span>";
    if(POSITION.success) {
        resultat.classList.remove("fail");
        resultat.classList.add("success");
    } else {
        resultat.classList.add("fail");
        resultat.classList.remove("success");
    }

    const tresor = document.getElementById('tresor');
    tresor.innerHTML = '';
    for(let o of POSITION.tresor.objets) {
        tresor.append(ajouterObjet(o.id, false, null, null, null));
    }
    for(let i=0; i<POSITION.tresor.nbPotions; i++) {
        tresor.append(ajouterObjet('potion', false, null, null, null));
    }
    for(let i=0; i<POSITION.tresor.nbRunes; i++) {
        tresor.append(ajouterObjet('rune', false, null, null, null));
    }

    // dessiner l'inventaire
    const inventaire = document.getElementById('inventaire');
    inventaire.innerHTML = '';
    for(let o of POSITION.inventaire.objets) {
        if(o.status === StatusObjet.objet_ok) {
            inventaire.append(ajouterObjet(o.id, true, null, null, null));
        }
    }


    // dessiner le combat
    const initiative = POSITION.resultat.caracteristiqueHero.initiative;
    document.getElementById("jeter-marqueur-initiative-text").innerHTML = String(initiative);

    const technique = document.getElementById('technique');
    const sort = document.getElementById('sort');
    const jeter = document.getElementById('jeter');
    const frapper = document.getElementById('frapper');

    technique.innerHTML='';
    sort.innerHTML='';
    jeter.innerHTML='';
    frapper.innerHTML='';

    // dessiners les charmes (rituels qui durent plusieurs tours)
    for(let charme of POSITION.charmes) {
        if(charme.duree > 0) {
            const fantome = ajouterObjet(charme.id, false, null, null, charme);
            document.getElementById( 'sort' ).prepend(fantome);
        }
    }

    for(let m of POSITION.combat) {
        const mouvement: Mouvement = trouverMouvement(m);
        const effetMouvement: Mouvement = trouverMouvementDansPosition(POSITION, m);
        const fantome = ajouterObjet(mouvement.objet, true, effetMouvement, null, null);

        // le type 'bloquer' est ajouté à 'frapper'
        let type = mouvement.type;
        if(mouvement.type === TypeMouvement.bloquer) {
            type = TypeMouvement.frapper;
        }
        if(mouvement.type === TypeMouvement.incantation) {
            type = TypeMouvement.technique;
        }
        document.getElementById( TypeMouvement[type] ).prepend(fantome);
    }


}


function recalculerAventure() {
    const inventaire: Inventaire = {objets:[{...trouverObjet("epee")}], nbRunes: 0, nbPotions: 0};

    const hero: Hero = {
        force: 1,
        endurance: 1,
        vitesse: 1,
        mana: 1
    };

    const charmes: Charme[] = [];

    for(let position of POSITIONS) {

        // traiter les préparatifs
        const preparations: Preparation[] = [];
        for(let preparation of position.preparations) {
            if(preparation.type === 'potion' && preparation.cible) {
                preparation.id="potion-"+preparations.length;
                preparations.push(preparation);
                if(inventaire.nbPotions > 0) {
                    inventaire.nbPotions --;
                    preparation.status = StatusPreparation.preparation_ok;
                    hero[preparation.cible]++;
                } else {
                    preparation.status = StatusPreparation.preparation_ko;
                }
            }

            if(preparation.type === 'rune' && preparation.cible) {
                preparation.id="rune-"+preparations.length;
                preparations.push(preparation);
                if(inventaire.nbRunes > 0) {
                    inventaire.nbRunes --;
                    preparation.status = StatusPreparation.preparation_ok;
                    trouverObjetDansInventaire(inventaire, preparation.cible).niveau ++;
                } else {
                    preparation.status = StatusPreparation.preparation_ko;
                }
            }
        }


        // traitement spécial du charme et de l'enchantement, parce qu'ils utilisent respectivement une potion et une rune
        let charme_status: StatusMouvement = position.combat.filter(value => value === "manuelMage_charme").length > 0 ? StatusMouvement.mouvement_ok : undefined;
        if(charme_status === StatusMouvement.mouvement_ok) {
            if(inventaire.nbPotions > 0) {
                inventaire.nbPotions --;
            } else {
                charme_status = StatusMouvement.mouvement_ko;
            }
        }
        let enchantement_status: StatusMouvement = position.combat.filter(value => value === "manuelMage_enchantement").length > 0 ? StatusMouvement.mouvement_ok : undefined;
        if(enchantement_status === StatusMouvement.mouvement_ok) {
            if(inventaire.nbRunes > 0) {
                inventaire.nbRunes --;
            } else {
                enchantement_status = StatusMouvement.mouvement_ko;
            }
        }
        let enchantement: Mouvement = undefined;


        for(let i=0; i<inventaire.nbPotions; i++) {
            preparations.push({cible: null, id: "potion-"+preparations.length, type: TypePreparation.potion, status: StatusPreparation.preparation_ok});
        }
        for(let i=0; i<inventaire.nbRunes; i++) {
            preparations.push({cible: null, id: "rune-"+preparations.length, type: TypePreparation.rune, status: StatusPreparation.preparation_ok});
        }
        position.preparations = preparations;


        // recopier l'état de l'inventaire, dans l'inventaire de la position
        position.inventaire = {objets:[...inventaire.objets.map(value => {return{...value};})], nbRunes: inventaire.nbRunes, nbPotions: inventaire.nbPotions};

        const caracteristique: Caracteristique = {
            attaqueDistance: 0,
            attaque: 0,
            defense: 0,
            mana: hero.mana,
            vitesse: hero.vitesse,
            initiative: 0,
            sournois: false,
        }

        const ennemi: Caracteristique = {
            attaqueDistance: 0,
            attaque: position.ennemi.attaque,
            defense: position.ennemi.defense,
            mana: 0,
            vitesse: position.ennemi.vitesse,
            initiative: 0,
            sournois: false,
        };
        const nomEnnemi = position.ennemi.nom;

        position.resultat.caracteristiqueHero = caracteristique;
        position.resultat.caracteristiqueEnnemi = ennemi;

        const utilisations = {
            technique: 0,
            sort : 0,
            jeter: 0,
            frapper: 0,
            bloquer: 0,
            incantation: 0,
        }

        position.mouvements = [];

        position.resultat.hero = {... hero};

        const baston = position.combat.filter(value => value === "manuelBarbare_baston").length > 0;
        const attaqueSournoise = position.combat.filter(value => value === "manuelVoleur_attaqueSournoise").length > 0;
        caracteristique.sournois = attaqueSournoise;

        // traiter les charmes
        position.charmes = [];
        for(let charme of charmes) {
            if(charme.duree > 0) {
                position.charmes.push({...charme});
                charme.duree--;

                caracteristique.attaque += charme.attaque;
                caracteristique.attaqueDistance += charme.attaque;
                caracteristique.defense += charme.defense;
                caracteristique.mana += charme.mana;
                caracteristique.vitesse += charme.vitesse;

                if(charme.feu) {
                    ennemi.defense -= (charme.attaque + charme.defense);
                }
                if(charme.glace) {
                    ennemi.attaque -= (charme.attaque + charme.defense);
                }
            }
        }

        // resoudre le combat
        for(let mouvement of MOUVEMENTS) {
            if(position.combat.indexOf(mouvement.id) > -1) {
                const objet = trouverObjetDansPosition(position, mouvement.objet);

                // ajouter l'attaque
                const effetMouvement: Mouvement = calculerEffetMouvement(position, mouvement, caracteristique);
                position.mouvements.push(effetMouvement);

                // vérifier que l'objet est disponible et qu'on l'utilise une seule fois
                if(objet.status !== StatusObjet.objet_ok) {
                    effetMouvement.status = StatusMouvement.mouvement_ko;
                    continue;
                }
                // enlever les objets utilisés de l'inventaire
                objet.status = StatusObjet.objet_ko;

                // cas spécial des incantations : elles ne sont pas ajoutées à la caractéristiques
                // car elles sont prise en compte directement dans le manuel
                if(mouvement.type === TypeMouvement.incantation) {
                    utilisations[ TypeMouvement[mouvement.type] ] ++;
                    continue;
                }

                // vérifier que si on utilise une arme contre un ennemi éthéré, elle est magique
                if(position.ennemi.ethere && objet.type === TypeObjet.arme && objet.niveau <= 1) {
                    effetMouvement.status = StatusMouvement.mouvement_ko;
                    continue;
                }

                // cas special du manuel du mage : charme qui necessite une potion
                if(mouvement.id === "manuelMage_charme" && charme_status === StatusMouvement.mouvement_ko) {
                    effetMouvement.status = StatusMouvement.mouvement_ko;
                    continue;
                }
                if(mouvement.id === "manuelMage_charme") {
                    const charme: Charme = {
                        id: 'charme',
                        attaque: effetMouvement.attaque,
                        defense: effetMouvement.defense,
                        vitesse: effetMouvement.vitesse,
                        mana: effetMouvement.mana,
                        feu: effetMouvement.feu,
                        glace: effetMouvement.glace,
                        distance: true,
                        duree: objet.niveau,
                        status: StatusMouvement.mouvement_ok,
                    }
                    charmes.push(charme);
                }
                // cas special du manuel du mage : enchantement qui necessite une rune
                if(mouvement.id === "manuelMage_enchantement" && enchantement_status === StatusMouvement.mouvement_ko) {
                    effetMouvement.status = StatusMouvement.mouvement_ko;
                    continue;
                }
                if(mouvement.id === "manuelMage_enchantement") {
                    enchantement = {...effetMouvement};
                    effetMouvement.attaque = 0;
                    effetMouvement.defense = 0;
                    effetMouvement.mana = 0;
                    effetMouvement.vitesse = 0;
                }
                if(enchantement && (effetMouvement.type === TypeMouvement.bloquer || effetMouvement.type === TypeMouvement.frapper)) {
                    fusionnerMouvement(effetMouvement, enchantement);
                }

                if(effetMouvement.distance) {
                    caracteristique.attaqueDistance += effetMouvement.attaque;
                }
                caracteristique.attaque += effetMouvement.attaque;
                caracteristique.defense += effetMouvement.defense;
                caracteristique.vitesse += effetMouvement.vitesse;
                caracteristique.mana += effetMouvement.mana;

                if(effetMouvement.feu) {
                    ennemi.defense -= (effetMouvement.attaque + effetMouvement.defense);
                }
                if(effetMouvement.glace) {
                    ennemi.attaque -= (effetMouvement.attaque + effetMouvement.defense);
                }

                // on compte le nombre d'utilisation de chaque type
                utilisations[ TypeMouvement[mouvement.type] ] ++;

                // on améliore le niveau du livre
                if(mouvement.type === TypeMouvement.technique) {
                    trouverObjetDansInventaire(inventaire, mouvement.objet).niveau ++ ;
                }

                // les parchemins sont à usage unique
                if(objet.type === TypeObjet.parchemin) {
                    trouverObjetDansInventaire(inventaire, objet.id).status = StatusObjet.objet_ko;
                }

            }
        }

        caracteristique.initiative = caracteristique.vitesse - ennemi.vitesse;

        if(attaqueSournoise) {
            caracteristique.initiative = 1;
        }

        const niveauVoleur = trouverObjetDansInventaire(inventaire, "manuelVoleur")?.niveau-1;
        const niveauMage = trouverObjetDansInventaire(inventaire, "manuelMage")?.niveau-1;

        if(position.combat.length === 0 && caracteristique.attaque === 0) {
            position.resultat.message = "Vous devez combattre "+nomEnnemi;
            position.success = false;
        }
        else if(attaqueSournoise && utilisations.bloquer > 0) {
            position.resultat.message = "En cas d'attaque sournoise, vous ne pouvez pas utiliser de bouclier";
            position.success = false;
        }
        else if(attaqueSournoise && utilisations.sort > 0) {
            position.resultat.message = "En cas d'attaque sournoise, vous ne pouvez pas utiliser de parchemin";
            position.success = false;
        }
        else if(attaqueSournoise && (utilisations.jeter + utilisations.frapper) > niveauVoleur) {
            position.resultat.message = "Pour l'instant, vous ne pouvez utiliser que " + niveauVoleur + " arme(s) pour votre attaque sournoise";
            position.success = false;
        }
        else if(enchantement_status === StatusMouvement.mouvement_ok && utilisations.incantation > niveauMage) {
            position.resultat.message = "Pour l'instant, vous ne pouvez utiliser que " + niveauMage + " parchemin(s) dans votre enchantement";
            position.success = false;
        } else if( (enchantement_status === StatusMouvement.mouvement_ok || charme_status === StatusMouvement.mouvement_ok) && utilisations.bloquer + utilisations.frapper > 1 ) {
            position.resultat.message = "Quand vous faites de la magie, vous ne pouvez utiliser qu'un seul mouvements de mélée";
            position.success = false;
        } else if(utilisations.bloquer + utilisations.frapper > 2) {
            position.resultat.message = "Vous n'avez que 2 mains, vous ne pouvez utiliser que 2 mouvements de mélée";
            position.success = false;
        } else if(utilisations.technique > 1) {
            position.resultat.message = "Vous ne pouvez utiliser qu'une seule technique";
            position.success = false;
        } else if(utilisations.jeter > 0 && caracteristique.initiative <= 0) {
            position.resultat.message = "Vous n'êtes pas assez rapide, vous ne pouvez rien jeter";
            position.success = false;
        } else if(utilisations.jeter > 0 && caracteristique.initiative < utilisations.jeter) {
            position.resultat.message = "Vous n'êtes pas assez rapide, vous ne pouvez  choisir que "+caracteristique.initiative+" mouvement jeter";
            position.success = false;
        }

        // cas special de la baston du barabre :
        else if(baston && utilisations.sort > 0) {
            position.resultat.message = "Le manuel du barbare ne permet pas de jeter des arme, ou de lancer des sorts";
            position.success = false;
        }

        else if(ennemi.defense <= 0) {
            position.resultat.message = "Vous carbonisez "+nomEnnemi;
            position.success = true;
        } else if(ennemi.attaque <= 0) {
            position.resultat.message = "Vous congelez "+nomEnnemi;
            position.success = true;
        } else if(caracteristique.attaqueDistance > ennemi.defense) {
            position.resultat.message = "Vous dégommez "+nomEnnemi;
            position.success = true;
        } else if(ennemi.attaque >= caracteristique.defense) {
            position.resultat.message = nomEnnemi + " a une attaque trop forte";
            position.success = false;
        } else if(ennemi.defense >= caracteristique.attaque) {
            position.resultat.message = nomEnnemi + " a une defense trop forte";
            position.success = false;
        } else {
            position.resultat.message = "Vous écrasez "+nomEnnemi;
            position.success = true;
        }

        // récupérer le trésor (seulement si on n'a pas de baston)
        // si on est bastpn, on ne récupère même pas ce qu'on a lancé
        if(baston) {
            for(let mouvement of position.mouvements) {
                if(mouvement.type === TypeMouvement.jeter) {
                    trouverObjetDansInventaire(inventaire, mouvement.objet).status = StatusObjet.objet_ko;
                }
            }
        } else {
            inventaire.nbPotions += position.tresor.nbPotions;
            inventaire.nbRunes += position.tresor.nbRunes;
            for(let tresor of position.tresor.objets) {
                inventaire.objets.push({...tresor});
            }
        }



        const index:number = parseInt(position.id.split("-")[1]);
        document.getElementById(position.id).classList.add(position.presentation);
        if(position.success) {
            document.getElementById(position.id).classList.remove("position-fail");
            document.getElementById(position.id).classList.add("position-success");
            document.getElementById(position.id).classList.remove("position-unknown");
            if(index > POSITION_DECOUVERTE) {
                POSITION_DECOUVERTE = index;
            }
        } else if (index > POSITION_DECOUVERTE+1) {
            document.getElementById(position.id).classList.remove("position-fail");
            document.getElementById(position.id).classList.remove("position-success");

            document.getElementById(position.id).classList.add("position-unknown");

        } else {
            document.getElementById(position.id).classList.add("position-fail");
            document.getElementById(position.id).classList.remove("position-success");
            document.getElementById(position.id).classList.remove("position-unknown");
        }

    }

}

function trouverPosition(id: string): Position {
    for(let position of POSITIONS) {
        if(position.id === id) {
            return position;
        }
    }
    return null;
}
function trouverObjet(id: string): Objet {
    for(let objet of OBJETS) {
        if(objet.id === id) {
            return objet;
        }
    }
    return null;
}
function trouverObjetDansPosition(position: Position, id: string): Objet {
    return trouverObjetDansInventaire(position.inventaire, id);
}
function trouverObjetDansInventaire(inventaire: Inventaire, id: string): Objet {
    for(let objet of inventaire.objets) {
        if(objet.id === id) {
            return objet;
        }
    }
    return null;
}
function trouverMouvement(id: string): Mouvement {
    for(let mouvement of MOUVEMENTS) {
        if(mouvement.id === id) {
            return mouvement;
        }
    }
    return null;
}
function trouverMouvementDansPosition(position: Position, id: string): Mouvement {
    for(let mouvement of position.mouvements) {
        if(mouvement.id === id) {
            return mouvement;
        }
    }
    return null;
}
function trouverPreparationDansPosition(position: Position, id: string) {
    for(let mouvement of position.preparations) {
        if(mouvement.id === id) {
            return mouvement;
        }
    }
    return null;
}

function ajouterObjet(classe: string, deplacable: boolean, mouvement: Mouvement, preparation: Preparation, charme: Charme): HTMLDivElement {
    const fantome = document.createElement('div');
    fantome.classList.add("action");
    fantome.classList.add("fantome");
    if(mouvement?.type === TypeMouvement.incantation) {
        fantome.classList.add("incantation");
    }
    const objet = document.createElement('div');
    objet.classList.add('objet');
    objet.classList.add(classe);
    objet.setAttribute("tdd-objet", classe);
    if(deplacable) {
        objet.classList.add('deplacable');
    }
    if(mouvement) {
        objet.setAttribute("tdd-mouvement", mouvement.id);

        // ajouter les marqueurs indicatifs visuels du mouvement
        fantome.append(creerMarqueurs(mouvement));

        if(mouvement.status !== StatusMouvement.mouvement_ok) {
            objet.classList.add('error');
        }
    }
    if(preparation) {
        objet.setAttribute("tdd-preparation", preparation.id);
        if(preparation.cible) {
            objet.classList.add(preparation.cible);
            objet.setAttribute("tdd-cible", preparation.cible);
        }
        if(preparation.status !== StatusPreparation.preparation_ok) {
            objet.classList.add('error');
        }
    }
    if(charme) {
        // ajouter les marqueurs indicatifs visuels du mouvement
        fantome.append(creerMarqueurs(charme));

        if(charme.status !== StatusMouvement.mouvement_ok) {
            objet.classList.add('error');
        }
    }

    const reference: Objet = trouverObjetDansPosition(POSITION, classe);
    if(reference) {
        objet.classList.add(reference.type);
        if(reference.niveau !== 1) {
            const marqueurs = document.createElement('div');
            marqueurs.classList.add("marqueurs");
            const marqueur = document.createElement('div');
            marqueur.classList.add("marqueur");
            marqueur.classList.add("marqueur-niveau");
            marqueur.innerHTML = "<span>"+String(reference.niveau)+"</span>";
            marqueurs.append(marqueur);
            objet.append(marqueurs);
        }
    }

    fantome.append(objet);
    return fantome;
}

function ajouterAssiette(mouvement: Mouvement) {
    const assiette = document.createElement('div');
    assiette.classList.add('action');
    assiette.classList.add('assiette');
    assiette.classList.add('en-construction');
    if(mouvement) {
        assiette.setAttribute("tdd-mouvement", mouvement.id);
        // le type 'bloquer' est ajouté à 'frapper'
        let type = mouvement.type;
        if(mouvement.type === TypeMouvement.bloquer) {
            type = TypeMouvement.frapper;
        }
        if(mouvement.type === TypeMouvement.incantation) {
            type = TypeMouvement.technique;
            assiette.classList.add('incantation');
        }
        document.getElementById( TypeMouvement[type] ).prepend(assiette);

        const objet: Objet = trouverObjetDansPosition(POSITION, mouvement.objet);
        const effetMouvement = calculerEffetMouvement(POSITION, mouvement, POSITION.resultat.caracteristiqueHero);
        if(POSITION.ennemi.ethere && objet.niveau <= 1 && objet.type === TypeObjet.arme) {
            effetMouvement.status = StatusMouvement.mouvement_ko;
        }
        assiette.append(creerMarqueurs(effetMouvement));

    } else {
        document.getElementById("inventaire").prepend(assiette);
    }


    setTimeout(function() { assiette.classList.remove('en-construction') }, 100);

}

function enleverDuTableau(tableau: string[], element: string) {
    const index = tableau.indexOf(element);
    if (index > -1) {
        tableau.splice(index, 1);
    }
}

function calculerEffetMouvement(position: Position, mouvement: Mouvement, caracteristique: Caracteristique): Mouvement {

    const hero: Hero = position.resultat.hero;
    const objet: Objet = trouverObjetDansPosition(position, mouvement.objet);
    const niveau : number = objet.niveau;

    const effetMouvement: Mouvement = {...mouvement};


    effetMouvement.attaque = mouvement.attaque * niveau;
    effetMouvement.defense = mouvement.defense * niveau;
    effetMouvement.vitesse = mouvement.vitesse * niveau;
    effetMouvement.mana = mouvement.mana * niveau;

    if(mouvement.type === TypeMouvement.jeter || mouvement.type === TypeMouvement.frapper) {
        effetMouvement.attaque += hero.force;
    }
    if(mouvement.type === TypeMouvement.bloquer || mouvement.type === TypeMouvement.frapper) {
        effetMouvement.defense += hero.endurance;
    }


    // effets speciaux
    switch (mouvement.id) {
        case "parcheminProjectileMagique_sort":
        case "parcheminProjectileMagique_incantation":
            effetMouvement.attaque = caracteristique.mana;
            break;
        case "parcheminProtection_sort":
        case "parcheminProtection_incantation":
            effetMouvement.defense = caracteristique.mana;
            break;
        case "parcheminMurDeGlace_sort":
        case "parcheminMurDeGlace_incantation":
            effetMouvement.defense = Math.floor(caracteristique.mana/2);
            effetMouvement.glace = true;
            break;
        case "parcheminBouleDeFeu_sort":
        case "parcheminBouleDeFeu_incantation":
            effetMouvement.attaque = Math.floor(caracteristique.mana/2);
            effetMouvement.feu = true;
            break;
        case "parcheminRapidite_sort":
        case "parcheminRapidite_incantation":
            effetMouvement.vitesse = caracteristique.mana;
            break;

        case "manuelMage_charme":
        case "manuelMage_enchantement":
            position.mouvements.filter(value => value.type === TypeMouvement.incantation).forEach(value => {
                fusionnerMouvement(effetMouvement, value)
            });
            break;
    }

    if(caracteristique.sournois) {
        effetMouvement.attaque *= 2;
        effetMouvement.defense *= 2;
        effetMouvement.mana *= 2;
        effetMouvement.vitesse *= 2;
    }

    return effetMouvement;
}

function creerMarqueurs(mouvement: Valeur): HTMLDivElement {
    const marqueurs = document.createElement('div');
    marqueurs.classList.add("marqueurs");

    // marqueur specifique pour le manuel du mage: charme
    if(mouvement.id === "manuelMage_charme") {
        const marqueur = document.createElement('div');
        marqueur.classList.add("marqueur");
        marqueur.classList.add("marqueur-charme");
        marqueurs.append(marqueur);
    }
    // marqueur specifique pour le manuel du mage: enchantement
    if(mouvement.id === "manuelMage_enchantement") {
        const marqueur = document.createElement('div');
        marqueur.classList.add("marqueur");
        marqueur.classList.add("marqueur-enchantement");
        marqueurs.append(marqueur);
    }

    if(mouvement.status === StatusMouvement.mouvement_ko) {
        return marqueurs;
    }

    if(mouvement.glace) {
        const marqueur = document.createElement('div');
        marqueur.classList.add("marqueur");
        marqueur.classList.add("marqueur-glace");
        marqueurs.append(marqueur);
    }
    if(mouvement.feu) {
        const marqueur = document.createElement('div');
        marqueur.classList.add("marqueur");
        marqueur.classList.add("marqueur-feu");
        marqueurs.append(marqueur);
    }

    if(mouvement.attaque > 0) {
        const marqueur = document.createElement('div');
        marqueur.classList.add("marqueur");
        marqueur.classList.add("marqueur-attaque");
        if(mouvement.distance) {
            marqueur.classList.add("marqueur-attaque-distance");
        }
        marqueur.innerHTML = "<span>"+String(mouvement.attaque)+"</span>";
        marqueurs.append(marqueur);
    }

    if(mouvement.defense > 0) {
        const marqueur = document.createElement('div');
        marqueur.classList.add("marqueur");
        marqueur.classList.add("marqueur-defense");
        marqueur.innerHTML = "<span>"+String(mouvement.defense)+"</span>";
        marqueurs.append(marqueur);
    }

    if(mouvement.vitesse > 0) {
        const marqueur = document.createElement('div');
        marqueur.classList.add("marqueur");
        marqueur.classList.add("marqueur-vitesse");
        marqueur.innerHTML = "<span>"+String(mouvement.vitesse)+"</span>";
        marqueurs.append(marqueur);
    }

    if(mouvement.mana > 0) {
        const marqueur = document.createElement('div');
        marqueur.classList.add("marqueur");
        marqueur.classList.add("marqueur-mana");
        marqueur.innerHTML = "<span>"+String(mouvement.mana)+"</span>";
        marqueurs.append(marqueur);
    }

    return marqueurs;
}

function choisirPosition(id: string) {
    POSITION = trouverPosition(id);
    document.getElementById("scene-presentator").classList.add("flipped");
    document.getElementById("presentation").className = "face "+POSITION.presentation;
    let message = "<span>"+POSITION.message+"</span>";
    if(POSITION.ennemi.ethere) {
        message += "<span class='presentation-alerte'>L'ennemi est éthéré<br>Les armes sans runes n'ont aucun effet sur lui</span>";
    }
    message += "<span class='continue'>-></span>";
    document.getElementById("presentation-message"). innerHTML = message;

    document.getElementById("caracteristique-ennemi").className = "thumbnail "+POSITION.presentation;
}

function afficherDetails(cible: string) {

    let details = "";
    if(cible === "potion") {
        details = "POTION" +
            "<p>Vous pouvez faire glisser une potion sur l'un des 4 attributs du héro, pour l'augmenter de 1 point.</p>" +
            "<p>L'effet d'une potion perdure jusqu'à la fin de la partie. Nh'esitez pas à adapter votre stratégie en fonction des attributs que vous avez favorisés.</p>" +
            "<p>Une potion est à usage unique. Si vous l'utilisez sur un attribut, avant un combat, vous ne pourrez pas l'utiliser ultérieurement sur un autre attribut.</p>";
    } else if (cible === "rune") {
        details = "RUNE" +
            "<p>Vous pouvez faire glisser une rune jusqu'à une arme pour l'améliorer. Vérifiez les détails de l'arme pour vérifier les effet des runes.</p>" +
            "<p>L'effet d'une rune perdure jusqu'à la fin de la partie. N'hesitez pas à ré-utiliser une arme améliorée, dans le plus de combats possibles.</p>" +
            "<p>Une rune est à usage unique. Si vous l'utilisez sur une arme, avant un combat, vous ne pourrez pas l'utiliser ultérieurement sur une autre arme.</p>";
    } else {
        const objet: Objet = trouverObjet(cible);
        details = objet.details;
    }


    document.getElementById("details").innerHTML = details;
}

function fusionnerMouvement(cible: Mouvement, ajout: Mouvement) {
    cible.attaque += ajout.attaque;
    cible.defense += ajout.defense;
    cible.mana += ajout.mana;
    cible.vitesse += ajout.vitesse;
    cible.feu  = cible.feu || ajout.feu;
    cible.glace  = cible.glace || ajout.glace;
}