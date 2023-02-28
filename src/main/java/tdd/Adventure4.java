package tdd;

import tdd.consommables.PotionMagique;

public class Adventure4 extends Adventure {

    /**
     * méthode à implémenter
     * @param hero le hero de l'aventure
     * @param inventaire l'inventaire du héro
     */
    public void launch(Hero hero, Inventaire inventaire) {
        hero.fouiller();
        hero.avancer();

        // squelette
        hero.combattre(inventaire.epee().frapper());
        hero.fouiller();
        hero.avancer();

        //zombies
        hero.combattre(inventaire.lance().jeter(), inventaire.epee().frapper(), inventaire.bouclier().bloquer());
        hero.fouiller();
        inventaire.potion().boire(PotionMagique.Choix.ENDURANCE);
        inventaire.rune().graver(inventaire.epee());
        hero.avancer();

        // araignée
        hero.combattre(inventaire.manuelDeLAventurier().positionDefensive(), inventaire.epee().frapper(), inventaire.lance().frapper());
        hero.fouiller();
        hero.avancer();

        // fantomes
        hero.combattre(inventaire.manuelDeLAventurier().positionDefensive(), inventaire.epee().frapper(), inventaire.dague().frapper());
        hero.fouiller();
        inventaire.potion().boire(PotionMagique.Choix.FORCE);
        hero.avancer();

        // sorcière
        hero.combattre(inventaire.manuelDeLAventurier().positionDefensive(), inventaire.lance().frapper(), inventaire.epee().frapper());
        hero.fouiller();
        inventaire.potion().boire(PotionMagique.Choix.FORCE);
        inventaire.potion().boire(PotionMagique.Choix.ENDURANCE);
        hero.avancer();

        // ghoul
        hero.combattre(inventaire.manuelDeLAventurier().reflexes(), inventaire.lance().jeter(), inventaire.bouclierDeGlace().bloquer(), inventaire.epee().frapper(), inventaire.dague().jeter(), inventaire.hacheDeGlace().jeter());
        hero.fouiller();
        inventaire.rune().graver(inventaire.epee());
        inventaire.rune().graver(inventaire.epee());
        inventaire.rune().graver(inventaire.epee());
        hero.avancer();

        // loup-garou
        hero.combattre(inventaire.manuelDuBarbare().baston(), inventaire.lance().frapper(), inventaire.epee().frapper(), inventaire.marteauDeForge().frapper());
        // hero.fouiller();
        // hero.avancer();

        // citrouilles
        hero.combattre(inventaire.manuelDuBarbare().baston(), inventaire.lance().frapper(), inventaire.epee().frapper(), inventaire.marteauDeForge().frapper());
        // hero.fouiller();
        // hero.avancer();

        // épouventail
        hero.combattre(inventaire.manuelDuBarbare().baston(), inventaire.lance().frapper(), inventaire.epee().frapper(), inventaire.marteauDeForge().frapper());
        //hero.fouiller();
        // hero.avancer();

        // banshee
        hero.combattre(inventaire.manuelDuBarbare().baston(), inventaire.bouclierDeGlace().bloquer(), inventaire.marteauDeForge().bloquer(), inventaire.epee().frapper());
        //hero.fouiller();
        //inventaire.potion().boire(PotionMagique.Choix.FORCE);
        //inventaire.rune().graver(inventaire.bouclierDeFeu());

        // vampire
        // hero.avancer();
        hero.combattre(inventaire.manuelDuBarbare().baston(), inventaire.bouclierDeGlace().bloquer(), inventaire.epee().frapper(), inventaire.marteauDeForge().frapper());
    }

}
