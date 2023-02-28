package tdd.armes;

import tdd.Mouvement;


/**
 * la dague est une arme magique
 * elle a déjà une rune quand vous la trouvez
 * (du coup, au début elle a déjà attaque:2)
 *
 */
public interface Dague extends Arme {
    /**
     * mouvement avec attaque:2 (parce qu'il y a déjà une rune dessus)
     * chaque rune ajoute attaque:+1
     */
    Mouvement jeter();

    /**
     * mouvement avec attaque:2 (parce qu'il y a déjà une rune dessus)
     * chaque rune ajoute attaque:+1
     */
    Mouvement frapper();
}