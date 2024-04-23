import mergeWith from 'lodash.mergewith'

export default async function handleStoryblokMessage(event) {
  //Onliy listen to messages from the app.storyblok.com
  if (event.origin !== 'https://app.storyblok.com') return

  const { action, story } = event.data
  //in the case of input event
  if (action === 'input' && story) {
    const currentBody = document.body

    const newBody = await getNewHTMLBody(story)
    if (newBody.outerHTML === currentBody.outerHTML) return

    //Get current focused element in storyblok
    const focusedElem = document.querySelector('[data-blok-focused="true"]')
    updateDOMWithNewBody(currentBody, newBody, focusedElem)
  } else if (['published', 'unpublished'].includes(event?.data?.action)) {
    location.reload()
  }
}
function updateDOMWithNewBody(currentBody, newBody, focusedElem) {
  if (focusedElem) {
    //Get the [data-blok-uid] of the focused element in storyblok
    const focusedElementID = focusedElem.getAttribute('data-blok-uid')
    //Now find the same element by above [data-blok-uid] in our new virtual HTML page
    const newDomFocusElem = newBody.querySelector(
      `[data-blok-uid="${focusedElementID}"]`
    )
    if (newDomFocusElem) {
      // Add the [data-blok-focused] attribute to the above element
      newDomFocusElem.setAttribute('data-blok-focused', 'true')
      console.log('Doing partial replace')
      focusedElem.replaceWith(newDomFocusElem)
    }
  } else {
    //We can make this part even better
    // const allStoryblokElem =
    //   document.querySelectorAll('[data-blok-uid]')
    // console.log({ allStoryblokElem })

    console.log('Doing full replace')
    currentBody.replaceWith(newBody)
  }
}

async function getNewHTMLBody(story) {
  const result = await fetch(location.href, {
    method: 'POST',
    body: JSON.stringify({
      ...story,
      is_storyblok_preview: true,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const html = await result.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  return doc.body
}
// const dataElement = document.getElementById('story-json')
// const initialStoryContent = JSON.parse(dataElement.dataset.story)
// let resolved_stories = []
// if (initialStoryContent) {
//   resolved_stories = getAllResolvedStory(initialStoryContent)
// }
// const newContent = mergeStoryIfPossible(story.content, resolved_stories)
// const currentBody = document.body
// const newBody = await getNewHTMLBody({ ...story, content: newContent })
function getAllResolvedStory(oldStory) {
  let resolved = []
  function customizer(objValue, srcValue) {
    if (srcValue?._stopResolving) {
      resolved.push(srcValue)
    }
  }
  mergeWith({}, oldStory, customizer)
  return resolved
}

function mergeStoryIfPossible(newStory, resolved_stories) {
  function customizer(objValue, srcValue) {
    if (Array.isArray(srcValue)) {
      if (typeof srcValue[0] === 'string') {
        let f = []
        srcValue.forEach((uid) => {
          let alHaveit = resolved_stories.find((post) => post['uuid'] === uid)
          if (alHaveit) {
            f = [...f, alHaveit]
          } else {
            console.log(
              'New resolve property added, need to solve this condition.'
            )
          }
        })
        return f
      }
    }
  }

  return mergeWith({}, newStory, customizer)
}
