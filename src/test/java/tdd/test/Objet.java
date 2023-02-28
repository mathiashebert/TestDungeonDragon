package tdd.test;

public class Objet implements tdd.Objet {
    public final String nom;
    public boolean disponible = false;
    public int niveau = 1;

    public Objet(String nom) {
        this.nom = nom;
    }

    public String nom() {
        return nom;
    }

    public int niveau() {
        return niveau;
    }

}