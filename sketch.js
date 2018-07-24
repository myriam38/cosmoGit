var camera;
//permet d'activer la camera dans un code
var canvas;
//périmètre de travail
var largeur
//dimension du périmètre en largeur
var hauteur
//dimension du périmètre en hauteur
var imgfond;
//permet de pouvoir afficher l'image de fond
var seuil = parseFloat(localStorage.getItem("seuil"))
//permet de définir la distance maximale tolérer entre la couleur que l'on veut repérer et la couleur de la camera
var slider;
//l'élèment graphique qui permet de modifié la vlaeur seuil
var couleuradetecter = [parseFloat(localStorage.getItem("rouge")), parseFloat(localStorage.getItem("vert")), parseFloat(localStorage.getItem("bleu"))]
//permet de remplacer la couleur manuellement
var vid
//permet de lire une vidéo
var secondeCR = 7
//permet de créer le compte à rebours
var ListeImage = ["media/4.jpg", "media/2.jpg", "media/3.jpg","media/5.jpg"]
var PositionListe = 0
var buttonHide
//Permet de cahcer ou de montrer les autre boutons
var buttonvisible = true
//afficher button
var buttonPhoto
var buttonSuivant
var buttonFullScreen
var nombre = 100;
var posX = [];
var posY = []; 
var speed = []; 
var bleu = [];
var vert = [];

var taille = []; 
function setup() //appeler qu'une fois au début et elle nous sert à paramétrer toute nos variables
{

    largeur = windowWidth
    hauteur = windowHeight
    canvas = createCanvas();
    //création de périmètre de travail
    canvas.size(largeur, hauteur)
    //taille de la largeur et de la hauteur
    camera = createCapture(VIDEO);
    //vidéo
    slider = createSlider(0, 250, seuil);
    //permet de créer le curseur  
    slider.mouseReleased(sliderchange)
    //la position du curseur
    slider.style('width', '80px');
    //permet de donner la largeur du slider à 80px
    camera.size(largeur, hauteur);
    //taille de l'affichage de la vidéo
    pixelDensity(1)
    //dennsité des pixels
    camera.hide();
    //caméra caché
    frameRate(20);
    //nombre d'image par seconde
    imgfond = loadImage("media/2.jpg")
    //fichier à télécharger pour l'image de fond
    buttonPhoto = createImg('media/Photo.png');
    //créer le bouton
    buttonPhoto.mousePressed(comptearebours);
    //quand tu clique sur le bouton la fonction photo est apeller
    text()
    textSize(100)
    buttonSuivant = createImg("media/suivant.png")  
    buttonSuivant.mousePressed(suivant)
    buttonHide = createImg('media/disparaitre.png')
    //créer un button
    buttonHide.mousePressed(hideShow)
    //créer un boutton ou on peut appuyer dessus('Hide')    
    buttonFullScreen = createImg("media/plein.png")   
    buttonFullScreen.mousePressed(pleinEcran)

      background("crimson");

   for (var i = 0; i < nombre; i=i+1) {
        posX[i] = random(-200, 800);
        posY[i] = random(0, 200);
        speed[i] = random(2, 7); 
        bleu[i] = random(255);
        vert[i] = random(255); 
        taille[i] = random(0.1, 0.9);
   }
    position_button();
}
function draw() //dessiner chaque image que l'on voit à l'ecran
{
      image(imgfond, 0, 0, largeur, hauteur)
    //dessine l'image ou la vidéo en plein écran
    drawVideo();
    loadPixels()
    //charge les pixels
    dessinerCamera();
    //dessine la webcam
    seuil = slider.value();
    //prend la valeur du slider pour modifié le seuil
    updatePixels();
    //permet de charger les pixels en mouvement
    textAffiche();
    

}
function dessinerCamera() {
    if (camera.width == 0) {
        camera.width = camera.imageData.width
        camera.height = camera.imageData.height
    }

    //afficher l'image de la caméra
    camera.loadPixels();
    //telecharger les pixels de la vidéo
    if (camera.pixels.length) {
        //verifie que la caméra marche
        var pixView = camera.pixels
        //pixels à afficher
        const w = canvas.width;
        //périmèetre de travail gauche
        const h = canvas.height;
        //périmètre de travail droit
        for (let i = 0; i < w; i++) {
            //on se balade sur les colonnes
            for (let j = 0; j < h; j++) {
                //on se balade sur les lignes
                const position1dCanvas = (j * w + i) * 4;
                //sert à récuperer la position dans le tableau des pixels
                const r = pixView[position1dCanvas + 0];
                //couleur rouge du pixel de la caméra
                const g = pixView[position1dCanvas + 1];
                //couleur vert du pixel de la caméra
                const b = pixView[position1dCanvas + 2];
                //couleur bleue du pixel de la caméra
                if (distance(r, g, b, couleuradetecter[0], couleuradetecter[1], couleuradetecter[2]) < seuil) {} else {
                    // si la distance des couleurs est inférieur à seuil alors...
                    pixels[position1dCanvas + 0] = r;
                    //afficher couleur rouge du pixel de la caméra
                    pixels[position1dCanvas + 1] = g;
                    //afficher couleur vert  du pixel de la caméra
                    pixels[position1dCanvas + 2] = b;
                    //afficher couleur bleue du pixel de la caméra
                }
            }
        }
    }
}

function distance(r1, g1, b1, r2, g2, b2) {
    //sert à afficher le résultat du calcul de couleur
    return (Math.abs(r2 - r1) + Math.abs(g2 - g1) + Math.abs(b2 - b1)) / 3
    //calcul la distance d'une couleur à une autre
}
function mouseClicked(e) {
    if (e.srcElement == canvas.canvas) {
        //fonction appeler quand la souris clock sur quelque choses
        var position1dCanvas = (mouseY * largeur + mouseX) * 4;
        //permet de detecter ou se situe la sourie en X et en Y
        couleuradetecter[0] = camera.pixels[position1dCanvas + 0]
        //sert a sauvegarder le pixel sous la souris quand la véritable couleur est detecter
        couleuradetecter[1] = camera.pixels[position1dCanvas + 1]
        //sert a sauvegarder le pixel sous la souris quand la véritable couleur est detecter
        couleuradetecter[2] = camera.pixels[position1dCanvas + 2]
        localStorage.setItem("rouge", "" + couleuradetecter[0])
        localStorage.setItem("vert", "" + couleuradetecter[1])
        localStorage.setItem("bleu", "" + couleuradetecter[2])

    }
}
//sert a sauvegarder le pixel sous la souris quand la véritable couleur est detecter
function Photo() // action du bouton
{
    var today = new Date();
    var photoDay = ajoutZero(today.getDate())
    var photoMonth = ajoutZero(today.getMonth() + 1)
    var photoYear = ajoutZero(today.getFullYear())
    var photoHour = ajoutZero(today.getHours())
    var photoMinute = ajoutZero(today.getMinutes())
    var photoSeconde = ajoutZero(today.getSeconds())
    var photoFullDay = photoDay + '-' + photoMonth + '-' + photoYear + '-' + photoHour + photoMinute + photoSeconde
    saveCanvas(canvas, photoFullDay, 'jpg');
    // permet de sauvegarder l'image

}
function ajoutZero(nombre) {
    if (nombre < 10) {
        return '0' + nombre
    } else {
        return '' + nombre

    }

}

function comptearebours() {
    //sert à activer un compte a rebours
    secondeCR = secondeCR - 1
    if (secondeCR == 0) {
        Photo()
        secondeCR = 7
    } else {
        setTimeout(comptearebours, 1000)
    }
}
function textAffiche() {
    //sert a afficher le compteur

    if (secondeCR == 6) {
        text('5', 250, 250)

    }
    if (secondeCR == 5) {
        text('4', 250, 250)
    }
    if (secondeCR == 4) {
        text('3', 250, 250)

    }
    if (secondeCR == 3) {
        text('2', 250, 250)

    }
    if (secondeCR == 2) {
        text('ouistiti', 250, 250)

    }
    if (secondeCR == 1) {
        text('', 45, 250)
    }
}

function suivant() {

    if (PositionListe < ListeImage.length - 1) {
        PositionListe = PositionListe + 1;
    } else {
        PositionListe = 0;

    }

    chargerImg()
}
function chargerImg() {
    imgfond = loadImage(ListeImage[PositionListe])

}

function hideShow() {
    if (buttonvisible == true) {
        buttonPhoto.hide()
        buttonSuivant.hide()
        slider.hide()
        buttonFullScreen.hide()
        buttonvisible = false
    } else {
        buttonPhoto.show()
        buttonSuivant.show()
        slider.show()
        buttonFullScreen.show()
        buttonvisible = true
    }

}

function sliderchange() {
    localStorage.setItem("seuil", "" + seuil)

}

function windowResized() {

    largeur = windowWidth
    hauteur = windowHeight
    canvas.size(windowWidth, windowHeight);
    camera.size(windowWidth, windowHeight)
}

function position_button(){
      var cotesmile1=windowHeight/8
      var cotesmile2= windowHeight/8
      var cotesmile3=windowHeight/8
      slider.size(400,30);
      slider.position(100, 10);
      buttonPhoto.size(100,100);
      buttonPhoto.position(windowWidth/2-buttonPhoto.width/2,hauteur-buttonPhoto.height-2);
      buttonSuivant.size(100,100);
      buttonSuivant.position(windowWidth-cotesmile1,hauteur-cotesmile1);
      buttonHide.size(100,100);
      buttonHide.position(600, 10);
      buttonFullScreen.size(100,100);
      buttonFullScreen.position(cotesmile3,cotesmile3);
      

}

function pleinEcran() {
    var fs = fullscreen();
    fullscreen(!fs);

}

function etoile(x, y, b, v, taille) {
    fill(0, 0, b)
    beginShape();
    vertex(x, y);
    vertex(x + 25 * taille, y + 60 * taille);
    vertex(x + 90 * taille, y + 60 * taille);
    vertex(x + 40 * taille, y + 100 * taille);
    vertex(x + 60 * taille, y + 170 * taille);
    vertex(x + 0 * taille, y + 130 * taille);
    vertex(x - 60 * taille, y + 170 * taille);
    vertex(x - 40 * taille, y + 100 * taille);
    vertex(x - 90 * taille, y + 60 * taille);
    vertex(x - 25 * taille, y + 60 * taille);
    vertex(x + 0 * taille, y + 0 * taille);
    endShape();
}
function drawVideo(){
 //background("yellow");
    for (var i = 0; i < nombre; i=i+1) {
        etoile(posX[i], posY[i], bleu[i], vert[i], taille[i]);
        posY[i] += speed[i]; 
        if(posY[i]>=hauteur){
            posY[i]=-400
            posX[i] = random(-200, windowWidth); 
        }
    }
}