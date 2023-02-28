package tdd.test.parchemins;

import tdd.test.Mouvement;

import static tdd.AdventureTest.hero;

public class Metamorphose extends Parchemin implements tdd.parchemins.Metamorphose {

    public Metamorphose() {
        super("metamorphose");
    }

    @Override
    public Mouvement sort() {
        int mana = hero.intelligence;
        Mouvement sort = new Mouvement(tdd.Mouvement.Type.SORT, 0, 0, 0, true, this);
        sort.metabolisme += mana/3;
        return  sort;
    }
}
