package tdd.test;


import tdd.CaracteristiqueDeCombat;
import tdd.Combat;
import tdd.Ennemi;
import tdd.Scene;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import static tdd.AdventureTest.*;

public class Hero implements tdd.Hero {

    public int force = 1;
    public int endurance = 1;
    public int intelligence = 1;
    public int agilite = 1;

    @Override
    public void avancer() {
        info("--> avancer");

        if(scenario.getScene().ennemi != null) {
            fail("Vous ne pouvez pas avancer car il y a un ennemi");
        }

        if(scenario.position+1 >= scenario.scenes.size()) {
            fail("Vous êtes déjà arrivé au bout du dongeon");
        }

        scenario.position ++;

        info("");
        info(scenario.getScene().message);


    }

    @Override
    public void fouiller() {
        info("--> fouiller");
        Scene scene = scenario.getScene();

        if(scene.ennemi != null) {
            fail("Vous ne pouvez pas fouiller car il y a un ennemi");
        }

        if(!scene.objets.isEmpty()) {
            scene.objets.forEach(arme -> arme.disponible = true);
            info("Vous trouvez les objets suivants: "+scene.objets.stream().map(Objet::nom).collect(Collectors.joining(", ")));
            scene.objets.clear();
        }

        if(!scene.armesJetees.isEmpty()) {
            scene.armesJetees.forEach(arme -> arme.disponible = true);
            info("Vous reprennez les objets suivants: "+scene.armesJetees.stream().map(Objet::nom).collect(Collectors.joining(", ")));
            scene.armesJetees.clear();
        }
        if(scene.nbRunes > 0) {
            inventaire.nbRunes += scene.nbRunes;
            info("Vous trouvez "+ scene.nbRunes+" rune"+(scene.nbRunes > 1 ? "s":""));
            scene.nbRunes = 0;
        }
        if(scene.nbPotions > 0) {
            inventaire.nbPotions += scene.nbPotions;
            info("Vous trouvez "+ scene.nbPotions+" potion"+(scene.nbPotions > 1 ? "s":""));
            scene.nbPotions = 0;
        }
    }

    @Override
    public void combattre(tdd.Mouvement... mouvements) {
        info("--> combattre");
        Ennemi ennemi = scenario.getScene().ennemi;

        if(ennemi == null) {
            fail("Il n'y a pas d'ennemi à combattre");
            return;
        }

        Combat combat = new Combat(ennemi);
        combat.resoudre(ennemi, mouvements);
        scenario.getScene().combat = combat;

        if(combat.referencesMouvements.contains("baston") && scenario.position < scenario.scenes.size()-1) {
            hero.avancer();
        }
    }
}