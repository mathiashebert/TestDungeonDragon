package tdd;

import tdd.armes.*;
import tdd.consommables.*;
import tdd.livres.*;
import tdd.parchemins.*;

/**
 * l'inventaire repertorie tout ce que vous pouvez trouver au cours de partie
 * en début de partie, l'appel à une de ces methodes provoquera un echec du test, car votre inventaire est vide
 * au fur et à mesure que vous trouvez des choses, les méhodes renverront un objet
 * certains objets à usage unique (comme les potions) sont retirés de l'inventaire lorsque vous les récupérez de l'inventaire
 * à contrario, certains objet (comme les armes), sont permanents et seront toujours disponibles dans l'inventaire, même lorsque vous les récupérez de l'inventaire
 *
 */
public interface Inventaire {

    // ARMES
    Epee epee();
    Bouclier bouclier();
    Lance lance();
    Dague dague();
    BouclierDeGlace bouclierDeGlace();
    Javelot javelot();
    HacheDeGlace hacheDeGlace();
    HacheDeFeu hacheDeFeu();
    BouclierDeFeu bouclierDeFeu();
    MarteauDeForge marteauDeForge();

    // AMELIORATIONS
    PotionMagique potion(); // usage unique
    RuneMagique rune(); // usage unique

    // LIVRES
    ManuelDeLAventurier manuelDeLAventurier();
    ManuelDuVoleur manuelDuVoleur();
    ManuelDuBarbare manuelDuBarbare();
    ManuelDuMage manuelDuMage();

    // PARCHEMINS
    ProjectileMagique projectileMagique();
    MurDeGivre murDeGivre();
    BouleDeFeu bouleDeFeu();
    Vitesse vitesse();
    Telekinesie telekinesie();
    Metamorphose metamorphose();

    }