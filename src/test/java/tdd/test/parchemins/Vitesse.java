package tdd.test.parchemins;

import tdd.test.Mouvement;

import static tdd.AdventureTest.hero;

public class Vitesse extends Parchemin implements tdd.parchemins.Vitesse {

    public Vitesse() {
        super("vitesse");
    }

    @Override
    public Mouvement sort() {
        int mana = hero.intelligence;
        Mouvement sort = new Mouvement(tdd.Mouvement.Type.SORT, 0, 0, mana, true, this);
        return  sort;
    }
}
