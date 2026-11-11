'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { getAccent, onAccent } from '@/lib/accent'

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uPulse;
  uniform vec2 uMouse;
  attribute float aRand;
  varying float vMix;
  varying float vAlpha;

  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main(){
    vec3 p = position;
    float n = snoise(p * 1.4 + vec3(uTime * 0.25, uTime * 0.18, uMouse.x));
    float n2 = snoise(p * 3.2 - uTime * 0.4);
    float d = 1.0 + n * (0.18 + uPulse * 0.25) + n2 * 0.04;
    p *= d;
    p += normalize(position) * aRand * 0.06 * sin(uTime * 2.0 + aRand * 20.0);
    vMix = smoothstep(-0.6, 0.8, n + p.y * 0.4);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (2.7 + aRand * 2.8 + max(n, 0.0) * 4.0) * (3.2 / -mv.z);
    vAlpha = 0.35 + 0.65 * smoothstep(-1.2, 1.2, p.z + n);
  }
`

const fragment = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  varying float vMix;
  varying float vAlpha;
  void main(){
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, r);
    vec3 col = mix(uA, uB, vMix);
    gl_FragColor = vec4(col * (0.8 + glow * 0.6), glow * vAlpha);
  }
`

function Particles({ count, calm }: { count: number; calm: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const { size, setDpr } = useThree()
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const pulse = useRef(0)
  const quality = useRef({ frames: 0, time: 0, level: 0 })

  const [positions, rands] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const rnd = new Float32Array(count)
    const golden = Math.PI * (3 - Math.sqrt(5))
    // ordem embaralhada: cortar o fim do buffer (qualidade baixa) tira pontos da esfera toda, não só de baixo
    const slot = Array.from({ length: count }, (_, i) => i)
    for (let i = count - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[slot[i], slot[j]] = [slot[j], slot[i]]
    }
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const t = golden * i
      const k = slot[i]
      pos[k * 3] = Math.cos(t) * r
      pos[k * 3 + 1] = y
      pos[k * 3 + 2] = Math.sin(t) * r
      rnd[k] = Math.random()
    }
    return [pos, rnd]
  }, [count])

  const uniforms = useMemo(() => {
    const c = getAccent()
    return {
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uA: { value: new THREE.Color(c.a) },
      uB: { value: new THREE.Color(c.b) },
    }
  }, [])

  const target = useRef({ a: new THREE.Color(getAccent().a), b: new THREE.Color(getAccent().b) })

  useEffect(() => {
    const off = onAccent((c) => {
      target.current.a.set(c.a)
      target.current.b.set(c.b)
      pulse.current = 1
    })
    const move = (e: PointerEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', move)
    return () => {
      off()
      window.removeEventListener('pointermove', move)
    }
  }, [])

  useFrame((_, dt) => {
    const pts = ref.current
    if (!pts) return
    // Qualidade adaptativa: mede ~1 s de quadros; se ficar abaixo de ~50 fps, baixa a resolução
    // e depois corta partículas. Nunca sobe de volta (evita ficar oscilando).
    const q = quality.current
    if (q.level < 2) {
      q.frames++
      q.time += Math.min(dt, 0.1)
      if (q.frames >= 60) {
        if (q.time / q.frames > 1 / 50) {
          q.level++
          if (q.level === 1) setDpr(1)
          else pts.geometry.setDrawRange(0, Math.floor(count * 0.55))
        }
        q.frames = 0
        q.time = 0
      }
    }
    const m = mouse.current
    m.x += (m.tx - m.x) * 0.04
    m.y += (m.ty - m.y) * 0.04
    pulse.current *= 0.97
    uniforms.uTime.value += calm ? dt * 0.35 : dt
    uniforms.uPulse.value = pulse.current
    uniforms.uMouse.value.set(m.x, m.y)
    uniforms.uA.value.lerp(target.current.a, 0.04)
    uniforms.uB.value.lerp(target.current.b, 0.04)

    const vh = window.innerHeight
    const prog = Math.min(window.scrollY / vh, 1.4)
    const mobile = size.width < 768
    pts.rotation.y += dt * 0.08
    pts.rotation.x = m.y * 0.35
    pts.rotation.z = m.x * 0.15
    const s = (mobile ? 1.05 : 1.55) - prog * 0.35
    pts.scale.setScalar(s)
    pts.position.x = mobile ? 0 : 1.6 + prog * 0.5 + m.x * 0.15
    pts.position.y = (mobile ? 0.6 : 0) + prog * 0.6 - m.y * 0.1
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRand" args={[rands, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function Orb({ calm = false }: { calm?: boolean }) {
  const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 3500 : 7000
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} dpr={[1, 1.25]} gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}>
        <Particles count={count} calm={calm} />
      </Canvas>
    </div>
  )
}
