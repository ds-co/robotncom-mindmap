const distance = 270;
let angle = 15;
let isModalOpen = false;




const nodeImages = {
  1: "image/logo.svg",
  2: {
    Platform: "image/Platform.svg",
    technology: "image/SI.svg",
    SNS: "image/SNS.svg",
    Awards: "image/Win.svg",
  },
  3: {
    Failertalk: "image/Failertalk.svg",
    Ttagttaguli: "image/Ttakttaguri.svg",
    naafaa: "image/Naafaa.svg",
    moonjapay: "image/Moonjapay.svg",
    "server solution": "image/Server.svg",
    "security solutions": "image/Security.svg",
    "network solutions": "image/Network.svg",
    "Computer HW": "image/Hardware.svg",
    "Voice Infrastructure": "image/Voiceinfra.svg",
    "Computer SW": "image/Software.svg",
    Instagram: "image/Insta.svg",
    homepage: "image/Homepage.svg",
    "naver blog": "image/Blog.svg",
    kakaotalk: "image/Kakao.svg",
    "MSS Ministry's Business Innovation Award": "image/Win3.svg",
    "Korea Engineer Award": "image/Win2.svg",
    "Top 100 Korean Brand Award [IT Platform]": "image/Win1.svg",
  },
};

const Graph = ForceGraph3D()(document.getElementById("3d-graph"))
  .jsonUrl("../datasets/miserables.json")
  .nodeLabel("id")
  .nodeAutoColorBy("group")
  .linkDirectionalParticleSpeed(0.02)  // 조절할 값입니다
  .linkWidth(2.5)
  
  // 네비게이션 컨트롤 비활성화
  .enableNavigationControls(false)
  // 노드 드래그 비활성화
  .enableNodeDrag(false)
  .onNodeClick((node, event) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Calculate normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, Graph.camera());

    // Check for intersections with the node
    const intersects = raycaster.intersectObject(node.__threeObj, true);

    console.log("Intersects:", intersects); // Add this line for debugging

    if (intersects.length > 0) {
      // Clicked inside the node image
      clickedNodeId = node.id;
      console.log(`이미지 안쪽을 클릭했습니다. ID: ${clickedNodeId}`);

      // Call the appropriate modal function based on the clicked node
      switch (clickedNodeId) {
        case "naafaa":
          console.log("Calling showNaafaModal");
          showNaafaModal();
          break;
        case "Failertalk":
          console.log("Calling showFailerModal");
          showFailerModal();
          break;
        case "nolga":
          console.log("Calling showNolgaModal");
          showNolgaModal();
          break;
        case "Ttagttaguli":
          console.log("Calling showTtackModal");
          showTtackModal();
          break;
        case "moonjapay":
          console.log("Calling showPayModal");
          showPayModal();
          break;
        case "TeamWork":
          console.log("Calling showTeamModal");
          showTeamModal();
          break;
        default:
          break;
      }
    }
  })
  .nodeThreeObject((node) => {
    // 노드의 그룹 ID와 노드 ID를 가져옵니다.
    const groupId = node.group;
    const nodeId = node.id;

    // 노드 이미지가 존재하는 경우
    if (nodeImages[groupId]) {
      // 노드에 대한 이미지 경로를 가져옵니다.
      let imageSrc = nodeImages[groupId];

      // 이미지 경로가 객체 형태로 제공되는 경우 해당 노드에 대한 이미지를 선택합니다
      if (typeof imageSrc === "object" && imageSrc[nodeId]) {
        imageSrc = imageSrc[nodeId];
      }

      // 로고 텍스처를 로드하고 인코딩을 sRGB로 설정합니다.
      const logoTexture = textureLoader.load(imageSrc);
      logoTexture.encoding = THREE.sRGBEncoding;

      const imageMaterial = new THREE.MeshBasicMaterial({
        map: logoTexture,
        depthTest: false,
        transparent: true,
        side: THREE.DoubleSide,
        renderOrder: -1,
      });

      // 이미지 메시를 생성하고 크기를 조절합니다
      const image = new THREE.Mesh(
        new THREE.PlaneGeometry(15, 15),
        imageMaterial
      );

      // 이미지가 렌더링되기 전에 호출되는 콜백 함수를 정의합니다.
      image.onBeforeRender = function (
        renderer,
        scene,
        camera,
        geometry,
        material,
        group
      ) {
        // 카메라의 회전 값을 복사하고 이미지의 회전을 설정합니다.
        const euler = new THREE.Euler();
        euler.copy(camera.rotation);
        image.rotation.set(euler.x, euler.y, euler.z);
      };

      // THREE.Group을 생성하고 이미지를 추가합니다.
      const group = new THREE.Group();
      group.add(image);

      return group;
    }
  })
  
  .onEngineTick(() => {
    const graphData = Graph.graphData();
    const centralNode = graphData.nodes.find((n) => n.id === "RobotNcom");
    const techNode = graphData.nodes.find((n) => n.id === "technology");
    const platformNode = graphData.nodes.find((n) => n.id === "Platform");
    const awardNode = graphData.nodes.find((n) => n.id === "Awards");
    const snsNode = graphData.nodes.find((n) => n.id === "SNS");

    if (centralNode && techNode && platformNode && awardNode && snsNode) {
      const distanceX = 100;
      const distanceY = 25;

      centralNode.__threeObj.scale.set(4, 4, 4);
      techNode.__threeObj.scale.set(2, 2, 2);
      platformNode.__threeObj.scale.set(2, 2, 2);
      awardNode.__threeObj.scale.set(2, 2, 2);
      snsNode.__threeObj.scale.set(2, 2, 2);

      techNode.x = centralNode.x - distanceX;
      techNode.y = centralNode.y + distanceY;
      techNode.z = centralNode.z;

      platformNode.x = centralNode.x + distanceX;
      platformNode.y = centralNode.y + distanceY;
      platformNode.z = centralNode.z;

      awardNode.x = centralNode.x - distanceX;
      awardNode.y = centralNode.y - distanceY;
      awardNode.z = centralNode.z;

      snsNode.x = centralNode.x + distanceX;
      snsNode.y = centralNode.y - distanceY;
      snsNode.z = centralNode.z;
    }

    // Update camera position based on window size and angle
    if (!isModalOpen) {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      Graph.cameraPosition({
        x: distance * Math.sin(angle),
        z: distance * Math.cos(angle),
      });

      Graph.width(newWidth);
      Graph.height(newHeight);

      angle += Math.PI / 6500;
    }
  });

Graph.linkOpacity(1.0);

window.addEventListener('modalOpen', () => {
  isModalOpen = true;
});

window.addEventListener('modalClose', () => {
  isModalOpen = false;
});

// Add an event listener for window resize
window.addEventListener('resize', () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  Graph.cameraPosition({
    x: distance * Math.sin(angle),
    z: distance * Math.cos(angle),
  });

  Graph.width(newWidth);
  Graph.height(newHeight);
});

// Camera orbit
setInterval(() => {
  if (!isModalOpen) {
    Graph.cameraPosition({
      x: distance * Math.sin(angle),
      z: distance * Math.cos(angle),
    });
    angle += Math.PI / 6500;
  }
}, 10);


const textureLoader = new THREE.TextureLoader();
const backgroundTexture = textureLoader.load("image/backimg.jpg");

Graph.renderer().setClearColor(new THREE.Color("rgba(0, 0, 0, 1)")); // Set alpha value (0.8 for 80% opacity)
backgroundTexture.minFilter = THREE.NearestFilter;
Graph.scene().background = backgroundTexture;

function showNaafaModal() {
  const modal = document.getElementById("NaafaModalBackground");
  modal.style.display = "flex";
  window.addEventListener("click", hideNaafaModal);
  // Dispatch modal open event
  window.dispatchEvent(new Event('modalOpen'));
}

// Function to hide Naafa modal
function hideNaafaModal(event) {
  event.stopPropagation();
  const modal = document.getElementById("NaafaModalBackground");
  modal.style.display = "none";
  // Dispatch modal close event
  window.dispatchEvent(new Event('modalClose'));
}

document
  .getElementById("closeNaafaModal")
  .addEventListener("click", hideNaafaModal);

// Function to show Failer modal
function showFailerModal() {
  const modal = document.getElementById("FailerModalBackground");
  modal.style.display = "flex";
  window.addEventListener("click", hideFailerModal);
  // Dispatch modal open event
  window.dispatchEvent(new Event('modalOpen'));
}

// Function to hide Failer modal
function hideFailerModal(event) {
  event.stopPropagation();
  const modal = document.getElementById("FailerModalBackground");
  modal.style.display = "none";
  // Dispatch modal close event
  window.dispatchEvent(new Event('modalClose'));
}

document
  .getElementById("closeFailerModal")
  .addEventListener("click", hideFailerModal);

// Function to show Nolga modal
function showNolgaModal() {
  console.log("showNolgaModal function called");
  const modal = document.getElementById("NolgaModalBackground");
  if (!modal) {
    console.error("NolgaModalBackground not found!");
    return;
  }

  modal.style.display = "flex";
  window.addEventListener("click", hideNolgaModal);
  // Dispatch modal open event
  window.dispatchEvent(new Event('modalOpen'));
}

function showTtackModal() {
  const modal = document.getElementById("TtackModalBackground");
  modal.style.display = "flex";
  window.addEventListener("click", hideTtackModal);
  // Dispatch modal open event
  window.dispatchEvent(new Event('modalOpen'));
}

// Function to hide Ttack modal
function hideTtackModal(event) {
  event.stopPropagation();
  const modal = document.getElementById("TtackModalBackground");
  modal.style.display = "none";
  // Dispatch modal close event
  window.dispatchEvent(new Event('modalClose'));
}

document
  .getElementById("closeTtackModal")
  .addEventListener("click", hideTtackModal);

// Function to show Pay modal
function showPayModal() {
  const modal = document.getElementById("PayModalBackground");
  modal.style.display = "flex";
  window.addEventListener("click", hidePayModal);
  // Dispatch modal open event
  window.dispatchEvent(new Event('modalOpen'));
}

// Function to hide Pay modal
function hidePayModal(event) {
  event.stopPropagation();
  const modal = document.getElementById("PayModalBackground");
  modal.style.display = "none";
  // Dispatch modal close event
  window.dispatchEvent(new Event('modalClose'));
}
document
  .getElementById("closePayModal")
  .addEventListener("click", hidePayModal);


window.showNaafaModal = showNaafaModal;
window.showFailerModal = showFailerModal;
window.showTtackModal = showTtackModal;
window.showPayModal = showPayModal;

