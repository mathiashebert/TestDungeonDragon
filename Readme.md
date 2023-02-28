README
======

Voici comment utiliser ce projet : vous devez coder la méthode "aventure" qui est dans la classe "Adventure".
Le but étant de lancer les tests de la classe "AdventureTest".
Nh'esitez pas à vous référer à la javadoc des classes et des méthodes pour comprendre leur interêt et leur utilisation.
Mais en bref, voici comment commencer.

Au début de la méthode, utiliser le code `hero.fouiller();` pour fouiller la position actuelle du héro. Cela vous permettra de trouver une épée.
Avant cela, si vous tentez d'utiliser la méthode `inventaire.epee()`, le test échouera. Après avoir trouvé l'épée, cela renverra une instance de la classe  `Epee`.
Puis pour passer à la position suivante, utiliser le code `hero.avancer();`.

Sur la position 1, il y a un ennemi. Vous ne pouvez pas effectuez d'action dans que l'ennemi est là.
Pour combattre l'ennemi, utilisez la mzethode combattre du hero, comme ceci: `hero.combattre(inventaire.epee().frapper());`
La methode `combattre` du hero prend en paramettre un tableau d'éléments `Mouvement`. Les mouvements sont des objets retrounés notemments par des méthodes de votre inventaire, comme l'épée.
En combat, les mouvements vous font gagner de l'attaque et de la défense, et reçoivent un bonus selon la force et l'endurence du héro.
Pour l'instant, le héro a une force de 1 et une endurence de 1, l'épée a une attaque de 1 et une défense de 1, donc vous avez une attaque de 2 et une defense de 2.
Le squelette a une attaque de 1 et une defense de 1.
Pour gagner, vous devez avoir une attaque supérieure à la défense de l'ennemi, et une défense supérieure à l'attaque de l'ennemi.
Reférez-vous à la section Combat du Readme, pour tout connaître sur le sujet.
Après avoir combattu le squelette, pensez à fouiller la position 1, puis passer à la position suivante.

Sur la position 2, il y a un ennemi plus puissant. Le groupe de zombies à une attaque de 4 et une defense de 4, et une vitesse de 0.
Le hero a une agilité de base de 1, ce qui lui donne un avantage de vitesse de 1 par rapport au zombie.
Pour chaque point d'avantage de vitesse, le hero peut utiliser un mouvement "jeter" en paramètre de la méthode "combattre()".
En plus des mouvements "jeter", le hero ne peut utiliser que jusqu'à 2 mouvements "frapper" et/ou "combattre"
La lance a attaque:2 defense:0, et le bouclier a attaque:0 et defense:2
Lorsque vous utilisez un mouvement "jeter", son attaque est majorée par la force du héro.
Lorsque vous utilisez un mouvement "frapper", son attaque est majorée par la force du héro, et sa défense est majorée par l'endurence du héro.
Lorsque vous utilisez un mouvement "bloquer", sa défense est majorée par l'endurence du héro.
Pour vaincre les zombies, utilisez le code `hero.combattre(inventaire.lance().jeter(), inventaire.epee().frapper(), inventaire.bouclier().bloquer());`
Pensez toujours à fouiller après un combat. Cela vous permettra de trouver de nouveaux objets pour votre inventaire, mais aussi de récupérer les armes jetées.
Sur la position 2, vous trouverez une potion, une rune, et un livre : le manuel de l'aventurier.
Les potions permettent d'améliorer les caractéristiques du hero, vous pouvez par exemple utiliser `inventaire.potion().boire(Choix.AGILITE);` pour améliorer l'agilité du héro de un point (pour avori un meilleur avantage de vitesse en combat)
Les runes permettent d'améliorer les armes du hero, vous pouvez par exemple utiliser `inventaire.rune().graver(inventaire.lance());` pour améliorer la lance (elle aura alors une attaque de 4, au lieu de 2)
Les livres proposent des méthodes qui renvoies des mouvements (comme les armes). A chaque utilisation d'un livre, les effets sont de plus en plus efficaces. Ils vous permettront peu à peu de développer une strategie.
Vous ne pouvez utiliser qu'une seul mouvement de "livre", à chaque combat.


Sur la position 3, il y a un ennemi avec une vitesse 2. Si vous souhaitez jeter votre lance, vous devez avez une vitesse au moins égale à 3.
Cela est possible si vous avez utilisé la potion avec le choix "AGILITE", et si vous utilisez `inventaire.manueldeLAventurier().reflexes()`.
Si vous avez utilisé la rune pour améliorer la lance, et que vous jetez la lance, l'attaque du mouvement vaut 5. Les mouvements "jeter" ont une attaque à distance.
Si la somme de vos attaques à distance est suppérieure à la défense de l'ennemi, vous les dégommez, et vous n'avez pas besoin de comparer votre defense à son attaque.
Vous pouvez donc faire ça, en utilisant la potion pour améliorer votre agilité, la rune pour améliorer la lance, et un combat avec les reflexes du manuel de l'aventurier, et en jetant la lance.


Combats
-------

Comment est résolut un combat ?
* vous ne pouvez utiliser qu'un seul mouvement "TECHNIQUE" (issu d'un livre)
* Vous ne pouvez pas utiliser 2 fois le même objets.
* Si vous avez plus de vitesse que l'ennemi, alors vous pouvez utiliser un mouvement "JETER" pour chaque point de vitesse que vous avez en plus.
* Vous pouvez utiliser 2 mouvements "FRAPPER" et/ou "BLOQUER".
* l'attaque des mouvements "FRAPPER" et "JETER" est majorée par la force du héro
* la défense des mouvements "FRAPPER" et "BLOQUER" est majorée par la défense du héro
* Les mouvements "SORT" et "JETER" ont une attaque à distance. Si la somme des attaques à distance est supérieure à la defense de l'ennemi, vous le dégommez.
* Les armes ou sort qui ont un effet "glace" diminuent l'attaque de l'ennemi d'autant que leur attaque et leur défense.
* Les armes ou sort qui ont un effet "feu" diminuent la défense de l'ennemi d'autant que leur attaque et leur défense.
* Si l'attaque d'un ennemi tombe à 0 ou moins (cf effet glace), vous le congelez.
* Si la défense d'un ennemi tombe à 0 ou moins (cf effet feu), vous le carbonisez.
* Si vous n'avez pas réussi à le dégommer, ni le congeler, ni le carboniser, alors vous devez avoir une attaque totale supérieure à sa défense, et une défense supérieur à son attaque, pour l'écraser.

Sorts
-----

Les objets parchemins vous permettent de lancer des sort.
Ce sont des objets à usage unique (à moins d'utiliser le livre "manuel du mage").
La puissance de leur effet dépend de l'intelligence du hero.
Chaque parchemin a une méthode `sort()` qui renvoie un mouvement, utilisable en combat, comme les mouvements fournis par les armes ou les livres.
Vous pouvez utiliser plusieurs sorts dans un même combat, ils ne dépendent pas de votre vitesse, et ne diminuent pas le nombres des autres mouvements utilisables.
Les attaques des sorts sont des attaques à distance.

Ethere
------

Certains ennemis ont une capacité spéciale : "ehtéré". Seules les armes magiques peuvent servir contre un ennemi éthéré.
Une arme est magique si :
* elle a reçu au moins une rune
* ele a un effet "feu" ou "glace"
* elle a été enchantée avec la méthode "enchantement" du livre du mage.