const distance = 270;
let angle = 15;

// Function to update node positions and sizes on window resize
function handleWindowResize() {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  Graph.width(newWidth);
  Graph.height(newHeight);

  Graph.graphData().nodes.forEach((node) => {
    if (["로봇앤컴", "플랫폼", "기술", "수상", "SNS"].includes(node.id)) {
      // You can adjust the scale factor based on your needs
      const scaleFactor = 2;
      node.__threeObj.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }
  });
}

// Add event listener for window resize
window.addEventListener("resize", handleWindowResize);

const nodeImages = {
  1: "image/logo.svg",
  2: {
    플랫폼: "image/Platform.svg",
    기술: "image/SI.svg",
    SNS: "image/SNS.svg",
    수상: "image/Win.svg",
  },
  3: {
    페일러톡: "image/Failertalk.svg",
    딱따구리: "image/Ttakttaguri.svg",
    나아파: "image/Naafaa.svg",
    문자페이: "image/Moonjapay.svg",
    놀가: "image/Nolga.svg",
    팀웍: "image/Teamwork.svg",
    "서버 솔루션": "image/Server.svg",
    "보안 솔루션": "image/Security.svg",
    "네트워크 솔루션": "image/Network.svg",
    "Computer HW": "image/Hardware.svg",
    보이스인프라: "image/Voiceinfra.svg",
    "Computer SW": "image/Software.svg",
    인스타그램: "image/Insta.svg",
    홈페이지: "image/Homepage.svg",
    "네이버 블로그": "image/Blog.svg",
    카카오톡: "image/Kakao.svg",
    "중소벤처기업부 경영혁신 부문 장관상": "image/Win.svg",
    "대한민국 엔지니어상": "image/Win.svg",
    "한국 대표 브랜드 TOP 100 [IT 플랫폼] 부문 수상": "image/Win.svg",
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
        case "나아파":
          console.log("Calling showNaafaModal");
          showNaafaModal();
          break;
        case "페일러톡":
          console.log("Calling showFailerModal");
          showFailerModal();
          break;
        case "놀가":
          console.log("Calling showNolgaModal");
          showNolgaModal();
          break;
        case "딱따구리":
          console.log("Calling showTtackModal");
          showTtackModal();
          break;
        case "문자페이":
          console.log("Calling showPayModal");
          showPayModal();
          break;
        case "팀웍":
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

      // TextureLoader를 사용하여 SVG 텍스처를 로드합니다.
      const textureLoader = new THREE.TextureLoader();
      const svgTexture = textureLoader.load(imageSrc);
      svgTexture.encoding = THREE.sRGBEncoding;

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

      // 로고 텍스처의 감싸기 모드를 설정합니다.
      logoTexture.wrapS = THREE.ClampToEdgeWrapping;
      logoTexture.wrapT = THREE.ClampToEdgeWrapping;

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

      // 이미지의 z 위치를 조정하고 렌더 순서를 설정합니다.
      image.position.z = -0.1;
      image.renderOrder = 50;

      // THREE.Group을 생성하고 이미지를 추가합니다.
      const group = new THREE.Group();
      group.add(image);

      return group;
    }
  })
  
  .onEngineTick(() => {
    const graphData = Graph.graphData();
    const centralNode = graphData.nodes.find((n) => n.id === "로봇앤컴");
    const techNode = graphData.nodes.find((n) => n.id === "기술");
    const platformNode = graphData.nodes.find((n) => n.id === "플랫폼");
    const awardNode = graphData.nodes.find((n) => n.id === "수상");
    const snsNode = graphData.nodes.find((n) => n.id === "SNS");

    if (centralNode && techNode && platformNode && awardNode && snsNode) {
      const distanceX = 100; // Adjust this distance based on your preference
      const distanceY = 25; // Adjust this distance based on your preference

      centralNode.__threeObj.scale.set(4, 4, 4);
      techNode.__threeObj.scale.set(2, 2, 2);
      platformNode.__threeObj.scale.set(2, 2, 2);
      awardNode.__threeObj.scale.set(2, 2, 2);
      snsNode.__threeObj.scale.set(2, 2, 2);

      // Set positions relative to the central node
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

// Camera orbit
setInterval(() => {
  Graph.cameraPosition({
    x: distance * Math.sin(angle),
    z: distance * Math.cos(angle),
  });
  angle += Math.PI / 6500;
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
}

// Function to hide Naafa modal
function hideNaafaModal(event) {
  event.stopPropagation();
  const modal = document.getElementById("NaafaModalBackground");
  modal.style.display = "none";
}

document
  .getElementById("closeNaafaModal")
  .addEventListener("click", hideNaafaModal);

// Function to show Failer modal
function showFailerModal() {
  const modal = document.getElementById("FailerModalBackground");
  modal.style.display = "flex";
  window.addEventListener("click", hideFailerModal);
}

// Function to hide Failer modal
function hideFailerModal(event) {
  event.stopPropagation();
  const modal = document.getElementById("FailerModalBackground");
  modal.style.display = "none";
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
}

// Function to hide Nolga modal
function hideNolgaModal(event) {
  event.stopPropagation();
  console.log("Hide Nolga Modal");
  const modal = document.getElementById("NolgaModalBackground");
  if (!modal) {
    console.error("NolgaModalBackground not found!");
    return;
  }

  modal.style.display = "none";
}

document
  .getElementById("closeNolgaModal")
  .addEventListener("click", hideNolgaModal);

function showTtackModal() {
  const modal = document.getElementById("TtackModalBackground");
  modal.style.display = "flex";
  window.addEventListener("click", hideTtackModal);
}

// Function to hide Ttack modal
function hideTtackModal(event) {
  event.stopPropagation();
  const modal = document.getElementById("TtackModalBackground");
  modal.style.display = "none";
}

document
  .getElementById("closeTtackModal")
  .addEventListener("click", hideTtackModal);

// Function to show Pay modal
function showPayModal() {
  const modal = document.getElementById("PayModalBackground");
  modal.style.display = "flex";
  window.addEventListener("click", hidePayModal);
}

// Function to hide Pay modal
function hidePayModal(event) {
  event.stopPropagation();
  const modal = document.getElementById("PayModalBackground");
  modal.style.display = "none";
}
document
  .getElementById("closePayModal")
  .addEventListener("click", hidePayModal);

// Function to show Team modal
function showTeamModal() {
  const modal = document.getElementById("TeamModalBackground");
  modal.style.display = "flex";
  window.addEventListener("click", hideTeamModal);
}

// Function to hide Team modal
function hideTeamModal(event) {
  event.stopPropagation();
  const modal = document.getElementById("TeamModalBackground");
  modal.style.display = "none";
}
document
  .getElementById("closeTeamModal")
  .addEventListener("click", hideTeamModal);


window.showNaafaModal = showNaafaModal;
window.showFailerModal = showFailerModal;
window.showNolgaModal = showNolgaModal;
window.showTtackModal = showTtackModal;
window.showPayModal = showPayModal;
window.showTeamModal = showTeamModal;
