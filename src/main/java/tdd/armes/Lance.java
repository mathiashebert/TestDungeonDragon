package tdd.armes;

import tdd.Mouvement;


public interface Lance extends Arme {
    /**
     * mouvement avec attaque:2
     * chaque rune ajoute attaque+2
     */
    Mouvement jeter();
    /**
     * mouvement avec attaque:2
     * chaque rune ajoute attaque+2
     */
    Mouvement frapper();
}