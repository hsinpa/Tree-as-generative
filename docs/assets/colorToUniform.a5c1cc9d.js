var S=Object.defineProperty,y=Object.defineProperties;var w=Object.getOwnPropertyDescriptors;var _=Object.getOwnPropertySymbols;var k=Object.prototype.hasOwnProperty,F=Object.prototype.propertyIsEnumerable;var M=(s,t,e)=>t in s?S(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e,u=(s,t)=>{for(var e in t||(t={}))k.call(t,e)&&M(s,e,t[e]);if(_)for(var e of _(t))F.call(t,e)&&M(s,e,t[e]);return s},h=(s,t)=>y(s,w(t));import{a2 as O,d as U,a0 as P}from"./index.e376c1db.js";const v={normal:0,add:1,multiply:2,screen:3,overlay:4,erase:5,"normal-npm":6,"add-npm":7,"screen-npm":8,min:9,max:10},c=0,d=1,f=2,p=3,m=4,x=5,b=class T{constructor(){this.data=0,this.blendMode="normal",this.polygonOffset=0,this.blend=!0,this.depthMask=!0}get blend(){return!!(this.data&1<<c)}set blend(t){!!(this.data&1<<c)!==t&&(this.data^=1<<c)}get offsets(){return!!(this.data&1<<d)}set offsets(t){!!(this.data&1<<d)!==t&&(this.data^=1<<d)}set cullMode(t){if(t==="none"){this.culling=!1;return}this.culling=!0,this.clockwiseFrontFace=t==="front"}get cullMode(){return this.culling?this.clockwiseFrontFace?"front":"back":"none"}get culling(){return!!(this.data&1<<f)}set culling(t){!!(this.data&1<<f)!==t&&(this.data^=1<<f)}get depthTest(){return!!(this.data&1<<p)}set depthTest(t){!!(this.data&1<<p)!==t&&(this.data^=1<<p)}get depthMask(){return!!(this.data&1<<x)}set depthMask(t){!!(this.data&1<<x)!==t&&(this.data^=1<<x)}get clockwiseFrontFace(){return!!(this.data&1<<m)}set clockwiseFrontFace(t){!!(this.data&1<<m)!==t&&(this.data^=1<<m)}get blendMode(){return this._blendMode}set blendMode(t){this.blend=t!=="none",this._blendMode=t,this._blendModeId=v[t]||0}get polygonOffset(){return this._polygonOffset}set polygonOffset(t){this.offsets=!!t,this._polygonOffset=t}toString(){return`[pixi.js/core:State blendMode=${this.blendMode} clockwiseFrontFace=${this.clockwiseFrontFace} culling=${this.culling} depthMask=${this.depthMask} polygonOffset=${this.polygonOffset}]`}static for2d(){const t=new T;return t.depthTest=!1,t.blend=!0,t}};b.default2d=b.for2d();let $=b,C=0;class B{constructor(t){this._poolKeyHash=Object.create(null),this._texturePool={},this.textureOptions=t||{},this.enableFullScreen=!1}createTexture(t,e,o){const i=new O(h(u({},this.textureOptions),{width:t,height:e,resolution:1,antialias:o,autoGarbageCollect:!0}));return new U({source:i,label:`texturePool_${C++}`})}getOptimalTexture(t,e,o=1,i){let n=Math.ceil(t*o-1e-6),l=Math.ceil(e*o-1e-6);n=P(n),l=P(l);const a=(n<<17)+(l<<1)+(i?1:0);this._texturePool[a]||(this._texturePool[a]=[]);let r=this._texturePool[a].pop();return r||(r=this.createTexture(n,l,i)),r.source._resolution=o,r.source.width=n/o,r.source.height=l/o,r.source.pixelWidth=n,r.source.pixelHeight=l,r.frame.x=0,r.frame.y=0,r.frame.width=t,r.frame.height=e,r.updateUvs(),this._poolKeyHash[r.uid]=a,r}getSameSizeTexture(t,e=!1){const o=t.source;return this.getOptimalTexture(t.width,t.height,o._resolution,e)}returnTexture(t){const e=this._poolKeyHash[t.uid];this._texturePool[e].push(t)}clear(t){if(t=t!==!1,t)for(const e in this._texturePool){const o=this._texturePool[e];if(o)for(let i=0;i<o.length;i++)o[i].destroy(!0)}this._texturePool={}}}const E=new B,g={name:"local-uniform-bit",vertex:{header:`

            struct LocalUniforms {
                uTransformMatrix:mat3x3<f32>,
                uColor:vec4<f32>,
                uRound:f32,
            }

            @group(1) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `}},G=h(u({},g),{vertex:h(u({},g.vertex),{header:g.vertex.header.replace("group(1)","group(2)")})}),I={name:"local-uniform-bit",vertex:{header:`

            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix = uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `}};class L{constructor(){this.batcherName="default",this.attributeSize=4,this.indexSize=6,this.packAsQuad=!0,this.roundPixels=0,this._attributeStart=0,this._batcher=null,this._batch=null}get blendMode(){return this.renderable.groupBlendMode}get color(){return this.renderable.groupColorAlpha}reset(){this.renderable=null,this.texture=null,this._batcher=null,this._batch=null,this.bounds=null}}function N(s,t,e){const o=(s>>24&255)/255;t[e++]=(s&255)/255*o,t[e++]=(s>>8&255)/255*o,t[e++]=(s>>16&255)/255*o,t[e++]=o}export{L as B,$ as S,E as T,I as a,G as b,N as c,g as l};
