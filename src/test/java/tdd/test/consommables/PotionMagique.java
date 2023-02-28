package tdd.test.consommables;

import static tdd.AdventureTest.*;

public class PotionMagique implements tdd.consommables.PotionMagique  {

    boolean vide = false;

    @Override
    public void boire(Choix choix) {
        info("--> boire ("+choix+")");

        if(vide) {
            fail("Cette potion a déjà été utilisée");
            return;
        }
        if(scenario.getScene().ennemi != null) {
            fail("Vous n'avez pas le temps de faire ça, il y a un ennemi");
            return;
        }
        switch (choix) {
            case INTELLIGENCE: hero.intelligence ++; break;
            case FORCE: hero.force ++; break;
            case ENDURANCE: hero.endurance ++; break;
            case AGILITE: hero.agilite ++; break;
        }
        this.vide = true;
    }
}