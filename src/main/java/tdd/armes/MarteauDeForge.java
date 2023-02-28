package tdd.armes;

import tdd.Mouvement;

public interface MarteauDeForge extends  Arme {
    /**
     * mouvement avec attaque:1
     * chaque rune ajoute attaque:+1
     */
    Mouvement frapper();

    /**
     * mouvement avec defense:1
     * chaque fois que vous gravez une rune sur une autre arme, ajoute ici defense:+1
     */
    Mouvement bloquer();
}