import handleStoryblokMessage from './handleStoryblokMessage'

export default function setupStoryblokLiveEditor() {
  if (window?.storyblokRegisterEvent !== undefined) {
    console.log(window['storyblokRegisterEvent'])
  }
  window.addEventListener('message', handleStoryblokMessage, false)
}
