package tdd.armes;

import tdd.Mouvement;


public interface Bouclier extends Arme {
    /**
     * mouvement avec défense:2
     * chaque rune ajoute défense+2
     */
    Mouvement bloquer();
}