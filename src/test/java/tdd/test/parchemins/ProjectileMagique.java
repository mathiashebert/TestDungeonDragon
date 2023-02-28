package tdd.test.parchemins;

import tdd.test.Mouvement;

import static tdd.AdventureTest.hero;

public class ProjectileMagique extends Parchemin implements tdd.parchemins.ProjectileMagique {
    public ProjectileMagique() {
        super("projectile magique");
    }

    @Override
    public Mouvement sort()
    {
        int mana = hero.intelligence;
        return new Mouvement(tdd.Mouvement.Type.SORT, mana, 0, 0, true, this);
    }
}
