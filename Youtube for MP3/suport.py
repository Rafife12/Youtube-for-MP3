@app.route('/download', methods=['GET'])
def download():
    video_url = request.args.get('url')
    quality = request.args.get('quality', 'highest')
    audio_format = request.args.get('format', 'mp3')  # Novo parâmetro

    try:
        # Baixar o vídeo
        yt = YouTube(video_url)
        stream = yt.streams.filter(only_audio=True).order_by('abr').desc().first()
        audio_file = stream.download(filename='audio.mp4')

        # Converter para o formato desejado
        audio = AudioSegment.from_file(audio_file)
        output_file = f'audio.{audio_format}'
        audio.export(output_file, format=audio_format)

        # Remover o arquivo de áudio original
        os.remove(audio_file)

        return send_file(output_file, as_attachment=True)

    except Exception as e:
        return str(e), 400
