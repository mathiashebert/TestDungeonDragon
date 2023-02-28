package tdd.test;

import tdd.test.armes.*;
import tdd.test.consommables.*;
import tdd.test.livres.*;
import tdd.test.parchemins.*;

import static tdd.AdventureTest.fail;

public class Inventaire implements tdd.Inventaire {

    public final Epee epee = new Epee();
    public final Bouclier bouclier = new Bouclier();
    public final Lance lance = new Lance();
    public final HacheDeGlace hacheDeGlace = new HacheDeGlace();
    public final BouclierDeGlace bouclierDeGlace = new BouclierDeGlace();
    public final Javelot javelot = new Javelot();
    public final HacheDeFeu hacheDeFeu = new HacheDeFeu();
    public final BouclierDeFeu bouclierDeFeu = new BouclierDeFeu();
    public final MarteauDeForge marteauDeForge = new MarteauDeForge();
    public final Dague dague = new Dague();

    public final ManuelDeLAventurier manuelDeLAventurier = new ManuelDeLAventurier();
    public final ManuelDuVoleur manuelDuVoleur = new ManuelDuVoleur();
    public final ManuelDuBarbare manuelDuBarbare = new ManuelDuBarbare();
    public final ManuelDuMage manuelDuMage = new ManuelDuMage();

    public final ProjectileMagique projectileMagique = new ProjectileMagique();
    public final MurDeGivre murDeGivre = new MurDeGivre();
    public final BouleDeFeu bouleDeFeu = new BouleDeFeu();
    public final Vitesse vitesse = new Vitesse();
    public final Telekinesie telekinesie = new Telekinesie();
    public final Metamorphose metamorphose = new Metamorphose();

    int nbPotions = 0;
    int nbRunes = 0;


    @Override
    public Epee epee() {
        if(!epee.disponible) fail("Vous n'avez pas ça dans votre sac à dos");
        return epee;
    }

    @Override
    public Bouclier bouclier() {
        if(!bouclier.disponible) fail("Vous n'avez pas ça dans votre sac à dos");
        return bouclier;
    }

    @Override
    public Lance lance() {
        if(!lance.disponible) fail("Vous n'avez pas ça dans votre sac à dos");
        return lance;
    }

    @Override
    public Dague dague() {
        if(!dague.disponible) fail("Vous n'avez pas ça dans votre sac à dos");
        return dague;
    }

    @Override
    public BouclierDeGlace bouclierDeGlace() {
        if(!bouclierDeGlace.disponible) fail("Vous n'avez pas ça dans votre sac à dos");
        return bouclierDeGlace;
    }

    @Override
    public HacheDeGlace hacheDeGlace() {
        if(!hacheDeGlace.disponible) fail("Vous n'avez pas ça dans votre sac à dos");
        return hacheDeGlace;
    }

    @Override
    public Javelot javelot() {
        if(!javelot.disponible) fail("Vous n'avez pas ça dans votre sac à dos");
        return javelot;
    }

    @Override
    public HacheDeFeu hacheDeFeu() {
        if(!hacheDeFeu.disponible) fail("Vous n'avez pas ça dans votre sac à dos");
        return hacheDeFeu;
    }

    @Override
    public BouclierDeFeu bouclierDeFeu() {
        if(!bouclierDeFeu.disponible) fail("Vous n'avez pas ça dans votre sac à dos");
        return bouclierDeFeu;
    }


    @Override
    public MarteauDeForge marteauDeForge() {
        if(!marteauDeForge.disponible) fail("Vous n'avez pas ça dans votre sac à dos");
        return marteauDeForge;
    }

    @Override
    public PotionMagique potion() {
        if(nbPotions == 0) fail("Vous n'avez pas ça dans votre sac à dos");
        -- nbPotions;
        return new PotionMagique();
    }

    @Override
    public RuneMagique rune() {
        if(nbRunes == 0) fail("Vous n'avez pas ça dans votre sac à dos");
        -- nbRunes;
        return new RuneMagique();
    }

    @Override
    public ManuelDeLAventurier manuelDeLAventurier() {
        if(!manuelDeLAventurier.disponible) fail("Vous n'avez pas ça dans votre sac à dos");
        return manuelDeLAventurier;
    }

    @Override
    public ManuelDuVoleur manuelDuVoleur() {
        if(!manuelDuVoleur.disponible) fail("Vous n'avez pas ça dans votre sac à dos");
        return manuelDuVoleur;
    }

    @Override
    public ManuelDuBarbare manuelDuBarbare() {
        if(!manuelDuBarbare.disponible) fail("Vous n'avez pas ça dans votre sac à dos");
        return manuelDuBarbare;
    }

    @Override
    public ManuelDuMage manuelDuMage() {
        if(!manuelDuMage.disponible) fail("Vous n'avez pas ça dans votre sac à dos");
        return manuelDuMage;
    }

    @Override
    public ProjectileMagique projectileMagique() {
        if(!projectileMagique.disponible) fail("Vous n'avez pas ça dans votre sac à dos");
        return projectileMagique;
    }

    @Override
    public MurDeGivre murDeGivre() {
        if(!murDeGivre.disponible) fail("Vous n'avez pas ça dans votre sac à dos");
        return murDeGivre;
    }

    @Override
    public BouleDeFeu bouleDeFeu() {
        if(!bouleDeFeu.disponible) fail("Vous n'avez pas ça dans votre sac à dos");
        return bouleDeFeu;
    }

    @Override
    public Vitesse vitesse() {
        if(!vitesse.disponible) fail("Vous n'avez pas ça dans votre sac à dos");
        return vitesse;
    }

    @Override
    public Telekinesie telekinesie() {
        if(!telekinesie.disponible) fail("Vous n'avez pas ça dans votre sac à dos");
        return telekinesie;
    }

    @Override
    public Metamorphose metamorphose() {
        if(!metamorphose.disponible) fail("Vous n'avez pas ça dans votre sac à dos");
        return metamorphose;
    }

}
