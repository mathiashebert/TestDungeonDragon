package tdd.test.armes;

import tdd.test.Mouvement;

import static tdd.AdventureTest.hero;

public class MarteauDeForge extends Arme implements tdd.armes.MarteauDeForge {

    public MarteauDeForge() {
        super("le marteau de forge");
    }

    @Override
    public Mouvement bloquer() {
        return new Mouvement(Mouvement.Type.BLOQUER, 0, 1*niveau + hero.endurance, 0, false, this);
    }

    @Override
    public Mouvement frapper() {
        return new Mouvement(Mouvement.Type.FRAPPER, 1*niveau + hero.force, hero.endurance, 0, false, this);
    }
}