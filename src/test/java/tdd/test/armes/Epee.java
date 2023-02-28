package tdd.test.armes;

import tdd.test.Mouvement;

import static tdd.AdventureTest.hero;

public class Epee extends Arme implements tdd.armes.Epee {

    public Epee() {
        super("l'épée");
    }

    @Override
    public Mouvement frapper() {
        return new Mouvement(Mouvement.Type.FRAPPER, 1*niveau + hero.force, 1*niveau + hero.endurance, 0, false, this);
    }
}
