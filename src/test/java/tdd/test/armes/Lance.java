package tdd.test.armes;


import tdd.test.Mouvement;

import static tdd.AdventureTest.hero;

public class Lance extends Arme implements tdd.armes.Lance {

    public Lance() {
        super("la lance");
    }

    @Override
    public Mouvement frapper() {
        return new Mouvement(Mouvement.Type.FRAPPER, 2*niveau + hero.force, hero.endurance, 0, false, this);
    }
    @Override
    public Mouvement jeter() {
        return new Mouvement(Mouvement.Type.JETER, 2*niveau + hero.force, 0, 0, true, this);
    }
}