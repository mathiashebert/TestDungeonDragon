package tdd.test.parchemins;

import tdd.test.Mouvement;

import static tdd.AdventureTest.hero;

public class BouleDeFeu extends Parchemin implements tdd.parchemins.BouleDeFeu {

    public BouleDeFeu() {
        super("boule de feu");
    }

    @Override
    public Mouvement sort() {
        int mana = hero.intelligence;
        Mouvement sort = new Mouvement(tdd.Mouvement.Type.SORT, mana / 2, 0, 0, true, this);
        sort.feu = true;
        return  sort;
    }
}
