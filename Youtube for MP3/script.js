let currentDownloadUrl = '';

function clearInput() {
  document.getElementById('youtubeUrl').value = '';
}

function convertToMp3() {
  const youtubeUrl = document.getElementById('youtubeUrl').value.trim();
  const quality = document.getElementById('quality').value;
  const format = document.getElementById('format').value;

  if (!youtubeUrl || (!youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be'))) {
    alert('Por favor, insira um link válido do YouTube');
    return;
  }

  document.getElementById('convertBtn').classList.add('hidden');
  document.getElementById('loading').classList.remove('hidden');

  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += 10;
    document.querySelector('.loading-spinner').style.borderTopColor =
      `hsl(${progress * 3.6}, 100%, 50%)`;

    if (progress >= 100) {
      clearInterval(progressInterval);

      const videoId = extractVideoId(youtubeUrl);
      const videoTitle = document.getElementById('youtubeUrl').value.includes('v=')
        ? document.getElementById('youtubeUrl').value.split('v=')[1].split('&')[0] + ' - YouTube'
        : "Música do YouTube";

      const videoData = {
        title: videoTitle,
        duration: "3:45",
        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        downloadUrl: `https://ytconvertapi.net/download?id=${videoId}&q=${quality}&f=${format.toLowerCase()}`
      };

      currentDownloadUrl = videoData.downloadUrl;

      document.getElementById('loading').classList.add('hidden');
      document.getElementById('videoTitle').textContent = videoData.title;
      document.getElementById('videoDuration').textContent = `Duração: ${videoData.duration}`;
      document.getElementById('thumbnail').src = videoData.thumbnail;
      document.getElementById('result').classList.remove('hidden');
    }
  }, 300);
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

  const zipUrl = currentDownloadUrl.replace('.mp3', '.zip');
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
  downloadAudio();
  setTimeout(downloadZip, 1000);
}

function copyLink() {
  navigator.clipboard.writeText(currentDownloadUrl)
    .then(() => alert('Link copiado para área de transferência!'))
    .catch(err => alert('Falha ao copiar link: ' + err));
}
