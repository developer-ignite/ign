/**
 * ContentWithMedia - Frontend video playback
 */
document.addEventListener("DOMContentLoaded", () => {
  const videoContainers = document.querySelectorAll(".content-with-media-video-container");

  videoContainers.forEach((container) => {
    const playButton = container.querySelector(".content-with-media-play-button");
    const video = container.querySelector("video");
    const embedContainer = container.querySelector(".embed-video-container");

    if (!playButton) return;

    playButton.addEventListener("click", () => {
      // Hide the play button and drop the decorative mask (keep rounded corners)
      playButton.classList.add("hidden");
      container.classList.add("is-playing");

      // Handle file video
      if (video) {
        video.play();
        return;
      }

      // Handle embedded video (YouTube/Vimeo)
      if (embedContainer) {
        const source = embedContainer.dataset.source;
        const videoId = embedContainer.dataset.videoId;

        if (source === "youtube") {
          embedContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="YouTube video player"></iframe>`;
        } else if (source === "vimeo") {
          embedContainer.innerHTML = `<iframe src="https://player.vimeo.com/video/${videoId}?autoplay=1&byline=0&portrait=0&badge=0&dnt=true&vimeo_logo=false&title=false" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="Vimeo video player"></iframe>`;
        }
      }
    });
  });
});
