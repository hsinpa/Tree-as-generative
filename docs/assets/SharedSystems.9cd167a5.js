var Ye=Object.defineProperty,Je=Object.defineProperties;var Xe=Object.getOwnPropertyDescriptors;var M=Object.getOwnPropertySymbols;var X=Object.prototype.hasOwnProperty,Q=Object.prototype.propertyIsEnumerable;var J=(s,e,t)=>e in s?Ye(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t,f=(s,e)=>{for(var t in e||(e={}))X.call(e,t)&&J(s,t,e[t]);if(M)for(var t of M(e))Q.call(e,t)&&J(s,t,e[t]);return s},C=(s,e)=>Je(s,Xe(e));var U=(s,e)=>{var t={};for(var r in s)X.call(s,r)&&e.indexOf(r)<0&&(t[r]=s[r]);if(s!=null&&M)for(var r of M(s))e.indexOf(r)<0&&Q.call(s,r)&&(t[r]=s[r]);return t};import{S as Qe,s as le,q as ue,aa as Ze,c as de,M as v,E as d,e as H,ab as ce,f as he,m as y,ac as et,R as L,ad as fe,ae as tt,d as g,a5 as m,a7 as E,w as pe,p as Z,af as rt,h as ee,i as S,a8 as D,ag as P,a2 as T,Y as R,ah as st,a as nt,C as G,ai as me,aj as ge,ak as ve,j as xe,al as at,P as it,B as ot,T as te,W as _e,am as re,g as lt,v as ut,an as dt}from"./index.e376c1db.js";import{S as be,T as se,B as ct,c as ht}from"./colorToUniform.a5c1cc9d.js";const ye=class O extends Qe{constructor(e){e=f(f({},O.defaultOptions),e),super(e),this.enabled=!0,this._state=be.for2d(),this.blendMode=e.blendMode,this.padding=e.padding,typeof e.antialias=="boolean"?this.antialias=e.antialias?"on":"off":this.antialias=e.antialias,this.resolution=e.resolution,this.blendRequired=e.blendRequired,this.clipToViewport=e.clipToViewport,this.addResource("uTexture",0,1)}apply(e,t,r,n){e.applyFilter(this,t,r,n)}get blendMode(){return this._state.blendMode}set blendMode(e){this._state.blendMode=e}static from(e){const l=e,{gpu:t,gl:r}=l,n=U(l,["gpu","gl"]);let a,i;return t&&(a=le.from(t)),r&&(i=ue.from(r)),new O(f({gpuProgram:a,glProgram:i},n))}};ye.defaultOptions={blendMode:"normal",resolution:1,padding:0,antialias:"off",blendRequired:!1,clipToViewport:!0};let ft=ye;var pt=`in vec2 vMaskCoord;
in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform sampler2D uMaskTexture;

uniform float uAlpha;
uniform vec4 uMaskClamp;
uniform float uInverse;

out vec4 finalColor;

void main(void)
{
    float clip = step(3.5,
        step(uMaskClamp.x, vMaskCoord.x) +
        step(uMaskClamp.y, vMaskCoord.y) +
        step(vMaskCoord.x, uMaskClamp.z) +
        step(vMaskCoord.y, uMaskClamp.w));

    // TODO look into why this is needed
    float npmAlpha = uAlpha;
    vec4 original = texture(uTexture, vTextureCoord);
    vec4 masky = texture(uMaskTexture, vMaskCoord);
    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);

    float a = alphaMul * masky.r * npmAlpha * clip;

    if (uInverse == 1.0) {
        a = 1.0 - a;
    }

    finalColor = original * a;
}
`,mt=`in vec2 aPosition;

out vec2 vTextureCoord;
out vec2 vMaskCoord;


uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;
uniform mat3 uFilterMatrix;

vec4 filterVertexPosition(  vec2 aPosition )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
       
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord(  vec2 aPosition )
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

vec2 getFilterCoord( vec2 aPosition )
{
    return  ( uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;
}   

void main(void)
{
    gl_Position = filterVertexPosition(aPosition);
    vTextureCoord = filterTextureCoord(aPosition);
    vMaskCoord = getFilterCoord(aPosition);
}
`,ne=`struct GlobalFilterUniforms {
  uInputSize:vec4<f32>,
  uInputPixel:vec4<f32>,
  uInputClamp:vec4<f32>,
  uOutputFrame:vec4<f32>,
  uGlobalFrame:vec4<f32>,
  uOutputTexture:vec4<f32>,
};

struct MaskUniforms {
  uFilterMatrix:mat3x3<f32>,
  uMaskClamp:vec4<f32>,
  uAlpha:f32,
  uInverse:f32,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler : sampler;

@group(1) @binding(0) var<uniform> filterUniforms : MaskUniforms;
@group(1) @binding(1) var uMaskTexture: texture_2d<f32>;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) filterUv : vec2<f32>,
};

fn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

fn globalTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
  return  (aPosition.xy / gfu.uGlobalFrame.zw) + (gfu.uGlobalFrame.xy / gfu.uGlobalFrame.zw);
}

fn getFilterCoord(aPosition:vec2<f32> ) -> vec2<f32>
{
  return ( filterUniforms.uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;
}

fn getSize() -> vec2<f32>
{
  return gfu.uGlobalFrame.zw;
}

@vertex
fn mainVertex(
  @location(0) aPosition : vec2<f32>,
) -> VSOutput {
  return VSOutput(
   filterVertexPosition(aPosition),
   filterTextureCoord(aPosition),
   getFilterCoord(aPosition)
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) filterUv: vec2<f32>,
  @builtin(position) position: vec4<f32>
) -> @location(0) vec4<f32> {

    var maskClamp = filterUniforms.uMaskClamp;
    var uAlpha = filterUniforms.uAlpha;

    var clip = step(3.5,
      step(maskClamp.x, filterUv.x) +
      step(maskClamp.y, filterUv.y) +
      step(filterUv.x, maskClamp.z) +
      step(filterUv.y, maskClamp.w));

    var mask = textureSample(uMaskTexture, uSampler, filterUv);
    var source = textureSample(uTexture, uSampler, uv);
    var alphaMul = 1.0 - uAlpha * (1.0 - mask.a);

    var a: f32 = alphaMul * mask.r * uAlpha * clip;

    if (filterUniforms.uInverse == 1.0) {
        a = 1.0 - a;
    }

    return source * a;
}
`;class gt extends ft{constructor(e){const o=e,{sprite:t}=o,r=U(o,["sprite"]),n=new Ze(t.texture),a=new de({uFilterMatrix:{value:new v,type:"mat3x3<f32>"},uMaskClamp:{value:n.uClampFrame,type:"vec4<f32>"},uAlpha:{value:1,type:"f32"},uInverse:{value:e.inverse?1:0,type:"f32"}}),i=le.from({vertex:{source:ne,entryPoint:"mainVertex"},fragment:{source:ne,entryPoint:"mainFragment"}}),l=ue.from({vertex:mt,fragment:pt,name:"mask-filter"});super(C(f({},r),{gpuProgram:i,glProgram:l,resources:{filterUniforms:a,uMaskTexture:t.texture.source}})),this.sprite=t,this._textureMatrix=n}set inverse(e){this.resources.filterUniforms.uniforms.uInverse=e?1:0}get inverse(){return this.resources.filterUniforms.uniforms.uInverse===1}apply(e,t,r,n){this._textureMatrix.texture=this.sprite.texture,e.calculateSpriteMatrix(this.resources.filterUniforms.uniforms.uFilterMatrix,this.sprite).prepend(this._textureMatrix.mapCoord),this.resources.uMaskTexture=this.sprite.texture.source,e.applyFilter(this,t,r,n)}}const W=class Te{constructor(e,t){var r,n;this.state=be.for2d(),this._batchersByInstructionSet=Object.create(null),this._activeBatches=Object.create(null),this.renderer=e,this._adaptor=t,(n=(r=this._adaptor).init)==null||n.call(r,this)}static getBatcher(e){return new this._availableBatchers[e]}buildStart(e){let t=this._batchersByInstructionSet[e.uid];t||(t=this._batchersByInstructionSet[e.uid]=Object.create(null),t.default||(t.default=new ce)),this._activeBatches=t,this._activeBatch=this._activeBatches.default;for(const r in this._activeBatches)this._activeBatches[r].begin()}addToBatch(e,t){if(this._activeBatch.name!==e.batcherName){this._activeBatch.break(t);let r=this._activeBatches[e.batcherName];r||(r=this._activeBatches[e.batcherName]=Te.getBatcher(e.batcherName),r.begin()),this._activeBatch=r}this._activeBatch.add(e)}break(e){this._activeBatch.break(e)}buildEnd(e){this._activeBatch.break(e);const t=this._activeBatches;for(const r in t){const n=t[r],a=n.geometry;a.indexBuffer.setDataWithSize(n.indexBuffer,n.indexSize,!0),a.buffers[0].setDataWithSize(n.attributeBuffer.float32View,n.attributeSize,!1)}}upload(e){const t=this._batchersByInstructionSet[e.uid];for(const r in t){const n=t[r],a=n.geometry;n.dirty&&(n.dirty=!1,a.buffers[0].update(n.attributeSize*4))}}execute(e){if(e.action==="startBatch"){const t=e.batcher,r=t.geometry,n=t.shader;this._adaptor.start(this,r,n)}this._adaptor.execute(this,e)}destroy(){this.state=null,this.renderer=null,this._adaptor=null;for(const e in this._activeBatches)this._activeBatches[e].destroy();this._activeBatches=null}};W.extension={type:[d.WebGLPipes,d.WebGPUPipes,d.CanvasPipes],name:"batch"};W._availableBatchers=Object.create(null);let ke=W;H.handleByMap(d.Batcher,ke._availableBatchers);H.add(ce);const $t={name:"texture-bit",vertex:{header:`

        struct TextureUniforms {
            uTextureMatrix:mat3x3<f32>,
        }

        @group(2) @binding(2) var<uniform> textureUniforms : TextureUniforms;
        `,main:`
            uv = (textureUniforms.uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
            @group(2) @binding(0) var uTexture: texture_2d<f32>;
            @group(2) @binding(1) var uSampler: sampler;

         
        `,main:`
            outColor = textureSample(uTexture, uSampler, vUV);
        `}},Kt={name:"texture-bit",vertex:{header:`
            uniform mat3 uTextureMatrix;
        `,main:`
            uv = (uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
        uniform sampler2D uTexture;

         
        `,main:`
            outColor = texture(uTexture, vUV);
        `}};function vt(s,e){const t=s.root,r=s.instructionSet;r.reset();const n=e.renderPipes?e:e.batch.renderer,a=n.renderPipes;a.batch.buildStart(r),a.blendMode.buildStart(),a.colorMask.buildStart(),t.sortableChildren&&t.sortChildren(),Me(t,r,n,!0),a.batch.buildEnd(r),a.blendMode.buildEnd(r)}function B(s,e,t){const r=t.renderPipes?t:t.batch.renderer;s.globalDisplayStatus<7||!s.includeInBuild||(s.sortableChildren&&s.sortChildren(),s.isSimple?xt(s,e,r):Me(s,e,r,!1))}function xt(s,e,t){if(s.renderPipeId){const r=s,{renderPipes:n,renderableGC:a}=t;n.blendMode.setBlendMode(r,s.groupBlendMode,e),n[r.renderPipeId].addRenderable(r,e),a.addRenderable(r,e),r.didViewUpdate=!1}if(!s.renderGroup){const r=s.children,n=r.length;for(let a=0;a<n;a++)B(r[a],e,t)}}function Me(s,e,t,r){const{renderPipes:n,renderableGC:a}=t;if(!r&&s.renderGroup)n.renderGroup.addRenderGroup(s.renderGroup,e);else{for(let u=0;u<s.effects.length;u++){const c=s.effects[u];n[c.pipe].push(c,s,e)}const i=s,l=i.renderPipeId;l&&(n.blendMode.setBlendMode(i,i.groupBlendMode,e),n[l].addRenderable(i,e),a.addRenderable(i,e),i.didViewUpdate=!1);const o=s.children;if(o.length)for(let u=0;u<o.length;u++)B(o[u],e,t);for(let u=s.effects.length-1;u>=0;u--){const c=s.effects[u];n[c.pipe].pop(c,s,e)}}}const _t=new he;class bt extends fe{constructor(){super(),this.filters=[new gt({sprite:new tt(g.EMPTY),inverse:!1,resolution:"inherit",antialias:"inherit"})]}get sprite(){return this.filters[0].sprite}set sprite(e){this.filters[0].sprite=e}get inverse(){return this.filters[0].inverse}set inverse(e){this.filters[0].inverse=e}}class Ce{constructor(e){this._activeMaskStage=[],this._renderer=e}push(e,t,r){const n=this._renderer;if(n.renderPipes.batch.break(r),r.add({renderPipeId:"alphaMask",action:"pushMaskBegin",mask:e,inverse:t._maskOptions.inverse,canBundle:!1,maskedContainer:t}),e.inverse=t._maskOptions.inverse,e.renderMaskToTexture){const a=e.mask;a.includeInBuild=!0,B(a,r,n),a.includeInBuild=!1}n.renderPipes.batch.break(r),r.add({renderPipeId:"alphaMask",action:"pushMaskEnd",mask:e,maskedContainer:t,inverse:t._maskOptions.inverse,canBundle:!1})}pop(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"alphaMask",action:"popMaskEnd",mask:e,inverse:t._maskOptions.inverse,canBundle:!1})}execute(e){const t=this._renderer,r=e.mask.renderMaskToTexture;if(e.action==="pushMaskBegin"){const n=y.get(bt);if(n.inverse=e.inverse,r){e.mask.mask.measurable=!0;const a=et(e.mask.mask,!0,_t);e.mask.mask.measurable=!1,a.ceil();const i=t.renderTarget.renderTarget.colorTexture.source,l=se.getOptimalTexture(a.width,a.height,i._resolution,i.antialias);t.renderTarget.push(l,!0),t.globalUniforms.push({offset:a,worldColor:4294967295});const o=n.sprite;o.texture=l,o.worldTransform.tx=a.minX,o.worldTransform.ty=a.minY,this._activeMaskStage.push({filterEffect:n,maskedContainer:e.maskedContainer,filterTexture:l})}else n.sprite=e.mask.mask,this._activeMaskStage.push({filterEffect:n,maskedContainer:e.maskedContainer})}else if(e.action==="pushMaskEnd"){const n=this._activeMaskStage[this._activeMaskStage.length-1];r&&(t.type===L.WEBGL&&t.renderTarget.finishRenderPass(),t.renderTarget.pop(),t.globalUniforms.pop()),t.filter.push({renderPipeId:"filter",action:"pushFilter",container:n.maskedContainer,filterEffect:n.filterEffect,canBundle:!1})}else if(e.action==="popMaskEnd"){t.filter.pop();const n=this._activeMaskStage.pop();r&&se.returnTexture(n.filterTexture),y.return(n.filterEffect)}}destroy(){this._renderer=null,this._activeMaskStage=null}}Ce.extension={type:[d.WebGLPipes,d.WebGPUPipes,d.CanvasPipes],name:"alphaMask"};class Se{constructor(e){this._colorStack=[],this._colorStackIndex=0,this._currentColor=0,this._renderer=e}buildStart(){this._colorStack[0]=15,this._colorStackIndex=1,this._currentColor=15}push(e,t,r){this._renderer.renderPipes.batch.break(r);const a=this._colorStack;a[this._colorStackIndex]=a[this._colorStackIndex-1]&e.mask;const i=this._colorStack[this._colorStackIndex];i!==this._currentColor&&(this._currentColor=i,r.add({renderPipeId:"colorMask",colorMask:i,canBundle:!1})),this._colorStackIndex++}pop(e,t,r){this._renderer.renderPipes.batch.break(r);const a=this._colorStack;this._colorStackIndex--;const i=a[this._colorStackIndex-1];i!==this._currentColor&&(this._currentColor=i,r.add({renderPipeId:"colorMask",colorMask:i,canBundle:!1}))}execute(e){this._renderer.colorMask.setMask(e.colorMask)}destroy(){this._colorStack=null}}Se.extension={type:[d.WebGLPipes,d.WebGPUPipes,d.CanvasPipes],name:"colorMask"};class we{constructor(e){this._maskStackHash={},this._maskHash=new WeakMap,this._renderer=e}push(e,t,r){var h;var n;const a=e,i=this._renderer;i.renderPipes.batch.break(r),i.renderPipes.blendMode.setBlendMode(a.mask,"none",r),r.add({renderPipeId:"stencilMask",action:"pushMaskBegin",mask:e,inverse:t._maskOptions.inverse,canBundle:!1});const l=a.mask;l.includeInBuild=!0,this._maskHash.has(a)||this._maskHash.set(a,{instructionsStart:0,instructionsLength:0});const o=this._maskHash.get(a);o.instructionsStart=r.instructionSize,B(l,r,i),l.includeInBuild=!1,i.renderPipes.batch.break(r),r.add({renderPipeId:"stencilMask",action:"pushMaskEnd",mask:e,inverse:t._maskOptions.inverse,canBundle:!1});const u=r.instructionSize-o.instructionsStart-1;o.instructionsLength=u;const c=i.renderTarget.renderTarget.uid;(h=(n=this._maskStackHash)[c])!=null||(n[c]=0)}pop(e,t,r){const n=e,a=this._renderer;a.renderPipes.batch.break(r),a.renderPipes.blendMode.setBlendMode(n.mask,"none",r),r.add({renderPipeId:"stencilMask",action:"popMaskBegin",inverse:t._maskOptions.inverse,canBundle:!1});const i=this._maskHash.get(e);for(let l=0;l<i.instructionsLength;l++)r.instructions[r.instructionSize++]=r.instructions[i.instructionsStart++];r.add({renderPipeId:"stencilMask",action:"popMaskEnd",canBundle:!1})}execute(e){var i;var t;const r=this._renderer,n=r.renderTarget.renderTarget.uid;let a=(i=(t=this._maskStackHash)[n])!=null?i:t[n]=0;e.action==="pushMaskBegin"?(r.renderTarget.ensureDepthStencil(),r.stencil.setStencilMode(m.RENDERING_MASK_ADD,a),a++,r.colorMask.setMask(0)):e.action==="pushMaskEnd"?(e.inverse?r.stencil.setStencilMode(m.INVERSE_MASK_ACTIVE,a):r.stencil.setStencilMode(m.MASK_ACTIVE,a),r.colorMask.setMask(15)):e.action==="popMaskBegin"?(r.colorMask.setMask(0),a!==0?r.stencil.setStencilMode(m.RENDERING_MASK_REMOVE,a):(r.renderTarget.clear(null,E.STENCIL),r.stencil.setStencilMode(m.DISABLED,a)),a--):e.action==="popMaskEnd"&&(e.inverse?r.stencil.setStencilMode(m.INVERSE_MASK_ACTIVE,a):r.stencil.setStencilMode(m.MASK_ACTIVE,a),r.colorMask.setMask(15)),this._maskStackHash[n]=a}destroy(){this._renderer=null,this._maskStackHash=null,this._maskHash=null}}we.extension={type:[d.WebGLPipes,d.WebGPUPipes,d.CanvasPipes],name:"stencilMask"};function Yt(s,e){var t,r,n;for(const a in s.attributes){const i=s.attributes[a],l=e[a];l?((t=i.format)!=null||(i.format=l.format),(r=i.offset)!=null||(i.offset=l.offset),(n=i.instance)!=null||(i.instance=l.instance)):pe(`Attribute ${a} is not present in the shader, but is present in the geometry. Unable to infer attribute details.`)}yt(s)}function yt(s){var a,i;const{buffers:e,attributes:t}=s,r={},n={};for(const l in e){const o=e[l];r[o.uid]=0,n[o.uid]=0}for(const l in t){const o=t[l];r[o.buffer.uid]+=Z(o.format).stride}for(const l in t){const o=t[l];(a=o.stride)!=null||(o.stride=r[o.buffer.uid]),(i=o.start)!=null||(o.start=n[o.buffer.uid]),n[o.buffer.uid]+=Z(o.format).stride}}const _=[];_[m.NONE]=void 0;_[m.DISABLED]={stencilWriteMask:0,stencilReadMask:0};_[m.RENDERING_MASK_ADD]={stencilFront:{compare:"equal",passOp:"increment-clamp"},stencilBack:{compare:"equal",passOp:"increment-clamp"}};_[m.RENDERING_MASK_REMOVE]={stencilFront:{compare:"equal",passOp:"decrement-clamp"},stencilBack:{compare:"equal",passOp:"decrement-clamp"}};_[m.MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"equal",passOp:"keep"},stencilBack:{compare:"equal",passOp:"keep"}};_[m.INVERSE_MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"not-equal",passOp:"replace"},stencilBack:{compare:"not-equal",passOp:"replace"}};class Jt{constructor(e){this._syncFunctionHash=Object.create(null),this._adaptor=e,this._systemCheck()}_systemCheck(){if(!rt())throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.")}ensureUniformGroup(e){const t=this.getUniformGroupData(e);e.buffer||(e.buffer=new ee({data:new Float32Array(t.layout.size/4),usage:S.UNIFORM|S.COPY_DST}))}getUniformGroupData(e){return this._syncFunctionHash[e._signature]||this._initUniformGroup(e)}_initUniformGroup(e){const t=e._signature;let r=this._syncFunctionHash[t];if(!r){const n=Object.keys(e.uniformStructures).map(l=>e.uniformStructures[l]),a=this._adaptor.createUboElements(n),i=this._generateUboSync(a.uboElements);r=this._syncFunctionHash[t]={layout:a,syncFunction:i}}return this._syncFunctionHash[t]}_generateUboSync(e){return this._adaptor.generateUboSync(e)}syncUniformGroup(e,t,r){const n=this.getUniformGroupData(e);return e.buffer||(e.buffer=new ee({data:new Float32Array(n.layout.size/4),usage:S.UNIFORM|S.COPY_DST})),t||(t=e.buffer.data),r||(r=0),n.syncFunction(e.uniforms,t,r),!0}updateUniformGroup(e){if(e.isStatic&&!e._dirtyId)return!1;e._dirtyId=0;const t=this.syncUniformGroup(e);return e.buffer.update(),t}destroy(){this._syncFunctionHash=null}}const w=[{type:"mat3x3<f32>",test:s=>s.value.a!==void 0,ubo:`
            var matrix = uv[name].toArray(true);
            data[offset] = matrix[0];
            data[offset + 1] = matrix[1];
            data[offset + 2] = matrix[2];
            data[offset + 4] = matrix[3];
            data[offset + 5] = matrix[4];
            data[offset + 6] = matrix[5];
            data[offset + 8] = matrix[6];
            data[offset + 9] = matrix[7];
            data[offset + 10] = matrix[8];
        `,uniform:`
            gl.uniformMatrix3fv(ud[name].location, false, uv[name].toArray(true));
        `},{type:"vec4<f32>",test:s=>s.type==="vec4<f32>"&&s.size===1&&s.value.width!==void 0,ubo:`
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
            data[offset + 2] = v.width;
            data[offset + 3] = v.height;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height) {
                cv[0] = v.x;
                cv[1] = v.y;
                cv[2] = v.width;
                cv[3] = v.height;
                gl.uniform4f(ud[name].location, v.x, v.y, v.width, v.height);
            }
        `},{type:"vec2<f32>",test:s=>s.type==="vec2<f32>"&&s.size===1&&s.value.x!==void 0,ubo:`
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y) {
                cv[0] = v.x;
                cv[1] = v.y;
                gl.uniform2f(ud[name].location, v.x, v.y);
            }
        `},{type:"vec4<f32>",test:s=>s.type==="vec4<f32>"&&s.size===1&&s.value.red!==void 0,ubo:`
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
            data[offset + 3] = v.alpha;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue || cv[3] !== v.alpha) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                cv[3] = v.alpha;
                gl.uniform4f(ud[name].location, v.red, v.green, v.blue, v.alpha);
            }
        `},{type:"vec3<f32>",test:s=>s.type==="vec3<f32>"&&s.size===1&&s.value.red!==void 0,ubo:`
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                gl.uniform3f(ud[name].location, v.red, v.green, v.blue);
            }
        `}];function Xt(s,e,t,r){const n=[`
        var v = null;
        var v2 = null;
        var t = 0;
        var index = 0;
        var name = null;
        var arrayOffset = null;
    `];let a=0;for(let l=0;l<s.length;l++){const o=s[l],u=o.data.name;let c=!1,h=0;for(let p=0;p<w.length;p++)if(w[p].test(o.data)){h=o.offset/4,n.push(`name = "${u}";`,`offset += ${h-a};`,w[p][e]||w[p].ubo),c=!0;break}if(!c)if(o.data.size>1)h=o.offset/4,n.push(t(o,h-a));else{const p=r[o.data.type];h=o.offset/4,n.push(`
                    v = uv.${u};
                    offset += ${h-a};
                    ${p};
                `)}a=h}const i=n.join(`
`);return new Function("uv","data","offset",i)}function x(s,e){return`
        for (let i = 0; i < ${s*e}; i++) {
            data[offset + (((i / ${s})|0) * 4) + (i % ${s})] = v[i];
        }
    `}const Tt={f32:`
        data[offset] = v;`,i32:`
        data[offset] = v;`,"vec2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];`,"vec3<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];`,"vec4<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];`,"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 4] = v[2];
        data[offset + 5] = v[3];`,"mat3x3<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 4] = v[3];
        data[offset + 5] = v[4];
        data[offset + 6] = v[5];
        data[offset + 8] = v[6];
        data[offset + 9] = v[7];
        data[offset + 10] = v[8];`,"mat4x4<f32>":`
        for (let i = 0; i < 16; i++) {
            data[offset + i] = v[i];
        }`,"mat3x2<f32>":x(3,2),"mat4x2<f32>":x(4,2),"mat2x3<f32>":x(2,3),"mat4x3<f32>":x(4,3),"mat2x4<f32>":x(2,4),"mat3x4<f32>":x(3,4)},Qt=C(f({},Tt),{"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];
    `});function kt(s,e,t,r,n,a){const i=a?1:-1;return s.identity(),s.a=1/r*2,s.d=i*(1/n*2),s.tx=-1-e*s.a,s.ty=-i-t*s.d,s}const b=new Map;function Pe(s,e){if(!b.has(s)){const t=new g({source:new D(f({resource:s},e))}),r=()=>{b.get(s)===t&&b.delete(s)};t.once("destroy",r),t.source.once("destroy",r),b.set(s,t)}return b.get(s)}function Mt(s){const e=s.colorTexture.source.resource;return globalThis.HTMLCanvasElement&&e instanceof HTMLCanvasElement&&document.body.contains(e)}const Re=class Ge{constructor(e={}){if(this.uid=P("renderTarget"),this.colorTextures=[],this.dirtyId=0,this.isRoot=!1,this._size=new Float32Array(2),this._managedColorTextures=!1,e=f(f({},Ge.defaultOptions),e),this.stencil=e.stencil,this.depth=e.depth,this.isRoot=e.isRoot,typeof e.colorTextures=="number"){this._managedColorTextures=!0;for(let t=0;t<e.colorTextures;t++)this.colorTextures.push(new T({width:e.width,height:e.height,resolution:e.resolution,antialias:e.antialias}))}else{this.colorTextures=[...e.colorTextures.map(r=>r.source)];const t=this.colorTexture.source;this.resize(t.width,t.height,t._resolution)}this.colorTexture.source.on("resize",this.onSourceResize,this),(e.depthStencilTexture||this.stencil)&&(e.depthStencilTexture instanceof g||e.depthStencilTexture instanceof T?this.depthStencilTexture=e.depthStencilTexture.source:this.ensureDepthStencilTexture())}get size(){const e=this._size;return e[0]=this.pixelWidth,e[1]=this.pixelHeight,e}get width(){return this.colorTexture.source.width}get height(){return this.colorTexture.source.height}get pixelWidth(){return this.colorTexture.source.pixelWidth}get pixelHeight(){return this.colorTexture.source.pixelHeight}get resolution(){return this.colorTexture.source._resolution}get colorTexture(){return this.colorTextures[0]}onSourceResize(e){this.resize(e.width,e.height,e._resolution,!0)}ensureDepthStencilTexture(){this.depthStencilTexture||(this.depthStencilTexture=new T({width:this.width,height:this.height,resolution:this.resolution,format:"depth24plus-stencil8",autoGenerateMipmaps:!1,antialias:!1,mipLevelCount:1}))}resize(e,t,r=this.resolution,n=!1){this.dirtyId++,this.colorTextures.forEach((a,i)=>{n&&i===0||a.source.resize(e,t,r)}),this.depthStencilTexture&&this.depthStencilTexture.source.resize(e,t,r)}destroy(){this.colorTexture.source.off("resize",this.onSourceResize,this),this._managedColorTextures&&this.colorTextures.forEach(e=>{e.destroy()}),this.depthStencilTexture&&(this.depthStencilTexture.destroy(),delete this.depthStencilTexture)}};Re.defaultOptions={width:0,height:0,resolution:1,colorTextures:1,stencil:!1,depth:!1,antialias:!1,isRoot:!1};let F=Re;class Zt{constructor(e){this.rootViewPort=new R,this.viewport=new R,this.onRenderTargetChange=new st("onRenderTargetChange"),this.projectionMatrix=new v,this.defaultClearColor=[0,0,0,0],this._renderSurfaceToRenderTargetHash=new Map,this._gpuRenderTargetHash=Object.create(null),this._renderTargetStack=[],this._renderer=e,e.renderableGC.addManagedHash(this,"_gpuRenderTargetHash")}finishRenderPass(){this.adaptor.finishRenderPass(this.renderTarget)}renderStart({target:e,clear:t,clearColor:r,frame:n}){this._renderTargetStack.length=0,this.push(e,t,r,n),this.rootViewPort.copyFrom(this.viewport),this.rootRenderTarget=this.renderTarget,this.renderingToScreen=Mt(this.rootRenderTarget)}postrender(){var e,t;(t=(e=this.adaptor).postrender)==null||t.call(e,this.rootRenderTarget)}bind(e,t=!0,r,n){const a=this.getRenderTarget(e),i=this.renderTarget!==a;this.renderTarget=a,this.renderSurface=e;const l=this.getGpuRenderTarget(a);(a.pixelWidth!==l.width||a.pixelHeight!==l.height)&&(this.adaptor.resizeGpuRenderTarget(a),l.width=a.pixelWidth,l.height=a.pixelHeight);const o=a.colorTexture,u=this.viewport,c=o.pixelWidth,h=o.pixelHeight;if(!n&&e instanceof g&&(n=e.frame),n){const p=o._resolution;u.x=n.x*p+.5|0,u.y=n.y*p+.5|0,u.width=n.width*p+.5|0,u.height=n.height*p+.5|0}else u.x=0,u.y=0,u.width=c,u.height=h;return kt(this.projectionMatrix,0,0,u.width/o.resolution,u.height/o.resolution,!a.isRoot),this.adaptor.startRenderPass(a,t,r,u),i&&this.onRenderTargetChange.emit(a),a}clear(e,t=E.ALL,r){!t||(e&&(e=this.getRenderTarget(e)),this.adaptor.clear(e||this.renderTarget,t,r,this.viewport))}contextChange(){this._gpuRenderTargetHash=Object.create(null)}push(e,t=E.ALL,r,n){const a=this.bind(e,t,r,n);return this._renderTargetStack.push({renderTarget:a,frame:n}),a}pop(){this._renderTargetStack.pop();const e=this._renderTargetStack[this._renderTargetStack.length-1];this.bind(e.renderTarget,!1,null,e.frame)}getRenderTarget(e){var t;return e.isTexture&&(e=e.source),(t=this._renderSurfaceToRenderTargetHash.get(e))!=null?t:this._initRenderTarget(e)}copyToTexture(e,t,r,n,a){r.x<0&&(n.width+=r.x,a.x-=r.x,r.x=0),r.y<0&&(n.height+=r.y,a.y-=r.y,r.y=0);const{pixelWidth:i,pixelHeight:l}=e;return n.width=Math.min(n.width,i-r.x),n.height=Math.min(n.height,l-r.y),this.adaptor.copyToTexture(e,t,r,n,a)}ensureDepthStencil(){this.renderTarget.stencil||(this.renderTarget.stencil=!0,this.adaptor.startRenderPass(this.renderTarget,!1,null,this.viewport))}destroy(){this._renderer=null,this._renderSurfaceToRenderTargetHash.forEach((e,t)=>{e!==t&&e.destroy()}),this._renderSurfaceToRenderTargetHash.clear(),this._gpuRenderTargetHash=Object.create(null)}_initRenderTarget(e){let t=null;return D.test(e)&&(e=Pe(e).source),e instanceof F?t=e:e instanceof T&&(t=new F({colorTextures:[e]}),D.test(e.source.resource)&&(t.isRoot=!0),e.once("destroy",()=>{t.destroy(),this._renderSurfaceToRenderTargetHash.delete(e);const r=this._gpuRenderTargetHash[t.uid];r&&(this._gpuRenderTargetHash[t.uid]=null,this.adaptor.destroyGpuRenderTarget(r))})),this._renderSurfaceToRenderTargetHash.set(e,t),t}getGpuRenderTarget(e){return this._gpuRenderTargetHash[e.uid]||(this._gpuRenderTargetHash[e.uid]=this.adaptor.initGpuRenderTarget(e))}}class er extends nt{constructor({buffer:e,offset:t,size:r}){super(),this.uid=P("buffer"),this._resourceType="bufferResource",this._touched=0,this._resourceId=P("resource"),this._bufferResource=!0,this.destroyed=!1,this.buffer=e,this.offset=t|0,this.size=r,this.buffer.on("change",this.onBufferChange,this)}onBufferChange(){this._resourceId=P("resource"),this.emit("change",this)}destroy(e=!1){this.destroyed=!0,e&&this.buffer.destroy(),this.emit("change",this),this.buffer=null}}class Be{constructor(e){this._renderer=e}updateRenderable(){}destroyRenderable(){}validateRenderable(){return!1}addRenderable(e,t){this._renderer.renderPipes.batch.break(t),t.add(e)}execute(e){!e.isRenderable||e.render(this._renderer)}destroy(){this._renderer=null}}Be.extension={type:[d.WebGLPipes,d.WebGPUPipes,d.CanvasPipes],name:"customRender"};function Ue(s,e){const t=s.instructionSet,r=t.instructions;for(let n=0;n<t.instructionSize;n++){const a=r[n];e[a.renderPipeId].execute(a)}}class Ae{constructor(e){this._renderer=e}addRenderGroup(e,t){this._renderer.renderPipes.batch.break(t),t.add(e)}execute(e){!e.isRenderable||(this._renderer.globalUniforms.push({worldTransformMatrix:e.worldTransform,worldColor:e.worldColorAlpha}),Ue(e,this._renderer.renderPipes),this._renderer.globalUniforms.pop())}destroy(){this._renderer=null}}Ae.extension={type:[d.WebGLPipes,d.WebGPUPipes,d.CanvasPipes],name:"renderGroup"};function z(s,e){e||(e=0);for(let t=e;t<s.length&&s[t];t++)s[t]=null}function Ie(s,e=[]){e.push(s);for(let t=0;t<s.renderGroupChildren.length;t++)Ie(s.renderGroupChildren[t],e);return e}function Ct(s,e,t){const r=s>>16&255,n=s>>8&255,a=s&255,i=e>>16&255,l=e>>8&255,o=e&255,u=r+(i-r)*t,c=n+(l-n)*t,h=a+(o-a)*t;return(u<<16)+(c<<8)+h}const A=16777215;function Ee(s,e){return s===A||e===A?s+e-A:Ct(s,e,.5)}const St=new G,ae=ve|me|ge;function De(s,e=!1){wt(s);const t=s.childrenToUpdate,r=s.updateTick++;for(const n in t){const a=Number(n),i=t[n],l=i.list,o=i.index;for(let u=0;u<o;u++){const c=l[u];c.parentRenderGroup===s&&c.relativeRenderGroupDepth===a&&Oe(c,r,0)}z(l,o),i.index=0}if(e)for(let n=0;n<s.renderGroupChildren.length;n++)De(s.renderGroupChildren[n],e)}function wt(s){const e=s.root;let t;if(s.renderGroupParent){const r=s.renderGroupParent;s.worldTransform.appendFrom(e.relativeGroupTransform,r.worldTransform),s.worldColor=Ee(e.groupColor,r.worldColor),t=e.groupAlpha*r.worldAlpha}else s.worldTransform.copyFrom(e.localTransform),s.worldColor=e.localColor,t=e.localAlpha;t=t<0?0:t>1?1:t,s.worldAlpha=t,s.worldColorAlpha=s.worldColor+((t*255|0)<<24)}function Oe(s,e,t){if(e===s.updateTick)return;s.updateTick=e,s.didChange=!1;const r=s.localTransform;s.updateLocalTransform();const n=s.parent;if(n&&!n.renderGroup?(t=t|s._updateFlags,s.relativeGroupTransform.appendFrom(r,n.relativeGroupTransform),t&ae&&ie(s,n,t)):(t=s._updateFlags,s.relativeGroupTransform.copyFrom(r),t&ae&&ie(s,St,t)),!s.renderGroup){const a=s.children,i=a.length;for(let u=0;u<i;u++)Oe(a[u],e,t);const l=s.parentRenderGroup,o=s;o.renderPipeId&&!l.structureDidChange&&l.updateRenderable(o)}}function ie(s,e,t){if(t&me){s.groupColor=Ee(s.localColor,e.groupColor);let r=s.localAlpha*e.groupAlpha;r=r<0?0:r>1?1:r,s.groupAlpha=r,s.groupColorAlpha=s.groupColor+((r*255|0)<<24)}t&ge&&(s.groupBlendMode=s.localBlendMode==="inherit"?e.groupBlendMode:s.localBlendMode),t&ve&&(s.globalDisplayStatus=s.localDisplayStatus&e.globalDisplayStatus),s._updateFlags=0}function Pt(s,e){const{list:t,index:r}=s.childrenRenderablesToUpdate;let n=!1;for(let a=0;a<r;a++){const i=t[a];if(n=e[i.renderPipeId].validateRenderable(i),n)break}return s.structureDidChange=n,n}const Rt=new v;class Fe{constructor(e){this._renderer=e}render({container:e,transform:t}){e.isRenderGroup=!0;const r=e.parent,n=e.renderGroup.renderGroupParent;e.parent=null,e.renderGroup.renderGroupParent=null;const a=this._renderer,i=Ie(e.renderGroup,[]);let l=Rt;t&&(l=l.copyFrom(e.renderGroup.localTransform),e.renderGroup.localTransform.copyFrom(t));const o=a.renderPipes;for(let u=0;u<i.length;u++){const c=i[u];c.runOnRender(),c.instructionSet.renderPipes=o,c.structureDidChange?z(c.childrenRenderablesToUpdate.list,0):Pt(c,o),De(c),c.structureDidChange?(c.structureDidChange=!1,vt(c,a)):Gt(c),c.childrenRenderablesToUpdate.index=0,a.renderPipes.batch.upload(c.instructionSet)}a.globalUniforms.start({worldTransformMatrix:t?e.renderGroup.localTransform:e.renderGroup.worldTransform,worldColor:e.renderGroup.worldColorAlpha}),Ue(e.renderGroup,o),o.uniformBatch&&o.uniformBatch.renderEnd(),t&&e.renderGroup.localTransform.copyFrom(l),e.parent=r,e.renderGroup.renderGroupParent=n}destroy(){this._renderer=null}}Fe.extension={type:[d.WebGLSystem,d.WebGPUSystem,d.CanvasSystem],name:"renderGroup"};function Gt(s){const{list:e,index:t}=s.childrenRenderablesToUpdate;for(let r=0;r<t;r++){const n=e[r];n.didViewUpdate&&s.updateRenderable(n)}z(e,t)}class He{constructor(e){this._gpuSpriteHash=Object.create(null),this._destroyRenderableBound=this.destroyRenderable.bind(this),this._renderer=e,this._renderer.renderableGC.addManagedHash(this,"_gpuSpriteHash")}addRenderable(e,t){const r=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,r),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._gpuSpriteHash[e.uid];e.didViewUpdate&&this._updateBatchableSprite(e,t),t._batcher.updateElement(t)}validateRenderable(e){const t=e._texture,r=this._getGpuSprite(e);return r.texture._source!==t._source?!r._batcher.checkAndUpdateTexture(r,t):!1}destroyRenderable(e){const t=this._gpuSpriteHash[e.uid];y.return(t),this._gpuSpriteHash[e.uid]=null,e.off("destroyed",this._destroyRenderableBound)}_updateBatchableSprite(e,t){t.bounds=e.bounds,t.texture=e._texture}_getGpuSprite(e){return this._gpuSpriteHash[e.uid]||this._initGPUSprite(e)}_initGPUSprite(e){const t=y.get(ct);return t.renderable=e,t.transform=e.groupTransform,t.texture=e._texture,t.bounds=e.bounds,t.roundPixels=this._renderer._roundPixels|e._roundPixels,this._gpuSpriteHash[e.uid]=t,e.on("destroyed",this._destroyRenderableBound),t}destroy(){for(const e in this._gpuSpriteHash)y.return(this._gpuSpriteHash[e]);this._gpuSpriteHash=null,this._renderer=null}}He.extension={type:[d.WebGLPipes,d.WebGPUPipes,d.CanvasPipes],name:"sprite"};const V=class Le{constructor(){this.clearBeforeRender=!0,this._backgroundColor=new xe(0),this.color=this._backgroundColor,this.alpha=1}init(e){e=f(f({},Le.defaultOptions),e),this.clearBeforeRender=e.clearBeforeRender,this.color=e.background||e.backgroundColor||this._backgroundColor,this.alpha=e.backgroundAlpha,this._backgroundColor.setAlpha(e.backgroundAlpha)}get color(){return this._backgroundColor}set color(e){this._backgroundColor.setValue(e)}get alpha(){return this._backgroundColor.alpha}set alpha(e){this._backgroundColor.setAlpha(e)}get colorRgba(){return this._backgroundColor.toArray()}destroy(){}};V.extension={type:[d.WebGLSystem,d.WebGPUSystem,d.CanvasSystem],name:"background",priority:0};V.defaultOptions={backgroundAlpha:1,backgroundColor:0,clearBeforeRender:!0};let Bt=V;const k={};H.handle(d.BlendMode,s=>{if(!s.name)throw new Error("BlendMode extension must have a name property");k[s.name]=s.ref},s=>{delete k[s.name]});class We{constructor(e){this._isAdvanced=!1,this._filterHash=Object.create(null),this._renderer=e}setBlendMode(e,t,r){if(this._activeBlendMode===t){this._isAdvanced&&this._renderableList.push(e);return}this._activeBlendMode=t,this._isAdvanced&&this._endAdvancedBlendMode(r),this._isAdvanced=!!k[t],this._isAdvanced&&(this._beginAdvancedBlendMode(r),this._renderableList.push(e))}_beginAdvancedBlendMode(e){this._renderer.renderPipes.batch.break(e);const t=this._activeBlendMode;if(!k[t]){pe(`Unable to assign BlendMode: '${t}'. You may want to include: import 'pixi.js/advanced-blend-modes'`);return}let r=this._filterHash[t];r||(r=this._filterHash[t]=new fe,r.filters=[new k[t]]);const n={renderPipeId:"filter",action:"pushFilter",renderables:[],filterEffect:r,canBundle:!1};this._renderableList=n.renderables,e.add(n)}_endAdvancedBlendMode(e){this._renderableList=null,this._renderer.renderPipes.batch.break(e),e.add({renderPipeId:"filter",action:"popFilter",canBundle:!1})}buildStart(){this._isAdvanced=!1}buildEnd(e){this._isAdvanced&&this._endAdvancedBlendMode(e)}destroy(){this._renderer=null,this._renderableList=null;for(const e in this._filterHash)this._filterHash[e].destroy();this._filterHash=null}}We.extension={type:[d.WebGLPipes,d.WebGPUPipes,d.CanvasPipes],name:"blendMode"};const I={png:"image/png",jpg:"image/jpeg",webp:"image/webp"},j=class ze{constructor(e){this._renderer=e}_normalizeOptions(e,t={}){return e instanceof G||e instanceof g?f({target:e},t):f(f({},t),e)}async image(e){const t=new Image;return t.src=await this.base64(e),t}async base64(e){e=this._normalizeOptions(e,ze.defaultImageOptions);const{format:t,quality:r}=e,n=this.canvas(e);if(n.toBlob!==void 0)return new Promise((a,i)=>{n.toBlob(l=>{if(!l){i(new Error("ICanvas.toBlob failed!"));return}const o=new FileReader;o.onload=()=>a(o.result),o.onerror=i,o.readAsDataURL(l)},I[t],r)});if(n.toDataURL!==void 0)return n.toDataURL(I[t],r);if(n.convertToBlob!==void 0){const a=await n.convertToBlob({type:I[t],quality:r});return new Promise((i,l)=>{const o=new FileReader;o.onload=()=>i(o.result),o.onerror=l,o.readAsDataURL(a)})}throw new Error("Extract.base64() requires ICanvas.toDataURL, ICanvas.toBlob, or ICanvas.convertToBlob to be implemented")}canvas(e){e=this._normalizeOptions(e);const t=e.target,r=this._renderer;if(t instanceof g)return r.texture.generateCanvas(t);const n=r.textureGenerator.generateTexture(e),a=r.texture.generateCanvas(n);return n.destroy(),a}pixels(e){e=this._normalizeOptions(e);const t=e.target,r=this._renderer,n=t instanceof g?t:r.textureGenerator.generateTexture(e),a=r.texture.getPixels(n);return t instanceof G&&n.destroy(),a}texture(e){return e=this._normalizeOptions(e),e.target instanceof g?e.target:this._renderer.textureGenerator.generateTexture(e)}download(e){var n;e=this._normalizeOptions(e);const t=this.canvas(e),r=document.createElement("a");r.download=(n=e.filename)!=null?n:"image.png",r.href=t.toDataURL("image/png"),document.body.appendChild(r),r.click(),document.body.removeChild(r)}log(e){var i;const t=(i=e.width)!=null?i:200;e=this._normalizeOptions(e);const r=this.canvas(e),n=r.toDataURL();console.log(`[Pixi Texture] ${r.width}px ${r.height}px`);const a=["font-size: 1px;",`padding: ${t}px ${300}px;`,`background: url(${n}) no-repeat;`,"background-size: contain;"].join(" ");console.log("%c ",a)}destroy(){this._renderer=null}};j.extension={type:[d.WebGLSystem,d.WebGPUSystem],name:"extract"};j.defaultImageOptions={format:"png",quality:1};let Ut=j;class N extends g{static create(e){return new N({source:new T(e)})}resize(e,t,r){return this.source.resize(e,t,r),this}}const At=new R,It=new he,Et=[0,0,0,0];class Ve{constructor(e){this._renderer=e}generateTexture(e){var u;e instanceof G&&(e={target:e,frame:void 0,textureSourceOptions:{},resolution:void 0});const t=e.resolution||this._renderer.resolution,r=e.antialias||this._renderer.view.antialias,n=e.target;let a=e.clearColor;a?a=Array.isArray(a)&&a.length===4?a:xe.shared.setValue(a).toArray():a=Et;const i=((u=e.frame)==null?void 0:u.copyTo(At))||at(n,It).rectangle;i.width=Math.max(i.width,1/t)|0,i.height=Math.max(i.height,1/t)|0;const l=N.create(C(f({},e.textureSourceOptions),{width:i.width,height:i.height,resolution:t,antialias:r})),o=v.shared.translate(-i.x,-i.y);return this._renderer.render({container:n,transform:o,target:l,clearColor:a}),l.source.updateMipmaps(),l}destroy(){this._renderer=null}}Ve.extension={type:[d.WebGLSystem,d.WebGPUSystem],name:"textureGenerator"};class je{constructor(e){this._stackIndex=0,this._globalUniformDataStack=[],this._uniformsPool=[],this._activeUniforms=[],this._bindGroupPool=[],this._activeBindGroups=[],this._renderer=e}reset(){this._stackIndex=0;for(let e=0;e<this._activeUniforms.length;e++)this._uniformsPool.push(this._activeUniforms[e]);for(let e=0;e<this._activeBindGroups.length;e++)this._bindGroupPool.push(this._activeBindGroups[e]);this._activeUniforms.length=0,this._activeBindGroups.length=0}start(e){this.reset(),this.push(e)}bind({size:e,projectionMatrix:t,worldTransformMatrix:r,worldColor:n,offset:a}){const i=this._renderer.renderTarget.renderTarget,l=this._stackIndex?this._globalUniformDataStack[this._stackIndex-1]:{projectionData:i,worldTransformMatrix:new v,worldColor:4294967295,offset:new it},o={projectionMatrix:t||this._renderer.renderTarget.projectionMatrix,resolution:e||i.size,worldTransformMatrix:r||l.worldTransformMatrix,worldColor:n||l.worldColor,offset:a||l.offset,bindGroup:null},u=this._uniformsPool.pop()||this._createUniforms();this._activeUniforms.push(u);const c=u.uniforms;c.uProjectionMatrix=o.projectionMatrix,c.uResolution=o.resolution,c.uWorldTransformMatrix.copyFrom(o.worldTransformMatrix),c.uWorldTransformMatrix.tx-=o.offset.x,c.uWorldTransformMatrix.ty-=o.offset.y,ht(o.worldColor,c.uWorldColorAlpha,0),u.update();let h;this._renderer.renderPipes.uniformBatch?h=this._renderer.renderPipes.uniformBatch.getUniformBindGroup(u,!1):(h=this._bindGroupPool.pop()||new ot,this._activeBindGroups.push(h),h.setResource(u,0)),o.bindGroup=h,this._currentGlobalUniformData=o}push(e){this.bind(e),this._globalUniformDataStack[this._stackIndex++]=this._currentGlobalUniformData}pop(){this._currentGlobalUniformData=this._globalUniformDataStack[--this._stackIndex-1],this._renderer.type===L.WEBGL&&this._currentGlobalUniformData.bindGroup.resources[0].update()}get bindGroup(){return this._currentGlobalUniformData.bindGroup}get globalUniformData(){return this._currentGlobalUniformData}get uniformGroup(){return this._currentGlobalUniformData.bindGroup.resources[0]}_createUniforms(){return new de({uProjectionMatrix:{value:new v,type:"mat3x3<f32>"},uWorldTransformMatrix:{value:new v,type:"mat3x3<f32>"},uWorldColorAlpha:{value:new Float32Array(4),type:"vec4<f32>"},uResolution:{value:[0,0],type:"vec2<f32>"}},{isStatic:!0})}destroy(){this._renderer=null}}je.extension={type:[d.WebGLSystem,d.WebGPUSystem,d.CanvasSystem],name:"globalUniforms"};let Dt=1;class Ne{constructor(){this._tasks=[],this._offset=0}init(){te.system.add(this._update,this)}repeat(e,t,r=!0){const n=Dt++;let a=0;return r&&(this._offset+=1e3,a=this._offset),this._tasks.push({func:e,duration:t,start:performance.now(),offset:a,last:performance.now(),repeat:!0,id:n}),n}cancel(e){for(let t=0;t<this._tasks.length;t++)if(this._tasks[t].id===e){this._tasks.splice(t,1);return}}_update(){const e=performance.now();for(let t=0;t<this._tasks.length;t++){const r=this._tasks[t];if(e-r.offset-r.last>=r.duration){const n=e-r.start;r.func(n),r.last=e}}}destroy(){te.system.remove(this._update,this),this._tasks.length=0}}Ne.extension={type:[d.WebGLSystem,d.WebGPUSystem,d.CanvasSystem],name:"scheduler",priority:0};let oe=!1;function Ot(s){if(!oe){if(_e.get().getNavigator().userAgent.toLowerCase().indexOf("chrome")>-1){const e=[`%c  %c  %c  %c  %c PixiJS %c v${re} (${s}) http://www.pixijs.com/

`,"background: #E72264; padding:5px 0;","background: #6CA2EA; padding:5px 0;","background: #B5D33D; padding:5px 0;","background: #FED23F; padding:5px 0;","color: #FFFFFF; background: #E72264; padding:5px 0;","color: #E72264; background: #FFFFFF; padding:5px 0;"];globalThis.console.log(...e)}else globalThis.console&&globalThis.console.log(`PixiJS ${re} - ${s} - http://www.pixijs.com/`);oe=!0}}class q{constructor(e){this._renderer=e}init(e){if(e.hello){let t=this._renderer.name;this._renderer.type===L.WEBGL&&(t+=` ${this._renderer.context.webGLVersion}`),Ot(t)}}}q.extension={type:[d.WebGLSystem,d.WebGPUSystem,d.CanvasSystem],name:"hello",priority:-2};q.defaultOptions={hello:!1};function Ft(s){let e=!1;for(const r in s)if(s[r]==null){e=!0;break}if(!e)return s;const t=Object.create(null);for(const r in s){const n=s[r];n&&(t[r]=n)}return t}function Ht(s){let e=0;for(let t=0;t<s.length;t++)s[t]==null?e++:s[t-e]=s[t];return s.length=s.length-e,s}const $=class qe{constructor(e){this._managedRenderables=[],this._managedHashes=[],this._managedArrays=[],this._renderer=e}init(e){e=f(f({},qe.defaultOptions),e),this.maxUnusedTime=e.renderableGCMaxUnusedTime,this._frequency=e.renderableGCFrequency,this.enabled=e.renderableGCActive}get enabled(){return!!this._handler}set enabled(e){this.enabled!==e&&(e?(this._handler=this._renderer.scheduler.repeat(()=>this.run(),this._frequency,!1),this._hashHandler=this._renderer.scheduler.repeat(()=>{for(const t of this._managedHashes)t.context[t.hash]=Ft(t.context[t.hash])},this._frequency),this._arrayHandler=this._renderer.scheduler.repeat(()=>{for(const t of this._managedArrays)Ht(t.context[t.hash])},this._frequency)):(this._renderer.scheduler.cancel(this._handler),this._renderer.scheduler.cancel(this._hashHandler),this._renderer.scheduler.cancel(this._arrayHandler)))}addManagedHash(e,t){this._managedHashes.push({context:e,hash:t})}addManagedArray(e,t){this._managedArrays.push({context:e,hash:t})}prerender(){this._now=performance.now()}addRenderable(e,t){!this.enabled||(e._lastUsed=this._now,e._lastInstructionTick===-1&&(this._managedRenderables.push(e),e.once("destroyed",this._removeRenderable,this)),e._lastInstructionTick=t.tick)}run(){var a,i,l;const e=performance.now(),t=this._managedRenderables,r=this._renderer.renderPipes;let n=0;for(let o=0;o<t.length;o++){const u=t[o];if(u===null){n++;continue}const c=(a=u.renderGroup)!=null?a:u.parentRenderGroup,h=(l=(i=c==null?void 0:c.instructionSet)==null?void 0:i.tick)!=null?l:-1;u._lastInstructionTick!==h&&e-u._lastUsed>this.maxUnusedTime?(u.destroyed||r[u.renderPipeId].destroyRenderable(u),u._lastInstructionTick=-1,n++,u.off("destroyed",this._removeRenderable,this)):t[o-n]=u}t.length=t.length-n}destroy(){this.enabled=!1,this._renderer=null,this._managedRenderables.length=0,this._managedHashes.length=0,this._managedArrays.length=0}_removeRenderable(e){const t=this._managedRenderables.indexOf(e);t>=0&&(e.off("destroyed",this._removeRenderable,this),this._managedRenderables[t]=null)}};$.extension={type:[d.WebGLSystem,d.WebGPUSystem],name:"renderableGC",priority:0};$.defaultOptions={renderableGCActive:!0,renderableGCMaxUnusedTime:6e4,renderableGCFrequency:3e4};let Lt=$;const K=class $e{constructor(e){this._renderer=e,this.count=0,this.checkCount=0}init(e){var t;e=f(f({},$e.defaultOptions),e),this.checkCountMax=e.textureGCCheckCountMax,this.maxIdle=(t=e.textureGCAMaxIdle)!=null?t:e.textureGCMaxIdle,this.active=e.textureGCActive}postrender(){!this._renderer.renderingToScreen||(this.count++,this.active&&(this.checkCount++,this.checkCount>this.checkCountMax&&(this.checkCount=0,this.run())))}run(){const e=this._renderer.texture.managedTextures;for(let t=0;t<e.length;t++){const r=e[t];r.autoGarbageCollect&&r.resource&&r._touched>-1&&this.count-r._touched>this.maxIdle&&(r._touched=-1,r.unload())}}destroy(){this._renderer=null}};K.extension={type:[d.WebGLSystem,d.WebGPUSystem],name:"textureGC"};K.defaultOptions={textureGCActive:!0,textureGCAMaxIdle:null,textureGCMaxIdle:60*60,textureGCCheckCountMax:600};let Wt=K;const Y=class Ke{get autoDensity(){return this.texture.source.autoDensity}set autoDensity(e){this.texture.source.autoDensity=e}get resolution(){return this.texture.source._resolution}set resolution(e){this.texture.source.resize(this.texture.source.width,this.texture.source.height,e)}init(e){e=f(f({},Ke.defaultOptions),e),e.view&&(lt(ut,"ViewSystem.view has been renamed to ViewSystem.canvas"),e.canvas=e.view),this.screen=new R(0,0,e.width,e.height),this.canvas=e.canvas||_e.get().createCanvas(),this.antialias=!!e.antialias,this.texture=Pe(this.canvas,e),this.renderTarget=new F({colorTextures:[this.texture],depth:!!e.depth,isRoot:!0}),this.texture.source.transparent=e.backgroundAlpha<1,this.resolution=e.resolution}resize(e,t,r){this.texture.source.resize(e,t,r),this.screen.width=this.texture.frame.width,this.screen.height=this.texture.frame.height}destroy(e=!1){(typeof e=="boolean"?e:!!(e!=null&&e.removeView))&&this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas)}};Y.extension={type:[d.WebGLSystem,d.WebGPUSystem,d.CanvasSystem],name:"view",priority:0};Y.defaultOptions={width:800,height:600,autoDensity:!1,antialias:!1};let zt=Y;const tr=[Bt,je,q,zt,Fe,Wt,Ve,Ut,dt,Lt,Ne],rr=[We,ke,He,Ae,Ce,we,Se,Be];export{er as B,_ as G,Zt as R,tr as S,Jt as U,rr as a,Tt as b,Xt as c,w as d,Yt as e,Kt as f,$t as t,Qt as u};
