/*
File: main.js
Description: créer le jeu des 'paires' en Javascript avec jQuery
			Le jeu consiste à retrouver toutes les paires identiques. Le joueur clique sur une carte, sa valeur s'affiche, puis une seconde carte
			Si les deux cartes sont identiques, il a trouvé une paire, sinon les deux cartes sont de nouveau cachées.
			Le joueur gagne lorsqu'il a découvert toutes les paires (il y en a 8 à trouver)
			Le joueur perd, dès qu'il rencontre la paire correspondant à la croix rouge

Author: C.Dedenon
Date de création: 02/12/2018
Version: 1.0.0 
Version: 1.0.1	Modification charte graphique (modifié le 09/07/2019)
*/

$(function(){

	/* ***************************************************************************************************
	******************************************************************************************************
	*								DECLARATION DES VARIABLES 
	******************************************************************************************************
	*  ***************************************************************************************************/
	// 'tab' est le tableau d'origine et 'tabShuffle' le tableau mélangé aléatoirement
	var tab= ["html5", "html5", "css3", "css3", "js", "js", "mysql", "mysql", "php7", "php7", "symfony", "symfony", "wp", "wp" , "angular", "angular", "end", "end"];
	var tabShuffle = shuffle(tab);

	var isFirst = true;				// true si c'est la première des deux cartes, false si c'est la seconde
	var previousElement = null;		// stocke l'élément du tableau (html5, css3, js, mysql, php7, symfony, wp, angular, end) de la première carte
	var previousId = null;			// stocke l'id de l'élément du tableau de la première carte
	var nbPaires = 8;				// indique le nombre de paires restantes à trouver
	var nbChoices = 0;				// indique le nombre de fois que le joueur à jouer


	/* ***************************************************************************************************
	******************************************************************************************************
	*								GESTION DES EVENEMENTS 
	******************************************************************************************************
	*  ***************************************************************************************************/
	/* 
	*	Lorsque l'on clique sur une des images, on effectue la gestion générale du jeu
	*/
	$('figure').on('click', function(e){
		// On teste si l'élement à la classe 'active', si elle ne l'a pas, on ne fait rien du tout
		if($(e.target).parent().hasClass('active')){
			var id_element =  $(e.target).parent().attr('id');		// stocke l'id de l'élément cliqué (img_0, img_1 ...)
			var chars = id_element.split('_');						// stocke dans un tableau les élements de l'id précédent (chars[1] contiendra les index nécéssaires)
			var tab_element =  tabShuffle[chars[1]];				// fait le lien entre l'élément 'html' cliqué et la variable JS 'tabShuffle'
			var pass = true;										// astuce pour ne pas comptabiliser une carte d'une paire déjà découverte
			
			$('#' + id_element + ' img').attr("src", "img/" + tab_element + ".png");	// On dévoile la carte cliquée

			// Toutes les 200ms, on lance la fonction anonyme de gestion du jeu. Le temps permet de mémoriser la carte et son emplacement
			setTimeout(function(){
				// CAS 1: l'élément cliqué est identique à l'élément cliqué précédemment (ie une paire à été trouvée)
				if((tab_element === previousElement) && !isFirst){
					nbChoices++;
					// Si la paire de la "croix rouge" est trouvé alors la partie est terminée, on demande si le joueur veut rejouer
					if(tab_element === "end"){
						endOfTheGame('perdu');
					}
					// Sinon on laisse les deux carte dévoilée (on retire la classe "active")
					pass = false;
					nbPaires--;
					$('#' + id_element).removeClass('active');
					$('#' + previousId).removeClass('active');

					// On met à jour les variables, le nombre de paires à trouver diminue de 1 unité, et on supprime la classe 'active' des deux cartes
					setVariables();
		
					// Si toutes les paires ont été trouvées, la partie est terminée, le joueur a gagné, on lui propose de jouer à nouveau
					if(nbPaires === 0){
						endOfTheGame('gagné');
					}
				}

				// CAS 2: l'élément cliqué n'est pas identique à l'élément cliqué précédemment (ie les deux cartes ne constituent pas une paire)
				if((tab_element != previousElement) && !isFirst){
					// On retourne les deux cartes et on met à jour les variables
					nbChoices++;
					$('#' + id_element + " img").attr("src", "img/back.png");
					$('#' + previousId + " img").attr("src", "img/back.png");
					$('#' + previousId).addClass('active');
					setVariables();
					pass = false;
				}

				// CAS 3: l'élément cliqué est la première des 2 cartes sélectionnée, on stocke alors l'élément et l'id dans les variables concernées
				if(isFirst && pass){
					isFirst = false;
					previousId = id_element;
					previousElement = tab_element;
					$('#' + previousId).removeClass('active');
				}
			}, 200);
		}
	});

	
	/* ***************************************************************************************************
	******************************************************************************************************
	*										FONCTIONS
	******************************************************************************************************
	*  ***************************************************************************************************/
	/**
	 * shuffle(): mélange aléatoirement un tableau
	 * @param Array - tab (le tableau à mélanger)
	 * @return Array - tab (le tableau mélangé aléatoirement)
	 */
	function shuffle(tab){
		var length = tab.length, randomIndex, temporaryValue;
		for(var i=length-1; i > 0; i--){
			randomIndex = Math.floor(Math.random() * (i+1));
			temporaryValue = tab[i];
			tab[i] = tab[randomIndex];
			tab[randomIndex] = temporaryValue;
		}
		return tab;
	} 

	/**
	 * endOfTheGame(): affiche un message et demande au joueur s'il vaut rejouer. Si oui, le chargement de la page est effectué
	 * @param String - text (le texte à affiché 'gagné' ou 'perdu')
	 * @return void
	 */
	function endOfTheGame(text){
		if(confirm(`Vous avez ${text} la partie en ${nbChoices} coups. \nVoulez-vous rejouer ?`)){
			location.reload();
		}
		else{
			tabShuffle.forEach(function(element, index, array){
				$("#img_" + index).removeClass('active');
			});
		}	
	}	

	/**
	 * setVariables(): réinitialise les variables globales
	 * @param void
	 * @return void
	 */
	function setVariables(){
		isFirst = true;	
		previousId = null;
		previousElement = null;
	}	
});