// Basic Three.js globe setup
let scene, camera, renderer, controls, globe;

function init() {
  // Create scene
  scene = new THREE.Scene();

  // Set up camera
  camera = new THREE.PerspectiveCamera(50, 800/800, 0.1, 1000);
  camera.position.set(0, 0, 3);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(800, 800);
  renderer.setClearColor(0x181c24);
  document.getElementById('globe-container').appendChild(renderer.domElement);

  // Lighting for dark tones
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);
  const directional = new THREE.DirectionalLight(0xffffff, 0.8);
  directional.position.set(5, 3, 5);
  scene.add(directional);

  // Earth globe with texture
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const loader = new THREE.TextureLoader();
  loader.load(
    'earth-outline.jpg', // or 'earth-outline.png'
    function(texture) {
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 10,
        specular: 0x222222
      });
      globe = new THREE.Mesh(geometry, material);
      scene.add(globe);
      animate();
    },
    undefined,
    function() {
      // Fallback: show a blue sphere if texture fails to load
      const material = new THREE.MeshPhongMaterial({
        color: 0x3399ff,
        shininess: 10,
        specular: 0x222222
      });
      globe = new THREE.Mesh(geometry, material);
      scene.add(globe);
      animate();
      console.error("Could not load earth-outline.jpg. Please add a valid Earth texture image.");

      const errorDiv = document.createElement('div');
      errorDiv.textContent = "Could not load earth-outline.jpg. Please add a valid Earth texture image to your project folder.";
      errorDiv.style.position = "absolute";
      errorDiv.style.top = "20px";
      errorDiv.style.left = "20px";
      errorDiv.style.color = "#fff";
      errorDiv.style.background = "#c00";
      errorDiv.style.padding = "12px";
      errorDiv.style.borderRadius = "8px";
      errorDiv.style.zIndex = "10";
      document.getElementById('globe-container').appendChild(errorDiv);
    }
  );

  // OrbitControls for click-and-drag rotation
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 1.5;
  controls.maxDistance = 5;
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Helper: Convert lat/lon to 3D coordinates on sphere
function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

init();