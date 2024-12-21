//Music - - - - - - - -
const musicButton = document.querySelector('.music-button');
const backgroundAudio = new Audio('Asset/Sounds/homeBGM.mp3');

// 초기 상태
backgroundAudio.loop = true;
backgroundAudio.play(); // 페이지 로드 시 자동 재생
let isPlaying = true;

// 버튼 클릭 이벤트 리스너
musicButton.addEventListener('click', () => {
    if (isPlaying) {
        backgroundAudio.pause();
        musicButton.textContent = '▶';
    } else {
        backgroundAudio.play();
        musicButton.textContent = '⏸';
    }
    isPlaying = !isPlaying;
});

//Zoom - - - - - - - -
// 줌 가능한 이미지들 선택 (illust와 bookshelf 둘 다 포함)
const zoomableImages = document.querySelectorAll('#zoomable-illust, #zoomable-bookshelf');
const zoomButton = document.querySelector('.zoom-button');
const zoomTrack = document.querySelector('.zoom-track');
const container = document.querySelector('body'); // 이미지 이동 범위

let isDraggingZoom = false; // 줌 버튼 드래그 상태
let isDraggingImage = false; // 이미지 드래그 상태
let zoomScale = 1;
let offsetX = 0; // 이미지 이동 오프셋 X
let offsetY = 0; // 이미지 이동 오프셋 Y
let startX = 0; // 마우스 시작 위치 X
let startY = 0; // 마우스 시작 위치 Y

// 줌 버튼 드래그 시작
zoomButton.addEventListener('mousedown', () => {
    isDraggingZoom = true;
});

// 줌 버튼 드래그 종료
document.addEventListener('mouseup', () => {
    isDraggingZoom = false;
    isDraggingImage = false;
});

// 줌 버튼 드래그 중 이벤트
document.addEventListener('mousemove', (e) => {
    if (isDraggingZoom) {
        updateZoomButtonAndScale(e.clientX);
    }
});

// 줌 트랙 클릭 이벤트
zoomTrack.addEventListener('click', (e) => {
    updateZoomButtonAndScale(e.clientX);
});

// 이미지 드래그 시작 이벤트 (zoomableImages 전체 적용)
zoomableImages.forEach((image) => {
    image.addEventListener('mousedown', (e) => {
        isDraggingImage = true;
        startX = e.clientX;
        startY = e.clientY;
    });
});

// 이미지 드래그 중 이벤트
document.addEventListener('mousemove', (e) => {
    if (isDraggingImage) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        startX = e.clientX;
        startY = e.clientY;

        // 오프셋 업데이트
        offsetX = Math.max(
            Math.min(offsetX + deltaX, container.offsetWidth / 2),
            -container.offsetWidth / 2
        );
        offsetY = Math.max(
            Math.min(offsetY + deltaY, container.offsetHeight / 2),
            -container.offsetHeight / 2
        );

        updateImageTransform();
    }
});

// 이미지 이동 및 줌 업데이트 함수
function updateImageTransform() {
    zoomableImages.forEach((image) => {
        image.style.transform = `
            translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))
            scale(${zoomScale})
        `;
    });
}

// 이미지 중심 리셋 함수
function resetImagePosition() {
    offsetX = 0;
    offsetY = 0;
    updateImageTransform();
}

// 줌 버튼과 확대 비율 업데이트 함수
function updateZoomButtonAndScale(clientX) {
    const trackRect = zoomTrack.getBoundingClientRect();
    let newLeft = clientX - trackRect.left;

    // 버튼 이동 제한 (트랙의 범위 안에서만)
    newLeft = Math.max(0, Math.min(newLeft, trackRect.width));

    // 버튼 위치 업데이트
    zoomButton.style.left = `${newLeft}px`;

    // 확대 비율 계산 (0 ~ 1)
    const zoomRatio = newLeft / trackRect.width;

    const minScale = 1; // 기본 크기
    const maxScale = 2.5; // 최대 확대 배율
    const previousZoomScale = zoomScale; // 이전 줌배율 저장
    zoomScale = minScale + zoomRatio * (maxScale - minScale);

    // 줌아웃 > 이미지 중심 리셋
    if (zoomScale < previousZoomScale) {
        resetImagePosition();
    }

    updateImageTransform();
}
