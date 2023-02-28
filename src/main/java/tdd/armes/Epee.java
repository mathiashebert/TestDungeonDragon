package tdd.armes;

import tdd.Mouvement;

public interface Epee extends Arme {
    /**
     * mouvement avec attaque:1 et défense:1
     * chaque rune ajoute attaque:+1 et défense+1
     */
    Mouvement frapper();
}