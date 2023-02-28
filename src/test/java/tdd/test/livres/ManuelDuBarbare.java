package tdd.test.livres;

import tdd.Mouvement;

public class ManuelDuBarbare extends Livre implements tdd.livres.ManuelDuBarbare {

    public ManuelDuBarbare() {
        super("le manuel du barbare");
    }

    @Override
    public Mouvement baston() {
        return new tdd.test.Mouvement(Mouvement.Type.TECHNIQUE, 0, 0, 0, false, this, "baston");
    }
}