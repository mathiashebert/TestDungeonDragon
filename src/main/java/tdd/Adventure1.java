package tdd;

import tdd.consommables.PotionMagique;

public class Adventure1 extends Adventure {

    /**
     * méthode à implémenter
     * @param hero le hero de l'aventure
     * @param inventaire l'inventaire du héro
     */
    public void aventure(Hero hero, Inventaire inventaire) {
        hero.fouiller();
        hero.avancer();

        // squelette
        hero.combattre(inventaire.epee().frapper());
        hero.fouiller();
        hero.avancer();

        //zombies
        hero.combattre(inventaire.lance().jeter(), inventaire.epee().frapper(), inventaire.bouclier().bloquer());
        hero.fouiller();
        inventaire.potion().boire(PotionMagique.Choix.AGILITE);
        inventaire.rune().graver(inventaire.lance());
        hero.avancer();

        // araignée
        hero.combattre(inventaire.manuelDeLAventurier().reflexes(), inventaire.lance().jeter());
        hero.fouiller();
        hero.avancer();

        // fantomes
        hero.combattre(inventaire.manuelDeLAventurier().reflexes(), inventaire.lance().jeter(), inventaire.dague().jeter());
        hero.fouiller();
        inventaire.potion().boire(PotionMagique.Choix.FORCE);
        inventaire.rune().graver(inventaire.lance());
        hero.avancer();

        // sorcière
        hero.combattre(inventaire.manuelDeLAventurier().reflexes(), inventaire.lance().jeter(), inventaire.dague().jeter());
        hero.fouiller();
        inventaire.potion().boire(PotionMagique.Choix.FORCE);
        inventaire.potion().boire(PotionMagique.Choix.AGILITE);
        hero.avancer();

        // ghoul
        hero.combattre(inventaire.manuelDeLAventurier().reflexes(), inventaire.lance().jeter(), inventaire.hacheDeGlace().jeter(),inventaire.dague().jeter());
        hero.fouiller();
        inventaire.rune().graver(inventaire.javelot());
        inventaire.rune().graver(inventaire.javelot());
        hero.avancer();

        // loup-garou
        hero.combattre(inventaire.manuelDeLAventurier().reflexes(), inventaire.lance().jeter(), inventaire.javelot().jeter(), inventaire.dague().jeter());
        hero.fouiller();

        // citrouilles
        hero.avancer();
        hero.combattre(inventaire.manuelDeLAventurier().reflexes(), inventaire.lance().jeter(), inventaire.javelot().jeter(), inventaire.dague().jeter(), inventaire.hacheDeGlace().jeter());
        hero.fouiller();
        hero.avancer();

        // épouvantail
        hero.combattre(inventaire.manuelDeLAventurier().reflexes(), inventaire.lance().jeter(), inventaire.javelot().jeter(), inventaire.dague().jeter(), inventaire.hacheDeGlace().jeter());
        hero.fouiller();
        hero.avancer();

        // banshee
        hero.combattre(inventaire.manuelDeLAventurier().reflexes(), inventaire.javelot().jeter());
        hero.fouiller();
        inventaire.potion().boire(PotionMagique.Choix.AGILITE);
        inventaire.rune().graver(inventaire.javelot());

        // vampire
        hero.avancer();
        hero.combattre(inventaire.manuelDeLAventurier().reflexes(), inventaire.lance().jeter(), inventaire.hacheDeFeu().jeter(), inventaire.javelot().jeter(), inventaire.bouclierDeFeu().bloquer());
    }

}
