package tdd.test;

import tdd.test.armes.Arme;
import tdd.test.parchemins.Parchemin;

import java.util.List;
import java.util.stream.Collectors;

import static tdd.AdventureTest.fail;

public class MouvementMagique extends Mouvement {

    public final Arme arme;

    public MouvementMagique(Objet objet, Arme arme, List<Parchemin> parchemins) {
        super(Type.TECHNIQUE, 0, 0, 0, true, objet);
        this.arme = arme;
        this.references.addAll(parchemins.stream().map(parchemin -> parchemin.nom).collect(Collectors.toList()));


        if(objet.niveau < parchemins.size()) {
            fail("Vous ne pouvez utiliser que "+objet.niveau+" sorts pour l'instant, avec le manuel du mage");
        }

        for(tdd.test.parchemins.Parchemin parchemin : parchemins) {
            if(!parchemin.disponible) {
                fail(parchemin.nom+" n'est pas disponible");
            }
            Mouvement sortDuParchemin = parchemin.sort();

            attaque += sortDuParchemin.attaque;
            defense += sortDuParchemin.defense;
            vitesse += sortDuParchemin.vitesse;
            feu |= sortDuParchemin.feu;
            glace |= sortDuParchemin.glace;
            armesSupplementaires += sortDuParchemin.armesSupplementaires;
            metabolisme += sortDuParchemin.metabolisme;
        }
    }

}