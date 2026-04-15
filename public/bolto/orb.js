class OrbRenderer {
    constructor(container, opts = {}) {
        this.container = container;
        this.hue = opts.hue ?? 0;
        this.targetHue = this.hue;
        this.hoverIntensity = opts.hoverIntensity ?? 0.2;
        this.targetIntensity = this.hoverIntensity;
        this.bgColor = opts.backgroundColor ?? [0.02, 0.02, 0.06];
        this.targetHover = 0;
        this.currentHover = 0;
        this.currentRot = 0;
        this.lastTs = 0;
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.container.appendChild(this.canvas);
        this.gl = this.canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false });
        if (!this.gl) { console.warn('WebGL not available'); return; }
        this._build();
        this._resize();
        this._onResize = this._resize.bind(this);
        window.addEventListener('resize', this._onResize);
        this._raf = requestAnimationFrame(this._loop.bind(this));
    }
    static VERT = `
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main(){ vUv=uv; gl_Position=vec4(position,0.0,1.0); }`;
    static FRAG = `
    precision highp float;
    uniform float iTime;
    uniform vec3  iResolution;
    uniform float hue;
    uniform float hover;
    uniform float rot;
    uniform float hoverIntensity;
    uniform vec3  backgroundColor;
    varying vec2  vUv;
    /* ----- Color-space conversion: RGB ↔ YIQ ----- */
    // YIQ is the color model used by NTSC television. Converting to
    // YIQ lets us rotate the hue of any color by simply rotating the
    // I and Q components, then converting back to RGB.
    vec3 rgb2yiq(vec3 c){float y=dot(c,vec3(.299,.587,.114));float i=dot(c,vec3(.596,-.274,-.322));float q=dot(c,vec3(.211,-.523,.312));return vec3(y,i,q);}
    vec3 yiq2rgb(vec3 c){return vec3(c.x+.956*c.y+.621*c.z,c.x-.272*c.y-.647*c.z,c.x-1.106*c.y+1.703*c.z);}
    // adjustHue: rotate a color's hue by 'hueDeg' degrees.
    // 1. Convert RGB → YIQ.
    // 2. Rotate the (I, Q) pair by the hue angle (2D rotation matrix).
    // 3. Convert YIQ → RGB.
    vec3 adjustHue(vec3 color,float hueDeg){float h=hueDeg*3.14159265/180.0;vec3 yiq=rgb2yiq(color);float cosA=cos(h);float sinA=sin(h);float i2=yiq.y*cosA-yiq.z*sinA;float q2=yiq.y*sinA+yiq.z*cosA;yiq.y=i2;yiq.z=q2;return yiq2rgb(yiq);}

    /* ----- 3D Simplex Noise (snoise3) ----- */
    // Simplex noise is a smooth, natural-looking pseudo-random function
    // invented by Ken Perlin. Given a 3D coordinate it returns a value
    // roughly in [-1, 1]. By feeding (uv, time) we get animated,
    // organic-looking variation that drives the orb's wobbly edge.
    //
    // hash33: a cheap hash that maps a vec3 to a pseudo-random vec3 in
    //         [-1, 1]. Used internally by the noise to create random
    //         gradient vectors at each lattice point.
    vec3 hash33(vec3 p3){p3=fract(p3*vec3(.1031,.11369,.13787));p3+=dot(p3,p3.yxz+19.19);return -1.0+2.0*fract(vec3(p3.x+p3.y,p3.x+p3.z,p3.y+p3.z)*p3.zyx);}

    // snoise3: the actual 3D simplex noise implementation.
    // K1 and K2 are the skew/unskew constants for a 3D simplex grid.
    // The function:
    //   1. Skews the input into simplex (tetrahedral) space.
    //   2. Determines which simplex cell the point falls in.
    //   3. Computes distance vectors to each of the cell's 4 corners.
    //   4. For each corner, evaluates a radial falloff kernel multiplied
    //      by the dot product of a pseudo-random gradient and the
    //      distance vector.
    //   5. Sums the contributions and scales to roughly [-1, 1].
    float snoise3(vec3 p){const float K1=.333333333;const float K2=.166666667;vec3 i=floor(p+(p.x+p.y+p.z)*K1);vec3 d0=p-(i-(i.x+i.y+i.z)*K2);vec3 e=step(vec3(0.0),d0-d0.yzx);vec3 i1=e*(1.0-e.zxy);vec3 i2=1.0-e.zxy*(1.0-e);vec3 d1=d0-(i1-K2);vec3 d2=d0-(i2-K1);vec3 d3=d0-0.5;vec4 h=max(0.6-vec4(dot(d0,d0),dot(d1,d1),dot(d2,d2),dot(d3,d3)),0.0);vec4 n=h*h*h*h*vec4(dot(d0,hash33(i)),dot(d1,hash33(i+i1)),dot(d2,hash33(i+i2)),dot(d3,hash33(i+1.0)));return dot(vec4(31.316),n);}

    // extractAlpha: the orb is rendered on a transparent background.
    // This helper takes an RGB color and derives an alpha from the
    // brightest channel. That way fully-black areas become transparent
    // and bright areas become opaque — giving us a soft-edged glow
    // without needing a separate alpha mask.
    vec4 extractAlpha(vec3 c){float a=max(max(c.r,c.g),c.b);return vec4(c/(a+1e-5),a);}

    /* ----- Palette & geometry constants ----- */
    // Three base colors that define the orb's purple-cyan palette.
    // They get hue-shifted at runtime by the 'hue' uniform.
    const vec3 baseColor1=vec3(.611765,.262745,.996078);   // vivid purple
    const vec3 baseColor2=vec3(.298039,.760784,.913725);   // cyan / teal
    const vec3 baseColor3=vec3(.062745,.078431,.600000);   // deep indigo

    const float innerRadius=0.6;   // normalized radius of the orb's inner core
    const float noiseScale=0.65;   // how zoomed-in the noise pattern is

    /* ----- Procedural light falloff helpers ----- */
    // light1: inverse-distance falloff  →  I / (1 + d·a)
    // light2: inverse-square falloff    →  I / (1 + d²·a)
    // 'i' = intensity, 'a' = attenuation, 'd' = distance.
    // These give the orb its glowing highlight spots.
    float light1(float i,float a,float d){return i/(1.0+d*a);}
    float light2(float i,float a,float d){return i/(1.0+d*d*a);}

    /* ----- draw(): the core orb rendering routine ----- */
    // Given a UV coordinate (centered, normalized so the short axis
    // spans -1 to 1), this function returns an RGBA color for that
    // pixel.
    //
    // Step-by-step:
    //   1. Hue-shift the three base colors.
    //   2. Convert the UV to polar-ish helpers (angle and length).
    //   3. Sample 3D simplex noise at (uv, time) to create organic,
    //      time-varying distortion.
    //   4. Compute a wobbly radius (r0) from the noise — this is what
    //      makes the edge of the orb undulate.
    //   5. Calculate multiple light/glow terms:
    //        v0 – main glow field (radial, noise-modulated)
    //        v1 – an orbiting highlight point
    //        v2, v3 – radial fade masks that confine color to the orb
    //   6. Blend the base colors using the angular position (cl) so
    //      the orb shifts between purple and cyan as you go around it.
    //   7. Compose a "dark" version and a "light" version of the orb,
    //      then blend between them based on background luminance so
    //      the orb looks good on both dark and light UIs.
    //   8. Pass the result through extractAlpha to get proper
    //      transparency for compositing.
    vec4 draw(vec2 uv){
        vec3 c1=adjustHue(baseColor1,hue);vec3 c2=adjustHue(baseColor2,hue);vec3 c3=adjustHue(baseColor3,hue);
        float ang=atan(uv.y,uv.x);float len=length(uv);float invLen=len>0.0?1.0/len:0.0;
        float bgLum=dot(backgroundColor,vec3(.299,.587,.114));  // perceptual luminance of the bg
        float n0=snoise3(vec3(uv*noiseScale,iTime*0.5))*0.5+0.5;  // noise remapped to [0,1]
        float r0=mix(mix(innerRadius,1.0,0.4),mix(innerRadius,1.0,0.6),n0);  // wobbly radius
        float d0=distance(uv,(r0*invLen)*uv);  // distance from pixel to the wobbly edge
        float v0=light1(1.0,10.0,d0);          // main radial glow
        v0*=smoothstep(r0*1.05,r0,len);        // hard-ish cutoff just outside the radius
        float innerFade=smoothstep(r0*0.8,r0*0.95,len);  // fade near the center
        v0*=mix(innerFade,1.0,bgLum*0.7);
        float cl=cos(ang+iTime*2.0)*0.5+0.5;  // angular color blend (rotates over time)
        float a2=iTime*-1.0;vec2 pos=vec2(cos(a2),sin(a2))*r0;float d=distance(uv,pos);  // orbiting light
        float v1=light2(1.5,5.0,d);v1*=light1(1.0,50.0,d0);  // highlight with quick falloff
        float v2=smoothstep(1.0,mix(innerRadius,1.0,n0*0.5),len);  // outer fade mask
        float v3=smoothstep(innerRadius,mix(innerRadius,1.0,0.5),len);  // inner→outer ramp
        vec3 colBase=mix(c1,c2,cl);  // angular purple↔cyan blend
        float fadeAmt=mix(1.0,0.1,bgLum);
        // "dark" composite — used on dark backgrounds
        vec3 darkCol=mix(c3,colBase,v0);darkCol=(darkCol+v1)*v2*v3;darkCol=clamp(darkCol,0.0,1.0);
        // "light" composite — blends toward the background color
        vec3 lightCol=(colBase+v1)*mix(1.0,v2*v3,fadeAmt);lightCol=mix(backgroundColor,lightCol,v0);lightCol=clamp(lightCol,0.0,1.0);
        // final mix: lean toward lightCol when the background is bright
        vec3 fc=mix(darkCol,lightCol,bgLum);
        return extractAlpha(fc);
    }

    /* ----- mainImage(): entry point called by main() ----- */
    // Transforms the raw pixel coordinate into a centered, normalized
    // UV, applies rotation and the wavy hover distortion, then calls
    // draw().
    vec4 mainImage(vec2 fragCoord){
        vec2 center=iResolution.xy*0.5;float sz=min(iResolution.x,iResolution.y);
        vec2 uv=(fragCoord-center)/sz*2.0;  // center and normalize UV to [-1,1] on short axis
        // Apply 2D rotation (accumulated while the orb is "active")
        float s2=sin(rot);float c2=cos(rot);uv=vec2(c2*uv.x-s2*uv.y,s2*uv.x+c2*uv.y);
        // Wavy UV distortion driven by 'hover' (0→1 when active)
        uv.x+=hover*hoverIntensity*0.1*sin(uv.y*10.0+iTime);
        uv.y+=hover*hoverIntensity*0.1*sin(uv.x*10.0+iTime);
        return draw(uv);
    }

    /* ----- main(): GLSL entry point ----- */
    // Converts the varying vUv (0-1 range) back to pixel coordinates,
    // calls mainImage(), and writes the final pre-multiplied alpha
    // color to gl_FragColor.
    void main(){
        vec2 fc=vUv*iResolution.xy;vec4 col=mainImage(fc);
        gl_FragColor=vec4(col.rgb*col.a,col.a);
    }`;

    _compile(type, src) {
        const gl = this.gl;
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(s));
            gl.deleteShader(s);
            return null;
        }
        return s;
    }

    _build() {
        const gl = this.gl;
        const vs = this._compile(gl.VERTEX_SHADER, OrbRenderer.VERT);
        const fs = this._compile(gl.FRAGMENT_SHADER, OrbRenderer.FRAG);
        if (!vs || !fs) return;

        this.pgm = gl.createProgram();
        gl.attachShader(this.pgm, vs);
        gl.attachShader(this.pgm, fs);
        gl.linkProgram(this.pgm);
        if (!gl.getProgramParameter(this.pgm, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(this.pgm));
            return;
        }
        gl.useProgram(this.pgm);

        const posLoc = gl.getAttribLocation(this.pgm, 'position');
        const uvLoc  = gl.getAttribLocation(this.pgm, 'uv');

        const posBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        const uvBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 2,0, 0,2]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(uvLoc);
        gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

        this.u = {};
        ['iTime','iResolution','hue','hover','rot','hoverIntensity','backgroundColor'].forEach(name => {
            this.u[name] = gl.getUniformLocation(this.pgm, name);
        });

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0,0,0,0);
    }

    _resize() {
        const dpr = window.devicePixelRatio || 1;
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;
        this.canvas.width  = w * dpr;
        this.canvas.height = h * dpr;
        if (this.gl) this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    _loop(ts) {
        this._raf = requestAnimationFrame(this._loop.bind(this));
        if (!this.pgm) return;
        const gl = this.gl;
        const t = ts * 0.001;
        const dt = this.lastTs ? t - this.lastTs : 0.016;
        this.lastTs = t;

        this.currentHover += (this.targetHover - this.currentHover) * Math.min(dt * 4, 1);
        
        this.hue += (this.targetHue - this.hue) * Math.min(dt * 3, 1);
        this.hoverIntensity += (this.targetIntensity - this.hoverIntensity) * Math.min(dt * 3, 1);

        if (this.currentHover > 0.5) this.currentRot += dt * 0.3;

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(this.pgm);
        gl.uniform1f(this.u.iTime, t);
        gl.uniform3f(this.u.iResolution, this.canvas.width, this.canvas.height, this.canvas.width / this.canvas.height);
        gl.uniform1f(this.u.hue, this.hue);
        gl.uniform1f(this.u.hover, this.currentHover);
        gl.uniform1f(this.u.rot, this.currentRot);
        gl.uniform1f(this.u.hoverIntensity, this.hoverIntensity);
        gl.uniform3f(this.u.backgroundColor, this.bgColor[0], this.bgColor[1], this.bgColor[2]);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    setActive(active) {
        this.targetHover = active ? 1.0 : 0.0;
        const ctn = this.container;
        if (active) ctn.classList.add('active');
        else ctn.classList.remove('active');
    }

    setAIState(state) {
        const ctn = this.container;
        ctn.classList.remove('active', 'speaking', 'thinking');
        
        switch(state) {
            case 'thinking':
                this.targetHover = 0.7;
                this.targetHue = 120; // কালার চেইঞ্জ হয়ে ব্লু/সায়ান হবে
                this.targetIntensity = 0.5; // হালকা ভাইব্রেট করবে
                ctn.classList.add('active', 'thinking');
                break;
            case 'speaking':
                this.targetHover = 1.0;
                this.targetHue = -45; // কালার চেইঞ্জ হয়ে পিংক/রেডিশ হবে
                this.targetIntensity = 0.9; // অনেক বেশি এনার্জেটিক লাগবে
                ctn.classList.add('active', 'speaking');
                break;
            case 'idle':
            default:
                this.targetHover = 0.0;
                this.targetHue = 0; // ডিফল্ট পার্পল/সায়ান কালার
                this.targetIntensity = 0.2; // একদম শান্ত থাকবে
                break;
        }
    }

    destroy() {
        cancelAnimationFrame(this._raf);
        window.removeEventListener('resize', this._onResize);
        if (this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
        const ext = this.gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
    }
}
