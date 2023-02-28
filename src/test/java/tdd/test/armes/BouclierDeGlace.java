package tdd.test.armes;

import tdd.test.Mouvement;

import static tdd.AdventureTest.hero;

public class BouclierDeGlace extends  Arme implements tdd.armes.BouclierDeGlace {

    public BouclierDeGlace() {
        super("le bouclier de glace");
        niveau = 0;
    }

    @Override
    public Mouvement bloquer() {
        Mouvement bloquer = new Mouvement(Mouvement.Type.BLOQUER, 0, 2*niveau + hero.endurance, 0, false,this);
        bloquer.glace = true;
        return bloquer;
    }
}