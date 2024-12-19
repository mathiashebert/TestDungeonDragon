package tdd;

import tdd.consommables.PotionMagique;

public class Adventure {

    /**
     * méthode à implémenter
     * @param hero le hero de l'aventure
     * @param inventaire l'inventaire du héro
     */
    public void aventure(Hero hero, Inventaire inventaire) {
        hero.fouiller();

        hero.avancer(); // squelette
        hero.combattre(inventaire.epee().frapper());
        hero.fouiller();

        hero.avancer(); // zombies
        hero.combattre(inventaire.lance().jeter(), inventaire.epee().frapper(), inventaire.bouclier().bloquer());
        hero.fouiller();

        inventaire.potion().boire(PotionMagique.Choix.ENDURANCE);
        inventaire.rune().graver(inventaire.lance());
        hero.avancer(); // areignée
        hero.combattre(inventaire.manuelDeLAventurier().positionDefensive(), inventaire.lance().frapper(), inventaire.bouclier().bloquer());

        hero.fouiller();
    }

}
