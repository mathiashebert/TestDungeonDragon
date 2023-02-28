package tdd.armes;

import tdd.Mouvement;

public interface HacheDeFeu extends  Arme {
    /**
     * mouvement avec attaque:0
     * chaque rune ajoute attaque:+1
     * cette attaque diminue la défense de l'ennemi d'autant
     * si la défense de l'ennemi devient négative, il est éliminé
     */
    Mouvement jeter();

    /**
     * mouvement avec defense 0
     * chaque rune ajoute defense:+1
     * ce blocage diminue la défense de l'ennemi d'autant
     * si la défense de l'ennemi devient négative, il est éliminé
     */
    Mouvement bloquer();
}