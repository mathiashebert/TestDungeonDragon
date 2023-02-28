package tdd;

import tdd.test.Objet;

import java.util.ArrayList;
import java.util.List;

public class Scene {
    public Ennemi ennemi = null;
    public List<Objet> objets = new ArrayList<>();
    public List<Objet> armesJetees = new ArrayList<>();
    public int nbPotions = 0;
    public int nbRunes = 0;

    public String message = "";

    public Combat combat;

}