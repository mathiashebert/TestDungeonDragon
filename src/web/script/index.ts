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
    combat: string[];
    resultat: ResultatCombat;
    success: boolean;
    inventaire: Inventaire;
    tresor: Inventaire;
    ennemi: Ennemi;
    mouvements: Mouvement[],
    presentation: string,
}

interface Ennemi {
    nom: string;
    attaque: number;
    defense: number;
    vitesse: number;
}

interface Objet {
    id: string;
    mouvements: string[];
    niveau: number;
}

interface Mouvement {
    id: string;
    type: string;
    objet: string;

    attaque: number;
    defense: number;
    vitesse: number;
    mana: number;

    distance: boolean;
    feu: boolean;
    glace: boolean;
}

interface Inventaire {
    objets: string[];
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
    type: string;
    vitesse: number = 0;

    constructor(id: string, type: string, objet: string) {
        this.id = id;
        this.type = type;
        this.objet = objet;
    }

}


let DRAG : Drag = {
    drag_offset_x: 0,
    drag_offset_y: 0,
    element: undefined
}

const POSITIONS: Position[] = [
    {
        ... new _Position("position-1"),
        message: "vous arrivez devant le manoir, armé de votre seule épée. Un squelette garde le portail.",
        tresor: {objets:["lance", "bouclier"], nbPotions: 0, nbRunes:0},
        ennemi: {
            nom: "le squelette",
            attaque: 1,
            defense: 1,
            vitesse: 1
        },
        presentation: "skeleton",
    },
    {
        ... new _Position("position-2"),
        message: "Vous entrez dans le manoir. Le hall est rempli de zombies, qui se dirigent alors vers vous... lentement...",
        tresor: {objets:["manuelAventurier"], nbPotions: 1, nbRunes:1},
        ennemi: {
            nom: "le zombie",
            attaque: 4,
            defense: 4,
            vitesse: 0
        },
        presentation: "zombie",
    },
    {
        ... new _Position("position-3"),
        message: "Vous entrez une petite salle remplie de toilles d'areignées. Une areignée géante vénimeuse vous tombe soudain dessus.",
        tresor: {objets:[], nbPotions: 0, nbRunes:0},
        ennemi: {
            nom: "l'areiegnée",
            attaque: 6,
            defense: 4,
            vitesse: 1
        },
        presentation: "spider",
    }
];

let POSITION: Position = POSITIONS[0];

const MOUVEMENTS: Mouvement[] = [
    {... new _Mouvement("manuelAventurier_positionAggressive", "technique", "manuelAventurier"), attaque: 1},
    {... new _Mouvement("manuelAventurier_positionDefensive", "technique", "manuelAventurier"), defense: 1},
    {... new _Mouvement("manuelAventurier_reflexes", "technique", "manuelAventurier"), vitesse: 1},
    {... new _Mouvement("manuelAventurier_concentration", "technique", "manuelAventurier"), mana: 1},

    {... new _Mouvement("epee_frapper", "frapper", "epee"), attaque: 1, defense: 1},
    {... new _Mouvement("lance_frapper", "frapper", "lance"), attaque: 2},
    {... new _Mouvement("lance_jeter", "jeter", "lance"), attaque: 2, distance: true},
    {... new _Mouvement("bouclier_bloquer", "bloquer", "bouclier"), defense: 2}
]

const OBJETS: Objet[] = [
    {
        id: "epee",
        mouvements: ["epee_frapper"],
        niveau: 1
    },
    {
        id: "lance",
        mouvements: ["lance_frapper", "lance_jeter"],
        niveau: 1
    },
    {
        id: "bouclier",
        mouvements: ["bouclier_bloquer"],
        niveau: 1
    },
    {
        id: "manuelAventurier",
        mouvements: ["manuelAventurier_concentration", "manuelAventurier_reflexes", "manuelAventurier_positionDefensive", "manuelAventurier_positionAggressive"],
        niveau: 1
    }
]




window.oncontextmenu = function() {
    return false;
}
window.onload = function() {
    // find the element that you want to drag.
    const body = document.getElementById('body');

    body.addEventListener('touchstart', function(e) {

        // grab the location of touch
        const touchLocation: Touch = e.targetTouches[0];
        const x = touchLocation.pageX ;
        const y = touchLocation.pageY ;

        const target: any = touchLocation.target;

        if(target?.getAttribute("id") === "presentation") {
            document.getElementById("scene-presentator").classList.remove("flipped");
            return;
        }

        if(target?.getAttribute("id") === "message") {
            document.getElementById("scene-presentator").classList.add("flipped");
            return;
        }

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
                } else if(objetReference === 'rune') {
                    // gérer de pouvoir cibler une arme

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

        // retirer les assiettes
        assiettes = document.getElementsByClassName("assiette");
        for(let i = 0; i < assiettes.length; i++) {
            const o = assiettes.item(i);
            o.classList.add("en-construction");
            setTimeout(function (){ o.remove()}, 1000);
        }

        DRAG.element.classList.remove("dragging");
        DRAG.element = null;
    })

}

function choisirEvidence(objet: Element, evidence: Element) {
    console.log("choisir evidence", objet, evidence);

    const attribut = evidence.getAttribute("tdd-attribut");
    if(attribut) {

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
    console.log("ancien mouvement", objet.getAttribute("tdd-mouvement"));
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
    const message = document.getElementById('message');
    message.innerHTML = "<- "+POSITION.message;

    const pause = document.getElementById("pause-actions");
    // ecrire la pause
    for(let i=0; i<POSITION.inventaire.nbPotions; i++) {
        pause.append(ajouterObjet('potion', true, null));
    }
    for(let i=0; i<POSITION.inventaire.nbRunes; i++) {
        pause.append(ajouterObjet('rune', true, null));
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
    caracteristiqueHero.innerHTML =
        "attaque à distance:"+POSITION.resultat.caracteristiqueHero.attaqueDistance +
        " attaque:"+POSITION.resultat.caracteristiqueHero.attaque +
        " defense:"+POSITION.resultat.caracteristiqueHero.defense;
    caracteristiqueEnnemi.innerHTML =
        " attaque:"+POSITION.resultat.caracteristiqueEnnemi.attaque +
        " defense:"+POSITION.resultat.caracteristiqueEnnemi.defense;

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
        tresor.append(ajouterObjet(o, false, null));
    }
    for(let i=0; i<POSITION.tresor.nbPotions; i++) {
        tresor.append(ajouterObjet('potion', false, null));
    }
    for(let i=0; i<POSITION.tresor.nbRunes; i++) {
        tresor.append(ajouterObjet('rune', false, null));
    }

    // dessiner l'inventaire
    const inventaire = document.getElementById('inventaire');
    inventaire.innerHTML = '';
    for(let o of POSITION.inventaire.objets) {
        inventaire.append(ajouterObjet(o, true, null));
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
        const fantome = ajouterObjet(mouvement.objet, true, effetMouvement)
        switch (mouvement.type) {
            case 'technique': technique.prepend(fantome); break;
            case 'sort': sort.prepend(fantome); break;
            case 'jeter': jeter.prepend(fantome); break;
            case 'frapper': frapper.prepend(fantome); break;
            case 'bloquer': frapper.prepend(fantome); break;
        }
    }


}


function recalculerAventure() {
    const inventaire: Inventaire = {objets:["epee"], nbRunes: 0, nbPotions: 0};

    const hero: Hero = {
        force: 1,
        endurance: 1,
        vitesse: 1,
        mana: 1
    };

    for(let position of POSITIONS) {
        position.inventaire = {objets:[...inventaire.objets], nbRunes: inventaire.nbRunes, nbPotions: inventaire.nbPotions};

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

        const references = [];

        const utilisations = {
            technique: 0,
            sort : 0,
            jeter: 0,
            frapper: 0,
            bloquer: 0
        }

        position.mouvements = [];

        position.resultat.hero = {... hero};

        if(position.combat.length === 0) {
            position.resultat.message = "Vous devez combattre "+nomEnnemi;
            position.success = false;
        } else {
            // resoudre le combat

            for(let mouvement of MOUVEMENTS) {
                if(position.combat.indexOf(mouvement.id) > -1) {
                    console.log(mouvement);

                    utilisations[mouvement.type] ++;

                    // vérifier qu'on utilise un objet une seule fois
                    if(references.indexOf(mouvement.objet) > -1) {
                        continue;
                    }
                    references.push(mouvement.objet);

                    // vérifier que l'objet est disponibles ?


                    // enlever les objets utilisés de l'inventaire
                    enleverDuTableau(position.inventaire.objets, mouvement.objet);

                    // ajouter l'attaque
                    const effetMouvement: Mouvement = calculerEffetMouvement(mouvement, hero);
                    position.mouvements.push(effetMouvement);

                    if(effetMouvement.distance) {
                        caracteristique.attaqueDistance += effetMouvement.attaque;
                    }
                    caracteristique.attaque += effetMouvement.attaque;
                    caracteristique.defense += effetMouvement.defense;
                    caracteristique.vitesse += effetMouvement.vitesse;
                    caracteristique.mana += effetMouvement.mana;

                    if(mouvement.feu) {
                        ennemi.defense -= (effetMouvement.attaque + effetMouvement.defense);
                    }
                    if(mouvement.glace) {
                        ennemi.attaque -= (effetMouvement.attaque + effetMouvement.defense);
                    }

                }
            }

            console.log("attaque: "+caracteristique.attaque+" defense: "+caracteristique.defense);

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

            else if(caracteristique.attaqueDistance > ennemi.defense) {
                position.resultat.message = "Vous écrasez "+nomEnnemi;
                position.success = true;
            } else if(ennemi.defense <= 0) {
                position.resultat.message = "Vous carbonisez "+nomEnnemi;
                position.success = true;
            } else if(ennemi.attaque <= 0) {
                position.resultat.message = "Vous congelez "+nomEnnemi;
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

        // récupérer les armes

        // récupérer le trésor
        inventaire.nbPotions += position.tresor.nbPotions;
        inventaire.nbRunes += position.tresor.nbRunes;
        inventaire.objets = [...inventaire.objets, ...position.tresor.objets];

        // gérer la pause

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

function ajouterObjet(classe: string, deplacable: boolean, mouvement: Mouvement): HTMLDivElement {
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
        let type = mouvement.type;
        if(type === 'bloquer') {
            type = 'frapper';
        }
        document.getElementById(type).prepend(assiette);

        const effetMouvement = calculerEffetMouvement(mouvement, POSITION.resultat.hero);
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

function calculerEffetMouvement(mouvement: Mouvement, hero): Mouvement {
    const objet: Objet = trouverObjet(mouvement.objet);

    let attaque = mouvement.attaque * objet.niveau;
    let defense = mouvement.defense * objet.niveau;
    let vitesse = mouvement.vitesse * objet.niveau;
    let mana = mouvement.mana * objet.niveau;

    if(mouvement.type === 'jeter' || mouvement.type === 'frapper') {
        attaque += hero.force;
    }
    if(mouvement.type === 'bloquer' || mouvement.type === 'frapper') {
        defense += hero.endurance;
    }

    const effetMouvement: Mouvement = {...mouvement};

    effetMouvement.attaque = attaque;
    effetMouvement.defense = defense;
    effetMouvement.vitesse = vitesse;
    effetMouvement.mana = mana;

    return effetMouvement;
}

function creerMarqueurs(mouvement: Mouvement): HTMLDivElement {
    const marqueurs = document.createElement('div');
    marqueurs.classList.add("marqueurs");

    if(mouvement.attaque > 0) {
        const marqueur = document.createElement('div');
        marqueur.classList.add("marqueur");
        marqueur.classList.add("marqueur-attaque");
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
    document.getElementById("presentation-message").innerHTML = POSITION.message+"<div class='continue'>-></div>";
}