package tdd.test.parchemins;

import tdd.test.Mouvement;
import tdd.test.Objet;

public abstract class Parchemin extends Objet implements tdd.parchemins.Parchemin {

    public Parchemin(String nom) {
        super(nom);
    }

    public abstract Mouvement sort();
}
