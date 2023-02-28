package tdd.test.armes;

import tdd.test.Mouvement;

import static tdd.AdventureTest.hero;

public class Bouclier extends Arme implements tdd.armes.Bouclier {

    public Bouclier() {
        super("le bouclier");
    }

    @Override
    public Mouvement bloquer() {
        return new Mouvement(Mouvement.Type.BLOQUER, 0, 2*niveau + hero.endurance, 0, false, this);
    }
}