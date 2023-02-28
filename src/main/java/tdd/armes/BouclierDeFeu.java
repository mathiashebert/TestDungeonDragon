package tdd.armes;

import tdd.Mouvement;

public interface BouclierDeFeu extends  Arme {

    /**
     * mouvement avec defense 0
     * chaque rune ajoute defense:+2
     * ce blocage diminue la défense de l'ennemi d'autant
     * si la défense de l'ennemi devient négative, il est éliminé
     */
    Mouvement bloquer();
}