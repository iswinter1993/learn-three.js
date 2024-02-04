uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform sampler2D image;
varying vec2 vUv;
void main(){
    vec2 st = gl_FragCoord.xy/iResolution;
    vec4 texture = texture2D(image,vUv);
    gl_FragColor = vec4(texture.r,texture.g,texture.b,1.0);
}