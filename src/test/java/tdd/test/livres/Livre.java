package tdd.test.livres;

import tdd.test.Objet;

public abstract class Livre extends Objet implements tdd.livres.Livre {

    Livre(String nom) {
        super(nom);
    }

}
