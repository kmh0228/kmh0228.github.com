<template>
    <div class="loginBackground_container container">
		<div class="canvas_container container" ref="canvasBackground_container">
			<script ref="vs" type="x-shader/x-vertex">
				varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }
			</script>
			<script ref="fs" type="x-shader/x-fragment">
				uniform sampler2D map; uniform vec3 fogColor; uniform float fogNear; uniform float fogFar; varying vec2 vUv; void main() { float depth = gl_FragCoord.z / gl_FragCoord.w; float fogFactor = smoothstep( fogNear, fogFar, depth ); gl_FragColor = texture2D( map, vUv ); gl_FragColor.w *= pow( gl_FragCoord.z, 20.0 ); gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor ); }
			</script>
		</div>
		
	</div>
</template>
<script>
//import cloud from './cloud.js'
import {THREE,GeometryUtils} from './THREE.js'
import cloud from './cloud_hese.png'
export default {
    name:'loginBackground',
    mounted(){
        this.$nextTick(function(){
			var refs = this.$refs;
		   	var canvas = document.createElement('canvas');
		   	var dom = refs.canvasBackground_container;
			canvas.width = 32;
			canvas.height = dom.innerHeight;
			var context = canvas.getContext('2d');
			var gradient = context.createLinearGradient(0, 0, 0, canvas.height);
			gradient.addColorStop(0, "#1e4877");
			gradient.addColorStop(0.5, "#4584b4");

			context.fillStyle = gradient;
			context.fillRect(0, 0, canvas.width, canvas.height);
			dom.style.background = 'url(' + canvas.toDataURL('image/png') + ')';
			var container;
			var camera, scene, renderer, sky, mesh, geometry, material, i, h, color, colors = [],
				sprite, size, x, y, z;
			var mouseX = 0,
				mouseY = 0;
			var start_time = new Date().getTime();
			var windowHalfX = dom.offsetWidth / 2;
			var windowHalfY = dom.offsetHeight / 2;
			init();
			animate();

			function init() {
				container = document.createElement('div');
				dom.appendChild(container);
				camera = new THREE.Camera(30, window.innerWidth / window.innerHeight, 1, 3000);
				camera.position.z = 6000;
				scene = new THREE.Scene();
				geometry = new THREE.Geometry();
				var texture = THREE.ImageUtils.loadTexture(cloud);
				texture.magFilter = THREE.LinearMipMapLinearFilter;
				texture.minFilter = THREE.LinearMipMapLinearFilter;
				//var fog = new THREE.Fog(0x4584b4, -100, 3000);
				var fog = new THREE.Fog(0xc2745e, -100, 3000);
				material = new THREE.MeshShaderMaterial({
					uniforms: {
						"map": {
							type: "t",
							value: 2,
							texture: texture
						},
						"fogColor": {
							type: "c",
							value: fog.color
						},
						"fogNear": {
							type: "f",
							value: fog.near
						},
						"fogFar": {
							type: "f",
							value: fog.far
						},
					},
					vertexShader: refs.vs.textContent,
					fragmentShader: refs.fs.textContent,
					depthTest: false
				});
				var plane = new THREE.Mesh(new THREE.Plane(64, 64));
				for(i = 0; i < 8000; i++) {
					plane.position.x = Math.random() * 1000 - 500;
					plane.position.y = -Math.random() * Math.random() * 200 - 15;
					plane.position.z = i;
					plane.rotation.z = Math.random() * Math.PI;
					plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;
					GeometryUtils.merge(geometry, plane)
				}
				mesh = new THREE.Mesh(geometry, material);
				scene.addObject(mesh);
				mesh = new THREE.Mesh(geometry, material);
				mesh.position.z = -8000;
				scene.addObject(mesh);
				renderer = new THREE.WebGLRenderer({
					antialias: false
				});
				renderer.setSize(window.innerWidth, window.innerHeight);
				container.appendChild(renderer.domElement);
				document.addEventListener('mousemove', onDocumentMouseMove, false);
				window.addEventListener('resize', onWindowResize, false)
			}

			function onDocumentMouseMove(event) {
				mouseX = (event.clientX - windowHalfX) * 0.25;
				mouseY = (event.clientY - windowHalfY) * 0.15;
			}

			function onWindowResize(event) {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(window.innerWidth, window.innerHeight)
			}

			function animate() {
				requestAnimationFrame(animate);
				render()
			}

			function render() {
				var position = ((new Date().getTime() - start_time) * 0.03) % 8000;
				camera.position.x += (mouseX - camera.target.position.x) * 0.01;
				camera.position.y += (-mouseY - camera.target.position.y) * 0.01;
				camera.position.z = -position + 8000;
				camera.target.position.x = camera.position.x;
				camera.target.position.y = camera.position.y;
				camera.target.position.z = camera.position.z - 1000;
				renderer.render(scene, camera)
			} 
        });
    }
}
</script>
<style lang="less">
.loginBackground_container{
    //background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAALNCAYAAABOP2OBAAAD0klEQVR4Xu3TBVIWUBhGYdmISPyIKCIp0uWMCYK00t0NP512d3d37k+XcZi5567gzHO/N2bnkbl/O8AXY4ACvMDRKLyC4ANiaQEDYo/NsyswQAFcYNfxBXYFBijAC5xYhFdgAC0QxwcssUcYd9IABXCBZXgFlXBAvAEKVK6wK4ivMiB0gQT6BhKqVtkVJJwyQAFcYA1eQTUckGiAAtXr7AoSawwIXSBC30CkZoNdQeS0AQrgApvwCmpDD0iiBbZBwBZ7hEm1dECdAQqcY1ewu44OqDdAgfPwCurpgIbQA5JpgW0QcIFdQXIDHdBogAIX2RXsaaQDmgxQ4BK8giY6oDn0gBRaYBsEXGZXkNJMB5wxQIEr7Ar2njVAgav0EdIBLQaELrCv5Rq7Aj6glRYwgBe4Dq+glQ5ogwNSDeAFbrArSG2jA9oNCF1gf/tNdgV8QActYAAvcAteQQcd0AkHpBnAC9xmV5DWSQd0GRC6wIGuO+wK+IBuWsCA7rvwERrQQ38BHZDOB9xjV5DeE3xALy1gQO99eAV0QAYe0Ad/QYYBfQ/YFWQY0E9/AR2QyQc8ZFeQ2R98wAAtYMDAI3gFdEAWHjAIf0GWAYOP2RVkGTBEfwEdkM0HPGFXkD0UfMAwLcAHPIWPcNgAWCBnxIBn7ApyRgygBUYNeM6u4OCoAbTAmAEv4BWMGQAL5I4b8JJdQe64AbTAhAGv2BUcmjCAFpg04DW8gkkDYIG8KQPesCvImzKAFpjGA97CRzgdekA+LcAHzMA3kD/zjl2BAQrkz8JHWDD7nl2BAQoUzNFHOPcBXkHwAYW0AB8QhY+wMPqRXYEBChTOw0dYNP+JXYEBChQt0Ee48BleQfABxbQAH7AIH2Hx4hd2BQYoULz0FT5COqDEAAWWv7ErKDEgeIFSWqB05Tu7AgMU4AVWf8AroAPKDFBg7Se7gjIDghcopwXK13+xKzBAAV5g4ze8AjqgwgAFNv+wK6gwIHiBw1t/2SM0QAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBAAQUUUECB4AX+A+0uhk+KwLWXAAAAAElFTkSuQmCC);
	background-image:url(./ntm.jpg);
	background-size:100% 100%;
}
</style>