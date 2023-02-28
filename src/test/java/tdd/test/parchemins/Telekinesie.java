package tdd.test.parchemins;

import tdd.test.Mouvement;

import static tdd.AdventureTest.hero;

public class Telekinesie extends Parchemin implements tdd.parchemins.Telekinesie {

    public Telekinesie() {
        super("telekinesie");
    }

    @Override
    public Mouvement sort() {
        int mana = hero.intelligence;
        Mouvement sort = new Mouvement(tdd.Mouvement.Type.SORT, 0, 0, 0, true, this);
        sort.armesSupplementaires = mana /3;
        return  sort;
    }
}
