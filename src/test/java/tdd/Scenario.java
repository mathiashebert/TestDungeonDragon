package tdd;

import java.util.ArrayList;
import java.util.List;

import static tdd.AdventureTest.info;
import static tdd.AdventureTest.inventaire;

public class Scenario {

    public int position = 0;
    public List<Scene> scenes = new ArrayList<>();

    Scenario() {
        scenes.add(sceneIntro());
        scenes.add(sceneSquelette());
        scenes.add(sceneZombie());
        scenes.add(sceneAraignee());
        scenes.add(sceneFantomes());
        scenes.add(sceneSorciere());
        scenes.add(sceneGhoul());
        scenes.add(sceneLoupGarou());
        scenes.add(sceneCitrouilles());
        scenes.add(sceneEpouventail());
        scenes.add(sceneBanshee());
        scenes.add(sceneVampire());
    }

    public Scene getScene() {
        return scenes.get(position);
    }
    public Scene getScenePrecendente() {
        return scenes.get(position-1);
    }


    Scene sceneIntro() {
        Scene scene = new Scene();
        scene.message = "Au terme d'un long voyage, vous arrivez devant un sinistre manoir... Oserez-vous entrer ?";
        scene.objets.add(inventaire.epee);
        return scene;
    }
    Scene sceneSquelette() {
        Scene scene = new Scene();
        scene.message = "Alors que vous entrez dans le hall, un squelette se dresse devant vous !";
        Ennemi ennemi = new Ennemi();
        scene.ennemi = ennemi;
        ennemi.attaque = 1;
        ennemi.defense = 1;
        ennemi.vitesse = 0;
        ennemi.nom = "le squelette";
        scene.objets.add(inventaire.lance);
        scene.objets.add(inventaire.bouclier);

        return scene;
    }
    Scene sceneZombie() {
        Scene scene = new Scene();
        scene.message = "Vous arrivez dans une bibliothèque. Des zombies occupés à devorer un livre tournent la tête, et se dirigent vers vous... lentement...";
        Ennemi ennemi = new Ennemi();
        scene.ennemi = ennemi;
        ennemi.attaque = 4;
        ennemi.defense = 4;
        ennemi.vitesse = 0;
        ennemi.nom = "les zombies";
        ennemi.pluriel = true;
        scene.nbPotions = 1;
        scene.nbRunes = 1;
        scene.objets.add(inventaire.manuelDeLAventurier);

        return scene;
    }
    Scene sceneAraignee() {
        Scene scene = new Scene();
        scene.message = "Vous arrivez dans une petite salle remplie de toiles d'araignées, une araignée géante vénimeuse vous tombe dessus";
        Ennemi ennemi = new Ennemi();
        scene.ennemi = ennemi;
        ennemi.attaque = 6;
        ennemi.defense = 4;
        ennemi.vitesse = 2;
        ennemi.nom = "l'araignée géante vénimeuse";
        scene.objets.add(inventaire.projectileMagique);
        scene.objets.add(inventaire.dague);
        return scene;
    }
    Scene sceneFantomes() {
        Scene scene = new Scene();
        scene.message = "Vous descendez dans une vieilles cryptes. Vous vous retrouvez rapidement cernés par des fantômes. " +
                "(les fantômes ont la acapacité spéciale 'ethérés' : seules les armes magiques ou gravées d'une rune peuvent servir contre eux)";
        Ennemi ennemi = new Ennemi();
        scene.ennemi = ennemi;
        ennemi.attaque = 5;
        ennemi.defense = 5;
        ennemi.vitesse = 1;
        ennemi.nom = "les fantômes";
        ennemi.pluriel = true;
        ennemi.ethere = true;
        scene.nbRunes = 1;
        scene.nbPotions = 1;
        scene.objets.add(inventaire.manuelDuBarbare);
        scene.objets.add(inventaire.vitesse);

        return scene;
    }
    Scene sceneSorciere() {
        Scene scene = new Scene();
        scene.message = "Dans la cuisine, vous voyez une vieille sorcière, occupée à remuer un chaudron fumant.";
        Ennemi ennemi = new Ennemi();
        scene.ennemi = ennemi;
        ennemi.attaque = 7;
        ennemi.defense = 7;
        ennemi.vitesse = 2;
        ennemi.nom = "la sorcière";
        scene.objets.add(inventaire.hacheDeGlace);
        scene.objets.add(inventaire.bouclierDeGlace);
        scene.objets.add(inventaire.murDeGivre);
        scene.nbPotions = 2;
        scene.objets.add(inventaire.manuelDuMage);
        scene.objets.add(inventaire.javelot);
        return scene;
    }
    Scene sceneGhoul() {
        Scene scene = new Scene();
        scene.message = "Alors que vous poursuivez votre chemin, une ghoule se dirige vers vous... lentement...";
        Ennemi ennemi = new Ennemi();
        scene.ennemi = ennemi;
        ennemi.attaque = 10;
        ennemi.defense = 15;
        ennemi.vitesse = 0;
        ennemi.nom = "la ghoule";
        scene.nbRunes = 2;
        scene.objets.add(inventaire.telekinesie);
        scene.objets.add(inventaire.marteauDeForge);

        return scene;
    }
    Scene sceneLoupGarou() {
        Scene scene = new Scene();
        scene.message = "Devant la porte de la salle du trône, se tient un jeune homme poilu. Mais quand vous approchez il se transforme soudain en un gigantesque loup-garou et se rue vers vous à une vitesse incroyable";
        Ennemi ennemi = new Ennemi();
        scene.ennemi = ennemi;
        ennemi.attaque = 15;
        ennemi.defense = 20;
        ennemi.vitesse = 5;
        ennemi.nom = "le loup garou";
        scene.objets.add(inventaire.metamorphose);
        return scene;
    }
    Scene sceneCitrouilles() {
        Scene scene = new Scene();
        scene.message = "Vous débouchez dans une petite court, au centre il y a un potager rempli de citrouilles carnivores.";
        Ennemi ennemi = new Ennemi();
        scene.ennemi = ennemi;
        ennemi.attaque = 10;
        ennemi.defense = 25;
        ennemi.vitesse = 3;
        ennemi.nom = "les citrouilles";
        ennemi.pluriel = true;
        scene.objets.add(inventaire.hacheDeFeu);
        scene.objets.add(inventaire.bouleDeFeu);
        scene.objets.add(inventaire.bouclierDeFeu);
        scene.objets.add(inventaire.manuelDuVoleur);
        return scene;
    }
    Scene sceneEpouventail() {
        Scene scene = new Scene();
        scene.message = "Au fond de la court, un épouvantail s'anime, mécontent que vous ayez sacagé le potager.";
        Ennemi ennemi = new Ennemi();
        scene.ennemi = ennemi;
        ennemi.attaque = 20;
        ennemi.defense = 20;
        ennemi.vitesse = 6;
        ennemi.nom = "l'épouvantail";
        ennemi.pluriel = true;

        return scene;
    }

    Scene sceneBanshee() {
        Scene scene = new Scene();
        scene.message = "Dans la grande salle du manoir, se tient la dame du domaine : la banshee. (c'est un spectre étheré) ";
        Ennemi ennemi = new Ennemi();
        scene.ennemi = ennemi;
        ennemi.attaque =30;
        ennemi.defense = 10;
        ennemi.vitesse = 10;
        ennemi.nom = "la banshee";
        ennemi.ethere = true;
        scene.nbRunes = 1;
        scene.nbPotions = 1;
        return scene;
    }
    Scene sceneVampire() {
        Scene scene = new Scene();
        scene.message = "Vous arrivez enfin devant le maître du dongeon. Le vampire esquisse un sourire, dévoilant ses canines menaçantes.";
        Ennemi ennemi = new Ennemi();
        scene.ennemi = ennemi;
        ennemi.attaque = 30;
        ennemi.defense = 30;
        ennemi.vitesse = 10;
        ennemi.nom = "le vampire";
        return scene;
    }


}