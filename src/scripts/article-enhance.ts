function enhanceCodeBlocks() {
  document.querySelectorAll<HTMLPreElement>('.markdown-body pre').forEach((pre, index) => {
    if (pre.querySelector('.code-copy-button')) return
    const code = pre.querySelector('code')
    if (!code) return

    if (code.className.includes('language-mermaid')) {
      const wrapper = document.createElement('div')
      wrapper.className = 'mermaid'
      wrapper.textContent = code.textContent || ''
      pre.replaceWith(wrapper)
      return
    }

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'code-copy-button'
    button.setAttribute('aria-label', '复制代码')
    button.innerHTML =
      '<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>'
    button.addEventListener('click', async () => {
      await navigator.clipboard.writeText(code.textContent || '')
      button.innerHTML =
        '<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"></path></svg>'
      window.setTimeout(() => {
        button.innerHTML =
          '<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>'
      }, 1200)
    })
    pre.append(button)
    pre.dataset.copyId = `code-${index}`
  })
}

function enhanceImages() {
  document.querySelectorAll<HTMLImageElement>('.markdown-body img').forEach((image) => {
    image.addEventListener('click', () => {
      const lightbox = document.createElement('button')
      lightbox.type = 'button'
      lightbox.className = 'image-lightbox'
      lightbox.setAttribute('aria-label', '关闭图片预览')
      lightbox.innerHTML = `<img src="${image.currentSrc || image.src}" alt="${image.alt}">`
      lightbox.addEventListener('click', () => lightbox.remove())
      document.body.append(lightbox)
    })
  })
}

async function renderMermaid() {
  const diagrams = Array.from(document.querySelectorAll<HTMLElement>('.mermaid'))
  if (diagrams.length === 0) return
  const { default: mermaid } = await import('mermaid')
  mermaid.initialize({ startOnLoad: false, theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default' })

  await Promise.all(
    diagrams.map(async (diagram, index) => {
      const source = diagram.textContent || ''
      try {
        const { svg } = await mermaid.render(`mermaid-${index}`, source)
        diagram.innerHTML = svg
      } catch {
        diagram.innerHTML = `<pre>${source}</pre>`
      }
    })
  )
}

enhanceCodeBlocks()
enhanceImages()
renderMermaid()
