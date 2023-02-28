package tdd.test.livres;

import tdd.armes.Arme;
import tdd.consommables.RuneMagique;
import tdd.parchemins.Parchemin;
import tdd.test.MouvementMagique;

import java.util.Arrays;
import java.util.stream.Collectors;

public class ManuelDuMage extends Livre implements tdd.livres.ManuelDuMage {

    public ManuelDuMage() {
        super("le manuel du mage");
    }

    @Override
    public MouvementMagique rituel(Parchemin... parchemins) {
        return new MouvementMagique(this, null, Arrays.stream(parchemins).map(parchemin -> (tdd.test.parchemins.Parchemin)parchemin).collect(Collectors.toList()));
    }

    @Override
    public MouvementMagique enchantement(Arme arme, RuneMagique runeMagique, Parchemin... parchemins) {
        return new MouvementMagique(this, (tdd.test.armes.Arme) arme, Arrays.stream(parchemins).map(parchemin -> (tdd.test.parchemins.Parchemin)parchemin).collect(Collectors.toList()));
    }
}