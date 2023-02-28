package tdd;


/**
 * Le hero permet de faire les actions
 * * avancer
 * * fouiller
 * * combattre
 * -----------
 * Le héro a egalement 4 caractéristiques de combats :
 * * la force. En combat elle s'additionne à l'attaque de chaque mouvement "jeter" et "frapper"
 * * l'endurance. En combat elle s'additionne à la defense de chaque mouvement "frapper" et "bloquer"
 * * l'intelligence. Elle sert de base à votre mana.
 * * l'agilité. Elle sert de base à votre vitesse. En combat, si votre vitesse est supérieure à celle de l'ennemi, vous pouvez utiliser autant de mouvements "jeter" ou "tirer" que la différence
 *
 */
public interface Hero {
    /**
     * avancer vous permet d'atteindre la salle suivante et donc de couvrir plus de tests
     */
    void avancer();

    /**
     * fouiller vous permet de trouver des objets, qui seront disponibles dans votre inventaire
     */
    void fouiller();

    /**
     * combattre permet de vaincre un ennemi
     * il prend en paramètre un ensemble de mouvements (l'odre n'a pas d'importance)
     * de manière générale vous pouvez utiliser :
     * * 1 mouvement de "technique"
     * * 1 ou 2 mouvements d'attaque de mélée (frapper ou bloquer)
     * * autant de mouvements d'attaque à distance (jeter ou tirer) que votre avantage de vitesse
     * Vous ne pouvez pas utiliser 2 fois la même arme
     */
    void combattre(Mouvement... mouvements);

}