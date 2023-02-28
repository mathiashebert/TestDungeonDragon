package tdd.test.livres;

import tdd.test.Mouvement;

public class ManuelDeLAventurier extends Livre implements tdd.livres.ManuelDeLAventurier {

    public ManuelDeLAventurier() {
        super("le manuel de l'aventurier");
    }

    @Override
    public Mouvement positionAgressive() {
        return new Mouvement(Mouvement.Type.TECHNIQUE, niveau, 0, 0,false, this);
    }

    @Override
    public Mouvement positionDefensive() {
        return new Mouvement(Mouvement.Type.TECHNIQUE, 0, niveau, 0, false, this);
    }

    @Override
    public Mouvement reflexes() {
        return new Mouvement(Mouvement.Type.TECHNIQUE, 0, 0, niveau, false, this);
    }
}
