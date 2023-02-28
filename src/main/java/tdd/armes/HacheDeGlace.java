package tdd.armes;

import tdd.Mouvement;

public interface HacheDeGlace extends  Arme {
    /**
     * mouvement avec attaque:0
     * chaque rune ajoute attaque:+1
     * cette attaque diminue l'attaque de l'ennemi d'autant
     * si l'attaque de l'ennemi devient négative, il est éliminé
     */
    Mouvement jeter();

    /**
     * mouvement avec defense:0
     * chaque rune ajoute defense:+1
     * ce blocage diminue l'attaque de l'ennemi d'autant
     * si l'attaque de l'ennemi devient négative, il est éliminé
     */
    Mouvement bloquer();
}