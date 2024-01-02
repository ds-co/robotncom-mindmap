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

// 랜딩 js
    // document.addEventListener("DOMContentLoaded", function () {
    //   const homeContent = document.getElementById("home-content");
    //   const h1AnimationDuration = 5000;              /*랜딩 원이 유지되는 속도 */

    //   setTimeout(() => {
    //     // 이 부분에서 index.html의 circle과 h1을 숨깁니다.
    //     document.querySelector(".circle").style.display = "none";
    //     document.querySelector("h1").style.display = "none";

    //     // home.html을 미리 로드하여 body에 직접 추가합니다.
    //     const iframe = document.createElement("iframe");
    //     iframe.src = "home.html";
    //     iframe.frameBorder = "0";
    //     iframe.width = "100%";
    //     iframe.height = "100%";
    //     document.body.innerHTML = ""; // 기존 body 내용을 지워줍니다.
    //     document.body.appendChild(iframe);

    //     // home-content를 나타나게 하는 애니메이션을 추가합니다.
    //     // homeContent.style.animation = "showHomeContent 10s ease-in-out forwards";
    //   }, h1AnimationDuration);
    // });
// 랜딩 js

document.addEventListener("DOMContentLoaded", function () {
  const homeContent = document.getElementById("home-content");
  const h1AnimationDuration = 5000;

  setTimeout(() => {
      // circle과 h1에 애니메이션을 적용하여 천천히 사라지게 합니다.
      document.querySelector(".circle").classList.add("hide-circle");
      document.querySelector("h1").classList.add("hide-h1");

      // home.html을 미리 로드하여 body에 직접 추가합니다.
      const iframe = document.createElement("iframe");
      iframe.src = "home.html";
      iframe.frameBorder = "0";
      iframe.width = "100%";
      iframe.height = "100%";
      document.body.innerHTML = ""; // 기존 body 내용을 지워줍니다.
      document.body.appendChild(iframe);

      // home-content를 나타나게 하는 애니메이션을 추가합니다.
      // homeContent.style.animation = "showHomeContent 10s ease-in-out forwards";
  }, h1AnimationDuration);
});


document.getElementById("closeModal").addEventListener("click", hideModal);

const distance = 270;

const imageScene = new THREE.Scene();

const nodeImages = {
  1: "image/logo.svg",
  2: {
    Platform: "image/Platform.svg",
    Awards: "image/수상.svg",
    SNS: "image/SNS.svg",
    SI: "image/SI.svg",
  },
  3: {
    Failertalk: "image/페일러톡.svg",
    Ttagttaguli: "image/딱따구리.svg",
    naafaa: "image/NAAFAA.svg",
    moonjapay: "image/문자페이.svg",
    놀가: "image/놀가.svg",
    팀WORK: "image/팀WORK.svg",
    "server solution": "image/Server.svg",
    // "보안 솔루션": "Security.svg",
    "network solutions": "image/Network.svg",
    "Computer HW": "image/Hardware.svg",
    "Voice Infrastructure": "image/Voice infra.svg",
    // "Computer SW": "Software.svg",
    Instagram: "image/Instagram.svg",
    Homepage: "image/Homepage.svg",
    "Naver Blog": "image/Blog.svg",
    Kakaotalk: "image/Kakaotalk.svg",
    "MSS Ministry's Business Innovation Award": "image/수상.svg",
    "Korea Engineer Award": "image/수상.svg",
    "Top 100 Korean Brand Award [IT Platform]": "image/수상.svg",
  },
};

const Graph = ForceGraph3D()(document.getElementById("3d-graph"))
  .jsonUrl("../datasets/miserables.json")
  .nodeLabel("id")
  .nodeAutoColorBy("group")

  .enableNavigationControls(false)
  .enableNodeDrag(false)
  .onNodeClick((node) => {
    const nodeId = node.id;
    if (nodeImages[node.group]) {
      const imageSrc = nodeImages[node.group];
      if (typeof imageSrc === "object" && imageSrc[nodeId]) {
        console.log(`Node "${nodeId}" clicked!`);
      }
    }
  })

  .linkThreeObject((link) => {
    const whiteColor = new THREE.Color("white");
    // const lineWidth = 555;

    const material = new THREE.LineBasicMaterial({
      color: whiteColor,
      transparent: true,
    });
    return new THREE.Line(link.geometry, material);
  })

  .nodeThreeObject((node) => {
    const groupId = node.group;
    const nodeId = node.id;

    if (nodeImages[groupId]) {
      let imageSrc = nodeImages[groupId];

      if (typeof imageSrc === "object" && imageSrc[nodeId]) {
        imageSrc = imageSrc[nodeId];
      }

      const textureLoader = new THREE.TextureLoader();
      backgroundTexture.encoding = THREE.sRGBEncoding;
      rendingTexture.encoding = THREE.sRGBEncoding;
      

      const svgTexture = textureLoader.load(imageSrc);
      svgTexture.encoding = THREE.sRGBEncoding;
      const svgMaterial = new THREE.MeshBasicMaterial({
        map: svgTexture,
        depthTest: false,
        transparent: true,
        side: THREE.DoubleSide,
      });

      const svgMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(15, 15),
        svgMaterial
      ); // 노드 크기를 조절

      const logoTexture = textureLoader.load(imageSrc);
      logoTexture.encoding = THREE.sRGBEncoding;

      logoTexture.wrapS = THREE.ClampToEdgeWrapping;
      logoTexture.wrapT = THREE.ClampToEdgeWrapping;

      const logoMaterial = new THREE.MeshBasicMaterial({
        map: logoTexture,
        depthTest: false,
        transparent: true,
        side: THREE.DoubleSide,
      });

      const logo = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), logoMaterial);

      const imageMaterial = new THREE.MeshBasicMaterial({
        map: logoTexture,
        depthTest: false,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
        renderOrder: -1,
      });

      const image = new THREE.Mesh(
        new THREE.PlaneGeometry(17, 17),
        imageMaterial
      );

      image.position.z = -0.1;
      image.renderOrder = 50;

      image.onBeforeRender = function (
        renderer,
        scene,
        camera,
        geometry,
        material,
        group
      ) {
        const euler = new THREE.Euler();
        euler.copy(camera.rotation);
        image.rotation.set(euler.x, euler.y, euler.z);
      };

      const group = new THREE.Group();
      group.add(image);
      imageScene.add(group);

      return group;
    }
  })

  .onEngineTick(() => {
    Graph.graphData().nodes.forEach((n) => {
      if (n.id === "Robot N Com") {
        n.__threeObj.scale.set(4, 4, 4);
        n.__threeObj.position.x = 22;
      } else if (["Platform", "SI", "Awards", "SNS"].includes(n.id)) {
        n.__threeObj.scale.set(2, 2, 2);
      }
    });
  });

window.addEventListener("resize", () => {
  const graphContainer = document.getElementById("3d-graph");
  Graph.width(graphContainer.offsetWidth).height(graphContainer.offsetHeight);
});

function zoomInToNode(node) {
  const distance = 20;
  const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

  Graph.cameraPosition(
    {
      x: node.x * distRatio,
      y: node.y * distRatio,
      z: node.z * distRatio,
    },
    node,
    3000
  );
}

Graph.onNodeClick((node) => {
  const nodeId = node.id;

  if (
    nodeId === "naafaa" ||
    [
      "페일러톡",
      "딱따구리",
      "나아파",
      "문자페이",
      "놀가",
      "서버 솔루션",
      "보안 솔루션",
      "Computer HW",
      "보이스인프라",
      "네트워크 솔루션",
      "Computer SW",
      "중소벤처기업부 경영혁신 부문 장관상",
      "대한민국 엔지니어상",
      "한국 대표 브랜드 TOP 100 [IT 플랫폼] 부문 수상",
    ].includes(nodeId)
  ) {
    showNaafaModal();
  } else if (node.id === "Instagram") {
    window.open("https://www.instagram.com/robot_n_com/", "_blank");
  } else if (node.id === "Homepage") {
    window.open("https://www.robotncom.com/", "_blank");
  } else if (node.id === "Naver Blog") {
    window.open("https://blog.naver.com/robotncom", "_blank");
  } else if (node.id === "Kakaotalk") {
    window.open("http://pf.kakao.com/_VMxcds", "_blank");
  }
});

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

window.addEventListener("mouseup", getMouseDirection);

const textureLoader = new THREE.TextureLoader();

const rendingTexture = textureLoader.load("image/back2.jpg");
rendingTexture.encoding = THREE.sRGBEncoding;


const backgroundTexture = textureLoader.load("image/back2.jpg");
backgroundTexture.encoding = THREE.sRGBEncoding;
Graph.renderer().setClearColor(new THREE.Color("black"));
backgroundTexture.minFilter = THREE.NearestFilter;
Graph.scene().background = backgroundTexture;

function showNaafaModal() {
  console.log("showNaafaModal called");
  const modal = document.getElementById("Modalbackground");
  modal.style.display = "flex";

  modal.addEventListener("click", hideModal);
}

function hideModal() {
  event.stopPropagation();
  const modal = document.getElementById("Modalbackground");
  modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  const introSection = document.getElementById("intro-section");
  let startTime;

  function animate(time) {
    if (!startTime) {
      startTime = time;
    }

    const elapsed = time - startTime;

    introSection.style.opacity = 1;

    if (elapsed < 9000) {
      introSection.style.opacity = 1 - elapsed / 8000;
      requestAnimationFrame(animate);
    } else {
      introSection.style.display = "none";
    }
  }

  requestAnimationFrame(animate);
});


// const textureLoader = new THREE.TextureLoader();

// const rendingTexture = textureLoader.load("image/back2.jpg", () => {
//     rendingTexture.encoding = THREE.sRGBEncoding;

//     // 필터링 및 래핑 설정
//     rendingTexture.magFilter = THREE.LinearFilter;
//     rendingTexture.minFilter = THREE.LinearMipmapLinearFilter; // 필요한 경우만 설정
//     rendingTexture.wrapS = THREE.RepeatWrapping;
//     rendingTexture.wrapT = THREE.RepeatWrapping;

//     // 텍스처를 사용하여 재질 생성
//     const material = new THREE.MeshBasicMaterial({ map: rendingTexture });

//     // 나머지 코드 (예: 큐브 생성 및 씬에 추가 등)
// });
