import express from 'express';
import cors from 'cors';
import ytdl from 'ytdl-core';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/download', async (req, res) => {
  const videoURL = req.query.url;

  if (!ytdl.validateURL(videoURL)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    const info = await ytdl.getInfo(videoURL);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

    res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
    res.setHeader('Content-Type', 'audio/mpeg');

    ytdl(videoURL, {
      filter: 'audioonly',
      quality: 'highestaudio'
    }).pipe(res);

  } catch (error) {
    res.status(500).json({ error: 'Error downloading audio' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
