package tdd.parchemins;

import tdd.Mouvement;
import tdd.Objet;

/**
 * les parchemins permettent de lancer des sorts
 * ce sont des objets consommables (vous ne pouvez lancer le sort qu'une seule fois, à moins d'avoir le manuel du mage)
 * quand vous lancez un sort, la puissance du sort dépend de la quantité de mana investie
 */
public interface Parchemin extends Objet {
    Mouvement sort();
}
