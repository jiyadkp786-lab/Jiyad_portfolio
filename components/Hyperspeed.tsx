'use client';

import { BloomEffect, EffectComposer, EffectPass, RenderPass, SMAAEffect, SMAAPreset } from 'postprocessing';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ── Types ──────────────────────────────────────────────────────────────────
interface Distortion {
  uniforms: Record<string, { value: any }>;
  getDistortion: string;
  getJS?: (progress: number, time: number) => THREE.Vector3;
}

interface EffectOptions {
  onSpeedUp?: (ev: MouseEvent | TouchEvent) => void;
  onSlowDown?: (ev: MouseEvent | TouchEvent) => void;
  distortion: string;
  length: number;
  roadWidth: number;
  islandWidth: number;
  lanesPerRoad: number;
  fov: number;
  fovSpeedUp: number;
  speedUp: number;
  carLightsFade: number;
  totalSideLightSticks: number;
  lightPairsPerRoadWay: number;
  shoulderLinesWidthPercentage: number;
  brokenLinesWidthPercentage: number;
  brokenLinesLengthPercentage: number;
  lightStickWidth: number | [number, number];
  lightStickHeight: number | [number, number];
  movingAwaySpeed: [number, number];
  movingCloserSpeed: [number, number];
  carLightsLength: [number, number];
  carLightsRadius: [number, number];
  carWidthPercentage: [number, number];
  carShiftX: [number, number];
  carFloorSeparation: [number, number];
  colors: {
    roadColor: number;
    islandColor: number;
    background: number;
    shoulderLines: number;
    brokenLines: number;
    leftCars: number[];
    rightCars: number[];
    sticks: number | number[];
  };
}

const DEFAULT_EFFECT_OPTIONS: EffectOptions = {
  onSpeedUp: () => {},
  onSlowDown: () => {},
  distortion: 'turbulentDistortion',
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 4,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 20,
  lightPairsPerRoadWay: 40,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5],
  lightStickHeight: [1.3, 1.7],
  movingAwaySpeed: [60, 80],
  movingCloserSpeed: [-120, -160],
  carLightsLength: [400 * 0.03, 400 * 0.2],
  carLightsRadius: [0.05, 0.14],
  carWidthPercentage: [0.3, 0.5],
  carShiftX: [-0.8, 0.8],
  carFloorSeparation: [0, 5],
  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x000000,
    shoulderLines: 0xffffff,
    brokenLines: 0xffffff,
    leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
    rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
    sticks: 0x03b3c3
  }
};

// ── Helpers ────────────────────────────────────────────────────────────────
const nsin_fn = (val: number) => Math.sin(val) * 0.5 + 0.5;

function lerp(current: number, target: number, speed = 0.1, limit = 0.001) {
  let change = (target - current) * speed;
  if (Math.abs(change) < limit) {
    change = target - current;
  }
  return change;
}

const random = (base: number | [number, number]) => {
  if (Array.isArray(base)) return Math.random() * (base[1] - base[0]) + base[0];
  return Math.random() * base;
};

const pickRandom = <T,>(arr: T | T[]): T => {
  if (Array.isArray(arr)) return arr[Math.floor(Math.random() * arr.length)];
  return arr;
};

function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer, setSize: (w: number, h: number, u: boolean) => void) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width <= 0 || height <= 0) return false;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    setSize(width, height, false);
  }
  return needResize;
}

// ─────────────────────────────────────────────────────────────────────────────
// Distortions
// ─────────────────────────────────────────────────────────────────────────────
const mountainUniforms = {
  uFreq: { value: new THREE.Vector3(3, 6, 10) },
  uAmp: { value: new THREE.Vector3(30, 30, 20) }
};
const xyUniforms = {
  uFreq: { value: new THREE.Vector2(5, 2) },
  uAmp: { value: new THREE.Vector2(25, 15) }
};
const LongRaceUniforms = {
  uFreq: { value: new THREE.Vector2(2, 3) },
  uAmp: { value: new THREE.Vector2(35, 10) }
};
const turbulentUniforms = {
  uFreq: { value: new THREE.Vector4(4, 8, 8, 1) },
  uAmp: { value: new THREE.Vector4(25, 5, 10, 10) }
};
const deepUniforms = {
  uFreq: { value: new THREE.Vector2(4, 8) },
  uAmp: { value: new THREE.Vector2(10, 20) },
  uPowY: { value: new THREE.Vector2(20, 2) }
};

const distortions: Record<string, Distortion> = {
  mountainDistortion: {
    uniforms: mountainUniforms,
    getDistortion: `
      uniform vec3 uAmp;
      uniform vec3 uFreq;
      #define PI 3.14159265358979
      float nsin(float val){ return sin(val) * 0.5 + 0.5; }
      vec3 getDistortion(float progress){
        float movementProgressFix = 0.02;
        return vec3( 
          cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(movementProgressFix * PI * uFreq.x + uTime) * uAmp.x,
          nsin(progress * PI * uFreq.y + uTime) * uAmp.y - nsin(movementProgressFix * PI * uFreq.y + uTime) * uAmp.y,
          nsin(progress * PI * uFreq.z + uTime) * uAmp.z - nsin(movementProgressFix * PI * uFreq.z + uTime) * uAmp.z
        );
      }
    `,
    getJS: (progress, time) => {
      let movementProgressFix = 0.02;
      let uFreq = mountainUniforms.uFreq.value;
      let uAmp = mountainUniforms.uAmp.value;
      let distortion = new THREE.Vector3(
        Math.cos(progress * Math.PI * uFreq.x + time) * uAmp.x - Math.cos(movementProgressFix * Math.PI * uFreq.x + time) * uAmp.x,
        nsin_fn(progress * Math.PI * uFreq.y + time) * uAmp.y - nsin_fn(movementProgressFix * Math.PI * uFreq.y + time) * uAmp.y,
        nsin_fn(progress * Math.PI * uFreq.z + time) * uAmp.z - nsin_fn(movementProgressFix * Math.PI * uFreq.z + time) * uAmp.z
      );
      return distortion.multiply(new THREE.Vector3(2, 2, 2)).add(new THREE.Vector3(0, 0, -5));
    }
  },
  xyDistortion: {
    uniforms: xyUniforms,
    getDistortion: `
      uniform vec2 uFreq;
      uniform vec2 uAmp;
      #define PI 3.14159265358979
      vec3 getDistortion(float progress){
        float movementProgressFix = 0.02;
        return vec3( 
          cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(movementProgressFix * PI * uFreq.x + uTime) * uAmp.x,
          sin(progress * PI * uFreq.y + PI/2. + uTime) * uAmp.y - sin(movementProgressFix * PI * uFreq.y + PI/2. + uTime) * uAmp.y,
          0.
        );
      }
    `,
    getJS: (progress, time) => {
      let movementProgressFix = 0.02;
      let uFreq = xyUniforms.uFreq.value;
      let uAmp = xyUniforms.uAmp.value;
      let distortion = new THREE.Vector3(
        Math.cos(progress * Math.PI * uFreq.x + time) * uAmp.x - Math.cos(movementProgressFix * Math.PI * uFreq.x + time) * uAmp.x,
        Math.sin(progress * Math.PI * uFreq.y + time + Math.PI / 2) * uAmp.y - Math.sin(movementProgressFix * Math.PI * uFreq.y + time + Math.PI / 2) * uAmp.y,
        0
      );
      return distortion.multiply(new THREE.Vector3(2, 0.4, 1)).add(new THREE.Vector3(0, 0, -3));
    }
  },
  LongRaceDistortion: {
    uniforms: LongRaceUniforms,
    getDistortion: `
      uniform vec2 uFreq;
      uniform vec2 uAmp;
      #define PI 3.14159265358979
      vec3 getDistortion(float progress){
        float camProgress = 0.0125;
        return vec3( 
          sin(progress * PI * uFreq.x + uTime) * uAmp.x - sin(camProgress * PI * uFreq.x + uTime) * uAmp.x,
          sin(progress * PI * uFreq.y + uTime) * uAmp.y - sin(camProgress * PI * uFreq.y + uTime) * uAmp.y,
          0.
        );
      }
    `,
    getJS: (progress, time) => {
      let camProgress = 0.0125;
      let uFreq = LongRaceUniforms.uFreq.value;
      let uAmp = LongRaceUniforms.uAmp.value;
      let distortion = new THREE.Vector3(
        Math.sin(progress * Math.PI * uFreq.x + time) * uAmp.x - Math.sin(camProgress * Math.PI * uFreq.x + time) * uAmp.x,
        Math.sin(progress * Math.PI * uFreq.y + time) * uAmp.y - Math.sin(camProgress * Math.PI * uFreq.y + time) * uAmp.y,
        0
      );
      return distortion.multiply(new THREE.Vector3(1, 1, 0)).add(new THREE.Vector3(0, 0, -5));
    }
  },
  turbulentDistortion: {
    uniforms: turbulentUniforms,
    getDistortion: `
      uniform vec4 uFreq;
      uniform vec4 uAmp;
      float nsin(float val){ return sin(val) * 0.5 + 0.5; }
      #define PI 3.14159265358979
      float getDistortionX(float progress){
        return (cos(PI * progress * uFreq.r + uTime) * uAmp.r + pow(cos(PI * progress * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2. ) * uAmp.g);
      }
      float getDistortionY(float progress){
        return (-nsin(PI * progress * uFreq.b + uTime) * uAmp.b + -pow(nsin(PI * progress * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.) * uAmp.a);
      }
      vec3 getDistortion(float progress){
        return vec3(getDistortionX(progress) - getDistortionX(0.0125), getDistortionY(progress) - getDistortionY(0.0125), 0.);
      }
    `,
    getJS: (progress, time) => {
      const uFreq = turbulentUniforms.uFreq.value;
      const uAmp = turbulentUniforms.uAmp.value;
      const getX = (p: number) => Math.cos(Math.PI * p * uFreq.x + time) * uAmp.x + Math.pow(Math.cos(Math.PI * p * uFreq.y + time * (uFreq.y / uFreq.x)), 2) * uAmp.y;
      const getY = (p: number) => -nsin_fn(Math.PI * p * uFreq.z + time) * uAmp.z - Math.pow(nsin_fn(Math.PI * p * uFreq.w + time / (uFreq.z / uFreq.w)), 5) * uAmp.w;
      let distortion = new THREE.Vector3(getX(progress) - getX(progress + 0.007), getY(progress) - getY(progress + 0.007), 0);
      return distortion.multiply(new THREE.Vector3(-2, -5, 0)).add(new THREE.Vector3(0, 0, -10));
    }
  },
  deepDistortion: {
    uniforms: deepUniforms,
    getDistortion: `
      uniform vec4 uFreq;
      uniform vec4 uAmp;
      uniform vec2 uPowY;
      float nsin(float val){ return sin(val) * 0.5 + 0.5; }
      #define PI 3.14159265358979
      float getDistortionX(float progress){ return (sin(progress * PI * uFreq.x + uTime) * uAmp.x); }
      float getDistortionY(float progress){ return (pow(abs(progress * uPowY.x), uPowY.y) + sin(progress * PI * uFreq.y + uTime) * uAmp.y); }
      vec3 getDistortion(float progress){ return vec3(getDistortionX(progress) - getDistortionX(0.02), getDistortionY(progress) - getDistortionY(0.02), 0.); }
    `,
    getJS: (progress, time) => {
      const uFreq = deepUniforms.uFreq.value;
      const uAmp = deepUniforms.uAmp.value;
      const uPowY = deepUniforms.uPowY.value;
      const getX = (p: number) => Math.sin(p * Math.PI * uFreq.x + time) * uAmp.x;
      const getY = (p: number) => Math.pow(p * uPowY.x, uPowY.y) + Math.sin(p * Math.PI * uFreq.y + time) * uAmp.y;
      let distortion = new THREE.Vector3(getX(progress) - getX(progress + 0.01), getY(progress) - getY(progress + 0.01), 0);
      return distortion.multiply(new THREE.Vector3(-2, -4, 0)).add(new THREE.Vector3(0, 0, -10));
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

class CarLights {
  webgl: App;
  options: EffectOptions;
  colors: number | number[];
  speed: [number, number];
  fade: THREE.Vector2;
  mesh!: THREE.Mesh;

  constructor(webgl: App, options: EffectOptions, colors: number | number[], speed: [number, number], fade: THREE.Vector2) {
    this.webgl = webgl; this.options = options; this.colors = colors; this.speed = speed; this.fade = fade;
  }

  init() {
    const o = this.options;
    let curve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1));
    let geometry = new THREE.TubeGeometry(curve, 40, 1, 8, false);
    let instanced = new THREE.InstancedBufferGeometry().copy(geometry as any);
    instanced.instanceCount = o.lightPairsPerRoadWay * 2;

    let laneWidth = o.roadWidth / o.lanesPerRoad;
    let aOffset: number[] = [], aMetrics: number[] = [], aColor: number[] = [];
    let cols = (Array.isArray(this.colors) ? this.colors : [this.colors]).map(c => new THREE.Color(c));

    for (let i = 0; i < o.lightPairsPerRoadWay; i++) {
      let radius = random(o.carLightsRadius), length = random(o.carLightsLength), speed = random(this.speed);
      let carLane = i % o.lanesPerRoad;
      let laneX = carLane * laneWidth - o.roadWidth / 2 + laneWidth / 2;
      laneX += random(o.carShiftX) * laneWidth;
      let offsetY = random(o.carFloorSeparation) + radius * 1.3, offsetZ = -random(o.length);

      for (let k = 0; k < 2; k++) {
        aOffset.push(laneX + (k === 0 ? -1 : 1) * random(o.carWidthPercentage) * laneWidth / 2, offsetY, offsetZ);
        aMetrics.push(radius, length, speed);
        let col = pickRandom(cols);
        aColor.push(col.r, col.g, col.b);
      }
    }

    instanced.setAttribute('aOffset',  new THREE.InstancedBufferAttribute(new Float32Array(aOffset),  3));
    instanced.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 3));
    instanced.setAttribute('aColor',   new THREE.InstancedBufferAttribute(new Float32Array(aColor),   3));

    const distortionObj = (distortions as any)[o.distortion] || distortions.turbulentDistortion;

    let material = new THREE.ShaderMaterial({
      fragmentShader: carLightsFragment,
      vertexShader: carLightsVertex,
      transparent: true,
      uniforms: Object.assign({ uTime: { value: 0 }, uTravelLength: { value: o.length }, uFade: { value: this.fade } }, this.webgl.fogUniforms, distortionObj.uniforms)
    });
    material.onBeforeCompile = s => { s.vertexShader = s.vertexShader.replace('#include <getDistortion_vertex>', distortionObj.getDistortion); };
    this.mesh = new THREE.Mesh(instanced, material);
    this.mesh.frustumCulled = false;
    this.webgl.scene.add(this.mesh);
  }
  update(time: number) { (this.mesh.material as THREE.ShaderMaterial).uniforms.uTime.value = time; }
}

const carLightsFragment = `
  #define USE_FOG;
  ${THREE.ShaderChunk['fog_pars_fragment']}
  varying vec3 vColor; varying vec2 vUv; uniform vec2 uFade;
  void main() {
    float alpha = smoothstep(uFade.x, uFade.y, vUv.x);
    gl_FragColor = vec4(vColor, alpha);
    if (gl_FragColor.a < 0.0001) discard;
    ${THREE.ShaderChunk['fog_fragment']}
  }
`;

const carLightsVertex = `
  #define USE_FOG;
  ${THREE.ShaderChunk['fog_pars_vertex']}
  attribute vec3 aOffset, aMetrics, aColor;
  uniform float uTravelLength, uTime;
  varying vec2 vUv; varying vec3 vColor; 
  #include <getDistortion_vertex>
  void main() {
    vec3 transformed = position.xyz;
    float radius = aMetrics.r, myLength = aMetrics.g, speed = aMetrics.b;
    transformed.xy *= radius; transformed.z *= myLength;
    transformed.z += myLength - mod(uTime * speed + aOffset.z, uTravelLength);
    transformed.xy += aOffset.xy;
    float progress = abs(transformed.z / uTravelLength);
    transformed.xyz += getDistortion(progress);
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vUv = uv; vColor = aColor;
    ${THREE.ShaderChunk['fog_vertex']}
  }
`;

class LightsSticks {
  webgl: App;
  options: EffectOptions;
  mesh!: THREE.Mesh;

  constructor(webgl: App, options: EffectOptions) { this.webgl = webgl; this.options = options; }

  init() {
    const o = this.options;
    const geometry = new THREE.PlaneGeometry(1, 1);
    let instanced = new THREE.InstancedBufferGeometry().copy(geometry as any);
    instanced.instanceCount = o.totalSideLightSticks;
    let stickoffset = o.length / (o.totalSideLightSticks - 1);
    let aOffset: number[] = [], aColor: number[] = [], aMetrics: number[] = [];
    let cols = (Array.isArray(o.colors.sticks) ? o.colors.sticks : [o.colors.sticks]).map(c => new THREE.Color(c));

    for (let i = 0; i < o.totalSideLightSticks; i++) {
       aOffset.push((i - 1) * stickoffset * 2 + stickoffset * Math.random());
       let col = pickRandom(cols); aColor.push(col.r, col.g, col.b);
       aMetrics.push(random(o.lightStickWidth), random(o.lightStickHeight));
    }

    instanced.setAttribute('aOffset',  new THREE.InstancedBufferAttribute(new Float32Array(aOffset),  1));
    instanced.setAttribute('aColor',   new THREE.InstancedBufferAttribute(new Float32Array(aColor),   3));
    instanced.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 2));

    const distortionObj = (distortions as any)[o.distortion] || distortions.turbulentDistortion;

    const material = new THREE.ShaderMaterial({
      fragmentShader: sideSticksFragment,
      vertexShader: sideSticksVertex,
      side: THREE.DoubleSide,
      uniforms: Object.assign({ uTravelLength: { value: o.length }, uTime: { value: 0 } }, this.webgl.fogUniforms, distortionObj.uniforms)
    });
    material.onBeforeCompile = s => { s.vertexShader = s.vertexShader.replace('#include <getDistortion_vertex>', distortionObj.getDistortion); };
    this.mesh = new THREE.Mesh(instanced, material);
    this.mesh.frustumCulled = false;
    this.webgl.scene.add(this.mesh);
  }
  update(time: number) { (this.mesh.material as THREE.ShaderMaterial).uniforms.uTime.value = time; }
}

const sideSticksVertex = `
  #define USE_FOG;
  ${THREE.ShaderChunk['fog_pars_vertex']}
  attribute float aOffset; attribute vec3 aColor; attribute vec2 aMetrics;
  uniform float uTravelLength, uTime; varying vec3 vColor;
  mat4 rotationY(in float angle){ return mat4(cos(angle),0,sin(angle),0, 0,1,0,0, -sin(angle),0,cos(angle),0, 0,0,0,1); }
  #include <getDistortion_vertex>
  void main(){
    vec3 transformed = position.xyz;
    float width = aMetrics.x, height = aMetrics.y;
    transformed.xy *= vec2(width, height);
    float time = mod(uTime * 60. * 2. + aOffset, uTravelLength);
    transformed = (rotationY(3.14/2.) * vec4(transformed,1.)).xyz;
    transformed.z += - uTravelLength + time;
    float progress = abs(transformed.z / uTravelLength);
    transformed.xyz += getDistortion(progress);
    transformed.y += height / 2.; transformed.x += -width / 2.;
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vColor = aColor;
    ${THREE.ShaderChunk['fog_vertex']}
  }
`;

const sideSticksFragment = `
  #define USE_FOG;
  ${THREE.ShaderChunk['fog_pars_fragment']}
  varying vec3 vColor;
  void main(){ gl_FragColor = vec4(vColor, 1.); ${THREE.ShaderChunk['fog_fragment']} }
`;

class Road {
  webgl: App;
  options: EffectOptions;
  uTime = { value: 0 };
  leftRoadWay!: THREE.Mesh; rightRoadWay!: THREE.Mesh; island!: THREE.Mesh;

  constructor(webgl: App, options: EffectOptions) { this.webgl = webgl; this.options = options; }

  createPlane(side: number, width: number, isRoad: boolean) {
    const o = this.options;
    const geometry = new THREE.PlaneGeometry(isRoad ? o.roadWidth : o.islandWidth, o.length, 20, 100);
    let uniforms: any = { uTravelLength: { value: o.length }, uColor: { value: new THREE.Color(isRoad ? o.colors.roadColor : o.colors.islandColor) }, uTime: this.uTime };
    if (isRoad) {
      uniforms = { ...uniforms, uLanes: { value: o.lanesPerRoad }, uBrokenLinesColor: { value: new THREE.Color(o.colors.brokenLines) }, uShoulderLinesColor: { value: new THREE.Color(o.colors.shoulderLines) }, uShoulderLinesWidthPercentage: { value: o.shoulderLinesWidthPercentage }, uBrokenLinesLengthPercentage: { value: o.brokenLinesLengthPercentage }, uBrokenLinesWidthPercentage: { value: o.brokenLinesWidthPercentage } };
    }
    const distortionObj = (distortions as any)[o.distortion] || distortions.turbulentDistortion;
    const material = new THREE.ShaderMaterial({
      fragmentShader: isRoad ? roadFragment : islandFragment,
      vertexShader: roadVertex,
      side: THREE.DoubleSide,
      uniforms: Object.assign(uniforms, this.webgl.fogUniforms, distortionObj.uniforms)
    });
    material.onBeforeCompile = s => { s.vertexShader = s.vertexShader.replace('#include <getDistortion_vertex>', distortionObj.getDistortion); };
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2; mesh.position.z = -o.length / 2;
    mesh.position.x += (o.islandWidth / 2 + o.roadWidth / 2) * side;
    this.webgl.scene.add(mesh);
    return mesh;
  }

  init() { this.leftRoadWay = this.createPlane(-1, this.options.roadWidth, true); this.rightRoadWay = this.createPlane(1, this.options.roadWidth, true); this.island = this.createPlane(0, this.options.islandWidth, false); }
  update(time: number) { this.uTime.value = time; }
}

const roadMarkings_vars = `
  uniform float uLanes; uniform vec3 uBrokenLinesColor, uShoulderLinesColor;
  uniform float uShoulderLinesWidthPercentage, uBrokenLinesWidthPercentage, uBrokenLinesLengthPercentage;
`;

const roadMarkings_fragment = `
  uv.y = mod(uv.y + uTime * 0.05, 1.);
  float laneWidth = 1.0 / uLanes;
  float brokenLineWidth = laneWidth * uBrokenLinesWidthPercentage;
  float laneEmptySpace = 1. - uBrokenLinesLengthPercentage;
  float brokenLines = step(1.0 - brokenLineWidth, fract(uv.x * 2.0)) * step(laneEmptySpace, fract(uv.y * 10.0));
  float sideLines = step(1.0 - brokenLineWidth, fract((uv.x - laneWidth * (uLanes - 1.0)) * 2.0)) + step(brokenLineWidth, uv.x);
  brokenLines = mix(brokenLines, sideLines, uv.x);
`;

const roadVertex = `
  #define USE_FOG;
  uniform float uTime, uTravelLength; varying vec2 vUv; 
  #include <getDistortion_vertex>
  void main() {
    vec3 transformed = position.xyz;
    vec3 distortion = getDistortion((transformed.y + uTravelLength / 2.) / uTravelLength);
    transformed.x += distortion.x; transformed.z += distortion.y; transformed.y += -1. * distortion.z;  
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
    gl_Position = projectionMatrix * mvPosition;
    vUv = uv;
    ${THREE.ShaderChunk['fog_vertex']}
  }
`;

const roadFragment = `
  #define USE_FOG;
  varying vec2 vUv; uniform vec3 uColor; uniform float uTime;
  ${roadMarkings_vars}
  ${THREE.ShaderChunk['fog_pars_fragment']}
  void main() {
    vec2 uv = vUv; vec3 color = vec3(uColor);
    ${roadMarkings_fragment}
    gl_FragColor = vec4(color, 1.);
    ${THREE.ShaderChunk['fog_fragment']}
  }
`;

const islandFragment = `
  #define USE_FOG;
  varying vec2 vUv; uniform vec3 uColor;
  ${THREE.ShaderChunk['fog_pars_fragment']}
  void main() { gl_FragColor = vec4(uColor, 1.); ${THREE.ShaderChunk['fog_fragment']} }
`;

class App {
  options: EffectOptions;
  container: HTMLElement;
  renderer: THREE.WebGLRenderer;
  composer: EffectComposer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  clock: THREE.Clock;
  fogUniforms: any;
  disposed = false;
  hasValidSize = false;
  road!: Road;
  leftCarLights!: CarLights;
  rightCarLights!: CarLights;
  leftSticks!: LightsSticks;
  fovTarget: number;
  speedUpTarget = 0;
  speedUp = 0;
  timeOffset = 0;

  constructor(container: HTMLElement, options: EffectOptions) {
    this.container = container; this.options = options;
    const w = Math.max(1, container.offsetWidth), h = Math.max(1, container.offsetHeight);
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setSize(w, h, false);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.composer = new EffectComposer(this.renderer);
    container.append(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(options.fov, w / h, 0.1, 10000);
    this.camera.position.set(0, 8, -5);
    this.scene = new THREE.Scene();
    this.scene.background = null;

    let fog = new THREE.Fog(options.colors.background, options.length * 0.2, options.length * 500);
    this.scene.fog = fog;
    this.fogUniforms = { fogColor: { value: fog.color }, fogNear: { value: fog.near }, fogFar: { value: fog.far } };
    this.clock = new THREE.Clock();
    this.fovTarget = options.fov;

    this.tick = this.tick.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize);
    this.hasValidSize = w > 0 && h > 0;
  }

  onWindowResize() {
    const w = this.container.offsetWidth, h = this.container.offsetHeight;
    if (w <= 0 || h <= 0) { this.hasValidSize = false; return; }
    this.renderer.setSize(w, h); this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    this.composer.setSize(w, h); this.hasValidSize = true;
  }

  initPasses() {
    const rp = new RenderPass(this.scene, this.camera);
    const bp = new EffectPass(this.camera, new BloomEffect({ luminanceThreshold: 0.2, luminanceSmoothing: 0, resolutionScale: 1 }));
    const sp = new EffectPass(this.camera, new SMAAEffect({ preset: SMAAPreset.MEDIUM }));
    rp.renderToScreen = false; bp.renderToScreen = false; sp.renderToScreen = true;
    this.composer.addPass(rp); this.composer.addPass(bp); this.composer.addPass(sp);
  }

  init() {
    this.initPasses();
    const o = this.options;
    this.road = new Road(this, o); this.road.init();
    this.leftCarLights = new CarLights(this, o, o.colors.leftCars, o.movingAwaySpeed, new THREE.Vector2(0, 1 - o.carLightsFade));
    this.leftCarLights.init(); this.leftCarLights.mesh.position.setX(-o.roadWidth/2 - o.islandWidth/2);
    this.rightCarLights = new CarLights(this, o, o.colors.rightCars, o.movingCloserSpeed, new THREE.Vector2(1, 0 + o.carLightsFade));
    this.rightCarLights.init(); this.rightCarLights.mesh.position.setX(o.roadWidth/2 + o.islandWidth/2);
    this.leftSticks = new LightsSticks(this, o); this.leftSticks.init();
    this.leftSticks.mesh.position.setX(-(o.roadWidth + o.islandWidth/2));
    this.tick();
  }

  update(delta: number) {
    let lp = Math.exp(-(-60 * Math.log2(1 - 0.1)) * delta);
    this.speedUp += lerp(this.speedUp, this.speedUpTarget, lp, 0.00001);
    this.timeOffset += this.speedUp * delta;
    let time = this.clock.elapsedTime + this.timeOffset;
    this.rightCarLights.update(time); this.leftCarLights.update(time); this.leftSticks.update(time); this.road.update(time);

    let updateCamera = false;
    let fc = lerp(this.camera.fov, this.fovTarget, lp);
    if (fc !== 0) { this.camera.fov += fc * delta * 6; updateCamera = true; }

    const distortionObj = (distortions as any)[this.options.distortion] || distortions.turbulentDistortion;
    if (distortionObj.getJS) {
      const d = distortionObj.getJS(0.025, time);
      this.camera.lookAt(this.camera.position.clone().add(d));
      updateCamera = true;
    }
    if (updateCamera) this.camera.updateProjectionMatrix();
  }

  dispose() {
    this.disposed = true; window.removeEventListener('resize', this.onWindowResize);
    this.scene.traverse(o => { (o as any).geometry?.dispose(); if ((o as any).material) { if (Array.isArray((o as any).material)) (o as any).material.forEach((m: any) => m.dispose()); else (o as any).material.dispose(); } });
    this.renderer.dispose(); this.renderer.forceContextLoss();
    if (this.renderer.domElement.parentNode) this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    this.composer.dispose();
  }

  tick() {
    if (this.disposed) return;
    if (!this.hasValidSize) {
      const w = this.container.offsetWidth, h = this.container.offsetHeight;
      if (w > 0 && h > 0) { this.renderer.setSize(w, h, false); this.camera.aspect = w/h; this.camera.updateProjectionMatrix(); this.composer.setSize(w, h); this.hasValidSize = true; }
      else { requestAnimationFrame(this.tick); return; }
    }
    const delta = this.clock.getDelta(); this.composer.render(delta); this.update(delta);
    requestAnimationFrame(this.tick);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// React Component
// ─────────────────────────────────────────────────────────────────────────────
interface HyperspeedProps {
  effectOptions?: Partial<EffectOptions>;
}

export default function Hyperspeed({ effectOptions = {} }: HyperspeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef       = useRef<App | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const options = {
      ...DEFAULT_EFFECT_OPTIONS,
      ...effectOptions,
      colors: { ...DEFAULT_EFFECT_OPTIONS.colors, ...effectOptions.colors }
    } as EffectOptions;

    const myApp = new App(container, options);
    appRef.current = myApp;
    myApp.init();

    return () => {
      if (appRef.current) appRef.current.dispose();
    };
  }, [effectOptions]);

  return <div className="w-full h-full" ref={containerRef}></div>;
}
