window.onload = function() {
    // [1] 레트로 로딩 화면 실행
    const loadingScreen = document.getElementById('loading_screen');
    const fill = document.querySelector('.progress_fill');
    const fileName = document.getElementById('file_name');
    const files = ['kernel32.dll', 'user32.exe', 'shell32.dll', 'sound.wav', 'ready!'];
    
    let width = 0;
    let fileIdx = 0;

    if (loadingScreen) {
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                setTimeout(() => { loadingScreen.style.display = 'none'; }, 500);
            } else {
                width += Math.random() * 15; 
                if (width > 100) width = 100;
                fill.style.width = width + '%';
                if (width % 20 < 5) {
                    fileName.innerText = files[fileIdx % files.length];
                    fileIdx++;
                }
            }
        }, 100);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    let zIndex = 1000;

    // [2] 창 열기 (data-open 속성 연결)
    document.querySelectorAll('[data-open]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-open');
            const targetWindow = document.getElementById(targetId);

            if (targetWindow) {
                targetWindow.style.display = 'block';
                zIndex++;
                targetWindow.style.zIndex = zIndex;
                
                // 비디오가 있다면 처음부터 재생 (선택사항)
                const video = targetWindow.querySelector('video');
                if (video) video.play();
            }
        });
    });

    // [3] 창 닫기 (.closer 또는 .ok 클릭 시) + 비디오 정지 기능
    document.querySelectorAll('.closer, .ok').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetWindow = btn.closest('.interface');
            if (targetWindow) {
                // 비디오/오디오 정지 로직
                const video = targetWindow.querySelector('video');
                if (video) {
                    video.pause();
                    video.currentTime = 0; // 다시 열 때 처음부터 나오게 리셋
                }
                
                targetWindow.style.display = 'none';
            }
        });
    });

    // [4] 클릭 시 해당 창을 맨 위로 (z-index 관리)
    document.querySelectorAll('.interface').forEach(win => {
        win.addEventListener('mousedown', () => {
            zIndex++;
            win.style.zIndex = zIndex;
        });
    });

    // [5] 드래그 앤 드롭 (.inter_heder 잡고 이동)
    document.querySelectorAll('.inter_heder').forEach(header => {
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.closer') || e.target.closest('.ok')) return;

            const win = header.closest('.interface');
            let shiftX = e.clientX - win.getBoundingClientRect().left;
            let shiftY = e.clientY - win.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                win.style.left = pageX - shiftX + 'px';
                win.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            document.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                document.onmouseup = null;
            };
        });
        header.ondragstart = () => false;
    });
});