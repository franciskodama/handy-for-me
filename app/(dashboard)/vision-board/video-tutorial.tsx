export default function VideoTutorial(): React.ReactNode {
  return (
    <video width="1200" height="720" controls>
      <source src="videos/tutorial-vision-board.mp4" type="video/mp4" />
      <track
        src="/path/to/captions.vtt"
        kind="subtitles"
        srcLang="en"
        label="English"
      />
      Your browser does not support the video tag.
    </video>
  );
}
