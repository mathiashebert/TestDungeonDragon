package tdd.test.armes;

import tdd.test.Mouvement;

import static tdd.AdventureTest.hero;

public class HacheDeGlace extends  Arme implements tdd.armes.HacheDeGlace {

    public HacheDeGlace() {
        super("la hache de glace");
        niveau = 0;
    }

    @Override
    public Mouvement jeter() {
        Mouvement jeter = new Mouvement(Mouvement.Type.JETER, 1*niveau + hero.force, 0, 0, true, this);
        jeter.glace = true;
        return jeter;
    }

    @Override
    public Mouvement bloquer() {
        Mouvement bloquer = new Mouvement(Mouvement.Type.BLOQUER, 0, 1*niveau + hero.endurance, 0, false, this);
        bloquer.glace = true;
        return  bloquer;
    }
}