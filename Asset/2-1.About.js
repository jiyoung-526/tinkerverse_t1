const fieldsUsingInnerHTML = ['about_exhibit']; // <br> 처리가 필요한 필드

document.addEventListener("DOMContentLoaded", () => {
    // data-key 속성을 가진 모든 요소에 텍스트를 업데이트
    updateTextContent();
});

// 텍스트 업데이트 함수
function updateTextContent() {
    document.querySelectorAll("[data-key]").forEach(element => {
        const key = element.getAttribute('data-key'); // data-key 값
        const content = translations?.[currentLang]?.[key] || ''; // 현재 언어 텍스트

        if (fieldsUsingInnerHTML.includes(key)) {
            element.innerHTML = content; // HTML 형식으로 렌더링 (<br> 태그 적용)
        } else {
            element.textContent = content; // 일반 텍스트로 렌더링
        }
    });
}
