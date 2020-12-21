"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;   //matrix

var instanceMatrix;

var modelViewMatrixLoc;


var animationflag = false;

var vertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var eye;
var modelView;
var radius = 30;
var thetaperspective  = 282.0*Math.PI/180.0;
var phi  = 0.0;

var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);



//======================================================
//CODE FOR TEXTURE

var texSize = 256;
var texture1, texture2,texture3,texture4,texture5,texture6;
var numChecks = 12;
var c;
var flagHead = false;
var flagBranch = false;
var flagLog = false;
var flaglower = false;


// to handle texture -------------------
var texCoordsArray = [];
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var image1= new Uint8Array(4*texSize*texSize);

    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            var patchx = Math.floor(i/(texSize/numChecks));
            var patchy = Math.floor(j/(texSize/numChecks));
            if(patchx%2 ^ patchy%2) c = 200;
            else c = 20;
            c = 200*(((i & 0x13) == 0) ^ ((j & 0x13)  == 0))
            image1[4*i*texSize+4*j] = c;
            image1[4*i*texSize+4*j+1] = 2;
            image1[4*i*texSize+4*j+2] = 2;
            image1[4*i*texSize+4*j+3] = 255;
        }
    }


    var image2 = new Uint8Array(4*texSize*texSize);

        for ( var i = 0; i < texSize; i++ ) {
            for ( var j = 0; j <texSize; j++ ) {
                var patchx = Math.floor(i/(texSize/numChecks));
                var patchy = Math.floor(j/(texSize/numChecks));
                if(patchx%2 ^ patchy%2) c = 92;
                else c = 154;
                //c = 255*(((i & 0x8) == 0) ^ ((j & 0x8)  == 0))
                image2[4*i*texSize+4*j] = 200 ;
                image2[4*i*texSize+4*j+1] = c;
                image2[4*i*texSize+4*j+2] = 50;
                image2[4*i*texSize+4*j+3] = 255;
            }
        }


  var image3 = new Uint8Array(4*texSize*texSize);

      // Create a checkerboard pattern
      for (var i = 0; i < texSize; i++) {
          for (var j = 0; j <texSize; j++) {
              image3[4*i*texSize+4*j] = 121;
              image3[4*i*texSize+4*j+1] = 80;
              image3[4*i*texSize+4*j+2] = 26;
              image3[4*i*texSize+4*j+3] = 255;
             }
      }


  var image4 = new Uint8Array(4*texSize*texSize);

      // Create a checkerboard pattern
      for (var i = 0; i < texSize; i++) {
          for (var j = 0; j <texSize; j++) {
              image4[4*i*texSize+4*j] =  26;
              image4[4*i*texSize+4*j+1] =  121;
              image4[4*i*texSize+4*j+2] = 33;
              image4[4*i*texSize+4*j+3] = 255;
             }
      }


function configureTexture() {

    texture1 = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image1);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    texture2 = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture2 );
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image2);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);



    texture3 = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture3 );
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image3);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);


    texture4 = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture4);
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image4);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

}

//END CODE FOR Texture
//======================================================




//======================================================
//VARIABLES FOR THE BEAR
var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 10;
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;

var tailId = 11;
var branchId = 12;
var logId = 13;

var torsoHeight = 3.8;
var torsoWidth = 6.0;

var upperArmHeight = 2.2;
var upperArmWidth  = 1.2;

var lowerArmHeight = 1.6;
var lowerArmWidth  = 0.9;

var upperLegHeight = 2.2;
var upperLegWidth  = 1.2;


var lowerLegHeight = 1.6;
var lowerLegWidth  =0.9;

var headHeight = 2;
var headWidth =  2.4;

var tailHeight = 0.6;
var tailWidth = 1.1;


var branchHeight = 8.0;
var branchWidth = 8.0;
var logWIdth = 3;
var logHeight = 20;

var numNodes = 14;
var numAngles = 14;
var angle = 0;

var theta = [0, 160,/*beginleg*/ 190, 195, 170, 175, 190, 180, 170, 160, /*other*/180, 190, 0, 0];  //torso - head - rightarm - rightarmlower - leftarm ecc.
//var theta_torso = [90, 90, 0];

var numVertices = 24;

var stack = [];

var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];

//=========================================================
//-------------------------------------------
//CLASSIC FUNCTIONS

function scale4(a, b, c) {
   var result = mat4();
   result[0] = a;
   result[5] = b;
   result[10] = c;
   return result;
}

//--------------------------------------------


function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}

//=========================================================

//BEGIN FIGURE OF BEAR
function initNodes(Id) {

    var m = mat4();

    switch(Id) {

    case branchId:
      m = translate(5, 17, 14.0);
      m = mult(m, rotate(theta[torsoId], vec3(1, 0, 0) ));
      figure[branchId] = createNode( m, branch, logId ,null );
      break;

    case logId:
      m = translate(5, -1.6, 14);
      m = mult(m, rotate(theta[torsoId], vec3(1, 0, 0) ));
      figure[logId] = createNode( m, log, null, null );
      break;

    case torsoId:
    m = translate(-0.9, 0.7, -1.2);
    m = mult(m, translate(0, 0, translateBodyall)); //to move along the x axis
    m = mult(m, translate(0, translateBodyY, 0));  //move on y
    m = mult(m, translate(translatebodyX, 0, 0));
    m = mult(m, rotate(theta[torsoId], vec3(1, 0, 0) ));
    m = mult(m, rotate(rotatetorso, vec3(1, 0, 0)));
    m = mult(m, rotate(rotatetorsotwo, vec3(0, 0, 1) ));
    m = mult(m, rotate(rotatetorsothree, vec3(0,1,0)));
    m = mult(m, translate( 0,0 , bodyYtwo));  //move on y
    figure[torsoId] = createNode( m, torso, null, tailId );
    break;

    case tailId:
      m = translate(0, 3.2, -3.4);
      m = mult(m, rotate(theta[tailId], vec3(1, 0, 0)));
      figure[tailId] = createNode( m, tail, headId, null );
      break;


    case headId:
    case head1Id:
    case head2Id:


      m = translate(0.0 ,3.3,4.0);
  	  m = mult(m, rotate(theta[head1Id], vec3(1, 0, 0)))
  	  m = mult(m, rotate(theta[head2Id], vec3(0, 1, 0)));
      m = mult(m, rotate(rotateheadwalk , vec3(0, 1, 0)));
      m = mult(m, rotate(rotateheadwalktwo , vec3(1, 0, 0)));
      m = mult(m, translate(0, translatehead , translateheadtwo  ));
      m = mult(m, rotate(rotateheadup , vec3(1, 0, 0)));
      m = mult(m, rotate(rotateheadscratchhorizontal , vec3(0, 1, 0)));
        m = mult(m, rotate(rotateheadscratchvertical , vec3(1, 0, 0)));
      figure[headId] = createNode( m, head, leftUpperArmId, null);
      break;


    case leftUpperArmId:

    m = translate(-1.3, 0.8, 2.0);
	  m = mult(m, rotate(theta[leftUpperArmId], vec3(1, 0, 0)));
    m = mult(m, rotate(rotaterightupper, vec3(1, 0, 0)));
    m = mult(m, rotate(rotaterightuppertree, vec3(1, 0, 0)));
    m = mult(m, translate(0, pushtranslate, 0 ));
    figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
    break;


    case rightUpperArmId:

    m = translate(1.3, 0.8, 2.0);
	  m = mult(m, rotate(theta[rightUpperArmId], vec3(1, 0, 0)));
    m = mult(m, rotate(rotateleftupper, vec3(1, 0, 0)));
    m = mult(m, rotate(rotateleftuppertree, vec3(1, 0, 0)));
    m = mult(m, translate(0, pushtranslate, 0 ));
    figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
    break;

    case leftUpperLegId:

    m = translate(-1.3, 0.8, -2.0);
	  m = mult(m , rotate(theta[leftUpperLegId], vec3(1, 0, 0)));
    m = mult(m, rotate(rotaterightupperleg, vec3(1, 0, 0)));
    m = mult(m, rotate(rotateennesim, vec3(1, 0, 0)));

    m = mult(m, translate(0, 0,  translateupperlegleft));
    m = mult(m, translate(0, translateupperlegrightprova,0  ));
    m = mult(m, rotate(gambaupperleft, vec3(1, 0, 0)));
    m = mult(m, translate(0, gambatranslate, 0  ));

    figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;

    case rightUpperLegId:

    m = translate(1.3, 0.8, -2.0);
	  m = mult(m, rotate(theta[rightUpperLegId], vec3(1, 0, 0)));
    m = mult(m, rotate(rotateleftupperleg, vec3(1, 0, 0)));
    m = mult(m, rotate(rotateennesimtwo, vec3(1, 0, 0)));
    m = mult(m, translate(0, 0,  translateupperlegright));
    m = mult(m, rotate(gambaupperright, vec3(1, 0, 0)));
    m = mult(m, translate(0, gambatranslate,  0));
    figure[rightUpperLegId] = createNode( m, rightUpperLeg, null, rightLowerLegId );
    break;

    case leftLowerArmId:  //RIGHT

    m = translate(0.0, 3.2, -0.2);
    m = mult(m, rotate(theta[leftLowerArmId], vec3(1, 0, 0)));
    m = mult(m, rotate(rotateleftlower, vec3(1, 0, 0)));
    m = mult(m, rotate(otherrotate, vec3(1, 0, 0)));
    m = mult(m, translate(0, othertranslate, othertranslate));
    figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
    break;

    case rightLowerArmId: //LEFT

    m = translate(0.0, 3.2, -0.2);
    m = mult(m, rotate(theta[rightLowerArmId], vec3(1, 0, 0)));
    m = mult(m, rotate(rotaterightlower, vec3(1, 0, 0)));
    m = mult(m, rotate(otherrotatetwo, vec3(1, 0, 0)));
    m = mult(m, translate(0, othertranslatetwo, othertranslatetwo));
    figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
    break;

    case leftLowerLegId:

    m = translate(0.0, 3.2, 0.2);
    m = mult(m, rotate(theta[leftLowerLegId],vec3(1, 0, 0)));
    m = mult(m, rotate(rotateleftlowerleg, vec3(1, 0, 0)));
    m = mult(m, rotate(rotateennesimlower, vec3(1, 0, 0)));
    m = mult(m, rotate(gambalowerleft, vec3(1, 0, 0)));
    m = mult(m, rotate(adjustrotate, vec3(1, 0, 0)));
    figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );

    break;

    case rightLowerLegId:

    m = translate(0.0, 3.2, 0.2);
    m = mult(m, rotate(theta[rightLowerLegId], vec3(1, 0, 0)));
    m = mult(m, rotate(rotaterightlowerleg, vec3(1, 0, 0)));
    m = mult(m, rotate(rotateennesimlowertwo, vec3(1, 0, 0)));
    m = mult(m, rotate(gambalowerright, vec3(1, 0, 0)));
    figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
    break;

    }

}





//VARIABLES FOR ANIMATION ---------------------
//============================================

var turn = 0.4;
var turn2 = 0.4;
var turnhead = 0.25;
var turnheadtwo = 0.1;
var turn3 = 0.5;
var turn4 = 0.2;
var turn6 = 0.4;
var turn7 = 0.3;

var translateBodyall = 0;
var translateBodyY = 0;
var translatebodyX = 0;
var translatehead = 0;
var translateheadtwo = 0;

var rotatetorso = 0;
var rotatetorsotwo = 0;
var rotatetorsothree = 0;

var rotateleftupper= 0;
var rotateleftlower= 0;

var rotaterightupper= 0;
var rotaterightlower= 0;

var rotateleftupperleg= 0;
var rotateleftlowerleg= 0;

var rotaterightupperleg= 0;
var rotaterightlowerleg= 0;

var rotateheadwalk = 0;
var rotateheadwalktwo = 0;
var rotateheadup = 0;

var translateupperlegleft = 0;
var translateupperlegright = 0;

var rotaterightuppertree = 0;
var rotateleftuppertree = 0;



var leftarmflag = true;
var leftlegflag = true;
var rightarmflag = true;
var rightlegflag = true;

var rotateheadflag = true;
var rotateheadflagtwo = true;

var leftlegflagtwo = true;
var rightlegflagtwo = true;
var leftarmflagtwo = true;
var rightarmflagtwo = true;

var otherrotate = 0;
var otherrotatetwo = 0;
var othertranslate = 0;
var othertranslatetwo = 0;

var pushrotate = 0;
var pushtranslate = 0;

var gambaupperright = 0;
var gambaupperleft = 0;

var gambalowerright = 0;
var gambalowerleft = 0;

var gambaupperflag = true;
var gambalowerflag = true;

var bodyYtwo = 0;
var flagbodyY = true;

var rotateheadscratchhorizontal = 0;
var rotateheadscratchvertical = 0;


var gambatranslate = 0;
var adjustrotate = 0;

var variable =0;

var translateupperlegrightprova = 0;


var ennesimflag = true;
var rotateennesim = 0;
var rotateennesimlower = 0;
var ennesimflagtwo = true;
var rotateennesimtwo = 0;
var rotateennesimlowertwo = 0;

var controltime = 0;



var animation = function(){

  if(translateBodyall < 16){
    translateBodyall +=0.025;

    //MOVING HEAD
    if(translateBodyall < 10){
      if(rotateheadflag)
        rotateheadwalk += turnhead;
      else{
        rotateheadwalk -= turnhead;
      }
        if(rotateheadwalk > 16){
          rotateheadflag = false;
        }
        else if (rotateheadwalk < -16){
          rotateheadflag =true;
        }
    }

    //MOVING HEAD TWO
    if(translateBodyall > 10){
      if(rotateheadflagtwo)
        rotateheadwalktwo += turnheadtwo;
      else{
        rotateheadwalktwo -= turnheadtwo;
      }
        if(rotateheadwalktwo > 16){
          rotateheadflagtwo = false;
        }
        else if (rotateheadwalktwo < 0){
          rotateheadflagtwo =true;
        }
    }


      //WALK
    if(leftarmflag){
      rotateleftupper +=turn;
      rotateleftlower -=turn2;
    }
    else{
        rotateleftupper -=turn;
        rotateleftlower +=turn2;
    }
    if(rotateleftupper > 20){
      leftarmflag = false;
    }
    else if (rotateleftupper < 0){
      leftarmflag =true;
    }


    if(leftlegflag){
      rotateleftupperleg +=turn;
      rotateleftlowerleg -=turn2;
    }
    else{
        rotateleftupperleg -=turn;
        rotateleftlowerleg +=turn2;
    }
    if(rotateleftupperleg > 20){
      leftlegflag = false;
    }
    else if (rotateleftupperleg < 0){
      leftlegflag =true;
    }

    if(rightarmflag){
      rotaterightupper -=turn;
      rotaterightlower +=turn2;
    }
    else{
        rotaterightupper +=turn;
        rotaterightlower -=turn2;
    }

    if(rotaterightupper > 0){
      rightarmflag = true;
    }
    else if (rotaterightupper < -20){
      rightarmflag =false;
    }


    if(rightlegflag){
      rotaterightupperleg -=turn;
      rotaterightlowerleg +=turn2;
    }
    else{
        rotaterightupperleg +=turn;
        rotaterightlowerleg -=turn2;
    }
    if(rotaterightupperleg > 0){
      rightlegflag = true;
    }
    else if (rotaterightupperleg < -20){
      rightlegflag =false;
    }

}


else if (controltime < 6.8){  //PUSH TO GO UP

  pushtranslate -=0.003;
  translateBodyY -=0.004;


}


else if (rotatetorso < 90 && controltime > 6.8){  //GO UP
    translateBodyY+=0.015;
    rotatetorso+=0.5;
    //rotatetorsotwo+=0.5;


    translatehead+=0.018;
    translateheadtwo+=0.007;
    rotateheadup+=0.3


//LEGS
  if(rightlegflagtwo){
    rotaterightupperleg -=turn3;
    translateupperlegright +=0.003;

  }
  if(rotaterightupperleg < -90){
    rightlegflagtwo = false;
  }

  if(leftlegflagtwo){
    translateupperlegleft +=0.003;
    rotateleftupperleg -=turn3;
  }
  if(rotateleftupperleg < -90){
    leftlegflagtwo = false;
}


//ARMS
if(rightarmflagtwo){
  rotaterightuppertree -=turn4;


}
if(rotaterightuppertree < -45){
  rightarmflagtwo = false;}

if(leftarmflagtwo){
  rotateleftuppertree -=turn4;

}
if(rotateleftuppertree< -95){
  leftarmflagtwo = false;
    }


    rotatetorsotwo +=0.01;

  }

  else if (rotatetorsotwo < 90 && controltime > 7){ //TURN TO THE TREE



    if (rotatetorsotwo > 60){
      translatebodyX +=0.0151;
    }


    if(ennesimflag){
      rotateennesim -=turn;
      rotateennesimlower +=turn2;
    }
    else{
        rotateennesim +=turn;
        rotateennesimlower -=turn2;
    }
    if(rotateennesim > 15){
      ennesimflag = true;
    }

    else if (rotateennesim < -15){
      ennesimflag =false;
    }



    if(ennesimflagtwo){
      rotateennesimtwo +=turn;
      rotateennesimlowertwo -=turn2;
    }
    else{
        rotateennesimtwo -=turn;
        rotateennesimlowertwo +=turn2;
    }
    if(rotateennesimtwo > 15){
      ennesimflagtwo = false;
    }

    else if (rotateennesimtwo < -15){
      ennesimflagtwo =true;
    }

    rotatetorsotwo +=0.5; //ROTATE
  }


  else if (controltime > 7){  //PRESCRATCHING


    if (adjustrotate > -10){ //LEG PIECE
        adjustrotate -=0.4;
    }

    //ARMS
    if (otherrotate > -60){
      otherrotate -=0.6;
      othertranslate -=0.009;
    }

    if (otherrotatetwo > -60){
        otherrotatetwo -=0.6;
        othertranslatetwo -=0.010;
    }

    variable +=1;


    if(variable == 850){
      animationflag = false;
      document.getElementById("start").textContent = "Restart";
    }


//LEGS and BODY and HEAD SCRATCHING

if(variable > 20){


    if(gambalowerflag){
      gambalowerleft+=turn7;
      gambalowerright+=turn7;
      bodyYtwo+= 0.01;
      gambatranslate += 0.009;
      if (variable < 200){
      rotateheadscratchhorizontal -=0.7;
    }
    else{
          rotateheadscratchhorizontal -=0.4;
    }
    }
    else{
      gambalowerleft-=turn7;
      gambalowerright-=turn7;
      bodyYtwo-= 0.01;
      if (variable < 200){
      rotateheadscratchhorizontal +=0.7;
    }
    else{
          rotateheadscratchhorizontal +=0.4;
    }


      gambatranslate -= 0.009;
    }

    if(gambalowerright < -10){
      gambalowerflag = true;
    }
    else if(gambalowerright > 10){
      gambalowerflag = false;
    }

}

}  //SCRATCH

controltime+=0.01;
console.log(controltime);

}


//------------------------------------------------------
//END ANIMATION ----------------------------------------



function traverse(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}


function branch() {
    flagBranch = true;
    gl.uniform1i(gl.getUniformLocation( program, "branch"), flagBranch);

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*branchHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( branchWidth, branchHeight, branchWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

    flagBranch = false;
    gl.uniform1i(gl.getUniformLocation( program, "branch"), flagBranch);
}

function log() {

    flagLog = true;
    gl.uniform1i(gl.getUniformLocation( program, "log"), flagLog);

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*logHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( logWIdth, logHeight, logWIdth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

    flagLog = false;
    gl.uniform1i(gl.getUniformLocation( program, "log"), flagLog);
}

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( 4, 3, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {

    flagHead = true;
    gl.uniform1i(gl.getUniformLocation( program, "head"), flagHead);

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale(1.4, 1.5, 1.7) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

    flagHead = false;
    gl.uniform1i(gl.getUniformLocation( program, "head"), flagHead);
}


function tail() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * tailHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale(tailWidth, tailHeight, tailWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm() {
  flaglower = true;
  gl.uniform1i(gl.getUniformLocation( program, "lower"), flaglower);

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

    flaglower = false;
    gl.uniform1i(gl.getUniformLocation( program, "lower"), flaglower);
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperArmWidth, upperArmHeight, upperArmWidth) );
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm() {

  flaglower = true;
  gl.uniform1i(gl.getUniformLocation( program, "lower"), flaglower);

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

    flaglower = false;
    gl.uniform1i(gl.getUniformLocation( program, "lower"), flaglower);
}

function  leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLeg() {

  flaglower = true;
  gl.uniform1i(gl.getUniformLocation( program, "lower"), flaglower);

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

    flaglower = false;
    gl.uniform1i(gl.getUniformLocation( program, "lower"), flaglower);
}

function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg() {

  flaglower = true;
  gl.uniform1i(gl.getUniformLocation( program, "lower"), flaglower);

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);

    flaglower = false;
    gl.uniform1i(gl.getUniformLocation( program, "lower"), flaglower);
}



function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     texCoordsArray.push(texCoord[3]);
     pointsArray.push(vertices[b]);
     texCoordsArray.push(texCoord[2]);
     pointsArray.push(vertices[c]);
     texCoordsArray.push(texCoord[1]);
     pointsArray.push(vertices[d]);
     texCoordsArray.push(texCoord[0]);
}


function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);

    instanceMatrix = mat4();

    projectionMatrix = perspective(90, 1, 0.1, 60);
    modelViewMatrix = mat4();


    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix)  );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix)  );



    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")



    cube();

    modelView = gl.getUniformLocation(program, "modelViewMatrix");

    vBuffer = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );


    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );


  configureTexture();



    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);

    gl.activeTexture(gl.TEXTURE1 );
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 1);

    gl.activeTexture(gl.TEXTURE2 );
    gl.bindTexture(gl.TEXTURE_2D, texture4);
    gl.uniform1i(gl.getUniformLocation( program, "Tex2"), 3);

    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texture3);
    gl.uniform1i(gl.getUniformLocation( program, "Tex3"), 2);



    document.getElementById("thetaSlider").oninput = function() {thetaperspective = this.valueAsNumber*Math.PI/180.0;
         document.getElementById('labelTheta').innerHTML = " " + this.valueAsNumber;  };

    document.getElementById("change").onclick = function(){
        if (thetaperspective == 282*Math.PI/180.0){
            thetaperspective = 332*Math.PI/180.0
            document.getElementById('labelTheta').innerHTML = "332"
            document.getElementById('thetaSlider').valueAsNumber = 332
        }
        else{
          thetaperspective = 282*Math.PI/180.0
          document.getElementById('labelTheta').innerHTML = "Starting Point"
          document.getElementById('thetaSlider').valueAsNumber = 282
        }


    }


    document.getElementById("start").onclick = function(){
      if (this.textContent == "Start Animation"){  this.textContent = "Stop Animation"; animationflag = true; }
      else if( this.textContent == "Stop Animation") {this.textContent = "Start Animation";   animationflag = false;}
      else{

            this.textContent = "Stop Animation";
            animationflag = true;
            //RESET TUTTE LE VARIABILI
             translateBodyall = 0;
             translateBodyY = 0;
             translatebodyX = 0;
             translatehead = 0;
             translateheadtwo = 0;

             rotatetorso = 0;
             rotatetorsotwo = 0;
             rotatetorsothree = 0;

             rotateleftupper= 0;
             rotateleftlower= 0;

             rotaterightupper= 0;
             rotaterightlower= 0;

             rotateleftupperleg= 0;
             rotateleftlowerleg= 0;

             rotaterightupperleg= 0;
             rotaterightlowerleg= 0;

             rotateheadwalk = 0;
             rotateheadwalktwo = 0;
             rotateheadup = 0;

             translateupperlegleft = 0;
             translateupperlegright = 0;

             rotaterightuppertree = 0;
             rotateleftuppertree = 0;



             leftarmflag = true;
             leftlegflag = true;
             rightarmflag = true;
             rightlegflag = true;

             rotateheadflag = true;
             rotateheadflagtwo = true;

             leftlegflagtwo = true;
             rightlegflagtwo = true;
             leftarmflagtwo = true;
             rightarmflagtwo = true;

             otherrotate = 0;
             otherrotatetwo = 0;
             othertranslate = 0;
             othertranslatetwo = 0;

             pushrotate = 0;
             pushtranslate = 0;


            //VARIABLES TO SCRATCH
             gambaupperright = 0;
             gambaupperleft = 0;

             gambalowerright = 0;
             gambalowerleft = 0;

             gambaupperflag = true;
             gambalowerflag = true;

             bodyYtwo = 0;
             flagbodyY = true;

             rotateheadscratchhorizontal = 0;
             rotateheadscratchvertical = 0;

             gambatranslate = 0;
             adjustrotate = 0;

             variable =0;

             translateupperlegrightprova = 0;

             ennesimflag = true;
             rotateennesim = 0;
             rotateennesimlower = 0;
             ennesimflagtwo = true;
             rotateennesimtwo = 0;
             rotateennesimlowertwo = 0;

             controltime = 0;


      }
    };


      for(i=0; i<numNodes; i++) initNodes(i);

    render();
}




var render = function() {


        for(i=0; i<numNodes; i++) initNodes(i);

        eye = vec3(radius*Math.sin(thetaperspective)*Math.cos(phi), radius*Math.sin(thetaperspective)*Math.sin(phi), radius*Math.cos(thetaperspective));//vec3(radius*Math.sin(phi), radius*Math.sin(thetaperspective),radius*Math.cos(phi));
        modelViewMatrix = lookAt(eye, at , up);
        gl.uniformMatrix4fv( modelView, false, flatten(modelViewMatrix) );

        gl.clear( gl.COLOR_BUFFER_BIT );
        gl.clearColor(0.2274, 0.305, 0.4313, 1.0);
        traverse(torsoId);
        traverse(branchId);


        if(animationflag) animation();
        requestAnimationFrame(render);
}
