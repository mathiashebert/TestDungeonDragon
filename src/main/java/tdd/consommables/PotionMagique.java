package tdd.consommables;

public interface PotionMagique {
    enum Choix {  FORCE, ENDURANCE, INTELLIGENCE, AGILITE }

    /**
     * Vous pouvez boire une potion magique, pour améliorer la force, l'endurance, le mana ou la vitesse du héro
     */
    void boire(Choix choix);
}