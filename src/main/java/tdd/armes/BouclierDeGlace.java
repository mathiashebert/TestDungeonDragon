package tdd.armes;

import tdd.Mouvement;

public interface BouclierDeGlace extends  Arme {

    /**
     * mouvement avec defense:0
     * chaque rune ajoute defense:+2
     * ce blocage diminue l'attaque de l'ennemi d'autant
     * si l'attaque de l'ennemi devient négative, il est éliminé
     */
    Mouvement bloquer();
}