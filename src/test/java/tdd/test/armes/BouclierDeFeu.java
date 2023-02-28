package tdd.test.armes;

import tdd.test.Mouvement;

import static tdd.AdventureTest.hero;

public class BouclierDeFeu extends Arme implements tdd.armes.BouclierDeFeu {

    public BouclierDeFeu() {
        super("le bouclier de feu");
        niveau = 0;
    }

    @Override
    public Mouvement bloquer() {
        Mouvement bloquer = new Mouvement(Mouvement.Type.BLOQUER, 0, 2*niveau + hero.endurance, 0, false, this);
        bloquer.feu = true;
        return bloquer;
    }
}