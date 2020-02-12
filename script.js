// Remarques personnelles
// Pourquoi les globales sont une mauvaises idée? 
//        => Pour créer un code le plus modulable possible?
// La création d'un objet pour y stocker des données est-elle une bonne idée? Dans le cas présent, avoir un index avec 2 inconnus était pratique.

// comprendre quand utiliser let et quand utiliser var
// comment améliorer les noms de variables?


//###############################
//###############################
// PlUGIN JQUERY 
//###############################
//###############################

(function ($) {
     $.fn.puissance4 = function (x,y,color1,color2) {


          //###############################
          //###############################
          // MODULE ANTI KIKOOLOL
          //###############################
          //###############################

          if(color1 == color2){
               color1 = "rgba(255, 0, 0, 0.4)";
               color2 = "rgba(255, 255, 0, 0.4)"; 
          }
          // ouais je sais j'aurais voulu faire un contrast checker mais cette condition check le pdf. 
          // sauf si on dit que "red" = "rgb(255,0,0)" mais c'est chiant

          //###############################
          //###############################
          // MODULE AFFICHAGE GRILLE
          //###############################
          //###############################

          // Cache le bouton / affiche la div avec le jeu
          $(".buttonEnterTheArena1").click(function () {
               $(".buttonEnterTheArena1").hide();
               soundEffectsStart();
               $("#gameBox").css('visibility', "visible");
          })

          // declaration des variables globales
          // les légendes racontent que c'est une mauvaise technique
          // var x = 7; // largeur de la grille   en fait c'etait pour developper j'ai passé ces trucs la en parametre a la fin
          // var y = 6; // hauteur de la grille   en fait c'etait pour developper j'ai passé ces trucs la en parametre a la fin
          var p = 1; // initialisation joueur, le joueur 1 commence toujours
          var lastPlay = "";
          var lastPlayer = "";
          var matchNul = false;
          var victoire = false;
          var playerOneScore = 0;
          var playerTwoScore = 0;

          // création d'un objet j'ai pas trouvé comment le generer dans la fonction sans l'initialiser 
          var cellProperties = { col0row0: { id: 0, classe: 'col' + 0 + ' row' + 0 + '', col: 0, row: 0, couleur: 0 } };

          // generation remplissage des colonnes avec des cellules
          // création des boutons cancel,rejouer; création des divs contenant le score ou le numero du joueur
          // création d'un objet pour stocker l'état courant de la partie
          (function displayGrid(p, x, y) {
               var k = 1;
               $('#gameBox').prepend('<div class="playerName">PLAYER 1</div>');
               $('#gameBox').prepend('<div class="playerScores">PLAYER 1 [ <span style="color:'+color1+';">0</span> &nbsp||&nbsp <span style="color:'+color2+';">0</span> ] PLAYER 2</div>');
               $('#grid').append('<input id="buttonReplay" class="buttonReplay" type="button" name="replay" value="Replay">');
               for (var i = 1; i < (x + 1); i++) {
                    $('#grid').append('<div class="column column' + i + '"></div>'); // colonnes
                    for (var j = 1; j < (y + 1); j++) {
                         $('.column' + i + '').append('<div class="cell cell' + k + ' col' + i + ' row' + j + '" id="' + k + '"></div>'); // cells
                         cellProperties['col' + i + 'row' + j] = { id: k, classe: 'col' + i + ' row' + j + '', col: i, row: j, couleur: 0 }; // objet 
                         k++;
                    }
               }
               $('#grid').append('<input id="buttonCancelLastPlay" class="buttonCancelLastPlay" type="button" name="cancel" value="Cancel">');
          })(p, x, y);

          //###############################
          //###############################
          // FONCTION CHECK VICTORY
          //###############################
          //###############################

          // Conditions de victoire (Voir jpg relation grille puissance 4)
          function checkVictory(cléIndex) {
               var currentColor = cellProperties[cléIndex].couleur;
               var currentCol = cellProperties[cléIndex].col;
               var currentRow = cellProperties[cléIndex].row;
               var tokenHorizontal = 0;
               var tokenVertical = 0;
               var tokenDiagonalPositive = 0;
               var tokenDiagonalNegative = 0;
               var emptyCellFound = 0;


               // horizontal 
               // coté gauche(check les cases à gauche du jeton joué)
               if (currentCol > 1) {
                    for (i = currentCol; i > 1; i--) {
                         colTest = "col" + (i - 1);
                         if (cellProperties[colTest + 'row' + currentRow].couleur === currentColor) {
                              tokenHorizontal += 1;
                         }
                         if (cellProperties[colTest + 'row' + currentRow].couleur != currentColor) {
                              break;
                         }
                         if (tokenHorizontal >= 3) {
                              victoire = true;
                              console.log("Victoire Horizontale");
                              break;
                         }
                    }
               }
               // coté droit(check les cases à droite du jeton joué)
               if (currentCol < x && tokenHorizontal < 3 && x - currentCol > (3 - tokenHorizontal)) {
                    for (i = currentCol; i > 0; i++) {
                         colTest = "col" + (i + 1);
                         if (cellProperties[colTest + 'row' + currentRow].couleur === currentColor) {
                              tokenHorizontal += 1;
                         }
                         if (cellProperties[colTest + 'row' + currentRow].couleur != currentColor) {
                              break;
                         }
                         if (tokenHorizontal >= 3) {
                              victoire = true;
                              console.log("Victoire Horizontale");
                              break;
                         }
                    }
               }

               // vertical (check les cases sous le jeton joué)
               if (currentRow <= (y - 3)) {
                    for (i = currentRow; i < y; i++) {
                         rowTest = "row" + (i + 1);
                         if (cellProperties["col" + currentCol + rowTest].couleur === currentColor) {
                              tokenVertical += 1;
                         }
                         if (cellProperties["col" + currentCol + rowTest].couleur != currentColor) {
                              break;
                         }
                         if (tokenVertical >= 3) {
                              victoire = true;
                              console.log("Victoire Verticale");
                              break;
                         }
                    }
               }

               // diagonaux
               //diagonale positive
               // bas gauche (check les cases en bas à gauche en diagonale du jeton joué)
               if (currentRow < y && currentCol > 1) {
                    for (i = currentRow, j = currentCol; i < y && j > 1; i++ , j--) {
                         rowTest = "row" + (i + 1);
                         colTest = "col" + (j - 1)

                         if (cellProperties[colTest + rowTest].couleur === currentColor) {
                              tokenDiagonalPositive += 1;
                         }
                         if (cellProperties[colTest + rowTest].couleur != currentColor) {
                              break;
                         }
                         if (tokenDiagonalPositive >= 3) {
                              victoire = true;
                              console.log("Victoire Diagonale+");
                              break;
                         }
                    }
               }
               //diagonale positive
               // haut droit (check les cases en haut à droite en diagonale du jeton joué)
               if (currentRow > 1 && currentCol < x && (x - currentCol) > (3 - tokenDiagonalPositive) && currentRow > (3 - tokenDiagonalPositive)) {
                    for (i = currentRow, j = currentCol; i > 1 && j < x; i-- , j++) {
                         rowTest = "row" + (i - 1);
                         colTest = "col" + (j + 1)

                         if (cellProperties[colTest + rowTest].couleur === currentColor) {
                              tokenDiagonalPositive += 1;
                         }
                         if (cellProperties[colTest + rowTest].couleur != currentColor) {
                              break;
                         }
                         if (tokenDiagonalPositive >= 3) {
                              victoire = true;
                              console.log("Victoire Diagonale+");
                              break;
                         }
                    }
               }

               //diagonale negative
               // bas droite (check les cases en bas à droite en diagonale du jeton joué)
               if (currentRow < y && currentCol < x) {
                    for (i = currentRow, j = currentCol; i < y && j < x; i++ , j++) {
                         rowTest = "row" + (i + 1);
                         colTest = "col" + (j + 1)

                         if (cellProperties[colTest + rowTest].couleur === currentColor) {
                              tokenDiagonalNegative += 1;
                         }
                         if (cellProperties[colTest + rowTest].couleur != currentColor) {
                              break;
                         }
                         if (tokenDiagonalNegative >= 3) {
                              victoire = true;
                              console.log("Victoire Diagonale-");
                              break;
                         }
                    }
               }

               // diagonale negative
               // haut gauche (check les cases en bas à droite en diagonale du jeton joué)
               if (currentRow > 1 && currentCol > 1 && (currentCol - 1) > (3 - tokenDiagonalNegative) && currentRow > (3 - tokenDiagonalNegative)) {
                    for (i = currentRow, j = currentCol; i > 1 && j > 1; i-- , j--) {
                         rowTest = "row" + (i - 1);
                         colTest = "col" + (j - 1)

                         if (cellProperties[colTest + rowTest].couleur === currentColor) {
                              tokenDiagonalNegative += 1;
                         }
                         if (cellProperties[colTest + rowTest].couleur != currentColor) {
                              break;
                         }
                         if (tokenDiagonalNegative >= 3) {
                              victoire = true;
                              console.log("Victoire Diagonale-");
                              break;
                         }
                    }
               }

               // vérification du match nul en cas de complétion de grille
               if (currentRow == 1 && !victoire) {
                    for (i = 1; i <= x; i++) {
                         colTest = "col" + (i);
                         if (cellProperties[colTest + 'row1'].couleur == 0) {
                              emptyCellFound += 1;
                              break;
                         }
                    }
                    if (emptyCellFound == 0) {
                         console.log('Match Nul')
                         matchNul = true;
                    }
               }

          } // crochet fin de fonction condition de victoire


          //###############################
          //###############################
          // FONCTION SOUND
          //###############################
          //###############################
          function soundEffectsStart() {
               var starto = new Audio();
               starto.src = 'sounds/startSound.mp3';
               starto.play();

          }
          function soundEffectsCancel() {
               var cancelSound = new Audio();
               cancelSound.src = 'sounds/cancelSound.mp3';
               cancelSound.play();

          }
          function soundEffects2() {
               var beep2 = new Audio();
               beep2.src = 'sounds/laserSound2.mp3';
               beep2.play();
          }
          function soundEffects1() {
               var beep1 = new Audio();
               beep1.src = 'sounds/laserSound1.mp3';
               beep1.play();
          }
          function soundEffectsWin() {
               var winSound = new Audio();
               winSound.src = 'sounds/winSound.mp3';
               winSound.play();
          }
          function soundEffectsReplay() {
               var replaySound = new Audio();
               replaySound.src = 'sounds/replaySound.mp3';
               replaySound.play();
          }
          function soundEffectsDraw() {
               var drawSound = new Audio();
               drawSound.src = 'sounds/loseSound.mp3';
               drawSound.play();
          }



          //###############################
          //###############################
          // FONCTION APPARITION JETON
          //###############################
          //###############################

          $('.column').click(function jetonPop() {
               if (!victoire && !matchNul) {
                    var allClasses = $(this).attr("class"); // recup les classes de la colonne
                    var xLength = x.toString().length;
                    for (z = xLength; z > 0; z--) {
                         if (!(isNaN(allClasses.substring(allClasses.length - z, allClasses.length + 1)))) {
                              var colNumber = allClasses.substring(allClasses.length - z, allClasses.length + 1); // recup le numero de la colonne
                              break;
                         }
                    }

                    // Prend le nnumero de colonne et teste toute la colonne pour chercher les cases dont la couleur est 0
                    // Change le css de la case trouvée et modifie les objets en conséquence 
                    for (i = y; i > 0; i--) {
                         var indexKey = 'col' + colNumber + 'row' + i + ''
                         var cell = $(this).find($('.column > .row' + i + ''));
                         window['colRow'] = indexKey;


                         if (cellProperties[indexKey].couleur == 0) {
                              if (p == 1) {
                                   cellProperties[indexKey].couleur = 1;
                                   cell.css({ 'background-color': color1, "animation": "fallingDown 0.08s 0s linear" });
                                   checkVictory(indexKey);
                                   lastPlay = cell;
                                   lastPlayer = 1;
                                   if (victoire) {
                                        soundEffectsWin();
                                        $('.playerName').html('PLAYER ' + p + '<br> WINS')
                                        playerOneScore += 1;
                                        $('.playerScores').html('PLAYER 1 [ <span style="color:'+color1+';">' + playerOneScore + '</span> &nbsp||&nbsp <span style="color:'+color2+';">' + playerTwoScore + '</span> ] PLAYER 2');
                                   } else if (matchNul) {
                                        soundEffectsDraw();
                                        $('.playerName').html('JEU NUL')
                                   } else {
                                        $('.playerName').html('PLAYER 2')
                                        soundEffects1();

                                   }
                                   p = 2
                              } else if (p == 2) {
                                   cellProperties[indexKey].couleur = 2;
                                   cell.css({ 'background-color': color2, "animation": "fallingDown 0.08s 0s linear" });
                                   checkVictory(indexKey);
                                   lastPlay = cell;
                                   lastPlayer = 2;
                                   if (victoire) {
                                        soundEffectsWin();
                                        $('.playerName').html('PLAYER ' + p + '<br> WINS')
                                        playerTwoScore += 1;
                                        $('.playerScores').html('PLAYER 1 [ <span style="color:'+color1+';">' + playerOneScore + '</span> &nbsp||&nbsp <span style="color:'+color2+';">' + playerTwoScore + '</span> ] PLAYER 2');

                                   } else if (matchNul) {
                                        soundEffectsDraw();
                                        $('.playerName').html('JEU NUL')
                                   } else {
                                        $('.playerName').html('PLAYER 1')
                                        soundEffects2()
                                   }
                                   p = 1
                              }
                              break;
                         }
                    }
               }
          }); // accolade de fin de fonction

          //###############################
          //###############################
          // FONCTION ANNULER LAST PLAY
          //###############################
          //###############################

          $(".buttonCancelLastPlay").click(function () {
               if (typeof (colRow) != "undefined") {
                    soundEffectsCancel();
                    p = lastPlayer;
                    if (victoire && lastPlayer == 1) {
                         playerOneScore -= 1;
                    }
                    if (victoire && lastPlayer == 2) {
                         playerTwoScore -= 1;

                    }
                    $('.playerScores').html('PLAYER 1 [ <span style="color:'+color1+';">' + playerOneScore + '</span> &nbsp||&nbsp <span style="color:'+color2+';">' + playerTwoScore + '</span> ] PLAYER 2');
                    victoire = false;
                    matchNul = false;
                    $('.playerName').html('PLAYER ' + lastPlayer);
                    cellProperties[colRow].couleur = 0;
                    lastPlay.css({ 'background': "black" });
                    colRow = undefined; // pour lock le bouton cancel
               }
          });

          //###############################
          //###############################
          // FONCTION REPLAY
          //###############################
          //###############################

          $(".buttonReplay").click(function () {
               colRow = undefined; // pour lock le bouton cancel
               soundEffectsReplay();
               victoire = false;
               matchNul = false;
               p = 1;
               $('.playerName').html('PLAYER ' + p);
               for (i = x; i > 0; i--) {
                    for (j = y; j > 0; j--) {
                         cellProperties['col' + i + 'row' + j].couleur = 0;
                    }
               }
               $('.cell').css({ 'background': "black", "animation": "none" });
          });

     } // crochet de fin de plugin
})(jQuery);

$('a[rel="external"]').puissance4(7,6,"rgba(255, 0, 0, 0.4)","rgba(255, 255, 0, 0.4)"); 
// je capte rien a la syntaxe xptdrlolololol : lien relatif a quelque chose d'externe??? kek
// "rgba(255, 0, 0, 0.4)","rgba(255, 255, 0, 0.4) pour les test