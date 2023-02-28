package tdd.armes;

import tdd.Mouvement;

public interface Javelot extends  Arme {

    /**
     * mouvement avec attaque:3
     * chaque rune ajoute defense:+3
     */
    Mouvement jeter();
}