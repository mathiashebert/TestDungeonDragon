package tdd.test.parchemins;

import tdd.test.Mouvement;

import static tdd.AdventureTest.hero;

public class MurDeGivre extends Parchemin implements tdd.parchemins.MurDeGivre {

    public MurDeGivre() {
        super("mur de givre");
    }

    @Override
    public Mouvement sort() {
        int mana = hero.intelligence;
        Mouvement sort = new Mouvement(tdd.Mouvement.Type.SORT,  0, mana/2, 0, true, this);
        sort.glace = true;
        return  sort;
    }
}
