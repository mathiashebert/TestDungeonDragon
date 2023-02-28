package tdd.test.consommables;

import tdd.test.armes.Arme;

import static tdd.AdventureTest.*;

public class RuneMagique implements tdd.consommables.RuneMagique {

    boolean vide = false;

    @Override
    public void graver(tdd.armes.Arme arme) {
        Arme a = (Arme) arme;
        info("--> graver ("+a.nom+")");

        if(vide) {
            fail("Cette rune a déjà été utilisée");
            return;
        }
        if(scenario.getScene().ennemi != null) {
            fail("Vous n'avez pas le temps de faire ça, il y a un ennemi");
        }

        a.niveau ++;
        this.vide = true;

        if(!a.equals(inventaire.marteauDeForge)) {
            inventaire.marteauDeForge.niveau ++;
        }
    }
}