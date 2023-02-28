package tdd;

import tdd.consommables.PotionMagique;

public class Adventure3 extends Adventure {

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
        inventaire.rune().graver(inventaire.lance());
        hero.avancer();

        // araignée
        hero.combattre(inventaire.manuelDeLAventurier().positionDefensive(), inventaire.lance().frapper(), inventaire.bouclier().bloquer());
        hero.fouiller();
        hero.avancer();

        // fantomes
        hero.combattre(inventaire.manuelDeLAventurier().positionDefensive(), inventaire.lance().frapper(), inventaire.dague().frapper());
        hero.fouiller();
        inventaire.potion().boire(PotionMagique.Choix.ENDURANCE);
        inventaire.rune().graver(inventaire.lance());
        hero.avancer();

        // sorcière
        hero.combattre(inventaire.manuelDeLAventurier().positionDefensive(), inventaire.lance().frapper(), inventaire.dague().frapper());
        hero.fouiller();
        inventaire.potion().boire(PotionMagique.Choix.ENDURANCE);
        inventaire.potion().boire(PotionMagique.Choix.ENDURANCE);
        hero.avancer();

        // ghoul
        hero.combattre(inventaire.manuelDeLAventurier().positionDefensive(), inventaire.bouclierDeGlace().bloquer(), inventaire.hacheDeGlace().bloquer());
        hero.fouiller();
        inventaire.rune().graver(inventaire.lance());
        hero.avancer();

        // loup-garou
        // inventaire.rune().graver(inventaire.bouclierDeGlace());
        hero.combattre(inventaire.manuelDuMage().enchantement(inventaire.lance(), inventaire.rune(), inventaire.murDeGivre()), inventaire.bouclierDeGlace().bloquer(), inventaire.lance().frapper());
        hero.fouiller();
        hero.avancer();

        // citrouilles
        hero.combattre(inventaire.manuelDeLAventurier().positionDefensive(), inventaire.bouclierDeGlace().bloquer(), inventaire.hacheDeGlace().bloquer());
        hero.fouiller();
        hero.avancer();

        // épouventail
        hero.combattre(inventaire.manuelDuVoleur().attaqueSournoise(inventaire.lance().frapper()), inventaire.bouclierDeGlace().bloquer());
        hero.fouiller();
        hero.avancer();

        // banshee
        hero.combattre(inventaire.manuelDuVoleur().piege(inventaire.bouclierDeFeu().bloquer()));
        hero.fouiller();
        inventaire.potion().boire(PotionMagique.Choix.FORCE);
        inventaire.rune().graver(inventaire.lance());

        // vampire
        hero.avancer();
        hero.combattre(inventaire.manuelDuVoleur().coupFatal(inventaire.lance().jeter()));

    }

}
