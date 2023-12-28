//헤더
document.addEventListener("DOMContentLoaded", function() {
  var firstMenu = document.querySelectorAll('nav > ul > li')[0]; // Assuming you want to select the first top-level menu item
  var header = document.querySelector('header');

  firstMenu.addEventListener('mouseenter', function() {
    header.style.height = '300px';
  });

  firstMenu.addEventListener('mouseleave', function() {
    header.style.height = '50px';
  });
});


const distance = 250;
let isModalOpen = false;

// Function to calculate distance between two nodes with units
function calculateDistanceWithUnits(node1, node2) {
  const dx = node1.x - node2.x;
  const dy = node1.y - node2.y;
  const dz = node1.z - node2.z;

  // Return the coordinates
  return { x: dx, y: dy, z: dz };
}

const nodeImages = {
  1: "image/logo.svg",
  2: {
    Platform: "image/Platform.svg",
    technology: "image/SI.svg",
  },
  3: {
    Failertalk: "image/Failertalk.svg",
    Ttagttaguli: "image/Ttakttaguri.svg",
    naafaa: "image/Naafaa.svg",
    moonjapay: "image/Moonjapay.svg",
    "server & security solutions": "image/serversecurity.svg",
    "network solutions": "image/Network.svg",
    "Voice Infrastructure": "image/Voiceinfra.svg",
    "Computer SW+HW": "image/Software.svg",
    ICT: "image/ict.svg",
  },
};

const Graph = ForceGraph3D()(document.getElementById("3d-graph"))
  .jsonUrl("../datasets/miserables.json")
  .nodeLabel("id")
  .nodeAutoColorBy("group")
  .linkDirectionalParticleSpeed(0.02) // 조절할 값입니다
  .linkWidth(0.6)
  .linkOpacity(1.0)
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

    // Check if the clicked node is one of the target nodes
    if (
      [
        "Failertalk",
        "Ttagttaguli",
        "naafaa",
        "moonjapay",
        "server & security solutions",
        "Computer SW+HW",
        "Voice Infrastructure",
        "network solutions",
        "ICT",
      ].includes(node.id)
    ) {
      const targetNodes = ["RobotNcom"];

      // Find the positions of the target nodes
      const targetNodePositions = targetNodes.map((targetNode) => {
        const targetNodeData = Graph.graphData().nodes.find(
          (n) => n.id === targetNode
        );
        return {
          id: targetNode,
          position: {
            x: targetNodeData.x,
            y: targetNodeData.y,
            z: targetNodeData.z,
          },
        };
      });

      // Log X, Y coordinates
      targetNodePositions.forEach((target) => {
        const coordinates = calculateDistanceWithUnits(node, target.position);
        console.log(
          `${node.id} 노드의 좌표에서 ${
            target.id
          }노드 까지의 좌표 값: X=${coordinates.x.toFixed(
            2
          )}, Y=${coordinates.y.toFixed(2)}`
        );
      });
    }

    if (intersects.length > 0) {
      // Clicked inside the node image
      clickedNodeId = node.id;

      // Call the appropriate modal function based on the clicked node
      switch (node.id) {
        case "naafaa":
          showNaafaModal();
          break;
        case "Failertalk":
          showFailerModal();
          break;
        case "Ttagttaguli":
          showTtackModal();
          break;
        case "moonjapay":
          showPayModal();
          break;
        case "Platform":
          showPlatfromModal();
          break;
        case "network solutions":
          showNetworkModal();
          break;
        case "server & security solutions":
          showServerModal();
          break;
        case "Computer SW+HW":
          showSWHWModal();
          break;
        case "ICT":
          showICTModal();
          break;
        case "Voice Infrastructure":
          showVoiceModal();
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

    if (centralNode && techNode && platformNode) {
      centralNode.__threeObj.scale.set(4, 4, 4);
      techNode.__threeObj.scale.set(2, 2, 2);
      platformNode.__threeObj.scale.set(2, 2, 2);
    }
  });

// Add an event listener for the modal open and close events
window.addEventListener("modalOpen", () => {
  isModalOpen = true;
});

window.addEventListener("modalClose", () => {
  isModalOpen = false;
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

// Use Three.js onWindowResize event to handle window resize
window.addEventListener("resize", () => {
  Graph.width(window.innerWidth);
  Graph.height(window.innerHeight);

  // Recenter nodes on window resize
  centerNodes();
});

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
  window.dispatchEvent(new Event("modalOpen"));
}

// Function to hide Naafa modal
function hideNaafaModal(event) {
  event.stopPropagation();
  const modal = document.getElementById("NaafaModalBackground");
  modal.style.display = "none";
  // Dispatch modal close event
  window.dispatchEvent(new Event("modalClose"));
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
  window.dispatchEvent(new Event("modalOpen"));
}

// Function to hide Failer modal
function hideFailerModal(event) {
  event.stopPropagation();
  const modal = document.getElementById("FailerModalBackground");
  modal.style.display = "none";
  // Dispatch modal close event
  window.dispatchEvent(new Event("modalClose"));
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
  window.dispatchEvent(new Event("modalOpen"));
}

function showTtackModal() {
  const modal = document.getElementById("TtackModalBackground");
  modal.style.display = "flex";
  window.addEventListener("click", hideTtackModal);
  // Dispatch modal open event
  window.dispatchEvent(new Event("modalOpen"));
}

// Function to hide Ttack modal
function hideTtackModal(event) {
  event.stopPropagation();
  const modal = document.getElementById("TtackModalBackground");
  modal.style.display = "none";
  // Dispatch modal close event
  window.dispatchEvent(new Event("modalClose"));
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
  window.dispatchEvent(new Event("modalOpen"));
}

// Function to hide Pay modal
function hidePayModal(event) {
  event.stopPropagation();
  const modal = document.getElementById("PayModalBackground");
  modal.style.display = "none";
  // Dispatch modal close event
  window.dispatchEvent(new Event("modalClose"));
}
document
  .getElementById("closePayModal")
  .addEventListener("click", hidePayModal);

// Function to show Platfrom modal
function showPlatfromModal() {
  const modal = document.getElementById("PlatfromModalBackground");
  modal.style.display = "flex";
  window.addEventListener("click", hidePlatfromModal);
  // Dispatch modal open event
  window.dispatchEvent(new Event("modalOpen"));
}

// Function to hide Platfrom modal
function hidePlatfromModal(event) {
  event.stopPropagation();
  const modal = document.getElementById("PlatfromModalBackground");
  modal.style.display = "none";
  // Dispatch modal close event
  window.dispatchEvent(new Event("modalClose"));
}
document
  .getElementById("closePlatfromModal")
  .addEventListener("click", hidePlatfromModal);

// Function to show Network modal
function showNetworkModal() {
  const modal = document.getElementById("NetworkModalBackground");
  modal.style.display = "flex";
  window.addEventListener("click", hideNetworkModal);
  // Dispatch modal open event
  window.dispatchEvent(new Event("modalOpen"));
}

// Function to hide Network modal
function hideNetworkModal(event) {
  event.stopPropagation();
  const modal = document.getElementById("NetworkModalBackground");
  modal.style.display = "none";
  // Dispatch modal close event
  window.dispatchEvent(new Event("modalClose"));
}
document
  .getElementById("closeNetworkModal")
  .addEventListener("click", hideNetworkModal);

// Function to show Server modal
function showServerModal() {
  const modal = document.getElementById("ServerModalBackground");
  modal.style.display = "flex";
  window.addEventListener("click", hideServerModal);
  // Dispatch modal open event
  window.dispatchEvent(new Event("modalOpen"));
}

// Function to hide Server modal
function hideServerModal(event) {
  event.stopPropagation();
  const modal = document.getElementById("ServerModalBackground");
  modal.style.display = "none";
  // Dispatch modal close event
  window.dispatchEvent(new Event("modalClose"));
}
document
  .getElementById("closeServerModal")
  .addEventListener("click", hideServerModal);

// Function to show SWHW modal
function showSWHWModal() {
  const modal = document.getElementById("SWHWModalBackground");
  modal.style.display = "flex";
  window.addEventListener("click", hideSWHWModal);
  // Dispatch modal open event
  window.dispatchEvent(new Event("modalOpen"));
}

// Function to hide SWHW modal
function hideSWHWModal(event) {
  event.stopPropagation();
  const modal = document.getElementById("SWHWModalBackground");
  modal.style.display = "none";
  // Dispatch modal close event
  window.dispatchEvent(new Event("modalClose"));
}
document
  .getElementById("closeSWHWModal")
  .addEventListener("click", hideSWHWModal);

// Function to show SWHW modal
function showICTModal() {
  const modal = document.getElementById("ICTModalBackground");
  modal.style.display = "flex";
  window.addEventListener("click", hideICTModal);
  // Dispatch modal open event
  window.dispatchEvent(new Event("modalOpen"));
}

// Function to hide SWHW modal
function hideICTModal(event) {
  event.stopPropagation();
  const modal = document.getElementById("ICTModalBackground");
  modal.style.display = "none";
  // Dispatch modal close event
  window.dispatchEvent(new Event("modalClose"));
}
document
  .getElementById("closeICTModal")
  .addEventListener("click", hideICTModal);

// Function to show voice modal
function showVoiceModal() {
  const modal = document.getElementById("VoiceModalBackground");
  modal.style.display = "flex";
  window.addEventListener("click", hideVoiceModal);
  // Dispatch modal open event
  window.dispatchEvent(new Event("modalOpen"));
}

// Function to hide voice modal
function hideVoiceModal(event) {
  event.stopPropagation();
  const modal = document.getElementById("VoiceModalBackground");
  modal.style.display = "none";
  // Dispatch modal close event
  window.dispatchEvent(new Event("modalClose"));
}
document
  .getElementById("closeICTModal")
  .addEventListener("click", hideVoiceModal);

window.showNaafaModal = showNaafaModal;
window.showFailerModal = showFailerModal;
window.showTtackModal = showTtackModal;
window.showPayModal = showPayModal;

window.showPlatfromModal = showPlatfromModal;
window.showNetworkModal = showNetworkModal;
window.showServerModal = showServerModal;
window.showSWHWModal = showSWHWModal;
window.showICTModal = showICTModal;
window.showVoiceModal = showVoiceModal;

let angle = 182;
setInterval(() => {
  Graph.cameraPosition({
    x: distance * Math.sin(angle),
    z: distance * Math.cos(angle),
  });
  angle += Math.PI / 6000;
}, 10);

let prevX = 0,
  prevY = 0;
const $target = document.querySelector("#direction");

let mouseDownTimeout;
let mouseDown = false;

window.addEventListener("mousedown", (e) => {
  if (e.button === 0 || e.button === 2) {
    // 왼쪽 또는 오른쪽 마우스 버튼이 눌렸을 때
    mouseDown = true;

    // 1000 밀리초(1초) 후에 함수 실행을 위한 타임아웃 설정
    mouseDownTimeout = setTimeout(() => {
      // 1초 후에 실행할 코드
      console.log(
        `${e.button === 0 ? "왼쪽" : "오른쪽"} 마우스 버튼이 눌렸습니다.`
      );
      // 여기서 함수를 호출하거나 다른 작업을 수행할 수 있습니다.
      // 예를 들어, getMouseDirection(e)와 같은 함수를 호출할 수 있습니다.
      getMouseDirection(e);
    }, 1000);
  }
});

window.addEventListener("mouseup", () => {
  // 마우스 버튼이 떼어지면 타임아웃을 지웁니다.
  clearTimeout(mouseDownTimeout);
  mouseDown = false;
});

window.addEventListener("mousemove", (e) => {
  // 왼쪽 또는 오른쪽 마우스 버튼이 눌린 상태인지 확인합니다.
  if (mouseDown) {
    getMouseDirection(e);
  }
});

function getMouseDirection(e) {
  const xDir = prevX <= e.pageX ? "right" : "left";
  prevX = e.pageX;
  console.log(`${xDir} 마우스 방향`);
  if (xDir === "left") {
    Graph.cameraPosition({
      x: distance * Math.sin(angle),
      z: distance * Math.cos(angle),
    });
    angle += Math.PI / 100;
  } else if (xDir === "right") {
    Graph.cameraPosition({
      x: distance * Math.sin(angle),
      z: distance * Math.cos(angle),
    });
    angle -= Math.PI / 100;
  }
}