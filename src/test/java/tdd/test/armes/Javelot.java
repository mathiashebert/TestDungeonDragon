package tdd.test.armes;

import tdd.test.Mouvement;

import static tdd.AdventureTest.hero;

public class Javelot extends  Arme implements tdd.armes.Javelot {

    public Javelot() {
        super("le javelot");
    }

    @Override
    public Mouvement jeter() {
        return new Mouvement(Mouvement.Type.JETER, 3*niveau + hero.force, 0, 0, true, this);
    }
}