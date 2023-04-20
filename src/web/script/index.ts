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
    caracteristiqueHero: Caracteristique;
    caracteristiqueEnnemi: Caracteristique;

    nbTechniqueAutorises: number;
    nbSortAutorises: number;
    nbDistanceAutorises: number;
    nbMeleeAutorises: number;

    nbTechnique: number;
    nbSort: number;
    nbDistance: number;
    nbMelee: number;

    attaqueDistanceSuccess: boolean;
    attaqueTotalSuccess: boolean;
}

interface Position {
    id: string;
    message: string;
    combat: string[]; //ce qui est choisi par l'utilisateur
    mouvements: Mouvement[], // rendu calculé
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
    rune = "rune",
    livre = "livre"
}
interface Preparation {
    id: string;
    type: TypePreparation;
    cible: string;
    status: StatusPreparation;
}

interface Ennemi {
    nom: string;
    attaqueDistance: number;
    attaqueTotale: number;

    specials: EnnemiSpecial[];
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
    jeter,
    frapper,
    bloquer
}

interface Caracteristique {
    attaqueDistance: number,
    attaqueTotale: number,
}

interface Valeur {
    id: string;
    status: StatusMouvement;

    attaque: number;
    distance: boolean;

    force: number;
    courage: number;
    agilite: number;
    magie: number;

    glace: boolean;
    feu: boolean;

}
interface Mouvement extends Valeur {
    type: TypeMouvement;
    objet: string;
    attributs: Attribut[];
}

interface Inventaire {
    objets: Objet[];
    nbRunes: number;
    nbPotions: number;
    nbLivres: number;
}
enum Attribut {
    force,
    courage,
    agilite,
    magie
}

enum EnnemiSpecial {
    poison,
    vif,
    terreur,
    antisort,
    lent,
    rapide,
    ethere
}

interface HeroSpecial {
    rapide: number,
    initie: number,
    heroic: number,

    protecteur: boolean,
}

class _HeroSpecial implements HeroSpecial {
    rapide: number = 0;
    initie: number = 0;
    heroic: number = 0;

    protecteur: boolean = false;
}

interface Hero {
    force: number;
    courage: number;
    agilite: number;
    magie: number;

    heroSpecial: HeroSpecial;
}

class _Position implements Position {
    combat: string[] = [];
    ennemi: Ennemi;
    id: string;
    inventaire: Inventaire = null;
    message: string = "";
    mouvements: Mouvement[] = [];
    resultat: ResultatCombat = {
        message: "",
        hero: {force: 1, courage: 1, agilite: 1, magie: 1, heroSpecial: new _HeroSpecial()},
        caracteristiqueHero: {attaqueTotale: 0, attaqueDistance: 0},
        caracteristiqueEnnemi: {attaqueTotale: 0, attaqueDistance: 0},
        nbDistanceAutorises: 0,
        nbMeleeAutorises: 0,
        nbSortAutorises: 0,
        nbTechniqueAutorises: 0,
        nbDistance: 0,
        nbMelee: 0,
        nbSort: 0,
        nbTechnique: 0,
        attaqueDistanceSuccess: false,
        attaqueTotalSuccess: false
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
    distance: boolean = false;
    id: string;
    objet: string;
    type: TypeMouvement;
    status: StatusMouvement = StatusMouvement.mouvement_ok;

    attributs: Attribut[] = [];

    agilite: number = 0;
    courage: number = 0;
    force: number = 0;
    magie: number = 0;

    glace: boolean = false;
    feu: boolean = false;

    constructor(id: string, type: TypeMouvement, objet: string) {
        this.id = id;
        this.type = type;
        this.objet = objet;

        if(type === TypeMouvement.jeter || type === TypeMouvement.sort) {
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
        mouvements: ["hacheDeGlace_jeter", "hacheDeGlace_frapper"],
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
        mouvements: ["hacheDeFeu_jeter", "hacheDeFeu_frapper"],
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
        ... new _Objet("parcheminProjectileMagique", TypeObjet.parchemin),
        mouvements: ["parcheminProjectileMagique_sort"],
        details: "PARCHEMIN DE \"PROJECTILE MAGIQUE\"" +
            "<p></p>" +
            "<p></p>"
    },
    {
        ... new _Objet("parcheminProtection", TypeObjet.parchemin),
        mouvements: ["parcheminProtection_sort"],
        details: "PARCHEMIN DE \"PROTECTION\"" +
            "<p></p>" +
            "<p></p>"
    },
    {
        ... new _Objet("parcheminMurDeGlace", TypeObjet.parchemin),
        mouvements: ["parcheminMurDeGlace_sort"],
        details: "PARCHEMIN DE \"MUR DE GLACE\"" +
            "<p></p>" +
            "<p></p>"
    },
    {
        ... new _Objet("parcheminBouleDeFeu", TypeObjet.parchemin),
        mouvements: ["parcheminBouleDeFeu_sort"],
        details: "PARCHEMIN DE \"BOULE DE FEU\"" +
            "<p></p>" +
            "<p></p>"
    },
    {
        ... new _Objet("parcheminRapidite", TypeObjet.parchemin),
        mouvements: ["parcheminRapidite_sort"],
        details: "PARCHEMIN \"RAPIDITÉ\"" +
            "<p></p>" +
            "<p></p>"
    },
    {
        ... new _Objet("parcheminSoin", TypeObjet.parchemin),
        mouvements: ["parcheminSoin_sort"],
        details: "PARCHEMIN \"SOIN\"" +
            "<p></p>" +
            "<p></p>"
    },
    {
        ... new _Objet("batonDeMagicien", TypeObjet.arme),
        mouvements: ["batonDeMagicien_frapper"],
        details: "BÂTON DE MAGICIEN" +
            "<p>Le bâton de magicien est une arme spéciale. Lorsque vous l'utilisez, il permet de lancer 1 sort supplémentaire, pour chaque rune gravée dessus</p>"
    },
]

let POSITION_DECOUVERTE:number = 9; // commence à 0

const POSITIONS: Position[] = [
    {
        ... new _Position("position-1"),
        message: "vous arrivez devant le manoir, armé de votre seule épée. Un squelette garde le portail.",
        tresor: {objets:[trouverObjet("lance"), trouverObjet("bouclier")], nbPotions: 0, nbRunes:0, nbLivres: 0},
        ennemi: {
            nom: "le squelette",
            attaqueTotale: 1,
            attaqueDistance: 0,
            specials: []
        },
        presentation: "skeleton",
    },
    {
        ... new _Position("position-2"),
        message: "Vous sortez dans la court, où un épouvantail terrifiant est posé.",
        tresor: {objets:[trouverObjet("parcheminProjectileMagique")], nbPotions: 1, nbRunes:1, nbLivres: 1},
        ennemi: {
            nom: "l'épouvantail",
            attaqueTotale: 3,
            attaqueDistance: 1,
            specials: [EnnemiSpecial.terreur]
        },
        presentation: "scarecrow",
    },
    {
        ... new _Position("position-3"),
        message: "Vous entrez une petite salle remplie de toiles d'araignées. Une araignée géante vénimeuse vous tombe soudain dessus.",
        tresor: {objets:[trouverObjet("dagueRunique"), trouverObjet("parcheminProtection")], nbPotions: 0, nbRunes:0, nbLivres: 0},
        ennemi: {
            nom: "l'araignée",
            attaqueTotale: 5,
            attaqueDistance: 3,
            specials: [EnnemiSpecial.poison, EnnemiSpecial.rapide]
        },
        presentation: "spider",
    },
    {
        ... new _Position("position-4"),
        message: "Vous avancez dans un long couloir. Un fantôme vous barre la route.",
        tresor: {objets:[trouverObjet("javelot")], nbPotions: 1, nbRunes:1, nbLivres: 1},
        ennemi: {
            nom: "le fantôme",
            attaqueTotale: 10,
            attaqueDistance: 8,
            specials: [EnnemiSpecial.ethere]
        },
        presentation: "ghost",
    },
    {
        ... new _Position("position-5"),
        message: "Vous entrez dans le manoir. Le hall est rempli de zombies, qui se dirigent alors vers vous... lentement...",
        tresor: {objets:[trouverObjet("parcheminRapidite")], nbPotions: 0, nbRunes:0, nbLivres: 1},
        ennemi: {
            nom: "le zombie",
            attaqueTotale: 30,
            attaqueDistance: 20,
            specials: [EnnemiSpecial.lent]
        },
        presentation: "zombie",
    },
    {
        ... new _Position("position-6"),
        message: "Vous entrez dans la cuisine. Une vieille sorcière s'occupe d'un chaudron fumant",
        tresor: {objets:[trouverObjet("hacheDeGlace"), trouverObjet("bouclierDeGlace"), trouverObjet("parcheminMurDeGlace"), trouverObjet("batonDeMagicien")], nbPotions: 2, nbRunes:0, nbLivres: 0},
        ennemi: {
            nom: "la sorcière",
            attaqueTotale: 35,
            attaqueDistance: 20,
            specials: [EnnemiSpecial.antisort]
        },
        presentation: "hag",
    },
    {
        ... new _Position("position-7"),
        message: "Vous descendez à la cave. Une ghoule vous aperçoit, et avance vers vous... lentement...",
        tresor: {objets:[trouverObjet("parcheminSoin")], nbPotions: 0, nbRunes:2, nbLivres: 0},
        ennemi: {
            nom: "la ghoule",
            attaqueTotale: 10,
            attaqueDistance: 10,
            specials: [EnnemiSpecial.lent, EnnemiSpecial.poison, EnnemiSpecial.terreur]
        },
        presentation: "ghoul",
    },
    {
        ... new _Position("position-8"),
        message: "Vous croisez un bonhomme poilu, qui se transforme d'un coup en loup-garoup !",
        tresor: {objets:[trouverObjet("hacheDeFeu"), trouverObjet("bouclierDeFeu"), trouverObjet("parcheminBouleDeFeu")], nbPotions: 0, nbRunes:0, nbLivres: 2},
        ennemi: {
            nom: "le loup-garou",
            attaqueTotale: 15,
            attaqueDistance: 15,
            specials: [EnnemiSpecial.rapide, EnnemiSpecial.terreur]
        },
        presentation: "werewolf",
    },
    {
        ... new _Position("position-9"),
        message: "Devant vous, se tient la banshee",
        tresor: {objets:[], nbPotions: 1, nbRunes:1, nbLivres: 0},
        ennemi: {
            nom: "la banshee",
            attaqueTotale: 30,
            attaqueDistance: 30,
            specials: [EnnemiSpecial.ethere, EnnemiSpecial.antisort]
        },
        presentation: "banshee",
    },
    {
        ... new _Position("position-10"),
        message: "Vous arrivez enfin devant le boss final : un vampire",
        tresor: {objets:[], nbPotions: 0, nbRunes:0, nbLivres: 0},
        ennemi: {
            nom: "le vampire",
            attaqueTotale: 40,
            attaqueDistance: 50,
            specials: []
        },
        presentation: "vampire",
    }


];

let POSITION: Position = POSITIONS[0];

const MOUVEMENTS: Mouvement[] = [

    {... new _Mouvement("parcheminProjectileMagique_sort", TypeMouvement.sort, "parcheminProjectileMagique"), attributs: [Attribut.magie]},
    {... new _Mouvement("parcheminProtection_sort", TypeMouvement.sort, "parcheminProtection"), attributs: [Attribut.magie, Attribut.courage]},
    {... new _Mouvement("parcheminMurDeGlace_sort", TypeMouvement.sort, "parcheminMurDeGlace"), attributs: [Attribut.magie], glace: true},
    {... new _Mouvement("parcheminBouleDeFeu_sort", TypeMouvement.sort, "parcheminBouleDeFeu"), attributs: [Attribut.magie], feu: true},
    {... new _Mouvement("parcheminRapidite_sort", TypeMouvement.sort, "parcheminRapidite"), attributs: [Attribut.agilite, Attribut.magie]},
    {... new _Mouvement("parcheminSoin_sort", TypeMouvement.sort, "parcheminSoin"), attributs: [Attribut.force, Attribut.magie]},

    {... new _Mouvement("epee_frapper", TypeMouvement.frapper, "epee"), attributs: [Attribut.force, Attribut.courage]},
    {... new _Mouvement("lance_frapper", TypeMouvement.frapper, "lance"), attributs: [Attribut.force, Attribut.agilite]},
    {... new _Mouvement("lance_jeter", TypeMouvement.jeter, "lance"), attributs: [Attribut.force, Attribut.agilite]},
    {... new _Mouvement("bouclier_bloquer", TypeMouvement.bloquer, "bouclier"), attributs: [Attribut.courage]},
    {... new _Mouvement("dagueRunique_jeter", TypeMouvement.jeter, "dagueRunique"), attributs: [Attribut.agilite]},
    {... new _Mouvement("dagueRunique_frapper", TypeMouvement.frapper, "dagueRunique"), attributs: [Attribut.agilite]},
    {... new _Mouvement("hacheDeGlace_jeter", TypeMouvement.jeter, "hacheDeGlace"), attributs: [Attribut.force], glace: true},
    {... new _Mouvement("hacheDeGlace_frapper", TypeMouvement.frapper, "hacheDeGlace"), attributs: [Attribut.force], glace: true},
    {... new _Mouvement("bouclierDeGlace_bloquer", TypeMouvement.bloquer, "bouclierDeGlace"), attributs: [Attribut.courage], glace: true},
    {... new _Mouvement("hacheDeFeu_jeter", TypeMouvement.jeter, "hacheDeFeu"), attributs: [Attribut.force], feu: true},
    {... new _Mouvement("hacheDeFeu_frapper", TypeMouvement.frapper, "hacheDeFeu"), attributs: [Attribut.force], feu: true},
    {... new _Mouvement("bouclierDeFeu_bloquer", TypeMouvement.bloquer, "bouclierDeFeu"), attributs: [Attribut.courage], feu: true},
    {... new _Mouvement("javelot_jeter", TypeMouvement.jeter, "javelot"), attributs: [Attribut.force, Attribut.courage, Attribut.agilite]},

    {... new _Mouvement("batonDeMagicien_frapper", TypeMouvement.frapper, "batonDeMagicien"), attributs: [Attribut.magie]},



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

                } else if(objetReference === 'livre') {
                    // gérer de pouvoir cibler une capacité spéciale
                    const specials = document.getElementsByClassName("hero-special");
                    for(let i = 0; i < specials.length; i++) {
                        specials.item(i).classList.add("evidence");
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
    const special = evidence.getAttribute("tdd-special");
    const preparation = objet.getAttribute("tdd-preparation");
    if(attribut && preparation) {
        trouverPreparationDansPosition(POSITION, preparation).cible = attribut;
    }
    if(arme && preparation) {
        trouverPreparationDansPosition(POSITION, preparation).cible = arme;
    }
    if(special && preparation) {
        trouverPreparationDansPosition(POSITION, preparation).cible = special;
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
        pause.append(ajouterObjet(preparation.type, true, null, preparation));
    }

    // ecrire les capacités speciales
    const specials = document.getElementsByClassName("hero-special");
    for(let i= 0; i<specials.length; i++) {
        if(POSITION.resultat.hero.heroSpecial[specials.item(i).getAttribute("tdd-special")] === 0)
            specials.item(i).classList.remove("acquis");
        else
            specials.item(i).classList.add("acquis");
    }


    // écrire les attributs
    document.getElementById("attribut-force").innerHTML = String(POSITION.resultat.hero.force);
    document.getElementById("attribut-endurance").innerHTML = String(POSITION.resultat.hero.courage);
    document.getElementById("attribut-vitesse").innerHTML = String(POSITION.resultat.hero.agilite);
    document.getElementById("attribut-mana").innerHTML = String(POSITION.resultat.hero.magie);

    // écrire les totaux
    document.getElementById("total-attaque-distance-hero").innerHTML = String(POSITION.resultat.caracteristiqueHero.attaqueDistance);
    document.getElementById("total-attaque-hero").innerHTML = String(POSITION.resultat.caracteristiqueHero.attaqueTotale);
    //document.getElementById("total-defense-hero").innerHTML = String(POSITION.resultat.caracteristiqueHero.defense);

    document.getElementById("total-defense-ennemi").innerHTML = String(POSITION.resultat.caracteristiqueEnnemi.attaqueDistance);
    document.getElementById("total-attaque-ennemi").innerHTML = String(POSITION.resultat.caracteristiqueEnnemi.attaqueTotale);

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
        tresor.append(ajouterObjet(o.id, false, null, null));
    }
    for(let i=0; i<POSITION.tresor.nbPotions; i++) {
        tresor.append(ajouterObjet('potion', false, null, null));
    }
    for(let i=0; i<POSITION.tresor.nbRunes; i++) {
        tresor.append(ajouterObjet('rune', false, null, null));
    }
    for(let i=0; i<POSITION.tresor.nbLivres; i++) {
        tresor.append(ajouterObjet('livre', false, null, null));
    }

    // dessiner l'inventaire
    const inventaire = document.getElementById('inventaire');
    inventaire.innerHTML = '';
    for(let o of POSITION.inventaire.objets) {
        if(o.status === StatusObjet.objet_ok) {
            inventaire.append(ajouterObjet(o.id, true, null, null));
        }
    }


    // dessiner le combat
    // const initiative = POSITION.resultat.caracteristiqueHero.initiative;
    // document.getElementById("jeter-marqueur-initiative-text").innerHTML = String(initiative);
    document.getElementById("marqueur-distance-text").innerHTML = String(POSITION.resultat.nbDistanceAutorises);
    if(POSITION.resultat.nbDistance > POSITION.resultat.nbDistanceAutorises) {
        document.getElementById("marqueur-distance").classList.add("marqueur-error");
    } else {
        document.getElementById("marqueur-distance").classList.remove("marqueur-error");
    }
    document.getElementById("marqueur-melee-text").innerHTML = String(POSITION.resultat.nbMeleeAutorises);
    if(POSITION.resultat.nbMelee > POSITION.resultat.nbMeleeAutorises) {
        document.getElementById("marqueur-melee").classList.add("marqueur-error");
    } else {
        document.getElementById("marqueur-melee").classList.remove("marqueur-error");
    }
    document.getElementById("marqueur-sort-text").innerHTML = String(POSITION.resultat.nbSortAutorises);
    if(POSITION.resultat.nbSort > POSITION.resultat.nbSortAutorises) {
        document.getElementById("marqueur-sort").classList.add("marqueur-error");
    } else {
        document.getElementById("marqueur-sort").classList.remove("marqueur-error");
    }

    if(POSITION.resultat.attaqueTotalSuccess) {
        document.querySelector("#caracteristique-hero .marqueur-attaque:not(.marqueur-attaque-distance)").classList.add("marqueur-success");
    } else {
        document.querySelector("#caracteristique-hero .marqueur-attaque:not(.marqueur-attaque-distance)").classList.remove("marqueur-success");
    }
    if(POSITION.resultat.attaqueDistanceSuccess) {
        document.querySelector("#caracteristique-hero .marqueur-attaque-distance").classList.add("marqueur-success");
    } else {
        document.querySelector("#caracteristique-hero .marqueur-attaque-distance ").classList.remove("marqueur-success");
    }

    const technique = document.getElementById('technique');
    const sort = document.getElementById('sort');
    const jeter = document.getElementById('jeter');
    const frapper = document.getElementById('frapper');

    technique.innerHTML='';
    sort.innerHTML='';
    jeter.innerHTML='';
    frapper.innerHTML='';

    for(let effetMouvement of POSITION.mouvements) {
        //const mouvement: Mouvement = trouverMouvement(m);
        //const effetMouvement: Mouvement = trouverMouvementDansPosition(POSITION, m);
        const fantome = ajouterObjet(effetMouvement.objet, true, effetMouvement, null);

        // le type 'bloquer' est ajouté à 'frapper'
        let type = effetMouvement.type;
        if(effetMouvement.type === TypeMouvement.bloquer) {
            type = TypeMouvement.frapper;
        }
        document.getElementById( TypeMouvement[type] ).prepend(fantome);
    }


}


function recalculerAventure() {
    const inventaire: Inventaire = {objets:[{...trouverObjet("epee")}], nbRunes: 0, nbPotions: 0, nbLivres: 0};

    const hero: Hero = {
        force: 1,
        courage: 1,
        agilite: 1,
        magie: 1,

        heroSpecial: new _HeroSpecial()
    };

    for(let position of POSITIONS) {

        // traiter les préparatifs
        const preparations: Preparation[] = [];
        for(let preparation of position.preparations) {
            if(preparation.type === TypePreparation.potion && preparation.cible) {
                preparation.id="potion-"+preparations.length;
                preparations.push(preparation);
                if(inventaire.nbPotions > 0) {
                    inventaire.nbPotions --;
                    preparation.status = StatusPreparation.preparation_ok;
                    if(preparation.cible === 'force') hero.force ++;
                    if(preparation.cible === 'endurance') hero.courage ++;
                    if(preparation.cible === 'vitesse') hero.agilite ++;
                    if(preparation.cible === 'mana') hero.magie ++;
                } else {
                    preparation.status = StatusPreparation.preparation_ko;
                }
            }

            if(preparation.type === TypePreparation.rune && preparation.cible) {
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

            if(preparation.type === TypePreparation.livre && preparation.cible) {
                preparation.id="livre-"+preparations.length;
                preparations.push(preparation);
                const cible = preparation.cible;
                if(inventaire.nbLivres > 0 && hero.heroSpecial[cible] < 3) {
                    inventaire.nbLivres --;
                    preparation.status = StatusPreparation.preparation_ok;
                    hero.heroSpecial[cible] ++;
                } else {
                    preparation.status = StatusPreparation.preparation_ko;
                }
            }
        }


        for(let i=0; i<inventaire.nbPotions; i++) {
            preparations.push({cible: null, id: "potion-"+preparations.length, type: TypePreparation.potion, status: StatusPreparation.preparation_ok});
        }
        for(let i=0; i<inventaire.nbRunes; i++) {
            preparations.push({cible: null, id: "rune-"+preparations.length, type: TypePreparation.rune, status: StatusPreparation.preparation_ok});
        }
        for(let i=0; i<inventaire.nbLivres; i++) {
            preparations.push({cible: null, id: "livre-"+preparations.length, type: TypePreparation.livre, status: StatusPreparation.preparation_ok});
        }
        position.preparations = preparations;


        // recopier l'état de l'inventaire, dans l'inventaire de la position
        position.inventaire = {objets:[...inventaire.objets.map(value => {return{...value};})], nbRunes: inventaire.nbRunes, nbPotions: inventaire.nbPotions, nbLivres: inventaire.nbLivres};

        const caracteristique: Caracteristique = {
            attaqueDistance: 0,
            attaqueTotale: 0,
        }

        const ennemi: Caracteristique = {
            attaqueTotale: position.ennemi.attaqueTotale,
            attaqueDistance: position.ennemi.attaqueDistance,
        };
        const nomEnnemi = position.ennemi.nom;

        position.resultat = {
            attaqueDistanceSuccess: false,
            attaqueTotalSuccess: false,
            caracteristiqueEnnemi: ennemi,
            caracteristiqueHero: caracteristique,
            hero: {... hero},
            message: "",
            nbDistanceAutorises: 1,
            nbTechniqueAutorises: 1,
            nbSortAutorises: 0,
            nbMeleeAutorises: 2,
            nbDistance: 0,
            nbTechnique: 0,
            nbSort: 0,
            nbMelee: 0
        };

        const utilisations = {
            technique: 0,
            sort : 0,
            jeter: 0,
            frapper: 0,
            bloquer: 0,
        }

        position.mouvements = [];

        if(hero.heroSpecial.rapide > 0) {
            position.resultat.nbDistanceAutorises ++;
        }

        // voie "PALADIN"
        if(hero.heroSpecial.heroic >= 1) {
            position.resultat.hero.force ++;
            position.resultat.hero.courage ++;
        }

        let charge: Mouvement = null;
        if(hero.heroSpecial.heroic >= 2) {
            position.resultat.hero.force ++;
            charge = new _Mouvement("charge", TypeMouvement.technique,"charge");
            charge.attributs.push(Attribut.force);
        }

        position.resultat.hero.heroSpecial.protecteur = false;
        if(hero.heroSpecial.heroic >= 3) {
            if(position.combat.filter(value => value.indexOf("bouclier") > -1).length === 1) {
                position.resultat.hero.heroSpecial.protecteur = true;
            }
        }

        // voie "MAGE"
        if(hero.heroSpecial.initie > 0) {
            position.resultat.nbSortAutorises += 3;
        }

        // effet automatique : le familier du magicien
        let familier: Mouvement = null;
        if(hero.heroSpecial.initie >= 2) {
            familier = new _Mouvement("familierDuMagicien", TypeMouvement.technique,"familierDuMagicien");
        }

        if(hero.heroSpecial.initie >= 3) {
            position.resultat.hero.magie += 2;
        }

        if(position.ennemi.specials.indexOf(EnnemiSpecial.rapide) > -1) {
            position.resultat.nbDistanceAutorises --;
        }
        if(position.ennemi.specials.indexOf(EnnemiSpecial.lent) > -1) {
            position.resultat.nbDistanceAutorises ++;
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

                // vérifier que si on utilise une arme contre un ennemi éthéré, elle est magique
                if(position.ennemi.specials.indexOf(EnnemiSpecial.ethere) > -1 && objet.type === TypeObjet.arme && objet.niveau <= 1) {
                    effetMouvement.status = StatusMouvement.mouvement_ko;
                    continue;
                }

                appliquerMouvement(effetMouvement, caracteristique, ennemi);

                // on compte le nombre d'utilisation de chaque type
                utilisations[ TypeMouvement[mouvement.type] ] ++;

                if(effetMouvement.id === "batonDeMagicien_frapper") {
                    position.resultat.nbSortAutorises += (objet.niveau-1);
                }

                if(effetMouvement.type === TypeMouvement.sort && familier != null) {
                    fusionnerMouvement(familier, effetMouvement);
                }

            }
        }

        if(familier != null) {
            const effetMouvement = calculerEffetMouvement(position, familier, caracteristique);
            position.mouvements.push(effetMouvement);
            appliquerMouvement(effetMouvement, caracteristique, ennemi);
        }
        if(charge != null) {
            const effetMouvement = calculerEffetMouvement(position, charge, caracteristique);
            position.mouvements.push(effetMouvement);
            appliquerMouvement(effetMouvement, caracteristique, ennemi);
        }

        position.resultat.nbMelee = utilisations.frapper + utilisations.bloquer;
        position.resultat.nbDistance = utilisations.jeter;
        position.resultat.nbSort = utilisations.sort;
        position.resultat.nbTechnique = utilisations.technique;

        position.success = true;
        if(position.resultat.nbMelee > position.resultat.nbMeleeAutorises) {
            position.resultat.message = "Vous ne pouvez pas utiliser autant d'actions de mêlée";
            position.success = false;
        }
        if(position.resultat.nbDistance > position.resultat.nbDistanceAutorises) {
            position.resultat.message = "Vous ne pouvez pas utiliser autant d'actions à distance";
            position.success = false;
        }
        if(position.resultat.nbSort > position.resultat.nbSortAutorises) {
            position.resultat.message = "Vous ne pouvez pas utiliser autant d'actions de sorts";
            position.success = false;
        }
        if(position.resultat.nbTechnique > position.resultat.nbTechniqueAutorises) {
            position.resultat.message = "Vous ne pouvez pas utiliser autant d'actions de techniques";
            position.success = false;
        }

        if(position.success) {
            if (caracteristique.attaqueDistance > ennemi.attaqueDistance) {
                position.resultat.message = "Vous dégommez " + nomEnnemi;
                position.success = true;
                position.resultat.attaqueDistanceSuccess = true;
            } else if (caracteristique.attaqueTotale > ennemi.attaqueTotale) {
                position.resultat.message = "Vous écrasez " + nomEnnemi;
                position.success = true;
                position.resultat.attaqueTotalSuccess = true;
            } else {
                position.resultat.message = "Vous ne faites pas le poids devant " + nomEnnemi;
                position.success = false;
            }
        }


        // récupérer le trésor
        inventaire.nbPotions += position.tresor.nbPotions;
        inventaire.nbRunes += position.tresor.nbRunes;
        inventaire.nbLivres += position.tresor.nbLivres;
        for(let tresor of position.tresor.objets) {
            inventaire.objets.push({...tresor});
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

function trouverPreparationDansPosition(position: Position, id: string) {
    for(let mouvement of position.preparations) {
        if(mouvement.id === id) {
            return mouvement;
        }
    }
    return null;
}

function ajouterObjet(classe: string, deplacable: boolean, mouvement: Mouvement, preparation: Preparation): HTMLDivElement {
    const fantome = document.createElement('div');
    fantome.classList.add("action");
    fantome.classList.add("fantome");
    const objet = document.createElement('div');
    objet.classList.add('objet');
    objet.classList.add(classe);
    objet.setAttribute("tdd-objet", classe);
    if(mouvement && mouvement.type === TypeMouvement.technique) {
        deplacable = false;
    }
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
        document.getElementById( TypeMouvement[type] ).prepend(assiette);

        const objet: Objet = trouverObjetDansPosition(POSITION, mouvement.objet);
        const effetMouvement = calculerEffetMouvement(POSITION, mouvement, POSITION.resultat.caracteristiqueHero);
        if(POSITION.ennemi.specials.indexOf(EnnemiSpecial.ethere) > -1 && objet.niveau <= 1 && objet.type === TypeObjet.arme) {
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
    let niveau : number = objet ? objet.niveau : 1;

    if(hero.heroSpecial.protecteur && mouvement.id.indexOf("bouclier") > -1) {
        niveau *= 2;
    }

    const effetMouvement: Mouvement = {...mouvement};

    for(let attribut of mouvement.attributs) {
        effetMouvement[Attribut[attribut]] += hero[Attribut[attribut]] * niveau;
    }

    const poisonImmune = effetMouvement.glace || position.combat.indexOf("parcheminSoin_sort") > -1;
    const vifImmune = effetMouvement.glace || position.combat.indexOf("parcheminRapidite_sort") > -1;
    const antisortImmune = effetMouvement.glace;
    const terreurImmune = effetMouvement.glace || position.combat.indexOf("parcheminProtection_sort") > -1;

    if(position.ennemi.specials.indexOf(EnnemiSpecial.poison) > -1 && !poisonImmune) {
        effetMouvement.force *= -1;
    }
    if(position.ennemi.specials.indexOf(EnnemiSpecial.vif) > -1 && !vifImmune) {
        effetMouvement.agilite *= -1;
    }
    if(position.ennemi.specials.indexOf(EnnemiSpecial.antisort) > -1 && !antisortImmune) {
        effetMouvement.magie *= -1;
    }
    if(position.ennemi.specials.indexOf(EnnemiSpecial.terreur) > -1 && !terreurImmune) {
        effetMouvement.courage *= -1;
    }

    for(let attribut of mouvement.attributs) {
        if(effetMouvement[Attribut[attribut]] > 0) {
            effetMouvement.attaque += effetMouvement[Attribut[attribut]];
        }
    }

    return effetMouvement;
}

function creerMarqueurs(mouvement: Valeur): HTMLDivElement {
    const marqueurs = document.createElement('div');
    marqueurs.classList.add("marqueurs");

    if(mouvement.status === StatusMouvement.mouvement_ko) {
        return marqueurs;
    }

    if(mouvement.force != 0) {
        const marqueur = document.createElement('div');
        marqueur.classList.add("marqueur");
        marqueur.classList.add("marqueur-attaque");
        if(mouvement.force < 0) {
            marqueur.classList.add("ignore");
        }
        marqueur.innerHTML = "<span>"+String(Math.abs(mouvement.force))+"</span>";
        marqueurs.append(marqueur);
    }

    if(mouvement.courage != 0) {
        const marqueur = document.createElement('div');
        marqueur.classList.add("marqueur");
        marqueur.classList.add("marqueur-defense");
        if(mouvement.courage < 0) {
            marqueur.classList.add("ignore");
        }
        marqueur.innerHTML = "<span>"+String(Math.abs(mouvement.courage))+"</span>";
        marqueurs.append(marqueur);
    }

    if(mouvement.agilite != 0) {
        const marqueur = document.createElement('div');
        marqueur.classList.add("marqueur");
        marqueur.classList.add("marqueur-vitesse");
        if(mouvement.agilite < 0) {
            marqueur.classList.add("ignore");
        }
        marqueur.innerHTML = "<span>"+String(Math.abs(mouvement.agilite))+"</span>";
        marqueurs.append(marqueur);
    }

    if(mouvement.magie > 0) {
        const marqueur = document.createElement('div');
        marqueur.classList.add("marqueur");
        marqueur.classList.add("marqueur-mana");
        if(mouvement.magie < 0) {
            marqueur.classList.add("ignore");
        }
        marqueur.innerHTML = "<span>"+String(Math.abs(mouvement.magie))+"</span>";
        marqueurs.append(marqueur);
    }

    return marqueurs;
}

function choisirPosition(id: string) {
    POSITION = trouverPosition(id);
    document.getElementById("scene-presentator").classList.add("flipped");
    document.getElementById("presentation").className = "face "+POSITION.presentation;
    let message = "<span>"+POSITION.message+"</span>";
    if(POSITION.ennemi.specials.indexOf(EnnemiSpecial.ethere) > -1) {
        message += "<span class='presentation-alerte'>Ethéré ! les armes sans runes n'ont aucun effet sur lui</span>";
    }
    if(POSITION.ennemi.specials.indexOf(EnnemiSpecial.terreur) > -1) {
        message += "<span class='presentation-alerte'>Terreur : votre courage est réduit à 0 face à cet ennemi</span>";
    }
    if(POSITION.ennemi.specials.indexOf(EnnemiSpecial.poison) > -1) {
        message += "<span class='presentation-alerte'>Poison : votre force est réduite à 0 face à cet ennemi</span>";
    }
    if(POSITION.ennemi.specials.indexOf(EnnemiSpecial.antisort) > -1) {
        message += "<span class='presentation-alerte'>Antisort : votre magie est réduite à 0 face à cet ennemi</span>";
    }
    if(POSITION.ennemi.specials.indexOf(EnnemiSpecial.vif) > -1) {
        message += "<span class='presentation-alerte'>Vif : votre agilite est réduite à 0 face à cet ennemi</span>";
    }
    if(POSITION.ennemi.specials.indexOf(EnnemiSpecial.rapide) > -1) {
        message += "<span class='presentation-alerte'>Rapide : vous avez une attaque à distance de moins face à cet ennemi</span>";
    }
    if(POSITION.ennemi.specials.indexOf(EnnemiSpecial.lent) > -1) {
        message += "<span class='presentation-alerte'>Lent : vous avez une attaque à distance de plus face à cet ennemi</span>";
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
    } else if (cible === "livre") {
        details = "LIVRE" +
            "TODO LIVRE</p>";
    } else {
        const objet: Objet = trouverObjet(cible);
        details = objet.details;
    }


    document.getElementById("details").innerHTML = details;
}

function fusionnerMouvement(cible: Mouvement, ajout: Mouvement) {
    for(let a of ajout.attributs) {
        if(cible.attributs.indexOf(a) === -1) {
            cible.attributs.push(a);
        }
    }

    cible.feu = cible.feu || ajout.feu;
    cible.glace = cible.glace || ajout.glace;
}

function appliquerMouvement(effetMouvement: Mouvement, caracteristique: Caracteristique, ennemi: Caracteristique) {
    caracteristique.attaqueTotale += effetMouvement.attaque;
    if(effetMouvement.distance) {
        caracteristique.attaqueDistance += effetMouvement.attaque;
    }
    if(effetMouvement.feu) {
        ennemi.attaqueTotale -= effetMouvement.attaque;
    }
}