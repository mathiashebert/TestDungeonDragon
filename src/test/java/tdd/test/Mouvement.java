package tdd.test;

import java.util.ArrayList;
import java.util.List;

import static tdd.AdventureTest.hero;

public class Mouvement implements tdd.Mouvement {
    public Type type;

    public int attaque;
    public int defense;
    public int vitesse;

    public boolean feu;
    public boolean glace;
    public boolean magique = false;
    public int armesSupplementaires = 0;
    public int metabolisme = 0;

    public boolean distance;

    final public Objet objet;
    final public List<String> references = new ArrayList<>();

    public Mouvement(Type type, int attaque, int defense, int vitesse, boolean distance, Objet objet) {
        this(type, attaque, defense, vitesse, distance, objet, objet.nom);
    }

    public Mouvement(Type type, int attaque, int defense, int vitesse, boolean distance, Objet objet, String reference) {
        this.type = type;
        this.distance = distance;

        this.attaque = attaque;
        this.defense = defense;
        this.vitesse = vitesse;

        this.objet = objet;

        this.references.add(reference);
    }

    public boolean magique() {
        return objet.niveau > 1 || feu || glace || magique;
    }

}