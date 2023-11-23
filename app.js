const distance = 300;
let angle = 15;
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
  .linkDirectionalParticleSpeed(0.02) // 조절할 값입니다
  .linkWidth(1.3)

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
  
    // Check if the clicked node is one of the target nodes
    if (
      ["Failertalk", "Ttagttaguli", "naafaa", "moonjapay", "server solution", "security solutions", "Computer HW", "Voice Infrastructure", "network solutions", "Computer SW", "MSS Ministry's Business Innovation Award", "Korea Engineer Award", "Top 100 Korean Brand Award [IT Platform]", "Instagram", "homepage", "naver blog", "kakaotalk"].includes(node.id)
    ) {
      const targetNodes = ["Failertalk", "Ttagttaguli", "naafaa", "moonjapay", "server solution", "security solutions", "Computer HW", "Voice Infrastructure", "network solutions", "Computer SW", "MSS Ministry's Business Innovation Award", "Korea Engineer Award", "Top 100 Korean Brand Award [IT Platform]", "Instagram", "homepage", "naver blog", "kakaotalk"];
  
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
          `Coordinates from ${node.id} to ${target.id}: X=${coordinates.x.toFixed(
            2
          )}, Y=${coordinates.y.toFixed(2)}`
        );
      });
    }
  
    if (intersects.length > 0) {
      // Clicked inside the node image
      clickedNodeId = node.id;
      console.log(`이미지 안쪽을 클릭했습니다. ID: ${clickedNodeId}`);
  
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
        case "kakaotalk":
          window.location.href = "http://pf.kakao.com/_VMxcds";
          break;
        case "Instagram":
          window.location.href = "https://www.instagram.com/robot_n_com/";
          break;
        case "homepage":
          window.location.href = "https://www.robotncom.com/";
          break;
        case "naver blog":
          window.location.href = "https://blog.naver.com/robotncom";
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

      // TextureLoader를 사용하여 SVG 텍스처를 로드합니다.
      // const textureLoader = new THREE.TextureLoader();
      // const svgTexture = textureLoader.load(imageSrc);
      // svgTexture.encoding = THREE.sRGBEncoding;

      // 텍스처의 인코딩을 sRGB로 설정하고,
      // MeshBasicMaterial을 생성하여 텍스처를 적용합니다.
      // const svgMaterial = new THREE.MeshBasicMaterial({
      //   map: svgTexture,
      //   depthTest: false,
      //   transparent: true,
      //   side: THREE.DoubleSide,
      // });

      // 3D 메시 생성
      // const svgMesh = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), svgMaterial); // 노드 크기를 조절

      // 로고 텍스처를 로드하고 인코딩을 sRGB로 설정합니다.
      const logoTexture = textureLoader.load(imageSrc);
      logoTexture.encoding = THREE.sRGBEncoding;

      // MeshBasicMaterial을 생성하여 로고 텍스처를 적용합니다.
      // const logoMaterial = new THREE.MeshBasicMaterial({
      //   map: logoTexture,
      //   depthTest: false,
      //   transparent: true,
      //   side: THREE.DoubleSide,
      // });

      // 로고 메시를 생성하고 크기를 조절합니다.
      // const logo = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), logoMaterial);

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

      // // 이미지 메시에 클릭 이벤트를 추가합니다.
      // image.onClick = function (event) {
      //   // 클릭된 경우 여기서 원하는 작업을 수행하세요.
      //   showModal(nodeId);
      // };

      // THREE.Group을 생성하고 이미지를 추가합니다.
      const group = new THREE.Group();
      group.add(image);

      return group;
    }
  })
  .onEngineTick(() => {
    Graph.graphData().nodes.forEach((n) => {
      if (n.id === "RobotNcom") {
        n.__threeObj.scale.set(4, 4, 4);
      } else if (["Platform", "technology", "Awards", "SNS"].includes(n.id)) {
        n.__threeObj.scale.set(2, 2, 2);
      }
    });
  });

// function showModal(nodeId) {
//   // 모달 표시 함수
//   switch (nodeId) {
//     case "나아파":
//       console.log("Calling showNaafaModal");
//       showNaafaModal();
//       break;
//     case "페일러톡":
//       console.log("Calling showFailerModal");
//       showFailerModal();
//       break;
//     case "놀가":
//       console.log("Calling showNolgaModal");
//       showNolgaModal();
//       break;
//     case "딱따구리":
//       console.log("Calling showTtackModal");
//       showTtackModal();
//       break;
//     case "문자페이":
//       console.log("Calling showPayModal");
//       showPayModal();
//       break;
//     default:
//       break;
//   }
// }
Graph.linkOpacity(1.0);
// Graph.onNodeClick((node) => {
//   console.log("Node clicked:", node);

//   const nodeId = node.id;
//   const nodeGroup = node.group;

//   console.log(`Clicked Node: ${nodeId}, Group: ${nodeGroup}`);

//   if (nodeImages[nodeGroup]) {
//     const imageSrc = nodeImages[nodeGroup];
//     if (typeof imageSrc === "object" && imageSrc[nodeId]) {
//       console.log(`Node "${nodeId}" clicked!`);

//       switch (nodeId) {
//         case "나아파":
//           console.log("Calling showNaafaModal");
//           showNaafaModal();
//           break;
//         case "페일러톡":
//           console.log("Calling showFailerModal");
//           showFailerModal();
//           break;
//         case "놀가":
//           console.log("Calling showNolgaModal");
//           showNolgaModal();
//           break;
//         case "딱따구리":
//           console.log("Calling showTtackModal");
//           showTtackModal();
//           break;
//         case "문자페이":
//           console.log("Calling showPayModal");
//           showPayModal();
//           break;
//         default:
//           break;
//       }
//       return;
//     }
//   }
// });
// Function to zoom in to a node
// function zoomInToNode(node) {
//   const distance = 40;
//   const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

//   Graph.cameraPosition(
//     {
//       x: node.x * distRatio,
//       y: node.y * distRatio,
//       z: node.z * distRatio,
//     },
//     node,
//     3000
//   );
// }

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

window.showNaafaModal = showNaafaModal;
window.showFailerModal = showFailerModal;
window.showTtackModal = showTtackModal;
window.showPayModal = showPayModal;
