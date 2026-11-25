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

void main() {
  float time = u_time * 0.05;
  float progress = u_progressClick;

  float progressHover = u_progressHover;
  vec2 uv = v_uv;

  vec2 pointer = vec2(u_mouse.x, u_res.y - u_mouse.y);
  vec2 cpos = gl_FragCoord.xy / PR - pointer;
  float radius = 140. * clamp(progressHover / .7, 0., 1.) + progress * max(u_res.x, u_res.y);
  float edgeNoise = cnoise3(vec3(cpos * .025, u_time * .6));
  float c2 = (1. - smoothstep(radius - 8., radius + 8., length(cpos) + edgeNoise * 28.))
    * smoothstep(0., .1, progressHover + progress);

  float offX = uv.x + sin(uv.y + time * 2.);
  float offY = uv.y - time * .2 - cos(time * 2.) * 0.1;
  float distortion = cnoise3(vec3(offX, offY, time * .5) * 2.);

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
