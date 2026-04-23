const form = document.getElementById('generateForm');
const statusEl = document.getElementById('status');
const galleryEl = document.getElementById('gallery');

const setStatus = (text, type = 'info') => {
  statusEl.className = `status ${type}`;
  statusEl.textContent = text;
};

const buildPayload = ({ prompt, n, size, background, model, files }) => {
  const payload = new FormData();
  payload.append('model', model || 'gpt-image-1');
  payload.append('prompt', prompt);
  payload.append('n', String(Math.max(1, Math.min(10, Number(n) || 1))));
  payload.append('size', size || '1024x1024');
  payload.append('background', background || 'auto');

  const picked = [...files].slice(0, 16);
  picked.forEach((file) => payload.append('image[]', file));

  return payload;
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  galleryEl.innerHTML = '';

  const apiKey = document.getElementById('apiKey').value.trim();
  const prompt = document.getElementById('prompt').value.trim();
  const files = document.getElementById('references').files;
  const n = document.getElementById('n').value;
  const size = document.getElementById('size').value;
  const background = document.getElementById('background').value;
  const model = document.getElementById('model').value;

  if (!apiKey) {
    setStatus('API key is required.', 'error');
    return;
  }

  if (!prompt) {
    setStatus('Prompt is required.', 'error');
    return;
  }

  if (!files.length) {
    setStatus('Upload at least one reference image.', 'error');
    return;
  }

  setStatus('Generating images from OpenAI... this can take 10-60 seconds.', 'info');

  try {
    const payload = buildPayload({ prompt, n, size, background, model, files });
    const res = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      body: payload
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result?.error?.message || 'Request failed.');
    }

    const images = result.data || [];
    if (!images.length) {
      setStatus('No images were returned.', 'error');
      return;
    }

    images.forEach((item, index) => {
      const card = document.createElement('article');
      card.className = 'card';
      const src = `data:image/png;base64,${item.b64_json}`;
      card.innerHTML = `
        <img src="${src}" alt="Generated image ${index + 1}" />
        <a href="${src}" download="generated-${index + 1}.png">Download #${index + 1}</a>
      `;
      galleryEl.appendChild(card);
    });

    setStatus(`Success! Generated ${images.length} image(s).`, 'success');
  } catch (error) {
    setStatus(error.message || 'Image generation failed.', 'error');
  }
});
