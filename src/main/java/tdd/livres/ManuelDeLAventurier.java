package tdd.livres;

import tdd.Mouvement;

/**
 * le manuel de l'aventurier est un livre expliquant toutes les bonnes combines pour partir à l'aventure
 * plus vous l'utiliser, plus ce sera efficace
 */
public interface ManuelDeLAventurier extends Livre {

    /**
     * mouvement de combat avec attaque:1
     * à chaque utilisation supplémentaire de ce livre : attaque:+1
     */
    Mouvement positionAgressive();

    /**
     * mouvement de combat avec defense:1
     * à chaque utilisation supplémentaire de ce livre : defense:+1
     */
    Mouvement positionDefensive();

    /**
     * mouvement de combat avec vitesse:1
     * à chaque utilisation supplémentaire de ce livre : vitesse:+1
     */
    Mouvement reflexes();
}
