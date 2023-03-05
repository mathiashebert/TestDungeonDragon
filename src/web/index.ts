document.addEventListener('DOMContentLoaded', function() {
    recalculerAventure();
    dessinerPosition();

}, false);

let DRAG : Drag = {
    drag_offset_x: 0,
    drag_offset_y: 0,
    element: undefined
}

const POSITIONS: Position[] = [
    {
        id: "position-1",
        message: "vous arrivez devant le manoir, armé de votre seule épée. Un squelette garde le portail.",
        resultat: "",
        success: false,
        inventaire: null,
        combat: [],
        tresor: {objets:["lance", "bouclier"], nbPotions: 0, nbRunes:0},
        ennemi: {
            nom: "le squelette",
            attaque: 1,
            defense: 1,
            vitesse: 1
        }
    },
    {
        id: "position-2",
        message: "Vous entrez dans le manoir. Le hall est rempli de zombies, qui se dirigent alors vers vous... lentement...",
        resultat: "Vous devez combattre les zombies",
        success: false,
        inventaire: null,
        combat: [],
        tresor: {objets:["manuelAventurier"], nbPotions: 1, nbRunes:1},
        ennemi: {
            nom: "les zombies",
            attaque: 4,
            defense: 4,
            vitesse: 0
        }
    }
];

let POSITION: Position = POSITIONS[0];

const MOUVEMENTS: Mouvement[] = [
    {id: "epee_frapper", type: "frapper", objet:"epee", attaque: 1, defense: 1, mana: 0, vitesse: 0, distance: false, feu: false, glace: false},
    {id: "lance_frapper", type: "frapper", objet:"lance", attaque: 2, defense: 0, mana: 0, vitesse: 0, distance: false, feu: false, glace: false},
    {id: "lance_jeter", type: "jeter", objet:"lance", attaque: 2, defense: 0, mana: 0, vitesse: 0, distance: true, feu: false, glace: false},
    {id: "bouclier_bloquer", type: "bloquer", objet:"bouclier", attaque: 0, defense: 2, mana: 0, vitesse: 0, distance: false, feu: false, glace: false},
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
    }
]

interface Drag {
    element : HTMLElement;
    drag_offset_x: number;
    drag_offset_y: number;
}

interface Position {
    id: string;
    message: string;
    combat: string[];
    resultat: string;
    success: boolean;
    inventaire: Inventaire;
    tresor: Inventaire;
    ennemi: Ennemi;
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

        // vérifier si c'est un niveau, qui est cliqué
        if(target?.classList?.contains('level')) {
            POSITION = trouverPosition(target.getAttribute('id'));
            dessinerPosition();
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

                for(let j = 0; j < o.classList.length; j++) {
                    const objet = trouverObjet(o.classList.item(j));
                    if(objet) {
                        for(let mouvementId of objet.mouvements) {
                            const mouvement: Mouvement = trouverMouvement(mouvementId);
                            if(o.getAttribute("tdd-mouvement") === mouvement.id) {
                                ajouterAssiette(null); // si le mouvement est déjà celui selectionné, on ajoute l'assiette dans l'inventaire
                            } else {
                                ajouterAssiette(mouvement); // sinon on ajoute l'aciette normalement
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
    })

    body.addEventListener('touchend', function(e) {
        if (!DRAG.element) return;

        let assiettes = document.getElementsByClassName("assiette-hover");
        for(let i = 0; i < assiettes.length; i++) {
            const o = assiettes.item(i);
            mettreDansAssiette(DRAG.element, o);
            break;
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

function mettreDansAssiette(objet, assiette) {
    console.log("mettre dans assiette");

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
    message.innerHTML = POSITION.message;

    const resultat = document.getElementById('resultat');
    resultat.innerHTML = POSITION.resultat;
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

    // dessiner l'inventaire
    const inventaire = document.getElementById('inventaire');
    inventaire.innerHTML = '';
    for(let o of POSITION.inventaire.objets) {
        inventaire.append(ajouterObjet(o, true, null));
    }

    // dessiner le combat
    var technique = document.getElementById('technique');
    var sort = document.getElementById('sort');
    var jeter = document.getElementById('jeter');
    var frapper = document.getElementById('frapper');
    var bloquer = document.getElementById('bloquer');

    technique.innerHTML='';
    sort.innerHTML='';
    jeter.innerHTML='';
    frapper.innerHTML='';
    bloquer.innerHTML='';

    for(let m of POSITION.combat) {
        const mouvement: Mouvement = trouverMouvement(m);
        const fantome = ajouterObjet(mouvement.objet, true, mouvement)
        switch (mouvement.type) {
            case 'technique': technique.prepend(fantome); break;
            case 'sort': sort.prepend(fantome); break;
            case 'jeter': jeter.prepend(fantome); break;
            case 'frapper': frapper.prepend(fantome); break;
            case 'bloquer': bloquer.prepend(fantome); break;
        }
    }


}


function recalculerAventure() {
    const inventaire: Inventaire = {objets:["epee"], nbRunes: 0, nbPotions: 0};

    const hero = {
        force: 1,
        endurance: 1,
        agilite: 1,
        intelligence: 1
    };

    for(let position of POSITIONS) {
        position.inventaire = {objets:[...inventaire.objets], nbRunes: inventaire.nbRunes, nbPotions: inventaire.nbPotions};

        const caracteristique = {
            attaqueDistance: 0,
            attaque: 0,
            defense: 0,
            mana: hero.intelligence,
            vitesse: hero.agilite
        }

        const ennemi = {...position.ennemi};
        const references = [];

        const utilisations = {
            technique: 0,
            sort : 0,
            jeter: 0,
            frapper: 0,
            bloquer: 0
        }


        if(position.combat.length === 0) {
            position.resultat = "Vous devez combattre "+ennemi.nom;
        } else {
            // resoudre le combat

            for(let mouvement of MOUVEMENTS) {
                if(position.combat.indexOf(mouvement.id) > -1) {
                    console.log(mouvement);

                    const objet = trouverObjet(mouvement.objet);
                    utilisations[mouvement.type] ++;

                    // enlever les objets utilisés de l'inventaire
                    enleverDuTableau(position.inventaire.objets, mouvement.objet);

                    // vérifier qu'on utilise un objet une seule fois
                    if(references.indexOf(mouvement.objet) > -1) {
                        continue;
                    }
                    references.push(mouvement.objet);

                    // ajouter l'attaque
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

                    if(mouvement.distance) {
                        caracteristique.attaqueDistance += attaque;
                    }
                    caracteristique.attaque += attaque;
                    caracteristique.defense += defense;
                    caracteristique.vitesse += vitesse;
                    caracteristique.mana += mana;

                    if(mouvement.feu) {
                        ennemi.defense -= (attaque+defense);
                    }
                    if(mouvement.glace) {
                        ennemi.attaque -= (attaque+defense);
                    }

                }
            }

            console.log("attaque: "+caracteristique.attaque+" defense: "+caracteristique.defense);

            let initiative = caracteristique.vitesse - ennemi.vitesse;
            if(initiative <= 0) initiative = 0;

            if(utilisations.bloquer + utilisations.frapper > 2) {
                position.resultat = "Vous n'avez que 2 mains, vous ne pouvez utiliser que 2 mouvements bloquer et/ou frapper";
                position.success = false;
            } else if(utilisations.technique > 1) {
                position.resultat = "Vous ne pouvez utiliser qu'une seule tehcnique";
                position.success = false;
            } else if(utilisations.jeter > 0 && initiative <= 0) {
                position.resultat = "Vous n'êtes pas assez rapide, vous ne pouvez rien jeter";
                position.success = false;
            } else if(initiative < utilisations.jeter) {
                position.resultat = "Vous n'êtes pas assez rapide, vous ne pouvez  choisir que "+initiative+" mouvement jeter";
                position.success = false;
            }

            else if(caracteristique.attaqueDistance > ennemi.defense) {
                position.resultat = "Vous écrasez "+ennemi.nom;
                position.success = true;
            } else if(ennemi.defense <= 0) {
                position.resultat = "Vous carbonisez "+ennemi.nom;
                position.success = true;
            } else if(ennemi.attaque <= 0) {
                position.resultat = "Vous congelez "+ennemi.nom;
                position.success = true;
            } else if(ennemi.attaque >= caracteristique.defense) {
                position.resultat = ennemi.nom + " a une attaque trop forte";
                position.success = false;
            } else if(ennemi.defense >= caracteristique.attaque) {
                position.resultat = ennemi.nom + " a une defense trop forte";
                position.success = false;
            } else {
                position.resultat = "Vous écrasez "+ennemi.nom;
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

function ajouterObjet(classe: string, deplacable: boolean, mouvement: Mouvement): HTMLDivElement {
    const fantome = document.createElement('div');
    fantome.classList.add("action");
    fantome.classList.add("fantome");
    const objet = document.createElement('div');
    objet.classList.add('objet');
    objet.classList.add(classe);
    if(deplacable) {
        objet.classList.add('deplacable');
    } if(mouvement) {
        objet.setAttribute("tdd-mouvement", mouvement.id);
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
        document.getElementById(mouvement.type).prepend(assiette);
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