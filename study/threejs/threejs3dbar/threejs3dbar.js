(function(b, c) {
    typeof exports === 'object' && typeof module !== 'undefined' ? c(exports) : typeof define === 'function' && define.amd ? define(['exports'], c) : (c((b.Cubic = {})))
}(this, (function(b) {
	'use strict';
	var c = "1.0";
	var d = "created by YangYi on 2019/3/12 ,e-mail:804314077@qq.com";
	(function() {
		if (typeof THREE == "undefined") {
			console.warn("Cubic must depends on threejs!")
		}
	}());
	var e = 0;
	Array.prototype.sum = function() {
		return this.reduce(function(f, g) {
			return f + g
		})
	};

	function stamp(f) {
		f._cubic_id = f._cubic_id || ++e;
		return f._cubic_id
	};

	function get(f) {
		return typeof f === 'string' ? document.getElementById(f) : f
	};

	function getStyle(f, g) {
		var h = f.style[g] || (f.currentStyle && f.currentStyle[g]);
		if ((!h || h === 'auto') && document.defaultView) {
			var i = document.defaultView.getComputedStyle(f, null);
			h = i ? i[g] : null
		};
		return h === 'auto' ? null : h
	};

	function PieChart(f, g) {
		this._init_(f, g)
	};
	PieChart.prototype = {
		constructor: PieChart,
		options: {
			thickness: 5,
			radius: 20,
			colors: [0xffffff, 0xff00ff, 0xffff00, 0x0000ff, 0x5F9EA0, 0x00FF7F],
			data: [12, 13, 5, 50, 23, 54],
			startAngle: 0,
			background: 0xffffff,
			opacity: 1
		},
		_init_: function(f, g) {
			if (typeof THREE == "undefined") {
				throw new Error("Cubic must depends on threejs!")
			};
			this.options = Object.assign({}, this.options, g);
			this._initContainer(f);
			this._initLayout();
			this._initThree()
		},
		_initLayout: function() {
			if (!this.options.width) {
				this.options.width = this._container.width || this._container.innerWidth || this._container.clientWidth
			};
			if (!this.options.height) {
				this.options.height = this._container.height || this._container.innerHeight || this._container.clientHeight
			}
		},
		_initThree: function() {
			var f = this.options.width;
			var g = this.options.height;
			this.scene = new THREE.Scene();
			var h;
			h = new THREE.WebGLRenderer({
				antialias: true,
				alpha: true
			});
			h.setSize(f, g);
			h.setClearColor(this.options.background, this.options.opacity);
			h.shadowMap.enabled = true;
			this.canvas = h.domElement;
			this._container.appendChild(this.canvas);
			this.render = h;
			this.camera = new THREE.PerspectiveCamera(45, f / g, 0.01, 1000);
			this.camera.position.set(0, 0, 90);
			var i = new THREE.Vector3(0, 0, 0);
			this.camera.lookAt(i);
			this._addLight();
			this._create_()
		},
		_initContainer: function(f) {
			var g = this._container = get(f);
			if (!g) {
				throw new Error('cubic container not found.')
			} else if (g._cubic_id) {
				throw new Error('cubic container is already initialized.')
			};
			this._containerId = stamp(g)
		},
		_addLight: function() {
			var f = new THREE.AmbientLight(0x0c0c0c);
			this.scene.add(f);
			var g = new THREE.SpotLight(0xffffff);
			g.position.set(-20, 20, 60);
			g.shadow.mapSize.width = 5120;
			g.shadow.mapSize.height = 5120;
			g.castShadow = true;
			this.scene.add(g)
		},
		_render: function() {
			this.render.render(this.scene, this.camera)
		},
		_create_: function() {
			var f = this;
			var g = this.scene;
			var h = this.render;
			var i = this.camera;
			var j = [];
			var k = this.options.data;
			var l = this.options.colors;
			updateMesh();
			renderScene();

			function renderScene() {
				h.render(g, i)
			};

			function updateMesh() {
				for (var m = 0; m < j.length; m++) {
					if (j[m]) g.remove(j[m])
				};
				j = [];
				var n = f.options.startAngle;
				var o = 0;
				for (var m = 0; m < k.length; m++) {
					o = getStopAngle(n, k[m] / k.sum());
					var p = new THREE.MeshLambertMaterial({
						color: l[m % l.length]
					});
					var q = [p, p];
					var r = new THREE.ExtrudeGeometry(semiCircle(f.options.radius, n, o), {
						amount: /* f.options.thickness */ parseInt(10*Math.random()),
						bevelThinkness: 2,
						bevelSize: 0,
						bevelSegments: 30,
						bevelEnabled: false,
						curveSegments: 30,
						steps: 1
					});
					var s = new THREE.SceneUtils.createMultiMaterialObject(r, q);
					s.rotation.x = 2.0888322790658975;
					s.rotation.y = Math.PI;
					g.add(s);
					j.push(s);
					n = o
				};
				f._objects = j;
				renderScene()
			};

			function getStopAngle(m, n) {
				var o = m + getOffsetAngle(n || 0.3);
				return o
			};

			function getOffsetAngle(m) {
				return Math.PI * 2 * m
			};

			function semiCircle(m, n, o) {
				var p = new THREE.Shape();
				p.arc(0, 0, m, n, o);
				p.lineTo(0, 0);
				var q = {
					x: m * Math.cos(n),
					y: m * Math.sin(n)
				};
				p.lineTo(q.x, q.y);
				return p
			}
		},
		setPosition: function(f, g, h) {
			if (!this._objects) return;
			this._objects.map(function(i) {
				i.position.set(f, g, h)
			});
			this._render()
		},
		setRotation: function(f, g, h) {
			if (!this._objects) return;
			this._objects.map(function(i) {
				i.rotation.set(f, g, h)
			});
			this._render()
		},
		getPosition: function() {
			if (!this._objects) return null;
			return this._objects.length > 0 ? this._objects[0].position : null
		},
		getRotation: function() {
			if (!this._objects) return null;
			return this._objects.length > 0 ? this._objects[0].rotation : null
		},
		remove: function() {
			if (this.canvas) this._container.removeChild(this.canvas)
		}
	};
	window.a = b;
	b.version = c;
	b.description = d;
	b.PieChart = PieChart
})));