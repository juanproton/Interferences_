function random_hash() {
  let x = "0123456789abcdef", hash = '0x'
  for (let i = 64; i > 0; --i) {
    hash += x[Math.floor(Math.random()*x.length)]
  }
  return hash
}
tokenData = {
  "hash": random_hash(),
  "tokenId": "123000456"
}

let tokenId = parseInt(tokenData.tokenId.substring(2));
let seed = generateSeedFromTokenData(tokenData);
let rawParams = setupParametersFromTokenData(tokenData); // Gets you an array of 32 parameters from the hash ranging from 0-255
let ap =  parseInt(mapParam((rawParams[0]<127), -1, 1));

let theShader;
let pg, pgSize = 2500;
let play = true;
let values;
let subType = 2;
/// UNIFORMS
let u1,u2,u3,u4,u5;
let round1,round2,round3,round4;
let freq; let nShade, nShape;
let flip;
let nucleoSize = 0.;let nucleo = 5; let nucleoShades;
let outsideStrokeNucleo;
let outsideStroke;
let frequency;
let nucleoDivisions;
let fullInterference;
let randomFactor,randomFactor1,randomFactor2;

let pointsDivisionNucleo;
let pointsDivisionBody;
let pointsDivisionBody2;
let pointsDivisionBody3;
let pointsDivisionBodySize;
let pointsDivisionBodySize2;
let pointsDivisionBodySize3;

let pointsDivisions_fake;

let stroke_choice;
let stroke_Amt,stroke_Amt1;
let blend;

let cap_nucleo0,cap_nucleo1,cap_nucleo2;

let lightAmt;
let lightAmt1;
let lights;

let lightSize;
let lightSize2;

let lightCoord;
let lightCoord1;
let lightRot;
let background;

let rotate;
let rotateAmt;

let nMap;
let nShadeMap;
let rings_pos,rings_pos2,rings_pos3;
let rings_largo,rings_largo2,rings_largo3;
let rings_shades,rings_shades2,rings_shades3;
let nSub,nSub1,nSub2;

var fullGamma = [[107, 34, 60],
        [159, 19, 42],
        [222, 0, 0],
        [240, 2, 2],
        [255, 90, 0],
        [251, 171, 0],
        [236, 240, 2],
        [85, 208, 66],
        [1, 155, 74],
        [0, 90, 60],
        [7, 73, 91],
        [10, 60, 134],
        [34, 39, 168],
        [70, 46, 122]
];



var gray_scale = [];

var fullGammaUniforms = [];
var colors_temp = [];

let nCol;

var metallicColors = [];

let serials_choice;
let seriales_bool;
let seriales_draw;
let seriales_size;
let s_size;
let seriales_round;
let pos_serials;

let serialesTriangle_draw;
let serialesTriangle_offset0,serialesTriangle_offset1,serialesTriangle_offset2,serialesTriangle_offset3;

let boolSector = [0,0,0,0];

let nRings;
let nSubdivisionsRings;
let zoom, disc;
let array_freq;
let pulseChoice;

let nucleo_stroke;
let nucleo_subRings;
let nucleo_subRings_pos;
let rotateNucleo;

let capsule_nucleos;
let capsule_NucleoSize;

let pixela;

function preload(){
  theShader = loadShader('vertex.vert', 'basic.frag');
}

function setup() {
  array_freq = [];
	generator(0,4);
	passUniforms();
  pixelDensity(2.0);
	createCanvas(windowWidth, windowHeight, WEBGL);
	pg = createGraphics(pgSize, pgSize, WEBGL);
}

function generateSubdivisionsNucleo(){
  generateNucleoShades();
  pointsDivisionNucleo = []; nucleoDivisions = []; nucleo_stroke=[];nucleo_subRings=[];nucleo_subRings_pos=[];
  if(nucleoSize < 0.25){nDivisions = 1;}else{nDivisions =2;}

  for(let i = 0; i < nDivisions; i++){
    nucleoDivisions.push(1);
  }

  let a = 0;
  pointsDivisionNucleo.push(a);
  let random_stroke = rand_b([0.0009,0.0,0.005])
  for(let i = 0; i < nDivisions; i++){
    for(let i = 0; i <0; i++){
          if(u3 >= 0.5){
        nucleo_subRings.push(int(random(2)));
        nucleo_subRings_pos.push(rand_b([1.2,1.5,2.0,3.0,4.0]),random(0.01,0.005));
      }else{
        nucleo_subRings.push(0);
      }
    }
    a+= float((nucleoSize-0.09)/nDivisions);
    pointsDivisionNucleo.push(a);
    nucleo_stroke.push(random_stroke);
  }



  // console.log("POINTSNUCLEO  " + nucleoDivisions);
}

function generateNucleoShades(){
  nucleoShades = [];
  nucleoShades.push(1);
  nucleoShades.push(3);
}

function generate_rings_angles(){
  rings_pos = [];
  rings_largo = [];
  rings_shades = [];

  rings_pos2 = [];
  rings_largo2 = [];
  rings_shades2 = [];

  rings_pos3 = [];
  rings_largo3 = [];
  rings_shades3 = [];
  frequency = [];

  for(let i = 0; i < 8;i++){
    let schoice = rand_b([0,10,1,2]);
    let schoice2 = rand_b([0,10,1,2]);
    let schoice3 = rand_b([0,1,2,3,4,5,6,7,10]);
    let schoice4 = rand_b([0,1,2,3,4,5,6,7,10]);
    let schoice5 = rand_b([0,1,2,3,4,5,6,7,10]);
    let schoice6 = rand_b([0,5]);
    frequency.push(int(random(100)));
    rings_pos.push(random(0.0,0.0));
    rings_largo.push(random(0.,0.));
    rings_shades.push(schoice,schoice2);

    rings_pos2.push(random(0,.0));
    rings_largo2.push(random(0.,0.));
    rings_shades2.push(schoice3,schoice4);

    rings_pos3.push(random(0,.0));
    rings_largo3.push(0.,0.);
    rings_shades3.push(schoice5,schoice6);
  }
}

function generateSubdivisionsBody(){
  generate_rings_angles();

  pointsDivisionBodySize = 8;
  pointsDivisionBodySize2 = 8;
  pointsDivisionBodySize3 = int(random(1,9));

  pointsDivisionBody = [];pointsDivisionBody2 = [];pointsDivisionBody3 = [];

  let r = (1.0-u3) / 2.0;
  let p1 = 1.0;  pointsDivisionBody.push(p1);

  for(let i = 0; i< pointsDivisionBodySize; i++){
    if(i > 0){
      let p2 = random(pointsDivisionBody[i-1]-0.05,0.5);
      // let p2 =pointsDivisionBody[i-1]-(1 / pointsDivisionBodySize);
      pointsDivisionBody.push(p2);
    }
  }

  pointsDivisionBody.push(u3);

  pointsDivisionBody2.push(1.0);

  for(let i = 0; i< pointsDivisionBodySize2; i++){
    if(i > 0){
      let p2 = random(pointsDivisionBody2[i-1]-0.05,0.5);
      // let p2 =pointsDivisionBody2[i-1]-(1 / pointsDivisionBodySize2);
      pointsDivisionBody2.push(p2);
    }
  }

  pointsDivisionBody2.push(-1);
  pointsDivisionBody3.push(1);

  for(let i = 0; i< pointsDivisionBodySize3; i++){
    if(i > 0){
      let p2 = random(pointsDivisionBody3[i-1]-0.05,0.5);
      // let p2 =pointsDivisionBody[i-1]-(1 / pointsDivisionBodySize);
      pointsDivisionBody3.push(p2);
    }
    pointsDivisionBody3.push(-1);
}

}

function generate_rot(){
  rotate = 1;
  let p = [0.,0.5,1,1.5];
  rotateAmt = p[int(random(p.length))];
}

let subgroup_0;
let subgroup_1;
let subgroup_2;
let subgroup_3;
let group_full_external;
let elements_check;
let elements;
let isCenter;

function generateSeriales(){
  let n = 42;
  elements = [];
  seriales_bool = [];
  seriales_draw = [];
  seriales_round = [];
  seriales_size = [];
  pos_serials = [];
  subgroup_0 = [];  subgroup_1 = [];
  subgroup_2 = [];  subgroup_3= [];

  boolSector = [0,0,0,0];

  let size = 1/6;
  s_size = size;

let group_full = [8,15,22,29,
                  9,16,23,30,
                  10,17,24,31,
                  11,18,25,32];

 group_full_external = [8,15,22,29,
                  9,30,
                  10,31,
                  11,18,25,32];

 subgroup_0 = [8,15,
               9,16];
 subgroup_1 = [29,22,
              30,23];

 subgroup_2 = [32,25,
              31,24];
 subgroup_3 = [11,18,
              10,17];

let group2_external = [8,29,11,32];
let selections;

for(let i = 0; i <= n; i++){
      seriales_bool.push(0);
      seriales_draw.push(0);
      seriales_size.push(size);
}

    for(let x = 0; x < 1 ; x+=size){
      for(let y = 0; y < 1; y+=size){
        pos_serials.push(x,y);
      }
    }

    let r2 = [];
    for(let x = -0.5+0.125; x < 0.5-0.125 ; x+=0.125/12){
      for(let y =-0.5+0.125; y < 0.5-0.125; y+=0.125/12){
        r2.push([x,y]);
      }
    }

    let rr = int(random(r2.length));
    let insideChoice = [];
  for(let i = 0; i<r2.length; i++){
      let v1 = createVector(0, 0);
      let v2 = createVector(r2[i][0], r2[i][1]);
      let distance = v1.dist(v2);
      if(distance <  (size*2.0)){ // POINT INSIDE CIRCLE
        insideChoice.push([r2[i][0],r2[i][1]]);
      }
    }

    serialesTriangle_offset0 = [0.,-size*2.];
    serialesTriangle_offset1 = [0,0];
    serialesTriangle_offset3 = [0,0];
    serialesTriangle_offset2 = [0,0];


    let start_point = 2;

    if(start_point==0){
      serialesTriangle_draw = [0,0,0,0];

      let sector = 0;
      selections = [];
      let selections2 = [];
      let s_sector = [0,1,2,3];
      let choice = rand_b([0,0]);

      if(choice == 0){
        shuffle(s_sector, true);
        for(let i = 0; i< 1; i++){
          let ss = s_sector[i];
          gen_sector(1,int(random(0,3)),ss, selections,return_array(ss));
        }

      }else if(choice == 1){
        let r = random(1);
        let ss = [];

        if(r > 0.5){
          ss.push(s_sector[0]);
          ss.push(s_sector[2]);
          ss.push(s_sector[rand_b([1,3])]);
        }else{
          ss.push(s_sector[1]);
          ss.push(s_sector[3]);
          ss.push(s_sector[rand_b([0,2])]);
        }

        let a = rand_b([1,2,3]);
        let b;
        if(a == 3){
          b = rand_b([2,1]);
        }else {
          b = rand_b([1,2,3]);
        }
        gen_sector(a,int(random(0,3)),ss[0], selections,return_array(ss[0]));
        gen_sector(b,int(random(0,3)),ss[1], selections2,return_array(ss[1]));

        let r2 = random(1);
        if(r2 > 0.5){
          gen_sector(1,int(random(0,3)),ss[2], selections2,return_array(ss[2]));
        }
      }
    }else if(start_point==1){ // DOS EN EL MISMO LADO
      let random_inside = int(random(insideChoice.length));
      shuffle(insideChoice,true);

      let a = createVector(insideChoice[0][0],insideChoice[0][1]);
      let b = createVector(insideChoice[1][0],insideChoice[1][1]);
      let c = createVector(insideChoice[2][0],insideChoice[2][1]);

      serialesTriangle_draw = [1,0,0,1];
      // console.log(a);
      // console.log(b);


      serialesTriangle_offset0 = [a.x, a.y];
      // serialesTriangle_offset2 = [0, find_equal(a.y, b.y, insideChoice)];

      serialesTriangle_offset3 = [b.x, find_mayor(a.y, b.y, insideChoice)];

}else if(start_point == 2){
  let random_inside = int(random(insideChoice.length));
  shuffle(insideChoice,true);

  let a = createVector(insideChoice[0][0],insideChoice[0][1]);
  let b = createVector(insideChoice[1][0],insideChoice[1][1]);
  let c = createVector(insideChoice[2][0],insideChoice[2][1]);

  serialesTriangle_draw = [1,0,1,0];

  serialesTriangle_offset0 = [a.x, a.y];
  let p =  find_equal(a.y, b.y, insideChoice);

  serialesTriangle_offset2 = [b.x,find_mayor(a.y,p,insideChoice)];
}

// console.log(elements);
// console.log("IS CENTER" + isCenter);

}

function find_equal(a, b, ar){
  if(a != b){
    return b;
  }else{
    // console.log("ARE THE SAME");
    b = ar[int(random(ar.length))][1];
    return find(a,b,ar);
  }
}

function find_mayor(a,b,ar){

  if(a > b){
    return b;
  }else{
    // console.log("ARE THE SAME");
    // shuffle(ar,true);
    b = ar[int(random(ar.length))][1];
    return find_mayor(a,b,ar);
  }
}

function return_array(ss){
  let temp_s;

  if(ss == 0){
    temp_s = subgroup_0;
  }else if(ss ==1){
    temp_s = subgroup_1;
  }else if(ss ==2){
    temp_s = subgroup_2;
  }else if(ss==3){
    temp_s = subgroup_3;
  }
  return temp_s;
}

function add_number(number,array){
  if(!array.includes(number)){
    return true;
  }else{
    return false;
  }
}

function gen_sector(num,prev,sector,selections,subGroup){
    let cc;
    boolSector[sector] = 1;

    if(num == 1){
      cc = subGroup[prev];
      seriales_draw[cc]= 1;
      selections.push(prev);
      elements.push(cc);
    }

if(num == 2){
  cc = subGroup[prev];
  seriales_draw[cc]= 1;
  selections.push(prev);
  elements.push(cc);

  if(selections.includes(0)){
      newPrev = int(rand_b([1,2]));
      selections.push(newPrev);
      let cc2 = subGroup[newPrev];
      seriales_draw[cc2]= 1;
      elements.push(cc2);
  }else if(selections.includes(1)){
      newPrev = int(rand_b([0,3]));
      if(newPrev==3){
        isCenter = true;
      }
      selections.push(newPrev);
      let cc2 = subGroup[newPrev];
      seriales_draw[cc2]= 1;
      elements.push(cc2);

  }else if(selections.includes(2)){
    newPrev = int(rand_b([0,3]));
    if(newPrev==3){
      isCenter = true;
    }
    selections.push(newPrev);
    let cc2 = subGroup[newPrev];
    seriales_draw[cc2]= 1;
    elements.push(cc2);
  }
}

if(num == 3){
let c = random(1);
  selections.push(0);
  selections.push(1);
  selections.push(2);
  let cc0 = subGroup[0];
  let cc1 = subGroup[1];
  let cc2 = subGroup[2];
  elements.push(cc0);
  elements.push(cc1);
  elements.push(cc2);

  seriales_draw[cc0]= 1;
  seriales_draw[cc1]= 1;
  seriales_draw[cc2]= 1;
}

}

function checkArray(number){
  if(subgroup_0.includes(number)){
    boolSector[0] = 1;
  }else if(subgroup_1.includes(number)){
    boolSector[1] = 1;
  }else if(subgroup_2.includes(number)){
    boolSector[2] = 1;
  }else if(subgroup_3.includes(number)){
    boolSector[3] = 1;
  }
console.log(boolSector);
}

function checkSector(element){

  if(element[0] <= -0.5 && element[0] >= -1 && element[1] <= -0.5 &&element[1] >= -1){
    seriales_bool[8]= 1;
    boolSector[0] = 1;
  }
  if(element[0] <= 0.0 && element[0] >= -0.5 && element[1] <= -0.5 &&element[1] >=-1){
    seriales_bool[15]= 1;
    boolSector[0] = 1;
  }
  if(element[0] >= 0.0 && element[0] <= 0.5 && element[1] <= -0.5 &&element[1] >= -1){
    seriales_bool[22]= 1;
    boolSector[1] = 1;
  }
  if(element[0] >= 0.5 && element[0] <= 1.0 && element[1] <= -0.5 &&element[1] >= -1){
    seriales_bool[29]= 1;
    boolSector[1] = 1;
  }
  if(element[0] <= -0.5 && element[0] >= -1 && element[1] <= 0.0 &&element[1] >= -0.5){
    seriales_bool[9]= 1;
    boolSector[0] = 1;
  }
  if(element[0] <= 0.0 && element[0] >= -0.5 && element[1] <= 0.0 &&element[1] >= -0.5){
    seriales_bool[16]= 1;
    boolSector[0] = 1;
  }
  if(element[0] >= 0.0 && element[0] <= 0.5 && element[1] <= 0.0 &&element[1] >= -0.5){
    seriales_bool[23]= 1;
    boolSector[1] = 1;
  }
  if(element[0] >= 0.5 && element[0] <= 1.0 && element[1] <= 0.0 &&element[1] >= -0.5){
    seriales_bool[30]= 1;
    boolSector[1] = 1;
  }
  if(element[0] <= -0.5 && element[0] >= -1.0 && element[1] >= 0.0 &&element[1] <= 0.5){
    seriales_bool[10]= 1;
    boolSector[2] = 1;
  }
  if(element[0] <= 0.0 && element[0] >= -0.5 && element[1] >= 0.0 &&element[1] <= 0.5){
    seriales_bool[17]= 1;
    boolSector[2] = 1;
  }
  if(element[0] >= 0.0 && element[0] <= 0.5 && element[1] >= 0.0 &&element[1] <= 0.5){
    seriales_bool[24]= 1;
    boolSector[3] = 1;
  }
  if(element[0] >= 0.5 && element[0] <= 1.0 && element[1] >= 0. &&element[1] <= 0.5){
    seriales_bool[31]= 1;
    boolSector[3] = 1;
  }
  if(element[0] <= -0.5 && element[0] >= -1.0 && element[1] >= 0.5 &&element[1] <= 1.0){
    seriales_bool[11]= 1;
    boolSector[2] = 1;
  }
  if(element[0] <= -0. && element[0] >= -0.5 && element[1] >= 0.5 &&element[1] <= 1.0){
    seriales_bool[18]= 1;
    boolSector[2] = 1;
  }
  if(element[0] >= 0. && element[0] <= 0.5 && element[1] >= 0.5 &&element[1] <= 1.0){
    seriales_bool[25]= 1;
    boolSector[3] = 1;
  }
  if(element[0] >= 0.5 && element[0] <= 1.0 && element[1] >= 0.5 &&element[1] <= 1.0){
    seriales_bool[32]= 1;
    boolSector[3] = 1;
  }
}

function generateColorSet(_rules){

  for(let i = 0; i < 255; i+=18.21){
   let pp = [i,i,i];
   gray_scale.push(pp);
  }

  let temp_color;
  fullGammaUniforms = [];
  colors_temp = [];
  let shade_scale = [];

  let rules = rand_b([3]);
  // let rules = rand_b([7]);

  // reverse(gray_scale);

    let cc; let cc2 = [];
    let yplus = rand_b([2,3,4,5,6])
    let mod = rand_b([2,3,4]);
    let y,x,xy;
    let ss;
    let rrr2 = random(1);

    if(mod == 2){ss = 7;}else if(mod==3){ss = 5;}else if(mod == 4){ss = 3;}else if(mod ==5){ss = rand_b([0,1,2,4,7,8,11,12]);}


///////////



 if(rules==1){
    colors_temp = fullGamma;

    if(u3 >= 0.5){
      nCol = rand_b([1,2,3,4]);
      if(nCol == 1){
        array_freq[1] = rand_b([1,2,3,4]);
        stroke_Amt = rand_b([random(0.3)]);
      }else{
        array_freq[1] = rand_b( [nCol,nCol,nCol*2,nCol*4]);
        stroke_Amt = rand_b([random(0.8)]);
      }
      stroke_choice = rand_b([0]);
    }else{
      nCol = rand_b([7,14,14]);
      if(nShape == 2){
        nCol = rand_b([2,3,4,2]);
      }

      array_freq[1] = rand_b([nCol,nCol*2]);
      console.log(nCol);
      console.log(array_freq[1]);
      stroke_Amt = 0.88;
      stroke_Amt1 = 0.88;
      stroke_choice = rand_b([0,0,1]);
      colors_temp = fullGamma;

    }

    // array_freq[1] = rand_b([14]);

  }else if(rules == 2){
      colors_temp = fullGamma;
      y = int(random(14));
      if(rrr2  >= 0. && rrr2 < 0.1){
        nCol = 14;
      }else if(rrr2 > 0.1){
        shuffle(colors_temp, true);
        xy = int(random(14));
        x = int(random(xy,xy+ss));
       if(x > 14){x = x-14;}
      if(subType > 0){
        mod = 2;
        if(mod == 2){
          nCol = rand_b([2,4,6,8,10,12,14,14,14]);
        }else if(mod ==3){
          nCol = rand_b([3,6,9,12]);
        }else if(mod ==4){
          nCol = rand_b([4,8,12]);
        }
    }
    let rr = random(1);
    if(rr > 0. && rr < 0.1){
      shuffle(colors_temp, true);
    }else if( rr > 0.1 && rr < 0.8){
      colors_temp = [];
      var fullGamma_aux = [[107, 34, 60],
              [159, 19, 42],
              [222, 0, 0],
              [240, 2, 2],
              [255, 90, 0],
              [251, 171, 0],
              [236, 240, 2],
              [85, 208, 66],
              [1, 155, 74],
              [0, 90, 60],
              [7, 73, 91],
              [10, 60, 134],
              [34, 39, 168],
              [70, 46, 122]
      ];
      colors_temp = fullGamma_aux;
    }else if(rr > 0.8 && rr < 1.0){
      reverse(fullGamma);
    }
}


  }else if(rules == 3){
      nCol = 14;
      y = int(random(14));
      x = int(random(14));

      // xy = int(random(14));
      // x = int(random(xy,xy+ss));

      let pepe = int(random(14));
      xy = add_1(y,pepe);

  }else if(rules == 5|| rules == 6){
    colors_temp = fullGamma;
    y = int(random(14));
    let pepe = int(random(14));
    xy = add_1(y,pepe);
    nCol = 14;

  }else if(rules == 7){

    nCol = 14;

    let sss = int(random(14));

    temp_color = fullGamma[sss];

    var max = Math.max(Math.max(temp_color[0], Math.max(temp_color[1], temp_color[2])), 1);
    var step = 255 / (max * 14);
    console.log(step);

    for(let i = 0; i < 14; i++){
      let f = step *i;

      let tt = [temp_color[0] * f, temp_color[1] * f, temp_color[2] * f];
      // let tt = [temp_color[0] + (255-temp_color[0])*f, temp_color[1] + (255-temp_color[1])*f, temp_color[2] + (255-temp_color[2])*f];

      console.log(tt);
      shade_scale.push(tt);
    }
    if(random(1)>0.5){
      reverse(shade_scale);
    }

  }


// shuffle(fullGamma, true);

let rrr = random(0);
let choice_7 = rand_b([0]);

  for(let i = 0; i < nCol;i+=1){
    let a = i%mod;

  if(rules == 0){x+=1;if(x >= 14){x = 0;} cc2.push(x);

  }else if(rules == 1){
      cc = int(random(14));
      cc2.push(cc);
      if(i > 0){
        if(nCol < 3){
          if(cc2[i] == cc2[i-1]){
          cc = int(random(14));cc2[i] = cc;
        }
      }
    }

    }else if(rules == 2){

      if(rrr2 > 0.1){if(a == 0){cc2.push(xy);}else{x += 1;if(x >= 14){x = 0;}cc2.push(x);}
     }else{
       y += 1;if(y >= 14){y = 0;}
       cc2.push(y);
     }

    }else if(rules == 3){

      let a = i%mod;
      x+=1;if(x >= 14){x = 0;}

      if(a == 0){
        let c;
        if(rrr2 < 0.5){
          c = i
        }else if(rrr2 > 0.5 && rrr2 < 0.7){
          c = x;
        }else{
          c = y;
        }
        colors_temp.push(gray_scale[c]);
      }else{

        let ddd;
        if(rrr < 0.5){ddd = i;}else{ddd = x;}
        colors_temp.push(fullGamma[ddd]);
     }

     cc2.push(i);

     // if(a == 0){
    //       colors_temp.push(gray_scale[xy]);
    //  }else{
    //    x += 1;
    //   if(x >= 14){
    //     x = 0;
    //   }
    //   colors_temp.push(gray_scale[x]);
    // }
    //
    // cc2.push(i);



    }else if(rules == 5){
      let a = i%2;
      if(a == 0){y += 1;if(y >= 14){y = 0;}
       cc2.push(y);
      }else{
        xy += 1;if(xy >= 14){xy = 0;}
       cc2.push(xy);
     }
   }else if(rules == 6){
     let a = i%2;
     if(a == 0){
       y += yplus;
      if(y >= 14){
        y = 0;
      }
      cc2.push(y);
     }else{
       y += 1;
      if(y >= 14){
        y = 0;
      }
      cc2.push(y);
    }

  }else if(rules == 7){

    if(choice_7 == 0){

      if(rrr > 0.5){
        y += 1;
       if(y >= 14){
         y = 0;
       }
       colors_temp.push(shade_scale[y]);
     }else{
       colors_temp.push(shade_scale[i]);
     }

   }else if(choice_7==1){
     let a = i%2;
     y += 1;
    if(y >= 14){
      y = 0;
    }
     if(a == 0){
       if(rrr > 0.5){
         colors_temp.push(shade_scale[i]);
       }else {
         colors_temp.push(shade_scale[y]);
       }
     }else{
       if(rrr2 > 0.5){
         colors_temp.push(fullGamma[i]);
       }else {
         colors_temp.push(fullGamma[y]);
       }
    }
  }

   cc2.push(i);

  }

  array_freq[1] = rand_b([28,56,14]);
  stroke_choice = rand_b([2]);
  stroke_Amt1 = random(0.8,0.89);
  stroke_Amt = rand_b([0.1,0.88]);

  if(array_freq[1]==56){
    stroke_choice = 2;
  }


    fullGammaUniforms.push(colors_temp[cc2[i]][0]);
    fullGammaUniforms.push(colors_temp[cc2[i]][1]);
    fullGammaUniforms.push(colors_temp[cc2[i]][2]);
}


// if(nShape == 2){
//   array_freq[1] /=2.0;
// }

// console.log("/////COLORS");
// console.log("rules",rules);
// console.log("nCol",nCol);
// console.log("freq",array_freq[1]);

}


function add_1(a,b){
  if(a == b || b == a+1 || b == a-1){
    b = int(random(14));
    return add_1(a,b);
  }else{
    return b;
  }

  return b;
}

function generate3Colors(){
  if(nShape == 0 && subType == 0){
    array_freq[2] = int(random(14,70));
  }else{
    array_freq[2] = int(random(14,50));
  }

stroke_choice = int(random(3));
stroke_Amt = random(0.8,0.88); stroke_Amt1 = random(0.5,0.88);

let choice = 1;

if(choice == 0){

  array_freq[2] = int(random(10,40));

  let color = fullGamma[int(random(14))];
  metallicColors = [];
  metallicColors = [0,0,0,
                    color[0],color[1],color[2],
                    255,255,255];

}else if(choice == 1){
  metallicColors = [];
  array_freq[2] = int(random(10,100));

  let r = rand_b([random(1,25),random(225,255)]);
  metallicColors = [0,0,0,
                    r,r,r,
                    255,255,255];
stroke_Amt = random(0.8,0.88);
stroke_Amt1 = random(0.88,0.88);

}else if(choice == 2){
  metallicColors = [];
  stroke_choice = 0;stroke_Amt = random(0.88,0.88);
  let color = fullGamma[int(random(14))];
  let factor = random(50,100);
  metallicColors = [color[0]-factor,color[1]-factor,color[2]-factor,
                    color[0],color[1],color[2],
                    255,255,255];
}else if(choice == 3){
  let color = fullGamma[int(random(14))];
  let color2 = fullGamma[int(random(14))];
  metallicColors = [];
  metallicColors = [color[0],color[1],color[2],
                    255,255,255,
                    color2[0],color2[1],color2[2]];
}else if(choice == 4){
  array_freq[2] = int(random(7,40));
  stroke_choice = 0;
  metallicColors = [];
  let color = fullGamma[int(random(14))];
  let color2 = fullGamma[int(random(14))];
  let color3 = fullGamma[int(random(14))];
  metallicColors = [color[0],color[1],color[2],
                    color3[0],color3[1],color3[2],
                    color2[0],color2[1],color2[2]];
}else if(choice == 5){
  stroke_choice = 0;
  stroke_Amt = random(0.7,0.88);
  let color = fullGamma[int(random(14))];
  let color2 = fullGamma[int(random(14))];
  metallicColors = [];
  metallicColors = [color[0],color[1],color[2],
                    0.0,0.0,0.0,
                    color2[0],color2[1],color2[2]];
}
if(nShape == 2){
  array_freq[2] /= 2.0;
}
// freq = 14;
}

let fake_value1, fake_value2;

function generate_fakeColors(){
  nMap = 0;
  outSideStroke = 0;

  fake_value1 = [];
  fake_value2 = [];

  let n = 1;
  pointsDivisions_fake = [];
  nShade = 8; nShape = 0; nucleo = 0; zoom = 2.5;
  freq = rand_b([40,50,60,100]);

  for(let i = 0; i < 2; i++){
    fake_value1.push(rand_b([0.32,0.33,0.34,0.35,0.37,0.4]));
    fake_value2.push(int(random(1,10)));
  }
}
function generate_shade_pulse(){

  if(nShape == 0 && subType >= 1){
    pulseChoice = 0;
  }else{
    pulseChoice = 0;
  }
  if(pulseChoice == 0){
    array_freq[0] = int(random(5,50));
  }else if(pulseChoice == 1){
    array_freq[0] = rand_b([2,5,10,12,14,17,int(random(19,25))]);
    stroke_Amt = 0.88;
    stroke_Amt1 = 0.88;
    stroke_choice = int(random(2));
  }else if(pulseChoice == 2){
    array_freq[0] = rand_b([int(random(10,25))]);
    stroke_choice = 0;
  }

  if(nShape == 2){
    array_freq[0] /=2.0;
  }

  // console.log("FREQ SHADEPULSE ", array_freq[0])

}
function generate_capsule(){
  capsule_NucleoSize = [];
  capsule_nucleos = [];
  nucleo = 0;
  u4 = 1.0;
  zoom = 7.5;disc = 1;
  nShape = 2;
  freq = int(random(5,10));
  rotateNucleo = int(random(1));
  nShade = 1;
  // stroke_choice = 0;
  let r = []; let r2= [];
  for(let i = 1.5/freq; i < 1.5; i+=1.5/freq){r.push(i);r2.push(i);}shuffle(r,true);

  let size_choice = random(1);
  if(size_choice > 0.0 && size_choice < 0.3){
    capsule_NucleoSize = [r[0],r[1],r[2]];
  }else if(size_choice > 0.3 && size_choice < 0.5){
    capsule_NucleoSize = [r[0],r[0]/2.0,r[2]];
  }else if(size_choice > 0.5){
    capsule_NucleoSize = [r[0],r[0],r[1]];
  }

  let nucleo_choice = random(1);
  if(nucleo_choice > 0. && nucleo_choice < 0.5){
    capsule_nucleos = [1,1,0];
  }else if(nucleo_choice > 0.5 && nucleo_choice < 0.8){
    capsule_nucleos = [1,0,0];
  }else if(nucleo_choice>0.8 && nucleo_choice < 0.95){
    capsule_nucleos = [0,0,1];
  }else{
    capsule_nucleos = [1,1,1];
    let cccc = random(1);
    if(cccc >= 0.5){
      let as = int(random(1,r2.length));
      capsule_NucleoSize = [r2[as],r2[as],r2[0]];
    }else{
      let as = int(random(1,r2.length-1));
      capsule_NucleoSize = [r2[0],r2[0],r2[as]];
      console.log(r2[5]);
    }
  }
}

function newInterference(choice,_subtype){

    nShade = rand_b([1]);
    blend = int(random(3));
    nMap = 0;
    if(choice == 0){ // GENESIS

      nShape = 0;
      if(u1 == 1){u3 = rand_b([0.25,0.5,0.75,1-0.25/2.0])}
      if(u2 >= 0.7){if(u3 < 0.5){zoom = 3.8;}else{zoom = 3.5;}}else{zoom = 3.4;if(u3 > 0.5){zoom = 3.;}}disc = 1.0;if(subType >= 1){ zoom = 3.5; nucleo = 0;}else{
        nucleo = 1;nucleoSize = random(u3/2,u3);}
        freq = random(100);

        if(pixela == 1){
          u3 = 3.0;
          zoom = 40;
          disc = 10;
          nShade = 9;
          freq = random(5);
          u2=0.8*10;
        }
        // u2 = 0;
        // nucleo = 1;
        background = rand_b([0,6]);

    }else if(choice == 1){ // PYRAMIDA
      nShape = 1;
      zoom = 40.;
      disc = 40.0;
      // freq = random(3,5);
      stroke_choice = 1;
      nShade = 1;
    }else if(choice ==2){ // CAPSULE
      generate_capsule();
    }else if(choice ==3){ // PYRAMIDA_02
      zoom = 7.5;
      disc = 0.0;
      nShape = 3;
      stroke_choice = 0;

    }else if(choice==4){ // FAKE
      generate_fakeColors();
      blend = int(random(4));

    }else if(choice==5){ // SERIALS
      // generateSeriales();
      nMap = 0;
      nShade = rand_b([0]);
      freq = int(random(2));
      nucleo = 1;
      nucleoSize = 0.1;
      nShape = 0;
      u1 = 1;
      u3 = 0;
      u2 = 0;
      zoom = 1.5;
      disc = 0.5;
      serials_choice = 0;
      outSideStroke = 0;
      background = rand_b([6]);
    }

    if(nShade == 0){
      generate_shade_pulse();
    }else if (nShade==1){
      generateColorSet(int(random(6)));
    }else if(nShade == 2){
      generate3Colors();
    }else if(nShade == 9){
      nucleo =0;
      freq = int(random(10,50));
      stroke_Amt=0.89;stroke_Amt1= 0.89;
      randomFactor=rand_b([0.1,0.2,0.3,0.4,0.44,random(0.1,0.3)]);
    }

}

function initUniforms(_nShape, _subType){
  serials_choice = 1;

	flip = int(random(2));
  fullInterference = .0;
  outSideStroke = int(random(2));
  subType = _subType;
	u1 = values[_nShape].v1[subType][0];u2 = values[_nShape].v1[subType][1];u3 = values[_nShape].v1[subType][2];u4 = values[_nShape].v1[subType][3]; u5 = values[_nShape].v1[subType][4];
  randomFactor = int(random(25));
  randomFactor1 = random(1);
  randomFactor2 = random(-1,1);
  // stroke_Amt = 0.88;
  // stroke_Amt1 = 0.88;
}

function gen_lights(){
        lights = 1;
        lightAmt = random(0.,0.3);
        lightAmt1 = random(0.,0.3);
        lightRot = random(-6.28,6.28);
        lightSize = random(0.05,0.1);
        lightCoord = random(0.0,1);
}

function generator(_nShape, _subtype){
  reHash();
  generate_capsule();

  generateValues();
  generate_rot();
  generateColorSet(int(random(6)));
  generate_shade_pulse();
  generate_fakeColors();
  generateSeriales();

	initUniforms(_nShape,_subtype);
  newInterference(_nShape,_subtype);

  gen_lights();
  generateSubdivisionsBody();
  generateSubdivisionsNucleo();
}


function draw() {
	if(play){
    pg.background(255);
    pg.shader(theShader);
  	passUniforms();
    pg.rectMode(CENTER);
     pg.rect(0,0, 5000, 5000);
     rectMode(CENTER);
     scale(0.25);
     scale(-1, 1)
    texture(pg);
    rect(0,0,5000,5000);
    play = false;
  }else{
    // noLoop();
  }
}

function passUniforms(){
theShader.setUniform('resolution',[5000,5000]);
theShader.setUniform('nShape',nShape);theShader.setUniform('subtype',subType);theShader.setUniform('nShade',nShade);theShader.setUniform('nMap',nMap);theShader.setUniform('nShadeMap',nShadeMap);
theShader.setUniform('u1',u1);theShader.setUniform('u2',u2);theShader.setUniform('u3',u3);theShader.setUniform('u4',u4);theShader.setUniform('u5',u5);
theShader.setUniform('freq',freq);theShader.setUniform('round1',round1);theShader.setUniform('round2',round2);theShader.setUniform('round3',round3);theShader.setUniform('round4',round4);

theShader.setUniform('u_time',millis()/1000.0);
theShader.setUniform('background',background);
theShader.setUniform('zoom',zoom);theShader.setUniform('disc',disc);

theShader.setUniform('pointsDivisionNucleo',pointsDivisionNucleo);theShader.setUniform('pointsDivisionBody',pointsDivisionBody);theShader.setUniform('pointsDivisionBody2',pointsDivisionBody2);theShader.setUniform('pointsDivisionBody3',pointsDivisionBody3);
theShader.setUniform('pointsDivisions_fake',pointsDivisions_fake);

theShader.setUniform('nucleoSize',nucleoSize);theShader.setUniform('nucleo',nucleo);

theShader.setUniform('outsideStrokeNucleo',outsideStrokeNucleo);theShader.setUniform('outSideStroke',outSideStroke);
theShader.setUniform('rotateNucleo',rotateNucleo);

theShader.setUniform('nucleoShades',nucleoShades);
theShader.setUniform('nucleoDivisions',nucleoDivisions);
theShader.setUniform('nucleo_stroke',nucleo_stroke);
theShader.setUniform('nucleo_subRings',nucleo_subRings);
theShader.setUniform('nucleo_subRings_pos',nucleo_subRings_pos);

theShader.setUniform('randomFactor',randomFactor);theShader.setUniform('randomFactor1',randomFactor1);theShader.setUniform('randomFactor2',randomFactor2);

theShader.setUniform('noise',noise);
theShader.setUniform('frequency',frequency);

theShader.setUniform('flip',flip);theShader.setUniform('rotate',rotate);theShader.setUniform('rotateAmt',rotateAmt);

theShader.setUniform('stroke_choice',stroke_choice);theShader.setUniform('stroke_Amt',stroke_Amt);theShader.setUniform('stroke_Amt1',stroke_Amt1);

theShader.setUniform('lights',lights);
theShader.setUniform('lightAmt',lightAmt);
theShader.setUniform('lightAmt1',lightAmt1);
theShader.setUniform('lightSize',lightSize);
theShader.setUniform('lightCoord',lightCoord);
theShader.setUniform('lightRot',lightRot);

theShader.setUniform('pulseChoice',pulseChoice);
theShader.setUniform('fullInterference',fullInterference);


theShader.setUniform('fullGamma',fullGammaUniforms);
theShader.setUniform('nCol',nCol);
theShader.setUniform('blend',blend);
theShader.setUniform('metallicColors',metallicColors);

theShader.setUniform('seriales_round',seriales_round);
theShader.setUniform('seriales_draw',seriales_draw);
theShader.setUniform('seriales_size',seriales_size);

theShader.setUniform('pos_serials',pos_serials);
theShader.setUniform('s_size',s_size);
theShader.setUniform('nSub',nSub);theShader.setUniform('nSub1',nSub1);theShader.setUniform('nSub2',nSub2);

theShader.setUniform('rings_pos',rings_pos);theShader.setUniform('rings_largo',rings_largo);theShader.setUniform('rings_shades',rings_shades);
theShader.setUniform('rings_pos2',rings_pos2);theShader.setUniform('rings_largo2',rings_largo2);theShader.setUniform('rings_shades2',rings_shades2);
theShader.setUniform('rings_pos3',rings_pos3);theShader.setUniform('rings_largo3',rings_largo3);theShader.setUniform('rings_shades3',rings_shades3);

theShader.setUniform('serials_choice',serials_choice);
theShader.setUniform('array_freq',array_freq);
theShader.setUniform('serialesTriangle_draw',serialesTriangle_draw);theShader.setUniform('serialesTriangle_offset0',serialesTriangle_offset0);theShader.setUniform('serialesTriangle_offset1',serialesTriangle_offset1);theShader.setUniform('serialesTriangle_offset2',serialesTriangle_offset2);theShader.setUniform('serialesTriangle_offset3',serialesTriangle_offset3);

theShader.setUniform('capsule_nucleos',capsule_nucleos);
theShader.setUniform('capsule_NucleoSize',capsule_NucleoSize);

theShader.setUniform('pointsDivisionBodySize',pointsDivisionBodySize);
theShader.setUniform('pointsDivisionBodySize2',pointsDivisionBodySize2);
theShader.setUniform('pointsDivisionBodySize3',pointsDivisionBodySize3);

theShader.setUniform('fake_value1',fake_value1);
theShader.setUniform('fake_value2',fake_value2);

theShader.setUniform('pixela',pixela);

}

function debug(){
  console.log("////////////MATRIX");
  console.log("zoom: " + zoom);  console.log("flip: " + flip);

  console.log("////////////SHAPE");
  console.log("nShape: " + nShape);
  console.log("subType: " + subType);

	console.log("////////////SHADE");
  console.log("nShade: " + nShade);
	console.log("freq: " + freq);
  console.log("stroke_choice: " + stroke_choice);

	console.log("//////////// UNIFORMS");
	console.log("u1: " + u1);
	console.log("u2: " + u2);
	console.log("u3: " + u3);
	console.log("u4: " + u4);

  console.log("lightAmt: " + lightAmt);
  console.log("lightSize: " + lightSize);

  console.log("nCol: " + nCol);
  console.log("rotate: " + rotate);
  console.log("rotateAmt: " + rotateAmt);

  console.log("nucleo: " + nucleo);
  console.log("nucleoSize: " + nucleoSize);


}

function keyPressed(){
  let _subType;
  let n;
  console.log(key);
  if(key == '0'){
    pixela = 0;
    generator(0, int(random(1,4)));
    play = true;
  }else if(key == '1'){
    pixela = 0;
    _subType = 1;
    generator(1, _subType);
    play = true;
  }else if(key == '2'){
    pixela = 0;
    _subType = 0;
    generator(2, _subType);
    play = true;
  }else if(key == '3'){
    pixela = 0;
    _subType = 0;
    generator(3, _subType);
    play = true;
  }else if(key == '4'){
    pixela = 0;
    generator(4, 0);
    play = true;
  }else if(key == '5'){
    pixela = 0;
    generator(5,0);
    play = true;
  }else if(key == '7'){
    pixela = 0;
    generator(0,0);
    u1 = 0;
    nMap = 1;
    zoom = 2.0;
    play = true;
    fullInterference = 1.0;
  }else if(key == '8'){
    generator(0, 0);
    u1 = 1;
    play = true;
  }else if(key == '9'){
    save(pg, 'png');
  }else if(key == 'P'){
    pixela = 1;
    generator(0,0);
    play = true;
  }else if(key == 'O'){

  }
    // debug();
}

function generateValues(){
   values = [
    interference_00 = {
      type : 0,
      v1 : [
      [0, rand_b([0.25/2,0.25,0.3,0.4,0.5,0.6,0.7,0.8]),rand_b([0.25/3,0.25/2,0.25,0.5,0.75,1-0.25/2.0]),0,0],
      [0, rand_b([0.1,0.25, random(0.1,0.25)]),random(3,3.5),0,0],
      [rand_b([0,1]), rand_b([0.1,0.15,0.2, random(0.1,0.2)]),random(4,4.5),0,0],
      [rand_b([0,1]), rand_b([0.05,0.1,0.15, random(0.05,0.15)]),random(5,5.5),0,0],
      [rand_b([0,1]), 0,1.0,0,0]
  ]
},
interference_01 = {
  type : 1,
  v1 : [
  [rand_b([10,100]), random(0.5,10),rand_b([0,0.25/3,0.25/2,0.25,0.5]),int(random(2)),0],
  [rand_b([10,100]), int(random(3,72)),rand_b([0,0.25/3,0.25/2,0.25,0.5]),int(random(2)),0],
  [rand_b([10,100]), random(0.1,10),rand_b([0,0.25/3,0.25/2,0.25,0.5]),int(random(2)),0],
  [rand_b([10,100]), random(0.25,1),rand_b([0,0.25/3,0.25/2,0.25,0.5]),int(random(2)),0]
]
},
interference_02 = {
  type : 2,
  v1 : [
  [random(2,2.5),rand_b([0,0.75,1.0,1.25,1.5]),rand_b([0.,0.25/2,0.25,0.5,1.0,1.5,2.0,2.5]),0,0.5],
  [random(2,2.5),rand_b([0,0.75,1.0,1.25,1.5]),random(0),0,rand_b([-1])],

]
},
interference_03 = {
  type : 3,
  v1 : [
  [rand_b([2.5,3]),0.,.0,int(random(1.9)),0.5],
  [rand_b([1,1]),0.,.0,int(random(1.9)),0.5]

]
},
interference_04 = {
  type : 4,
  v1 : [
  [rand_b([random(0.32,0.33,0.34,0.35,0.37)]),0.,rand_b([0,0.25/3,0.25/2,0.25,0.5,0.75,1-0.25/2.0]),int(random(1.9)),0.5]
]
},
interference_05 = {
  type : 5,
  v1 : [
  [rand_b([random(0.32,0.33,0.34,0.35,0.37)]),0.,rand_b([0,0.25/3,0.25/2,0.25,0.5,0.75,1-0.25/2.0]),int(random(1.9)),0.5]
]
}
]
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function reHash(){
 random_hash();
  tokenData = {
    "hash": random_hash(),
    "tokenId": "123000456"
  }
 rawParams = setupParametersFromTokenData(tokenData); // Gets you an array of 32 parameters from the hash ranging from 0-255
 // console.log(tokenData.hash);
}

function setupParametersFromTokenData(token) {
  let hashPairs = []
  //parse hash
  for (let j = 0; j < 32; j++) {
    hashPairs.push(token.hash.slice(2 + (j * 2), 4 + (j * 2)))
  }
  // map to 0-255
  return hashPairs.map(x => {
    return parseInt(x, 16)
  })
}

function generateSeedFromTokenData(token) {
  return parseInt(token.hash.slice(0, 16), 16)
}

function rand_b(values){
  let size = values.length;
  let random_choice = int(random(size));
  let select = values[random_choice];
  // console.log(select);
  return select;
}

function gen_25(c){
  let choice = [];
  let r = 0.25/2;
  for(let i = 0; i < 1; i+=r){
    choice.push(i);
  }
  return choice[c];
}

function mapd(n, start1, stop1, start2, stop2) {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2
}

function mapParam(n, start, stop) {
  return mapd(n, 0, 255, start, stop)
}
