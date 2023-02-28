package tdd.livres;

import tdd.Mouvement;
import tdd.armes.Arme;
import tdd.consommables.RuneMagique;
import tdd.parchemins.Parchemin;

/**
 * le manuel du mage est un livre détaillant l'utilisation des parchemins magiques
 * plus vous l'utiliser, plus ce sera efficace
 */
public interface ManuelDuMage extends Livre {

    /**
     * choisissez un parchemin.
     * à chaque autre utilisation de ce livre : vous pouvez choisir un parchemin supplémentaire
     * vous obtenez un sort, qui combine l'effet de tous les parchemins choisis (attaques, defenses, feu, glace...)
     * la quantité de mana reçue pour CHAQUE sort correspond à l'intelligence du hero
     * Les parchemins ne sont pas perdus, ils pourront être à nouveau utilisés au prochain combat
     */
    Mouvement rituel(Parchemin... parchemins);

    /**
     * idem que pour un rituel
     * sauf qu'en plus l'effet du sort combiné est ajouté aux effet d'une arme (passée en paramètre)
     * L'arme devient magique (contre les ennemis étherés)
     * L'effet de l'enchantement est temporaire : il ne dure que le temps d'un combat
     * Cette action consomme une rune, aussi (passée en paramétre)
     */
    Mouvement enchantement(Arme arme, RuneMagique rune, Parchemin... parchemins);

}
