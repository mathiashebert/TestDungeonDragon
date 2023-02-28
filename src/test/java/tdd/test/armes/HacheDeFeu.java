package tdd.test.armes;

import tdd.test.Mouvement;

import static tdd.AdventureTest.hero;

public class HacheDeFeu extends Arme implements tdd.armes.HacheDeFeu {

    public HacheDeFeu() {
        super("la hache de feu");
        niveau = 0;
    }

    @Override
    public Mouvement jeter() {
        Mouvement jeter = new Mouvement(Mouvement.Type.JETER, 1*niveau + hero.force, 0, 0, true, this);
        jeter.feu = true;
        return jeter;
    }

    @Override
    public Mouvement bloquer() {
        Mouvement bloquer = new Mouvement(Mouvement.Type.BLOQUER, 0, 1*niveau + hero.endurance, 0, false, this);
        bloquer.feu = true;
        return bloquer;
    }
}