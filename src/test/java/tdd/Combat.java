package tdd;

import tdd.test.Mouvement;
import tdd.test.MouvementMagique;

import java.util.*;

import static tdd.AdventureTest.*;


public class Combat {

    List<CaracteristiqueDeCombat> caracHero = new ArrayList<>();
    List<CaracteristiqueDeCombat> caracEnnemi = new ArrayList<>();

    CaracteristiqueDeCombat totalEnnemi;
    CaracteristiqueDeCombat totalHero;

    public Set<String> referencesMouvements = new HashSet<>();

    public Combat(Ennemi ennemi) {
        caracEnnemi.add(new CaracteristiqueDeCombat(ennemi.nom, 0, ennemi.attaque, ennemi.defense, ennemi.vitesse));
        totalEnnemi = new CaracteristiqueDeCombat("total", 0, 0, 0, 0);

        totalHero = new CaracteristiqueDeCombat("total", 0, 0, 0, hero.agilite);

    }

    public void ajouterMouvement(Mouvement mouvement) {
        caracHero.add(new CaracteristiqueDeCombat(mouvement.objet.nom, mouvement.distance? mouvement.attaque :0, mouvement.attaque, mouvement.defense, mouvement.vitesse));

        int malus = mouvement.attaque + mouvement.defense;
        if(mouvement.feu && malus > 0) {
            // saveLigne(lignesEnnemi, mouvement.objet.nom, 0, 0, -malus, 0);
            caracEnnemi.add(new CaracteristiqueDeCombat(mouvement.objet.nom, 0, 0, -malus, 0));
        }
        if(mouvement.glace && malus > 0) {
            // saveLigne(lignesEnnemi, mouvement.objet.nom, 0, -malus, 0, 0);
            caracEnnemi.add(new CaracteristiqueDeCombat(mouvement.objet.nom, 0, -malus, 0, 0));
        }
    }

    private void logLigne(CaracteristiqueDeCombat carac) {
        String p = String.format("%-55s", carac.nom);
        String ad = String.format("%-22s", carac.attaqueDistance!=0 ? "attaque à distance:"+carac.attaqueDistance : "");
        String a = String.format("%-12s", "attaque:"+carac.attaqueTotale);
        String d = String.format("%-12s", "defense:"+carac.defense);
        String v = String.format("%-11s", carac.vitesse!=0 ? "vitesse:"+carac.vitesse : "");
        debug(p + ad + a + d + v);
    }

    public void fin() {

            // calculer et afficher les caracterisqitques du hero
            debug("Hero : force:"+hero.force+" endurence:"+hero.endurance+" agilite:"+hero.agilite+" intelligence:"+hero.intelligence);

            //saveLigne(lignesHero, "total", carac.attaqueDistance, carac.attaqueTotale, carac.defense, carac.vitesse);
            for(CaracteristiqueDeCombat carac: caracHero) {
                logLigne(carac);
                totalHero.ajouter(carac);
            }
            logLigne(totalHero);
            debug("-----");

            // calculer et afficher les caracteristiques de l'ennemi
            for(CaracteristiqueDeCombat carac: caracEnnemi) {
                logLigne(carac);
                totalEnnemi.ajouter(carac);
            }
            if(caracEnnemi.size() > 0) {
                logLigne(totalEnnemi);
            }
            debug("-----");


    }

    public void resoudre(Ennemi ennemi, tdd.Mouvement... mouvements) {
        int nbMains = 2;

        int nbFrapper = 0;
        int nbBloquer = 0;
        int nbJeter = 0;
        int nbTirer = 0;
        int nbTechnique = 0;

        MouvementMagique mouvementMagique = null;

        for(tdd.Mouvement m: mouvements) {
            Mouvement mouvement = (Mouvement) m;

            if(!mouvement.objet.disponible) {
                fail("Vous ne pouvez pas utiliser "+mouvement.objet.nom);
            }

            for(String reference : mouvement.references) {
                if(referencesMouvements.contains(reference)) {
                    fail("Vous ne pouvez pas utiliser "+reference+" plusieurs fois");
                }
                referencesMouvements.add(reference);
            }

            switch (mouvement.type) {
                case FRAPPER:
                    ++nbFrapper;
                    break;
                case BLOQUER:
                    ++ nbBloquer;
                    break;
                case JETER:
                    ++ nbJeter;
                    scenario.getScene().armesJetees.add(mouvement.objet);
                    mouvement.objet.disponible = false;
                    break;
                case TECHNIQUE:
                    ++ nbTechnique;

                    // traitement special des techniques de barbare
                    // ils sont traités maintenant pour être sûr de prendre en compte la remise à 0
                    traiterTactiqueDeBarare(mouvement);

                    mouvement.objet.niveau ++;

                    break;
                case SORT:
                    mouvement.objet.disponible = false;
                    break;
            }



            // appliquer l'enchantement, s'il y en a un
            if(mouvementMagique != null && mouvementMagique.arme != null && mouvementMagique.arme.equals(mouvement.objet)) {
                mouvement.feu |= mouvementMagique.feu;
                mouvement.glace |= mouvementMagique.glace;
                mouvement.attaque +=  mouvementMagique.attaque;
                mouvement.defense += mouvementMagique.defense;
                mouvement.vitesse += mouvementMagique.vitesse;
                mouvement.armesSupplementaires += mouvementMagique.armesSupplementaires;
                mouvement.metabolisme += mouvementMagique.metabolisme;
                mouvement.magique = true;
            }

            // cas de l'ennemi etheré : seul les mouvements magiques sont pris en comptes, et les techniques
            if(ennemi.ethere
                    && !mouvement.type.equals(tdd.Mouvement.Type.TECHNIQUE)
                    && !mouvement.type.equals(tdd.Mouvement.Type.SORT)
                    && !mouvement.magique()) {
                mouvement.attaque = 0;
                mouvement.defense = 0;
                mouvement.vitesse = 0;
            }

            // effet special magique
            if(mouvement instanceof MouvementMagique) {
                mouvementMagique = (MouvementMagique) mouvement;
                if(mouvementMagique.arme != null) { // // enchantement, on applique pas tout de suite l'effet
                    continue;
                }

            }

            nbMains += mouvement.armesSupplementaires;

            if(mouvement.metabolisme > 0) {
                int boost = mouvement.metabolisme;
                mouvement.vitesse += boost;

                Arrays.stream(mouvements).sequential().map(mouvement1 -> (Mouvement) mouvement1).forEach(mouvement1 -> {
                    if(mouvement1.type.equals(tdd.Mouvement.Type.FRAPPER) || mouvement1.type.equals(tdd.Mouvement.Type.JETER)) {
                        mouvement1.attaque += boost;
                    }
                    if(mouvement1.type.equals(tdd.Mouvement.Type.FRAPPER) || mouvement1.type.equals(tdd.Mouvement.Type.BLOQUER)) {
                        mouvement1.defense += boost;
                    }
                });
            }

            ajouterMouvement(mouvement);

        }
        fin();


        if(nbFrapper + nbBloquer > nbMains) {
            fail("Vous n'avez que 2 mains, vous ne pouvez utilisez au mieux que "+nbMains+" mouvements bloquer et/ou frapper");
        }
        else if(nbJeter+nbTirer > 0 && totalHero.vitesse <= totalEnnemi.vitesse) {
            fail("Vous n'êtes pas assez rapide, vous ne pouvez pas utilisez de mouvements jeter et/ou tirer");
        }
        else if(nbJeter+nbTirer > 0 &&  nbJeter+nbTirer > totalHero.vitesse - totalEnnemi.vitesse) {
            fail("Vous n'êtes pas assez rapide, vous ne pouvez utilisez au mieux que "+(totalHero.vitesse - totalEnnemi.vitesse)+" mouvements jeter et/ou tirer");
        }
        else if(nbTechnique > 1) {
            fail("Vous ne pouvez pas utiliser plusieurs techniques");
        } else if(referencesMouvements.contains("baston") && mouvements.length > 1+nbBloquer+nbFrapper) {
            fail("En cas de baston, vous ne pouvez utiliser que des mouvements 'frapper' et 'bloquer'");
        }

        else if(totalEnnemi.attaqueTotale <= 0) {
            succes("Vous congelez "+ennemi.nom);
        }
        else if(totalEnnemi.defense <= 0) {
            succes("Vous carbonisez "+ennemi.nom);
        }
        else if(totalHero.attaqueDistance > totalEnnemi.defense) {
            succes("Vous dégommez "+ennemi.nom);
        }
        else if(totalHero.defense <= totalEnnemi.attaqueTotale) {
            fail(ennemi.nom+ (ennemi.pluriel ? " ont":" a") + " une attaque trop forte");
        }
        else if(totalHero.attaqueTotale <= totalEnnemi.defense) {
            fail(ennemi.nom+ (ennemi.pluriel ? " ont":" a") + " une défense trop forte");
        } else {
            succes("Vous écrasez "+ennemi.nom);
        }

        scenario.getScene().ennemi = null;
    }

    private void traiterTactiqueDeBarare(Mouvement mouvement) {
        if(mouvement.references.contains("baston")) {
            if(scenario.position > 0 && !scenario.getScenePrecendente().combat.referencesMouvements.contains("baston")) {
                mouvement.objet.niveau = 1;
            }
            mouvement.armesSupplementaires += 1;
            mouvement.attaque = 3*mouvement.objet.niveau;
            mouvement.defense = 3*mouvement.objet.niveau;
            mouvement.vitesse = 3*mouvement.objet.niveau;
        }
    }

}