package tdd.livres;

import tdd.Mouvement;

/**
 * Le manuel du barbare est un livre des plus simples. Il n'y a surtout des illustrations, expliquant des tactiques de combats primitives, mais efficaces.
 * * Il y a botte secrette, qui marche en combat depuis la nuit des temps. C'est "taper plus fort que l'adversaire".
 * * Si elle ne marche pas, alors il y a une solution (à ne réveler qu'aux initiés) : "taper encore plus fort"
 *
 * Contrairement aux autres livres, l'experience accumulée dans celui-là est remise à 0 dès que vous changez de tactique.
 * Vous devez donc utiliser toujours la même tactique, sur plusieurs ennemis consécutifs, pour en tirer un meilleur résultat
 *
 */
public interface ManuelDuBarbare extends Livre {

    /**
     * En combat, vous pouvez bastonner. Cela vous permet d'utiliser une arme supplémentaire et vous donne attaque:3 defense:3
     * Si dans la salle suivante, vous continuez à batonner, alors vous gagnez un bonus supplémentaire attaque:+3 et defense:+3
     * et ainsi de suite pour chaque baston consécutive (ce qui peut donner des effets devastateurs au bout de 3 ou 4 bastons)
     *
     * En contrepartie, en cas de baston, vous ne pouvez utiliser que des mouvements 'frapper' et 'bloquer'
     * et la baston vous fait passer directement à la salle suivante (vous ne pourrez pas vous arrêter pour fouiller)
     */
    Mouvement baston();

}
