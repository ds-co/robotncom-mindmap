const distance = 350;

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
  .linkWidth(2.5)
  // 네비게이션 컨트롤 비활성화
  .enableNavigationControls(false)
  // 노드 드래그 비활성화
  .enableNodeDrag(false)
  .onNodeClick((node, event) => {
    clickedNodeId = node.id;
    // intersects 배열이 비어있지 않으면 노드 이미지 안쪽을 클릭한 것으로 간주
    console.log(`이미지 안쪽을 클릭했습니다. ID: ${clickedNodeId}`);
    // 모달을 표시하는 코드 등을 여기에 추가
    // 예를 들어, 다음과 같이 모달을 표시할 수 있습니다.
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
      default:
        break;
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
        new THREE.PlaneGeometry(17, 17),
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

      // 이미지의 z 위치를 조정하고 렌더 순서를 설정합니다.
      image.position.z = -0.1;
      image.renderOrder = 50;

      return group;
    }
  })

  .onEngineTick(() => {
    Graph.graphData().nodes.forEach((n) => {
      if (n.id === "로봇앤컴") {
        n.__threeObj.scale.set(4, 4, 4);
      } else if (["플랫폼", "기술", "수상", "SNS"].includes(n.id)) {
        n.__threeObj.scale.set(2, 2, 2);
      }
    });
  });

  function showModal(nodeId) {
    // 모달 표시 함수
    switch (nodeId) {
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
      default:
        break;
    }
  }
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

// camera orbit
let angle = 15;
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

window.showNaafaModal = showNaafaModal;
window.showFailerModal = showFailerModal;
window.showNolgaModal = showNolgaModal;
window.showTtackModal = showTtackModal;
window.showPayModal = showPayModal;
