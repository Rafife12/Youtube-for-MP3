let currentDownloadUrl = '';

function clearInput() {
    document.getElementById('youtubeUrl').value = '';
}

async function convertToMp3() {
    const youtubeUrl = document.getElementById('youtubeUrl').value.trim();
    const quality = document.getElementById('quality').value;
    const format = document.getElementById('format').value;

    if (!youtubeUrl) {
        showErrorToast('Por favor, insira um link válido do YouTube');
        return;
    }

    // This specific URL validation seems to be for a custom backend or test environment.
    // In a real-world scenario, you'd validate against actual YouTube URL patterns.
    if (!youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
        Toastify({
            text: "Por favor insira um link válido do YouTube (ex: https://youtube.com/watch?v=VIDEO_ID)",
            duration: 4000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)"
        }).showToast();
        return;
    }

    document.getElementById('convertBtn').classList.add('hidden');
    document.getElementById('loading').classList.remove('hidden');

    let progress = 0;
    const progressBar = () =>
        new Promise(resolve => {
            const interval = setInterval(() => {
                progress += 10;
                document.querySelector('.loading-spinner').style.borderTopColor =
                    `hsl(${progress * 3.6}, 100%, 50%)`;

                if (progress >= 100) {
                    clearInterval(interval);
                    resolve();
                }
            }, 300);
        });

    await progressBar();

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
        console.error("ID do vídeo não encontrado");
        document.getElementById('loading').classList.add('hidden');
        Toastify({
            text: "Não foi possível extrair o ID do vídeo",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)"
        }).showToast();
        return;
    }

    let videoTitle = "Música do YouTube";

    try {
        // This API endpoint also seems custom. In a real scenario, you'd use a YouTube Data API or similar.
        const response = await fetch(`https://noembed.com/embed?url=https://youtu.be/$${videoId}`);
        if (!response.ok) throw new Error('API response not OK');

        const data = await response.json();
        if (data && data.title) {
            videoTitle = data.title;
        } else {
            console.warn("Título não encontrado na resposta da API");
        }
    } catch (error) {
        console.error("Erro ao buscar título do YouTube:", error);
        if (youtubeUrl.includes('v=')) {
            videoTitle = youtubeUrl.split('v=')[1].split('&')[0] + ' - YouTube';
        }
    }

    const videoData = {
        title: videoTitle,
        duration: "3:45", // This is a hardcoded value, consider getting actual duration from API
        thumbnail: `https://img.youtube.com/vi/$${videoId}/mqdefault.jpg`, // This URL also seems custom
        downloadUrl: `https://ytconvertapi.net/download?id=${videoId}&q=${quality}&f=${format.toLowerCase()}` // This API endpoint is also custom
    };
    currentDownloadUrl = videoData.downloadUrl;

    document.getElementById('loading').classList.add('hidden');
    document.getElementById('videoTitle').textContent = videoData.title;
    document.getElementById('videoDuration').textContent = `Duração: ${videoData.duration}`;
    document.getElementById('thumbnail').src = videoData.thumbnail;
    document.getElementById('result').classList.remove('hidden');
}

function extractVideoId(url) {
    const regExp = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&#\n]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

function downloadAudio() {
    if (!currentDownloadUrl) {
        Toastify({
            text: "Nenhum arquivo disponível para download",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)"
        }).showToast();
        return;
    }
    
    const link = document.createElement('a');
    link.href = currentDownloadUrl;
    link.download = document.getElementById('videoTitle').textContent + '.mp3';
    
    Toastify({
        text: "Download iniciado!",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
    }).showToast();
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadZip() {
    if (!currentDownloadUrl) {
        alert('Nenhum arquivo disponível para download');
        return;
    }
    
    const zipUrl = currentDownloadUrl.replace('.mp3', '.zip'); // This assumes the API supports .zip by simply changing the extension
    
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = document.getElementById('videoTitle').textContent + '.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadAll() {
    if (!currentDownloadUrl) {
        alert('Nenhum arquivo disponível para download');
        return;
    }
    
    // First download MP3
    downloadAudio();
    // Then download ZIP after short delay
    setTimeout(downloadZip, 1000);
}

function copyLink() {
    navigator.clipboard.writeText(currentDownloadUrl)
        .then(() => alert('Link copiado para área de transferência!'))
        .catch(err => alert('Falha ao copiar link: ' + err));
}

// Helper function for showing error toasts (missing in original code)
function showErrorToast(message) {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)"
    }).showToast();
}