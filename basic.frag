#ifdef GL_ES
precision highp float;
#endif
#define TWO_PI 6.28318530718
#define LAMBDA 9.e-2
#define PI 3.14159
const int SIZE1 = 1, SIZE2 = 2, SIZE3 = 3, SIZE4 = 4, SIZE5 = 5,SIZE6 = 6,SIZE8 = 8, SIZE14 = 14, SIZE16 = 16,SIZE36 = 36, SIZE42 = 42;
uniform vec2 resolution;uniform int nShape, nShade,flip,subtype;uniform float zoom;uniform float disc;
uniform int nMap; uniform int pulseChoice;
uniform int nShadeMap [SIZE16]; uniform float rings_pos [SIZE16]; uniform float rings_largo [SIZE16];uniform vec2 rings_shades [SIZE16];
uniform float rings_pos2 [SIZE16];uniform float rings_largo2 [SIZE16];uniform vec2 rings_shades2 [SIZE16];
uniform int rotateNucleo;
uniform float rings_pos3 [SIZE16];uniform float rings_largo3 [SIZE16];uniform vec2 rings_shades3 [SIZE16];
uniform int nSub1,nSub2,nSub;

uniform int capsule_nucleos[SIZE3];
uniform float capsule_NucleoSize[SIZE3];

uniform int blend;
uniform float u_time;uniform float u1,u2,u3,u4,u5;
uniform float round1,round2,round3,round4;uniform float freq; uniform float array_freq[SIZE8];
uniform float frequency[SIZE8];
uniform float nucleoSize; uniform int outsideStrokeNucleo; uniform int nucleo;
uniform int nucleoShades[SIZE8];
uniform int nucleoDivisions[SIZE8];

uniform float fake_value1[SIZE8];
uniform float fake_value2[SIZE8];

uniform int pixela;

uniform float nucleo_stroke[SIZE16];
uniform int nucleo_subRings[SIZE16];
uniform vec2 nucleo_subRings_pos[SIZE16];
uniform int outSideStroke;
vec4 final;
uniform int fullInterference;

uniform float randomFactor, randomFactor1,randomFactor2;
uniform float pointsDivisionNucleo[SIZE8];uniform float pointsDivisionBody[SIZE8];uniform float pointsDivisionBody2[SIZE8];uniform float pointsDivisionBody3[SIZE8];
uniform int pointsDivisionBodySize;
uniform int pointsDivisionBodySize2;
uniform int pointsDivisionBodySize3;
// LIGHTS
uniform float noise;
uniform float lightAmt; uniform float lightAmt1; uniform float lightCoord; uniform float lightCoord1; uniform float lightRot;uniform float lightSize; uniform int lights;

// STROKE

uniform int stroke_choice;
uniform float stroke_Amt,stroke_Amt1;
uniform int stroke_var;

/// COLORS

uniform int nCol;
uniform vec3 fullGamma[SIZE14];
uniform vec3 metallicColors[SIZE3];

/// SERIALS
uniform int serials_choice;
uniform int seriales_draw[SIZE42];
uniform float seriales_size[SIZE42];
uniform float seriales_round[SIZE42];

uniform vec2 pos_serials[SIZE42];

uniform float s_size;

uniform int serialesTriangle_draw[SIZE4];
uniform vec2 serialesTriangle_offset0,serialesTriangle_offset1,serialesTriangle_offset2,serialesTriangle_offset3;


/// background

uniform int background;

//// MATRIX

uniform int rotate;
uniform float rotateAmt;

vec2 scale(vec2 st, vec2 s) {return (st-.5)*s+.5;}
mat2 rotate2d(float _angle){return mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle));}

//////// shapes
float capsule(vec2 p, vec2 a, vec2 b, float r) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}

float sdTriangle( in vec2 p, in vec2 p0, in vec2 p1, in vec2 p2, float ss ){
	vec2 e0 = p1 - p0;
	vec2 e1 = p2 - p1;
	vec2 e2 = p0 - p2;

	vec2 v0 = p - p0;
	vec2 v1 = p - p1;
	vec2 v2 = p - p2;

	vec2 pq0 = v0 - e0*clamp( dot(v0,e0)/dot(e0,e0), 0.0, 1.0 );
	vec2 pq1 = v1 - e1*clamp( dot(v1,e1)/dot(e1,e1), 0.0, 1.0 );
	vec2 pq2 = v2 - e2*clamp( dot(v2,e2)/dot(e2,e2), 0.0, 1.0 );

    float s = e0.x*e2.y - e0.y*e2.x;
    vec2 d = min( min( vec2( dot( pq0, pq0 ), s*(v0.x*e0.y-v0.y*e0.x) ),
                       vec2( dot( pq1, pq1 ), s*(v1.x*e1.y-v1.y*e1.x) )),
                       vec2( dot( pq2, pq2 ), s*(v2.x*e2.y-v2.y*e2.x) ));

	return -sqrt(d.x)*sign(d.y)-ss;
}


float triangle (vec2 st,
                vec2 p0, vec2 p1, vec2 p2,
                float smoothness){
  vec3 e0, e1, e2;


  e0.xy = normalize(p1 - p0).yx * vec2(+1.0, -1.0);
  e1.xy = normalize(p2 - p1).yx * vec2(+1.0, -1.0);
  e2.xy = normalize(p0 - p2).yx * vec2(+1.0, -1.0);

  e0.z = dot(e0.xy, p0) ;
  e1.z = dot(e1.xy, p1) ;
  e2.z = dot(e2.xy, p2) ;

  float a = max(0.0, dot(e0.xy, st) - e0.z+smoothness);
  float b = max(0.0, dot(e1.xy, st) - e1.z+smoothness);
  float c = max(0.0, dot(e2.xy, st) - e2.z+smoothness);

  return length(vec3(a, b, c))-smoothness;

}

float aastep(float threshold, float value) {
  #ifdef GL_OES_standard_derivatives
  float afwidth = 0.7 * length(vec2(dFdx(value), dFdy(value)));
  return smoothstep(threshold-afwidth, threshold+afwidth, value);
  #else
  return step(threshold, value);
  #endif
}

float smoothedge(float v) {
    return smoothstep(0.0, 1.0 / resolution.x, v);
}

float stroke(float x, float size, float w) {float d = aastep(size, x+w*.5) - aastep(size, x-w*.5);return clamp(d, 0., 1.);}

float shape(vec2 st, int N){
  float a = atan(st.x,st.y)+PI;
  float r = TWO_PI/float(N);
  return cos(floor(.5+a/r)*r-a)*length(st*1.0);}
float box(in vec2 _st, in vec2 _size){_size = vec2(0.5) - _size*0.5;vec2 uv = smoothstep(_size, _size+vec2(0.001),_st);uv *= smoothstep(_size,_size+vec2(0.001),vec2(1.0)-_st);return uv.x*uv.y;}
vec2 tile(vec2 _st, float _zoom){_st *= _zoom;return fract(_st);}
vec3 grid(vec2 uv, float size, float stroke){  vec3 f;vec2 grid = tile(uv, size);f = vec3( box( (grid), vec2(stroke) ));return f;}
float roundedBoxSDF(vec2 CenterPosition, vec2 Size, float Radius) {
  CenterPosition = CenterPosition *2.-1.;
    return length(max(abs(CenterPosition)-Size+Radius,0.0))-Radius;
}
float cro(in vec2 a, in vec2 b ) { return a.x*b.y - a.y*b.x; }
float ndot(vec2 a, vec2 b ) { return a.x*b.x - a.y*b.y; }
float sdUnevenCapsule( in vec2 p, in vec2 pa, in vec2 pb, in float ra, in float rb ){
    p  -= pa;
    pb -= pa;
    float h = dot(pb,pb);
    vec2  q = vec2( dot(p,vec2(pb.y,-pb.x)), dot(p,pb) )/h;

    //-----------

    q.x = abs(q.x);

    float b = ra-rb;
    vec2  c = vec2(sqrt(h-b*b),b);

    float k = cro(c,q);
    float m = dot(c,q);
    float n = dot(q,q);

         if( k < 0.0 ) return sqrt(h*(n            )) - ra;
    else if( k > c.x ) return sqrt(h*(n+1.0-2.0*q.y)) - rb;
                       return m                       - ra;
}
float sdRhombus( in vec2 p, in vec2 b ){
    vec2 q = abs(p);

    float h = clamp( (-2.0*ndot(q,b) + ndot(b,b) )/dot(b,b), -1.0, 1.0 );
    float d = length( q - 0.5*b*vec2(1.0-h,1.0+h) );
    d *= sign( q.x*b.y + q.y*b.x - b.x*b.y );

	return d;
}

float sdRoundBox( in vec2 p, in vec2 b, in vec4 r ){
    if(u4 == float(1)){
      if(p.y < -u3){
        p.x-=u2;
      }
      if(p.y > u3){
        p.x+=u2;
      }
    }else if(u4 == float(2)){
       // p.x/=cos(p.y);
    }
    r.xy = (p.x>0.0)?r.xy : r.zw;
    r.x  = (p.y>0.0)?r.x  : r.y;

    vec2 q = abs(p)-b+r.x;

    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;
}
float circle(in vec2 _st, in float _radius){vec2 dist = _st-vec2(0.5, 0.5);return 1.-smoothstep(_radius-(_radius), _radius+(_radius),dot(dist,dist)*1.0);}
float hash( float n ){return fract(sin(n)*43758.5453123);} float random(vec2 n, float offset ){return .5 - fract(sin(dot(n.xy + vec2( offset, 0.0 ), vec2(12.9898, 78.233)))* 43758.5453);}
float noise2( in vec2 x ){
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*157.0;
    return mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
               mix( hash(n+157.0), hash(n+158.0),f.x),f.y);
}
//// COLOR

vec3 blendDifference(vec3 base, vec3 blend) {return abs(base-blend);}
vec3 blendDifference(vec3 base, vec3 blend, float opacity) {return (blendDifference(base, blend) * opacity + base * (1.0 - opacity));}
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}
vec3 i2f(vec3 f){
   vec3 a = vec3(float(f.r)/255.0, float(f.g)/255.0, float(f.b)/255.0);
   return a;
 }

vec3 blendColor(vec3 a, vec3 a1, vec3 a2, vec3 a3){
  vec3 b;
  if(blend == int(0.0)){
    a = blendDifference(a,a1);
  }else if(blend == int(1.0)){
    a = blendDifference(a, a2);
  }else if(blend == int(2.0)){
    a = blendDifference(a, a3);
  }else if(blend == int(3.0)){
    a = blendDifference(a, vec3(0.,0.,0.));
  }
  b = a;
  return b;
}
///////////

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

vec3 pulseOsc(float _freq, float speed,float coord){vec3 osc;float freq = _freq ;float rampX = fract(coord*freq+speed);float rampY = fract(coord*freq+speed);float rampZ = fract(coord*freq+speed);float pulseX = 1.0 - smoothstep(0.49, 0.50001, rampX);float pulseY = 1.0 - smoothstep(0.49, 0.50001, rampY);float pulseZ = 1.0 - smoothstep(0.49, 0.50001, rampZ);osc = vec3(pulseX, pulseY, pulseZ);return osc;}

//// SHAPES

float gen_serials(vec2 uv, float ss){

  float a = 0.0;
  float cc  = ss/2.0;

  a = shape(uv+vec2(200),100)*1.0;

  for(int i = 0; i<=SIZE42;i++){
      if(seriales_draw[i] == int(1.0)){
        float xLarge = 0.;
        float yLarge = 0.;
         a = min(a,roundedBoxSDF(uv+vec2(pos_serials[i].x+cc+xLarge/2.0,pos_serials[i].y+cc+yLarge/2.0),vec2(ss+xLarge,ss+yLarge),seriales_round[i]));
      }
  }

  if(serialesTriangle_draw[0]==int(1.0)){
    vec2 offset = serialesTriangle_offset0;
    float ab = (-offset.y-ss*2.);
    float abx = (-offset.x);
    a = min(a, sdTriangle(vec2(uv.x,uv.y)*1.,
    vec2(abx,ss*2.+ab),
    vec2(ss*2.,ab+abx),
    vec2(ss*2.,ss*2.+ab),
    0.0) );
  }

  if(serialesTriangle_draw[1]==int(1.0)){
    vec2 offset = serialesTriangle_offset1;
    float ab = (-offset.y-ss*2.);
    float abx = (-offset.x);
    a = min(a, sdTriangle(vec2(uv.x,uv.y)*1.,
    vec2(abx,ss*2.+ab),
    vec2(-ss*2.,ss*2.+ab),
    vec2(-ss*2.,ab-abx),
    0.0) );
  }

  if(serialesTriangle_draw[2]==int(1.0)){
    vec2 offset = serialesTriangle_offset2;
    float ab = (offset.y-ss*2.);
    float abx = (-offset.x);
    a = min(a, sdTriangle(vec2(uv.x,uv.y)*1.,
      vec2(-ss*2.,-ab+abx),
      vec2(-ss*2.,-ss*2.-ab),
      vec2(abx,-ss*2.-ab),
    0.));
  }

  if(serialesTriangle_draw[3]==int(1.0)){
    vec2 offset = serialesTriangle_offset3;
    float ab = (offset.y-ss*2.);
    float abx = (-offset.x);
    a = min(a, sdTriangle(vec2(uv.x,uv.y)*1.,
    vec2(abx,-ss*2.-ab),
    vec2(ss*2.,-ss*2.-ab),
    vec2(ss*2.,-ab-abx),
    0.0) );
  }

  a = smoothedge(a);

  float b = shape(uv+vec2(pos_serials[0]),100)*5.0;
  // a = min(a,b);

return a;
}

vec3 generateRing(vec3 a,vec3 b,float F,float pos, float size, float borde,float borde1,float bSize, vec2 uv){
    if(F > pos && F <size){
      if(F > size-bSize){
        a = vec3(sin(uv.x*20.0+randomFactor))*borde;
        }else if(F < pos+bSize){
          a = vec3(sin(uv.x*10.0+randomFactor))*borde1;
      }else{
        a = b;
      }
    }
    return a;
}


float intf(vec2 pos, int choice, float a){
  float f1;
  float x, y;
  if(choice == 0){if(subtype == 0){if(pos.y > u3){x += u2;}if(u1 != 1.0){if(pos.y < -u3){x -= u2;}}}else if(subtype >= 1) {x = floor(pos.y*u3+0.5)*u2;}

  return f1 = distance(pos, vec2(vec2(x, 0.)));
  }else if(choice == 1){
    pos = abs(pos);
    if(subtype ==0){
      pos*=rotate2d(cos(pos.y/u1));
      x = floor(pos.x+sin(mix(pos.x,pos.y,u4)/u2+randomFactor2)+0.5);
    }else if(subtype==1){
      pos*=rotate2d(cos(pos.y/1000.0+0.5));
      x = floor(pos.x+floor(pos.y/u2+randomFactor2+0.5)+0.5);
    }else if(subtype==2){
      pos*=rotate2d(cos(pos.y/u1));
      x = floor(pos.x+fract(pos.y*u2+randomFactor2)+0.5);
    }else if(subtype==3){
      pos*=rotate2d(cos(pos.y/1000.0));
      x = floor(pos.x+tan(pos.x/u2+randomFactor2)+0.5);
    }else if(subtype==4){

    }
    return f1 = distance(pos, vec2(vec2(x, 0)));

  }else if(choice == 2){
    if(rotateNucleo==int(1.0)){pos*=rotate2d(PI/2.0);}
    float a = sdRoundBox(pos, vec2(0.5,2.5),vec4(u5));
    // a = min(a,sdRoundBox(pos+vec2(-(zoom/8.0),0.), vec2(0.05,3.5),vec4(0.5)));
    return f1 = a;
  }else if(choice == 3){
    float ar = sdRoundBox(pos, vec2(2.0,2.0),vec4(0.0));
    // return f1 = max(ar,sdRhombus(pos, vec2(u1,3.0)));
    return f1 = sdRhombus(pos, vec2(u1,3.0));
}else if(choice == 5){

}

// return f1 = distance(pos, vec2(vec2(x, 0)));
}

////// SHADES

vec3 addStroke(float F, vec3 a, vec2 uv, float _freq, float coord){

  float hue = floor(F)/_freq;
  float value = 1.0;

  if(stroke_choice == int(0.0)){ // BLANCO
  value = value * smoothstep(stroke_Amt,0.9, fract(F*_freq));
  // value *= -1.;
  // value*=(sin(coord*randomFactor+randomFactor1))*noise2(uv*10.);
  // value*=(noise2(fract(uv*1.+randomFactor)*F*coord+randomFactor));

  a+=value;

  }else if (stroke_choice == int(1.0)){ //NEGRO
    value = value / smoothstep(0.9,stroke_Amt1, fract(F*_freq));
    // value/=abs(noise2(uv*randomFactor));
    a/=value;
  }
  return a;
}

vec3 fakeColors(vec3 a,float F, vec2 uv, float coord){
  float hue = floor(F*freq)/1.0;
  float p1 = pointsDivisionBody[1];
  float p2 = pointsDivisionBody[2];
  float angle = atan(uv.y, uv.x)/TWO_PI;
  if(F < p1 && F>p2){
    a = hsb2rgb(vec3(abs(hue*fake_value1[0])+(angle*fake_value2[0]+randomFactor1),1.0,1.0));
    // a = hsb2rgb(vec3(abs(hue*fake_value1[0]),1.0,1.0));

  }else{
    a = hsb2rgb(vec3(abs(hue*fake_value1[1])+(angle*fake_value2[1]+randomFactor1),1.0,1.0));
    // a = hsb2rgb(vec3(abs(hue*fake_value1[1]),1.0,1.0));

  }

  a = blendColor(a, vec3(1.0,0.,0.),vec3(0.0,.0,1.0),vec3(0.0,1.0,0.0));
  return a;
}

vec3 shade(float F, vec2 uv, float coord,int choice, float freq, int color_index){

    vec3 a; int c12;

    if(choice == int(0.0)){
          if(pulseChoice == 0){a = pulseOsc(F, 0.53,freq);}
          else if(pulseChoice == 1){a = pulseOsc(F, 0.53, mix(array_freq[0], F, F/1.1));a = addStroke(1.0-(F),a,uv, freq, coord);}
          else if(pulseChoice == 2){a = pulseOsc(F, 0.53, mix(array_freq[0], F, sin(F*randomFactor+0.5) ));}
    }else if(choice == int(1.0)){c12 = int(mod(F*array_freq[1],float(nCol)));for(int i = 0; i <14; i++){if(c12 == i){a = i2f((fullGamma[i]));}}a = addStroke(1.0-(F),a,uv, array_freq[1], coord);
    }else if(choice == int(2.0)){c12 = int(mod(F*array_freq[2],3.0));for(int i = 0; i< 3; i++){if(c12 == i){a = i2f((metallicColors[i]));}}a = addStroke(1.0-(F),a,uv, array_freq[2], coord);
    }else if(choice == int(3.0)){
      vec2 newCoord;
      if(uv.y > u3){
        newCoord = vec2(uv.x -u2, uv.y);
      }else if(uv.y < -u3){
      newCoord = vec2(uv.x +u2, uv.y);
      if(u1 != 0.0){
        newCoord = vec2(uv.x , uv.y);
        }else{newCoord = vec2(uv.x +u2, uv.y);}
      }else{
        newCoord = vec2(uv.x, uv.y);
      }
      float cc = atan(newCoord.x, newCoord.y)/TWO_PI;
      a = pulseOsc(cc, 0.0,freq*2.0);

    }else if(choice == int(4.0)){
            vec3 g = grid(uv, 50.0,0.2);
            a = g;
        }else if(choice == int(5.0)){
            vec3 g = 1.0-grid(uv, 50.0,0.2);
            a = g;
        }else if(choice == int(6.0)){
            a = pulseOsc(uv.y,0.0,50.0);
        }else if(choice == int(7.0)){
            a = floor(vec3(circle(fract(uv*60.0), 0.1))+0.5);
            a = 1.0-a;
        }else if(choice == int(8.0)){
            a = fakeColors(a,F,uv,coord);
            a = addStroke(1.0-(F),a,uv, freq, coord);

        }else if(choice == int(9.0)){
            float hue = floor(F*freq)/1.0;

            if(pixela != int(1.0)){
              a = hsb2rgb(vec3(abs(hue*randomFactor),1.0,1.0));
              a = blendColor(a, vec3(1.0,1.0,0.),vec3(1.0,1.0,1.0),vec3(0.0,.8,0.1));
              a = addStroke(1.0-(F),a,uv, freq, coord);
            }else{
              a = hsb2rgb(vec3(abs(F*0.4),1.0,1.0));
              a = blendColor(a, vec3(1.0,1.0,0.),vec3(1.0,1.0,1.0),vec3(0.0,.8,0.1));
            }
        }else if(choice == int(10.)){
          c12 = color_index;
          for(int i = 0; i <14; i++){
            if(c12 == i){
              float r = noise2(uv*20.0+randomFactor*sin(uv.x*10.0+randomFactor1));
                a = i2f((fullGamma[i]));
              }
            }
          // a = addStroke(1.0-(F),a,uv, array_freq[1], coord);
        }else if(choice == int(11)){
          a = vec3(0.0);
          // a = vec(1.0);
        }else if(choice == int(12)){
          a = vec3(1.0);

        }else if(choice == int(13)){
          c12 = color_index;
          for(int i = 0; i <14; i++){
            if(c12 == i){
              float r = noise2(uv*10.+randomFactor*sin(uv.x*1.+randomFactor1));
                a = mix(i2f((fullGamma[i])),grid(uv, 50.0,0.2),smoothstep(0.1,0.2,vec3(r)));
              }
            }
        }
        return a;
}

vec3 generateNucleo(vec3 a, float F, vec2 uv){

  float p1 = pointsDivisionNucleo[0];float p2 = pointsDivisionNucleo[1];float p3 = pointsDivisionNucleo[2];float p4 = pointsDivisionNucleo[3];float p5 = pointsDivisionNucleo[4];float p6 = pointsDivisionNucleo[5];

  float offset0 = 0.2;

  if(F < nucleoSize){
  if(F > p1 && F < p2){
  if(nucleoDivisions[0] == 1){
        a = generateRing(a, vec3(.0),F,-0.5,p2, .0,1.0,nucleo_stroke[0],uv);

  if(nucleo_subRings[0]==1){
          float posRing = p2/nucleo_subRings_pos[0].r-0.01;float size = nucleo_subRings_pos[0].g;
          a = generateRing(a, vec3(1.0),F,posRing,posRing+size, .0,.0,0.00,uv);
        }
  if(nucleo_subRings[1]==1){
    float posRing = p2/nucleo_subRings_pos[1].r-0.01;float size = nucleo_subRings_pos[1].g;
          a = generateRing(a, vec3(1.0),F,posRing,posRing+size, .0,.0,0.00,uv);
        }
  if(nucleo_subRings[2]==1){
        a = generateRing(a,vec3(010),F,-0.1,p2/10.0, .0,.0,0.0,uv);
      }
  }
  }

    if(nucleoDivisions[1] == 1){
      a = generateRing(a, i2f(metallicColors[1]),F,p2,p3, .0,1.0,nucleo_stroke[1],uv);
    }

    if(nucleoDivisions[2] == 1){
      a = generateRing(a, i2f(metallicColors[0]),F,p3,p4, .0,1.0,nucleo_stroke[2],uv);
    }

    if(nucleoDivisions[3] == 1){
      a = generateRing(a, vec3(0.0),F,p4,p5, .0,1.0,nucleo_stroke[3],uv);
    }
    if(nucleoDivisions[4] == 1){
      a = generateRing(a, vec3(0.0),F,p4,p5, .0,1.0,nucleo_stroke[4],uv);
    }
  }
  return a;
}

vec3 light(vec3 a,vec2 uv){

    uv+=vec2(1.5);
    if(lights==int(1.0)){

    if(nMap==int(1.0)){
      a *= mix(1.0,abs(cos(sin(uv.y*0.3)*2.0)),0.2);
      a *= mix(1.0,cos(-uv.x*1.+0.2),0.9);
    }else{
      a *= abs(cos(sin(uv.y*0.3)*2.0))*1.0;
      a *= mix(1.0,cos(-uv.x*1.+0.2),.3);
    }

    uv*=rotate2d(lightRot*3.0);

    a +=circle(uv+cos(uv.x*2.0+0.5)*lightCoord, lightSize)*lightAmt;
    // a +=circle(uv+sin(uv.y*20.0+0.4)*lightCoord, lightSize)*lightAmt/3.0;
    a -=circle(uv+cos(uv.x*2.0+0.5)*lightCoord, .01)*lightAmt1;
  }

  return a;
  }

vec3 generate_noise(vec3 a){
  float af = 0.9;
  float f = 0.1;

  if(nShade == 0){
    if(a.r < af){
      a.rgb += vec3( f * random( gl_FragCoord.xy/100.0, 200.0 * 1.0  )); //1.4
    }
    if(a.b < af){
      a.rgb += vec3( f * random( gl_FragCoord.xy/100.0, 200.0 * 1.0  )); //1.4
    }
    if(a.g < af){
      a.rgb += vec3( f * random( gl_FragCoord.xy/100.0, 200.0 * 1.0  )); //1.4
    }

    }else{
      a.rgb += vec3( f * random( gl_FragCoord.xy/100.0, 200.0 * 1.0  )); //1.4
    }
    return a;
}

vec3 generateNucleo_capsule(float F,vec2 uv,vec3 a){

  float xx = 0.0;if(u4 == 1.0){xx = u2;}else{xx = 0.0;}
  float cc;
  if(rotateNucleo==int(1.0)){uv*=rotate2d(PI/2.0);}

  if(capsule_nucleos[0] == 1){
    cc = shape(uv+vec2(-xx,2.0), 100);
    if(distance(cc,0.0) < capsule_NucleoSize[0]){
      a = shade(cc,uv,0.,1,frequency[0],2);
        // a = vec3(0.0);
    }
  }
  if(capsule_nucleos[1] == 1){
     cc = shape(uv+vec2(xx,-2.),100);
     if(distance(cc,0.0) < capsule_NucleoSize[1]){
       a = shade(cc,uv,0.,1,frequency[0],2);
     }
  }
  if(capsule_nucleos[2] == 1){
    cc = shape(uv+vec2(0.,0.0),100);
    if(distance(cc,0.0) < capsule_NucleoSize[2]){
      a = shade(cc,uv,0.,1,frequency[0],2);
    }
  }

    // if(distance(cc,0.0) < map(u3,0.0,2.0,0.25/2.0,1.)){

return a;
}

vec3 gen_serials_map(float F,vec2 uv){
  vec3 a;

  if(F > 0.45){
    a = shade(F, uv, 0.0,0, 10.0,5);
  }else{
    a = shade(F,uv,0.,nShade,freq,1);
  }
  vec3 ar = grid(uv, 24.0,0.97); //2 / 12 / 24;
  return a;
}

vec3 generate_map(float F, vec2 uv, float _angle){
  vec3 a;
  float angle;

  // // float mm = map(angle, 0.0,TWO_PI,0.0,1.0);

  if(uv.y > u3){
  angle = atan(uv.x-u2, uv.y-u3)/TWO_PI;
  for(int i = 0; i <8; i++){
    if(i < pointsDivisionBodySize){
      float p1 = pointsDivisionBody[i]; float p2 = pointsDivisionBody[i+1];
      if( F < p1 && F > p2){
       a = shade(F,uv,angle,int(rings_shades2[i+1].y),frequency[i],2);
      }
  }
  }

  }else if(uv.y < -u3){
    if(u1 != 0.0){
      angle = atan(uv.x, uv.y)/TWO_PI;
    }else{angle = atan(uv.x+u2, uv.y+u3)/TWO_PI;}

    for(int i = 0; i <8; i++){
      if(i < pointsDivisionBodySize2){
        float p1 = pointsDivisionBody2[i]; float p2 = pointsDivisionBody2[i+1];
        if( F < p1 && F > p2){
         a = shade(F,uv,angle,int(rings_shades2[i].x),frequency[i+1],0);
        }
    }
    }
  }else {
    for(int i = 0; i < 8; i++){
      angle = atan(uv.x, uv.y)/TWO_PI;

      if(i < pointsDivisionBodySize3){
        float p1 = pointsDivisionBody3[i]; float p2 = pointsDivisionBody3[i+1];
        if( F < p1 && F > p2){
         a = shade(F,uv,angle,int(rings_shades2[i].y),frequency[i+2],1);
        }
    }
  }
  }





// }
// else  if(uv.y < -u3){
// for(int i = 0; i < 7; i++){
//   if(i < pointsDivisionBodySize2){
//
// float p1 = pointsDivisionBody2[i];
// float p2 = pointsDivisionBody2[i+1];
// if( F < p1 && F > p2){
// if(mm > rings_pos2[i]-rings_largo2[i] && mm < rings_pos2[i]){
//   a = shade(F,uv,angle,int(rings_shades2[i].x),freq);
// }else{
//   a = shade(F,uv,angle,int(rings_shades2[i].y),freq);
// }
// }else if(F < p2){
//   a = shade(F,uv,angle,int(rings_shades2[i].y),freq);
// }}
// }
//
// }else{
// for(int i = 0; i < 0; i++){
// float p1 = pointsDivisionBody3[i];
// float p2 = pointsDivisionBody3[i+1];
// float angle2 = atan(uv.y, uv.x);
//
// if( F < p1 && F > p2){
// a = shade(F,uv,angle2,int(rings_shades3[i].y),freq);
// }
// // else{
// //   a = shade(F,uv,angle2,int(rings_shades3[i].x),freq);
// //
// // }
// }
// }


// }else if(nShape == 2){
  // a = shade(F,uv,_angle,int(rings_shades3[0].y));

// }

  return a;
}

// vec3 generate_map_pyramida(float F, vec2 uv, float _angle){
//   vec3 a;
//   if(clamp(F,0.0,1.0) < 0.001){
//     a = shade(F,uv,_angle,1);
//   }else{
//     a = shade(F,uv,_angle,0);
//   }
//
// return a;
// }

vec3 generate_map_u1(float F, vec2 uv){
  vec3 a;
  if(uv.y > u3){
    a = vec3(0.0);
  }else{
    a = vec3(1.0);
  }
  return a;
}

void main() {
  vec2 coord = gl_FragCoord.xy; vec2 uv2 = gl_FragCoord.xy/resolution.xy;uv2-=vec2(0.5);

  vec2 uv  = zoom * vec2((coord.x - resolution.x / 2.0 )/resolution.x,(coord.y - resolution.y /2.0 )/resolution.y);
  vec2 uv3  = 3.5 * vec2((coord.x - resolution.x / 2.0 )/resolution.x,(coord.y - resolution.y /2.0 )/resolution.y);
  float fix = resolution.x/resolution.y;uv.x *= resolution.x / resolution.y;vec2 toCenter = vec2(.0*fix,.0)+uv;float radius = length(((toCenter)));float angle = atan(uv.x, uv.y);
  if(flip == int(1.0)){uv+=0.5;if(u1 == 1.0){uv=scale(uv, vec2(-1.0,-1.0));}else{uv=scale(uv, vec2(-1.0,1.0));}uv-=0.5;}else{uv = uv;}
  // if(flip == int(1.0)){uv2+=0.5;if(u1 == 1.0){uv2=scale(uv2, vec2(-1.0,-1.0));}else{uv2=scale(uv, vec2(-1.0,1.0));}uv2-=0.5;}else{uv2 = uv2;}
//

  // if(rotate == int(1.0)){
  //   uv*=rotate2d(PI/2.0);
  // }

  float serials = gen_serials(uv2,s_size);

    if(pixela == int(1.0)){
      uv = floor(uv*2.0+0.5);
    }else{
      uv = uv;
    }

  float F = intf(uv, nShape, angle);


    if(nMap==int(1.0)){
      if(nShape == 0){
        final.rgb = generate_map(F,uv,angle);
        if(u1 == 1.){
          final.rgb = generate_map_u1(F,uv);
        }
        if(serials_choice==0){
            final.rgb = gen_serials_map(F,uv2);
        }

      }else if(nShape == 2){

      }
    }else{
      final.rgb = shade(F,uv,angle,nShade,freq,1);
    }

    if(nShape == 2){
      if(nucleo==int(1.0)){
        final.rgb = generateNucleo_capsule(F,uv, final.rgb);
      }
    }

  if(nShape == 0){
    if(nucleo==int(1.)){final.rgb = generateNucleo(final.rgb, F,uv);}
  }

  uv2=scale(uv2,vec2(3.0));
  final.rgb = light(final.rgb,uv2);
  final.rgb = generate_noise(final.rgb);

  vec3 back;
  if(background==int(0.0)){
    back = vec3(1.0);
  }else if(background==int(1.0)){
    back = vec3(.0);
  }else if(background==int(2.0)){
    back = grid(uv2, 24.0,0.1);
  }else if(background==int(3.0)){
    back = 1.0-grid(uv2, 24.0,0.1);
  }else if(background==int(4.0)){
    back = grid(uv2, 8.0,0.97); //2 / 12 / 24;
  }else if(background==int(5.0)){
    back = 1.0-grid(uv2, 2.0,0.97); //2 / 12 / 24;
  }else if(background==int(6.0)){
    back = i2f((fullGamma[0]));
  }else if(background==int(7.0)){
    uv2*=rotate2d(sin(uv2.x*.5)*sin(uv2.y*2.0));
    back = 1.0-floor(vec3(circle(fract(uv2*20.0), 0.05*sin(uv.x*0.01)))+0.5);
  }else if(background==int(8.0)){
    back = 1.0-shade(F,uv,angle,13,freq,1);
  }

  if(F > disc){
    if(fullInterference==int(1.0)){
      if(uv.y > u3){
        final.rgb = shade(F,uv,angle,int(rings_shades[1].x),freq,1);
      }else if(uv.y <-u3){
        final.rgb = shade(F,uv,angle,int(rings_shades[0].x),freq,1);
      }else{
        final.rgb = shade(F,uv,angle,int(rings_shades[2].x),freq,1);
      }
    }else{
      final.rgb = back;
    }
  }

  if(outSideStroke == int(1.0)){
    if(F < disc && F > disc-0.005){
      final.rgb = vec3(sin(angle*5.0));
      final.rgb = generate_noise(final.rgb);

    }
  }

  if(serials_choice == int(0.0)){
    if(distance(serials,0.0) < s_size){
      final.rgb = back;
      // final.rgb = back*vec3(1.0,0.,0.);

    }
  }



  gl_FragColor = vec4(vec3(final.rgb), 1.0);

}
