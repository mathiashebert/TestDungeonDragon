package tdd.livres;


import tdd.Mouvement;

/**
 * Le manuel du voleur explique tous les coups tordus possibles
 * En bref, il permet de tripler d'effet d'un mouvement de combat
 *
 * La première fois, vous ne pourrez utiliser que 'attaque sournoise"
 * La deuxième fois, vus pourrez utiliser 'attaque sournoise' ou 'piege'
 * Enfin, la troisième fois, 'attaque sournoise' ou 'piege' ou 'coup fatal'
 */
public interface ManuelDuVoleur extends Livre {

    /**
     * Choisissez un mouvement 'frapper', son effet est triplé
     * Cette action utilise une main
     * Vous ne pouvez faire cette action dès la première utilisation du manuel du voleur
     */
    Mouvement attaqueSournoise(Mouvement frapper);

    /**
     * Choisissez un mouvement 'bloquer', son effet est triplé
     * Cette action utilise une main
     * Vous ne pouvez faire cette action qu'à partir de la deuxième utilisation du manuel du voleur
     */
    Mouvement piege(Mouvement bloquer);

    /**
     * Choisissez un mouvement 'jeter', son effet est triplé
     * Cette action utilise les 2 mains
     * Vous ne pouvez faire cette action qu'à partir de la troisième utilisation du manuel du voleur
     */
    Mouvement coupFatal(Mouvement jeter);

}
