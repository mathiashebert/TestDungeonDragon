package tdd;

import static tdd.AdventureTest.hero;

public class CaracteristiqueDeCombat {
    public String nom = "";

    public int attaqueTotale = 0;
    public int defense = 0;
    public int attaqueDistance = 0;
    public int vitesse = hero.agilite;

    public CaracteristiqueDeCombat() {
    }

    public CaracteristiqueDeCombat(String nom, int attaqueDistance, int attaqueTotale, int defense, int vitesse) {
        this.nom = nom;
        this.attaqueDistance = attaqueDistance;
        this.attaqueTotale = attaqueTotale;
        this.defense = defense;
        this.vitesse = vitesse;
    }

    public void ajouter(CaracteristiqueDeCombat carac) {
        attaqueDistance += carac.attaqueDistance;
        attaqueTotale += carac.attaqueTotale;
        defense += carac.defense;
        vitesse += carac.vitesse;
    }
}