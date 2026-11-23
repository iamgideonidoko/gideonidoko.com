#pragma glslify: cnoise3 = require('glsl-noise/classic/3d')

uniform sampler2D u_map;

uniform float u_alpha;
uniform float u_grayscaleHover;
uniform float u_time;
uniform float u_progressHover;
uniform float u_progressClick;

uniform vec2 u_res;
uniform vec2 u_mouse;
uniform vec2 u_ratio;

varying vec2 v_uv;

float circle(in vec2 _st, in float _radius, in float blurriness){
    vec2 dist = _st;
	  return 1. - smoothstep(_radius-(_radius*blurriness), _radius+(_radius*blurriness), dot(dist,dist)*4.0);
}


void main() {
  vec2 resolution = u_res * PR;
  float time = u_time * 0.05;
  float progress = u_progressClick;

  float progressHover = u_progressHover;
  vec2 uv = v_uv;

  vec2 st = gl_FragCoord.xy / resolution.xy - vec2(.5);
  st.y *= resolution.y / resolution.x;

  vec2 mouse = vec2((u_mouse.x / u_res.x) * 2. - 1.,-(u_mouse.y / u_res.y) * 2. + 1.) * -.5;
  mouse.y *= resolution.y / resolution.x;

  vec2 cpos = st + mouse;

  float c2 = circle(cpos, max(.01 * progressHover + progress * 0.5, .00001), 2.);

  float offX = uv.x + sin(uv.y + time * 2.);
  float offY = uv.y - time * .2 - cos(time * 2.) * 0.1;
  float nc = (cnoise3(vec3(offX, offY, time * .5) * 6.)) * progressHover;
  float distortion = cnoise3(vec3(offX, offY, time * .5) * 2.);

  c2 = smoothstep(0., .25, c2) * smoothstep(.1, .8, c2 * 5. + nc * 4.5 * (1. - c2) - 1.);

  uv -= vec2(0.5);
  uv *= u_ratio;
  uv += vec2(0.5);
  vec2 displacement = vec2(distortion) * progressHover * (1. - progress);
  uv += displacement * .003;

  vec4 base = texture2D(u_map, uv);
  vec4 color = texture2D(u_map, uv + displacement * .012);
  float luminance = dot(base.rgb, vec3(0.299, 0.587, 0.114));
  vec4 image = mix(vec4(vec3(luminance), base.a), base, u_grayscaleHover);
  float hoverLuminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color = mix(color, vec4(vec3(hoverLuminance), color.a), u_grayscaleHover);

  image = mix(image, color, clamp(c2 + progress, 0., 1.));

  gl_FragColor = vec4(image.rgb, u_alpha * image.a);
  // gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
}
