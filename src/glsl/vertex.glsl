varying vec2 v_uv;

void main() {
    v_uv = uv;
    vec3 pos = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    // gl_Position = vec4(pos, 1.0);
}
