#include utils/cnoise

#define PI 3.1915926535897932384626433832795

varying vec2 vUv;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}



void main()
{
    // // Pattern 3
    // float strength = vUv.x;

    // // Pattern 4
    // float strength = vUv.y;

    // // Pattern 5
    // float strength = 1.0 - vUv.y;

    // // Pattern 6
    // float strength = vUv.y  * 10.0;

    // // Pattern 7
    // float strength = mod(vUv.y * 10.0, 1.0);

    // // Pattern 8
    // float strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.5, strength);

    // // Pattern 9
    // float strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.8, strength);

    // // Pattern 10
    // float strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.8, strength);

    // // // Pattern 11
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength += step(0.8, step(0.8, mod(vUv.y * 10.0, 1.0)));

    // // Pattern 12
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    //  strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // // Pattern 13
    // float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
    //  strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

    // // Pattern 14
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0, 1.0));
    
    // float barY = step(0.8, mod(vUv.x * 10.0, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

    // float strength = barX + barY;

    // // Pattern 15
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));

    // float barY = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
    // barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

    // float strength = barX + barY;

    // // Pattern 16
    // float strength = abs(vUv.x -0.5);

    // // Pattern 17
    // float strength = min(abs(vUv.x -0.5), abs(vUv.y -0.5));

    // // Pattern 18
    // float strength = max(abs(vUv.x -0.5), abs(vUv.y -0.5));

    // // Pattern 19
    // float strength = step(0.2, max(abs(vUv.x -0.5), abs(vUv.y -0.5)));

    // // Pattern 20
    // float square1 = 1.0 - step(0.3, max(abs(vUv.x -0.5), abs(vUv.y -0.5)));
    // float square2 = step(0.2, max(abs(vUv.x -0.5), abs(vUv.y -0.5)));
    // float strength = square1 * square2;

    // // Patrern 21
    // float strength = floor(vUv.x * 10.0) * 0.1;

    // // Patrern 22
    // float strength = floor(vUv.x * 10.0) * 0.1;
    // strength * = floor(vUv.y * 10.0) * 0.1;

    // // Patrern 23
    // float strength = random(vUv);

    // // Patern 24
    // vec2 gridUv = vec2(
    //     floor(vUv.x * 10.0) * 0.1,
    //     floor(vUv.y * 10.0) * 0.1
    // )
    // float strength = random(gridUv);

    // // Patern 25
    // vec2 gridUv = vec2(
    //     floor(vUv.x * 10.0) * 0.1,
    //     floor(vUv.y * 10.0 + vUv.x * 5.0) * 0.1
    // );
    // float strength = random(gridUv);

    // // Partern 26
    // float strength = length(vUv);

    // // Partern 27
    // float strength = distance(vUv, vec2(0.5));

    // // Partern 28
    // float strength = 1.0 - distance(vUv, vec2(0.5));

    // // Partern 29
    // float strength = 0.02 / distance(vUv, vec2(0.5));
    
    // // Partern 30
    // vec2 lightUv = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
    // float strength = 0.02 / distance(lightUv, vec2(0.5));

    // // Partern 31
    // vec2 lightUvX = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
    // float lightX = 0.015 / distance(lightUvX, vec2(0.5));

    // vec2 lightUvY = vec2(vUv.x * 0.5 + 0.25, vUv.y * 0.1 + 0.45);
    // float lightY = 0.015 / distance(lightUvY, vec2(0.5));

    // float strength = lightX * lightY;

    // // Partern 32
    // vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));

    // vec2 lightUvX = vec2(rotatedUv.x * 0.1 + 0.45, rotatedUv.y * 0.5 + 0.25);
    // float lightX = 0.015 / distance(lightUvX, vec2(0.5));

    // vec2 lightUvY = vec2(rotatedUv.y * 0.1 + 0.45, rotatedUv.x * 0.5 + 0.25);
    // float lightY = 0.015 / distance(lightUvY, vec2(0.5));

    // float strength = lightX * lightY;

    // // partern 33
    // float strength = step(0.25, distance(vUv, vec2(0.5)));

    // // partern 34
    // float strength = abs(distance(vUv, vec2(0.5)) -0.25);

    // // partern 35
    // float strength = step(0.01, abs(distance(vUv, vec2(0.5)) -0.25));

    // // partern 36
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) -0.25));

    // // partern 37
    // vec2 wavedUv = vec2(vUv.x, vUv.y + sin(vUv.x * 30.0) * 0.1);
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) -0.25));

    // // partern 38
    // vec2 wavedUv = vec2(vUv.x + sin(vUv.y * 30.0) * 0.1, vUv.y + sin(vUv.x * 30.0) * 0.1);
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) -0.25));

    // // partern 39
    // vec2 wavedUv = vec2(vUv.x + sin(vUv.y * 100.0) * 0.1, vUv.y + sin(vUv.x * 100.0) * 0.1);
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) -0.25));

    // // partern 40
    // float angle = atan(vUv.y, vUv.x);
    // float strength = angle;

    // // partern 41
    // float angle = atan(vUv.y- 0.5, vUv.x - 0.5);
    // float strength = angle;

    // // partern 42
    // float angle = atan(vUv.x - 0.50, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = angle;

    // // partern 43
    // float angle = atan(vUv.x - 0.50, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // angle *= 100.0;
    // angle = mod(angle, 1.0);
    // float strength = angle;

    //  // partern 44
    // float angle = atan(vUv.x - 0.50, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // // angle *= 20.0;
    // // angle = mod(angle, 1.0);
    // float strength = sin(angle * 100.0 );

    // // Partern 45
    // float angle = atan(vUv.x - 0.50, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float sinusoid = sin(angle * 100.0 );

    // float radius = 0.25 + sinusoid * 0.02;
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

    // // Partern 46
    // float strength = cnoise(vUv * 10.0);

    // // Partern 47
    // float strength = step(0.1, cnoise(vUv * 10.0));

    // // Partern 48
    // float strength = (1.0 - abs(cnoise(vUv * 10.0)));

    // // Partern 49
    // float strength = sin(cnoise(vUv * 10.0) * 20.0);

    // Partern 50
    float strength = step(0.5, sin( cnoise(vUv * 10.0) * 20.0));

    // Clamp strength
    strength = clamp(strength, 0.0, 1.0);

    // Colored Version
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv, 1.0);
    vec3 mixedColor = mix(blackColor, uvColor, strength);
    gl_FragColor = vec4(mixedColor, 1.0);

    // // Black and white version
    // gl_FragColor = vec4(strength, strength, strength, 1.0);
}