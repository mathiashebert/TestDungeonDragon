document.addEventListener('DOMContentLoaded', function() {
    recalculerAventure();
    dessinerPosition();
    choisirPosition("position-1");

}, false);

interface Drag {
    element : HTMLElement;
    drag_offset_x: number;
    drag_offset_y: number;
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
interface Mouvement {
    id: string;
    type: TypeMouvement;
    objet: string;

    attaque: number;
    defense: number;
    vitesse: number;
    mana: number;

    distance: boolean;
    feu: boolean;
    glace: boolean;

    status: StatusMouvement;
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

interface Caracteristique {
    attaqueDistance: number,
    attaque: number,
    defense: number,
    mana: number,
    vitesse: number
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
        hero: {force: 1, endurance: 1, vitesse: 1, mana: 1},
        caracteristiqueHero: {attaqueDistance: 0, attaque: 0, defense: 0, mana: 0, vitesse: 0},
        caracteristiqueEnnemi: {attaqueDistance: 0, attaque: 0, defense: 0, mana: 0, vitesse: 0}
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

    constructor(id: string, type: TypeObjet) {
        this.id = id;
        this.type = type;
    }

}


let DRAG : Drag = {
    drag_offset_x: 0,
    drag_offset_y: 0,
    element: undefined
}

const OBJETS: Objet[] = [
    {
        ... new _Objet("epee", TypeObjet.arme),
        mouvements: ["epee_frapper"]
    },
    {
        ... new _Objet("lance", TypeObjet.arme),
        mouvements: ["lance_frapper", "lance_jeter"]
    },
    {
        ... new _Objet("bouclier", TypeObjet.arme),
        id: "bouclier",
        mouvements: ["bouclier_bloquer"]
    },
    {
        ... new _Objet("dagueRunique", TypeObjet.arme),
        niveau: 2,
        mouvements: ["dagueRunique_jeter", "dagueRunique_frapper"]
    },
    {
        ... new _Objet("hacheDeGlace", TypeObjet.arme),
        niveau: 1,
        mouvements: ["hacheDeGlace_jeter", "hacheDeGlace_bloquer"]
    },
    {
        ... new _Objet("bouclierDeGlace", TypeObjet.arme),
        niveau: 1,
        mouvements: ["bouclierDeGlace_bloquer"]
    },
    {
        ... new _Objet("hacheDeFeu", TypeObjet.arme),
        niveau: 1,
        mouvements: ["hacheDeFeu_jeter", "hacheDeFeu_bloquer"]
    },
    {
        ... new _Objet("bouclierDeFeu", TypeObjet.arme),
        niveau: 1,
        mouvements: ["bouclierDeFeu_bloquer"]
    },

    {
        ... new _Objet("manuelAventurier", TypeObjet.livre),
        mouvements: ["manuelAventurier_concentration", "manuelAventurier_reflexes", "manuelAventurier_positionDefensive", "manuelAventurier_positionAggressive"]
    },
    {
        ... new _Objet("manuelBarbare", TypeObjet.livre),
        mouvements: ["manuelBarbare_baston"]
    },

    {
        ... new _Objet("parcheminProjectileMagique", TypeObjet.parchemin),
        mouvements: ["parcheminProjectileMagique_sort"]
    },
    {
        ... new _Objet("parcheminMurDeGlace", TypeObjet.parchemin),
        mouvements: ["parcheminMurDeGlace_sort"]
    },
    {
        ... new _Objet("parcheminBouleDeFeu", TypeObjet.parchemin),
        mouvements: ["parcheminBouleDeFeu_sort"]
    },
    {
        ... new _Objet("parcheminRapidite", TypeObjet.parchemin),
        mouvements: ["parcheminRapidite_sort"]
    },
]

let POSITION_DECOUVERTE:number = 9; // commence à 0

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
        tresor: {objets:[trouverObjet("manuelAventurier")], nbPotions: 1, nbRunes:1},
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
            nom: "l'araiegnée",
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
        tresor: {objets:[trouverObjet("parcheminRapidite")], nbPotions: 1, nbRunes:1},
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
        tresor: {objets:[trouverObjet("hacheDeGlace"), trouverObjet("bouclierDeGlace"), trouverObjet("parcheminMurDeGlace")], nbPotions: 2, nbRunes:0},
        ennemi: {
            nom: "la socrière",
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
        tresor: {objets:[], nbPotions: 0, nbRunes:2},
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
        tresor: {objets:[], nbPotions: 0, nbRunes:0},
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
    {... new _Mouvement("manuelBarbare_baston", TypeMouvement.technique, "manuelBarbare"), attaque: 3, defense: 3},

    {... new _Mouvement("parcheminProjectileMagique_sort", TypeMouvement.sort, "parcheminProjectileMagique")},
    {... new _Mouvement("parcheminMurDeGlace_sort", TypeMouvement.sort, "parcheminMurDeGlace")},
    {... new _Mouvement("parcheminBouleDeFeu_sort", TypeMouvement.sort, "parcheminBouleDeFeu")},
    {... new _Mouvement("parcheminRapidite_sort", TypeMouvement.sort, "parcheminRapidite")},
    {... new _Mouvement("parcheminTelekinesie_sort", TypeMouvement.sort, "parcheminTelekinesie")},
    {... new _Mouvement("parcheminMetamorphose_sort", TypeMouvement.sort, "parcheminMetamorphose")},

    {... new _Mouvement("epee_frapper", TypeMouvement.frapper, "epee"), attaque: 1, defense: 1},
    {... new _Mouvement("lance_frapper", TypeMouvement.frapper, "lance"), attaque: 2},
    {... new _Mouvement("lance_jeter", TypeMouvement.jeter, "lance"), attaque: 2},
    {... new _Mouvement("bouclier_bloquer", TypeMouvement.bloquer, "bouclier"), defense: 2},
    {... new _Mouvement("dagueRunique_jeter", TypeMouvement.jeter, "dagueRunique"), attaque: 1},
    {... new _Mouvement("dagueRunique_frapper", TypeMouvement.frapper, "dagueRunique"), attaque: 1},
    {... new _Mouvement("hacheDeGlace_jeter", TypeMouvement.jeter, "hacheDeGlace"), attaque: 1, glace: true},
    {... new _Mouvement("hacheDeGlace_bloquer", TypeMouvement.frapper, "hacheDeGlace"), glace: true},
    {... new _Mouvement("bouclierDeGlace_bloquer", TypeMouvement.bloquer, "bouclierDeGlace"), defense: 2, glace: true},
    {... new _Mouvement("hacheDeFeu_jeter", TypeMouvement.jeter, "hacheDeFeu"), attaque: 1, feu: true},
    {... new _Mouvement("hacheDeFeu_bloquer", TypeMouvement.frapper, "hacheDeFeu"), feu: true},
    {... new _Mouvement("bouclierDeFeu_bloquer", TypeMouvement.bloquer, "bouclierDeFeu"), defense: 2, feu: true},

]





window.oncontextmenu = function() {
    return false;
}
window.onload = function() {

    document.getElementById("presentation").addEventListener("touchstart", function(e) {
        document.getElementById("scene-presentator").classList.remove("flipped");
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
    console.log("choisir evidence", objet, evidence);

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
    console.log("mettre dans assiette", objet, assiette);

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

    // écrire les attributs
    document.getElementById("attribut-force").innerHTML = String(POSITION.resultat.hero.force);
    document.getElementById("attribut-endurance").innerHTML = String(POSITION.resultat.hero.endurance);
    document.getElementById("attribut-vitesse").innerHTML = String(POSITION.resultat.hero.vitesse);
    document.getElementById("attribut-mana").innerHTML = String(POSITION.resultat.hero.mana);

    // ecrire le resultat
    const resultat = document.getElementById('resultat');
    const resultatMessage = document.getElementById('resultat-message');
    const caracteristiqueHero = document.getElementById('caracteristique-hero');
    const caracteristiqueEnnemi = document.getElementById('caracteristique-ennemi');
    resultatMessage.innerHTML = POSITION.resultat.message;

    document.getElementById("total-attaque-distance-hero").innerHTML = String(POSITION.resultat.caracteristiqueHero.attaqueDistance);
    document.getElementById("total-attaque-hero").innerHTML = String(POSITION.resultat.caracteristiqueHero.attaque);
    document.getElementById("total-defense-hero").innerHTML = String(POSITION.resultat.caracteristiqueHero.defense);

    document.getElementById("total-defense-ennemi").innerHTML = String(POSITION.resultat.caracteristiqueEnnemi.defense);
    document.getElementById("total-attaque-ennemi").innerHTML = String(POSITION.resultat.caracteristiqueEnnemi.attaque);

    /*caracteristiqueHero.innerHTML =
        "attaque à distance:"+POSITION.resultat.caracteristiqueHero.attaqueDistance +
        " attaque:"+POSITION.resultat.caracteristiqueHero.attaque +
        " defense:"+POSITION.resultat.caracteristiqueHero.defense;*/
    /*caracteristiqueEnnemi.innerHTML =
        " attaque:"+POSITION.resultat.caracteristiqueEnnemi.attaque +
        " defense:"+POSITION.resultat.caracteristiqueEnnemi.defense;*/

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

    // dessiner l'inventaire
    const inventaire = document.getElementById('inventaire');
    inventaire.innerHTML = '';
    for(let o of POSITION.inventaire.objets) {
        if(o.status === StatusObjet.objet_ok) {
            inventaire.append(ajouterObjet(o.id, true, null, null));
        }
    }

    // dessiner le combat
    const initiative = POSITION.resultat.caracteristiqueHero.vitesse - POSITION.resultat.caracteristiqueEnnemi.vitesse;
    document.getElementById("jeter-marqueur-initiative").innerHTML = String(initiative);

    const technique = document.getElementById('technique');
    const sort = document.getElementById('sort');
    const jeter = document.getElementById('jeter');
    const frapper = document.getElementById('frapper');

    technique.innerHTML='';
    sort.innerHTML='';
    jeter.innerHTML='';
    frapper.innerHTML='';

    for(let m of POSITION.combat) {
        const mouvement: Mouvement = trouverMouvement(m);
        const effetMouvement: Mouvement = trouverMouvementDansPosition(POSITION, m);
        const fantome = ajouterObjet(mouvement.objet, true, effetMouvement, null);

        const type = mouvement.type === TypeMouvement.bloquer ? TypeMouvement.frapper : mouvement.type; // le type 'bloquer' est ajouté à 'frapper'
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

    for(let position of POSITIONS) {
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
            vitesse: hero.vitesse
        }

        const ennemi: Caracteristique = {
            attaqueDistance: 0,
            attaque: position.ennemi.attaque,
            defense: position.ennemi.defense,
            mana: 0,
            vitesse: position.ennemi.vitesse
        };
        const nomEnnemi = position.ennemi.nom;

        position.resultat.caracteristiqueHero = caracteristique;
        position.resultat.caracteristiqueEnnemi = ennemi;

        const utilisations = {
            technique: 0,
            sort : 0,
            jeter: 0,
            frapper: 0,
            bloquer: 0
        }

        position.mouvements = [];

        position.resultat.hero = {... hero};

        const baston = position.mouvements.filter(value => value.id === "manuelBarbare_baston").length > 0;

        if(position.combat.length === 0) {
            position.resultat.message = "Vous devez combattre "+nomEnnemi;
            position.success = false;
        } else {
            // resoudre le combat
            for(let mouvement of MOUVEMENTS) {
                if(position.combat.indexOf(mouvement.id) > -1) {
                    const objet = trouverObjetDansPosition(position, mouvement.objet);

                    // ajouter l'attaque
                    const effetMouvement: Mouvement = calculerEffetMouvement(objet, mouvement, hero, caracteristique);
                    position.mouvements.push(effetMouvement);

                    // vérifier que l'objet est disponible et qu'on l'utilise une seule fois
                    if(objet.status !== StatusObjet.objet_ok) {
                        effetMouvement.status = StatusMouvement.mouvement_ko;
                        continue;
                    }
                    // enlever les objets utilisés de l'inventaire
                    objet.status = StatusObjet.objet_ko;

                    const magique = objet.niveau > 1;

                    // vérifier que si on utilise une arme, elle est magique
                    if(position.ennemi.ethere && objet.type === TypeObjet.arme && !magique) {
                        effetMouvement.status = StatusMouvement.mouvement_ko;
                        continue;
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

            // cas special de la baston du barabre :
            if(baston) {
                if(utilisations.jeter > 0 || utilisations.sort > 0) {
                    position.resultat.message = "Le manuel du barbare ne permet pas de jeter des arme, ou de lancer des sorts";
                    position.success = false;
                }
            } else if(trouverObjetDansInventaire(inventaire, "manuelBarbare")){
                trouverObjetDansInventaire(inventaire, "manuelBarbare").niveau = 1;
            }

            let initiative = caracteristique.vitesse - ennemi.vitesse;
            if(initiative <= 0) initiative = 0;

            if(utilisations.bloquer + utilisations.frapper > 2) {
                position.resultat.message = "Vous n'avez que 2 mains, vous ne pouvez utiliser que 2 mouvements de mélée";
                position.success = false;
            } else if(utilisations.technique > 1) {
                position.resultat.message = "Vous ne pouvez utiliser qu'une seule technique";
                position.success = false;
            } else if(utilisations.jeter > 0 && initiative <= 0) {
                position.resultat.message = "Vous n'êtes pas assez rapide, vous ne pouvez rien jeter";
                position.success = false;
            } else if(initiative < utilisations.jeter) {
                position.resultat.message = "Vous n'êtes pas assez rapide, vous ne pouvez  choisir que "+initiative+" mouvement jeter";
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

        }

        // récupérer le trésor (seulement si on n'a pas de baston)
        if(!baston) {
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

function ajouterObjet(classe: string, deplacable: boolean, mouvement: Mouvement, preparation: Preparation): HTMLDivElement {
    const fantome = document.createElement('div');
    fantome.classList.add("action");
    fantome.classList.add("fantome");
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
        objet.innerHTML=preparation.id;
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
            marqueur.innerHTML = String(reference.niveau);
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
        const type = mouvement.type === TypeMouvement.bloquer ? TypeMouvement.frapper : mouvement.type; // le type 'bloquer' est ajouté à 'frapper'
        document.getElementById( TypeMouvement[type] ).prepend(assiette);

        const objet: Objet = trouverObjetDansPosition(POSITION, mouvement.objet);
        const effetMouvement = calculerEffetMouvement(objet, mouvement, POSITION.resultat.hero, POSITION.resultat.caracteristiqueHero);
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

function calculerEffetMouvement(objet: Objet, mouvement: Mouvement, hero, caracteristique: Caracteristique): Mouvement {

    let attaque = mouvement.attaque * objet.niveau;
    let defense = mouvement.defense * objet.niveau;
    let vitesse = mouvement.vitesse * objet.niveau;
    let mana = mouvement.mana * objet.niveau;

    if(mouvement.type === TypeMouvement.jeter || mouvement.type === TypeMouvement.frapper) {
        attaque += hero.force;
    }
    if(mouvement.type === TypeMouvement.bloquer || mouvement.type === TypeMouvement.frapper) {
        defense += hero.endurance;
    }

    const effetMouvement: Mouvement = {...mouvement};

    // effets speciaux
    switch (mouvement.id) {
        case "parcheminProjectileMagique_sort":
            attaque = caracteristique.mana;
            break;
        case "parcheminMurDeGlace_sort":
            defense = Math.floor(caracteristique.mana/2);
            effetMouvement.glace = true;
            break;
        case "parcheminBouleDeFeu_sort":
            attaque = Math.floor(caracteristique.mana/2);
            effetMouvement.feu = true;
            break;
        case "parcheminRapidite_sort":
            vitesse = caracteristique.mana;
            break;
    }

    effetMouvement.attaque = attaque;
    effetMouvement.defense = defense;
    effetMouvement.vitesse = vitesse;
    effetMouvement.mana = mana;

    return effetMouvement;
}

function creerMarqueurs(mouvement: Mouvement): HTMLDivElement {
    const marqueurs = document.createElement('div');
    marqueurs.classList.add("marqueurs");
    if(mouvement.status === StatusMouvement.mouvement_ko) {
        return marqueurs;
    }

    if(mouvement.attaque > 0) {
        const marqueur = document.createElement('div');
        marqueur.classList.add("marqueur");
        marqueur.classList.add("marqueur-attaque");
        if(mouvement.distance) {
            marqueur.classList.add("marqueur-attaque-distance");
        }
        marqueur.innerHTML = String(mouvement.attaque);
        marqueurs.append(marqueur);
    }

    if(mouvement.defense > 0) {
        const marqueur = document.createElement('div');
        marqueur.classList.add("marqueur");
        marqueur.classList.add("marqueur-defense");
        marqueur.innerHTML = String(mouvement.defense);
        marqueurs.append(marqueur);
    }

    if(mouvement.vitesse > 0) {
        const marqueur = document.createElement('div');
        marqueur.classList.add("marqueur");
        marqueur.classList.add("marqueur-vitesse");
        marqueur.innerHTML = String(mouvement.vitesse);
        marqueurs.append(marqueur);
    }

    if(mouvement.mana > 0) {
        const marqueur = document.createElement('div');
        marqueur.classList.add("marqueur");
        marqueur.classList.add("marqueur-mana");
        marqueur.innerHTML = String(mouvement.mana);
        marqueurs.append(marqueur);
    }

    return marqueurs;
}

function choisirPosition(id: string) {
    POSITION = trouverPosition(id);
    document.getElementById("scene-presentator").classList.add("flipped");
    document.getElementById("presentation").className = "face "+POSITION.presentation;
    let message = POSITION.message;
    if(POSITION.ennemi.ethere) {
        message += "<div class='presentation-alerte'>L'ennemi est éthéré<br>Les armes sans runes n'ont aucun effet sur lui</div>";
    }
    message += "<div class='continue'>-></div>";
    document.getElementById("presentation-message").innerHTML = message;

    document.getElementById("caracteristique-ennemi").className = "level "+POSITION.presentation;
}