document.addEventListener('DOMContentLoaded', function() {
    dessinerPosition("position-1");

}, false);

var dragging = null;
var dragging_fantome = null;
var drag_offset_x;
var drag_offset_y;

var POSITION;

var POSITIONS = {
    "position-1": {
        message: "vous arrivez devant le manoir, armé de votre seule épée. Un squelette garde le portail.",
        resultat: "Vous devez combattre le squelette",
        success: false,
        inventaire: ["epee", "lance", "bouclier"],
        combat: [{mouvement: "epee_frapper"}],
        tresor: ["lance", "bouclier"],
        ennemi: {}
    },
    "position-2": {
        message: "Vous entrez dans le manoir. Le hall est rempli de zombies, qui se dirigent alors vers vous... lentement...",
        resultat: "Vous devez combattre les zombies",
        success: false,
        inventaire: ["epee"],
        combat: [],
        ennemi: {}
    }
};

var MOUVEMENTS = {
    epee_frapper: {id: "epee_frapper", type: "frapper", objet:"epee"},
    lance_frapper: {id: "lance_frapper", type: "frapper", objet:"lance"},
    lance_jeter: {id: "lance_jeter", type: "jeter", objet:"lance"},
    bouclier_bloquer: {id: "bouclier_bloquer", type: "bloquer", objet:"bouclier"},
}

var OBJETS = {
    "epee": {
        mouvements: ["epee_frapper"]
    },
    "lance": {
        mouvements: ["lance_frapper", "lance_jeter"]
    },
    "bouclier": {
        mouvements: ["bouclier_bloquer"]
    }
}


window.onload = function() {
    // find the element that you want to drag.
    var body = document.getElementById('body');

    body.addEventListener('touchstart', function(e) {
        // grab the location of touch
        var touchLocation = e.targetTouches[0];
        var x = touchLocation.pageX ;
        var y = touchLocation.pageY ;

        console.log('touchstart', touchLocation);

        // vérifier si c'est un niveau, qui est cliqué
        if(touchLocation?.target?.classList?.contains('level')) {
            dessinerPosition(touchLocation.target.getAttribute('id'));
            return;
        }

        // chercher si c'est une carte qui est cliquée
        var objets = document.getElementsByClassName("objet");
        for(let o of objets) {
            var rect = o.getBoundingClientRect();

            if( x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                console.log("trouvé", o);

                drag_offset_x = x - rect.left;
                drag_offset_y = y - rect.top;

                o.classList.add("dragging");
                o.style.left = (x - drag_offset_x) + 'px';
                o.style.top = (y - drag_offset_y) + 'px';
                dragging = o;
                dragging_fantome = o.parentElement;

                for(let c of o.classList) {
                    if(OBJETS[c]) {
                        const objet = OBJETS[c];
                        for(let mouvementId of objet.mouvements) {
                            const mouvement = MOUVEMENTS[mouvementId];
                            console.log(mouvement);
                            const assiette = document.createElement('div');
                            assiette.classList.add('action');
                            assiette.classList.add('assiette');
                            assiette.classList.add('en-construction');
                            assiette.setAttribute("tdd-mouvement", mouvementId);
                            document.getElementById(mouvement.type).prepend(assiette);

                            setTimeout(function() { assiette.classList.remove('en-construction') }, 100);
                        }
                    }
                }
            }
        }

    })

    /* listen to the touchMove event,
    every time it fires, grab the location
    of touch and assign it to box */

    body.addEventListener('touchmove', function(e) {
        // grab the location of touch
        var touchLocation = e.targetTouches[0];

        var x = touchLocation.pageX ;
        var y = touchLocation.pageY ;
        dragging.style.left = (x - drag_offset_x) + 'px';
        dragging.style.top = (y - drag_offset_y) + 'px';

        // detecter un bloc d'actions
        var objets = document.getElementsByClassName("actions");
        for(let o of objets) {
            var rect = o.getBoundingClientRect();

            if( x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                o.classList.add("actions-hover");
            } else {
                o.classList.remove("actions-hover");
            }
        }
        objets = document.getElementsByClassName("assiette");
        for(let o of objets) {
            var rect = o.getBoundingClientRect();

            if( x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                o.classList.add("assiette-hover");
            } else {
                o.classList.remove("assiette-hover");
            }
        }

        // assign box new coordinates based on the touch.
        //box.style.left = touchLocation.pageX + 'px';
        //box.style.top = touchLocation.pageY + 'px';
    })

    /* record the position of the touch
    when released using touchend event.
    This will be the drop position. */

    body.addEventListener('touchend', function(e) {
        if (!dragging) return;

        let objets = document.getElementsByClassName("assiette-hover");
        for(let o of objets) {
            const actions = o.parentElement;
            const position = actions.parentElement;
            console.log(o, actions, position);
            mettreDansAssiette(dragging, o);
            break;
        }

        objets = document.getElementsByClassName("actions");
        for(let o of objets) {
            o.classList.remove("actions-hover");
        }
        objets = document.getElementsByClassName("assiette");
        for(let o of objets) {
            o.classList.add("en-construction");
            setTimeout(function (){ o.remove()}, 1000);
        }


        dragging.classList.remove("dragging");
        dragging = null;
    })

}

function mettreDansAssiette(objet, assiette) {
    console.log("mettre dans assiette");

    var old_fantome = objet.parentElement;
    old_fantome.classList.add("en-construction");

    assiette.classList.remove("assiette");
    assiette.classList.remove("assiette-hover");
    assiette.classList.add("fantome");

    assiette.prepend(objet);

    POSITION.combat.push({mouvement:assiette.getAttribute("tdd-mouvement")});


    setTimeout(function(){
        old_fantome.parentNode.removeChild(old_fantome);
    }, 1000);
}

function dessinerPosition(positionId) {
    var position = POSITIONS[positionId];
    POSITION = position;
    var message = document.getElementById('message');
    message.innerHTML = position.message;

    var resultat = document.getElementById('resultat');
    resultat.innerHTML = position.resultat;
    if(position.success) {
        resultat.classList.remove("fail");
        resultat.classList.add("success");
    } else {
        resultat.classList.add("fail");
        resultat.classList.remove("success");
    }

    var inventaire = document.getElementById('inventaire');
    inventaire.innerHTML = '';
    for(let o of position.inventaire) {
        var fantome = document.createElement('div');
        fantome.classList.add("action");
        fantome.classList.add("fantome");
        inventaire.append(fantome);
        var objet = document.createElement('div');
        objet.classList.add('objet');
        objet.classList.add(o);
        fantome.append(objet);
    }

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

    for(let o of position.combat) {
        const mouvement = MOUVEMENTS[o.mouvement];
        var fantome = document.createElement('div');
        fantome.classList.add("action");
        fantome.classList.add("fantome");
        switch (mouvement.type) {
            case 'technique': technique.prepend(fantome); break;
            case 'sort': sort.prepend(fantome); break;
            case 'jeter': jeter.prepend(fantome); break;
            case 'frapper': frapper.prepend(fantome); break;
            case 'bloquer': bloquer.prepend(fantome); break;
        }
        var objet = document.createElement('div');
        objet.classList.add('objet');
        objet.classList.add(mouvement.objet);
        fantome.append(objet);
    }


}


function recalculerAventure() {
    const inventaire = ["epee"];
    let nbPotion = 0;
    let nbRunes = 0;

    const hero = {
        force: 1,
        endurance: 1,
        agilite: 1,
        intelligence: 1
    };

    for(let position of POSITIONS) {

        const ennemi = position.ennemi;
        let attaqueDistance = 0;
        let attaqueTotale = 0;
        let defense = 0;
        const nbActions = {
            technique: 0,
            sort: 0,
            jeter: 0,
            frapper: 0,
            bloquer: 0
        }

        const references = [];
        const errors = [];

        for(let mouvementId of position.combat) {
            nbActions[mouvement.actions] ++;

            if(references.includes(mouvement.reference)) {
                errors.push("Vous ne pouvez utiliser "+mouvement.reference+" qu'une seule fois");
                continue;
            }
            references.push(mouvement.reference);


        }


    }
}