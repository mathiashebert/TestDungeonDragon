package tdd.test.armes;

import tdd.test.Mouvement;

import static tdd.AdventureTest.hero;

public class Dague extends Arme implements tdd.armes.Dague {

    public Dague() {
        super("la dague");
        niveau = 2;
    }

    @Override
    public Mouvement jeter() {
        return new Mouvement(Mouvement.Type.JETER, 1*niveau + hero.force, 0, 0, true, this);
    }

    @Override
    public Mouvement frapper() {
        return new Mouvement(Mouvement.Type.FRAPPER, 1*niveau + hero.force, hero.endurance, 0, false, this);
    }
}