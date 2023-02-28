package tdd.test.livres;

import tdd.test.Mouvement;
import static tdd.AdventureTest.fail;

public class ManuelDuVoleur extends Livre implements tdd.livres.ManuelDuVoleur {

    public ManuelDuVoleur() {
        super("le manuel du voleur");
    }

    @Override
    public Mouvement attaqueSournoise(tdd.Mouvement frapper) {
        Mouvement mouvement = (Mouvement) frapper;
        if(!mouvement.type.equals(tdd.Mouvement.Type.FRAPPER)) {
            fail("Quand vous effectuez une attaque sournoise, vous devez choisir un mouvement 'frapper'");
        }

        Mouvement resultat  = new Mouvement(tdd.Mouvement.Type.TECHNIQUE, mouvement.attaque*3, mouvement.defense*3, mouvement.vitesse*3, mouvement.distance, this);
        resultat.references.addAll(mouvement.references); // ajouter une reference pour éviter que cet arme soit réutilisée

        resultat.feu = mouvement.feu;
        resultat.glace = mouvement.glace;
        resultat.armesSupplementaires = -1; // pas possible d'effectuer une autre attaque
        return resultat;
    }

    @Override
    public Mouvement piege(tdd.Mouvement bloquer) {
        Mouvement mouvement = (Mouvement) bloquer;
        if(niveau < 2) {
            fail("Vous n'avez pas encore assez utilisé ce livre. Commencez par effectuer une attaque sournoise");
        }
        if(!mouvement.type.equals(tdd.Mouvement.Type.BLOQUER)) {
            fail("Quand vous effectuez un piège, vous devez choisir un mouvement 'bloquer'");
        }

        Mouvement resultat  = new Mouvement(tdd.Mouvement.Type.TECHNIQUE, mouvement.attaque*3, mouvement.defense*3, mouvement.vitesse*3, mouvement.distance, this);
        resultat.references.addAll(mouvement.references); // ajouter une reference pour éviter que cet arme soit réutilisée

        resultat.feu = mouvement.feu;
        resultat.glace = mouvement.glace;
        resultat.armesSupplementaires = -1; // pas possible d'effectuer une autre attaque
        return resultat;
    }

    @Override
    public Mouvement coupFatal(tdd.Mouvement jeter) {
        Mouvement mouvement = (Mouvement) jeter;
        if(niveau < 3) {
            fail("Vous n'avez pas encore assez utilisé ce livre. Commencez par effectuer une attaque sournoise et/ou un piège");
        }
        if(!mouvement.type.equals(tdd.Mouvement.Type.JETER)) {
            fail("Quand vous effectuez un coup fatal, vous devez choisir un mouvement 'jeter'");
        }

        Mouvement resultat  = new Mouvement(tdd.Mouvement.Type.TECHNIQUE, mouvement.attaque*3, mouvement.defense*3, mouvement.vitesse*3, mouvement.distance, this);
        resultat.references.addAll(mouvement.references); // ajouter une reference pour éviter que cet arme soit réutilisée

        resultat.feu = mouvement.feu;
        resultat.glace = mouvement.glace;
        resultat.armesSupplementaires = -2; // pas possible d'effectuer une autre attaque
        return resultat;
    }
}
