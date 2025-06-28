document.getElementById('year').textContent = new Date().getFullYear();

const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbylAV3oOLXvGxCNMTd3NaWstea_CAhjwvn6TTUBzqBDxlF03RyS3x7A0R2KVsRpExXO0A/exec';
const container = document.getElementById('payment-status');
const token = new URLSearchParams(window.location.search).get('token') || null;
const jwt = new URLSearchParams(window.location.search).get('jwt') || null;
const action = new URLSearchParams(window.location.search).get('action') || null;

const params = new URLSearchParams({
    token: token,
    jwt: jwt,
    route: 'ticket-validate',
    action: action
});

function render(content) {
  container.innerHTML = content;
}

function renderValid(data) {
  const { name, type, date, orderNsu, receiptUrl } = data.payload || {};

  render(`
        <div class="icon status-confirmed">✅</div>
        <h1 class="status-confirmed">Ingresso válido</h1>
        <p>
          <strong>NOME:</strong> ${name || ''}<br>
          <strong>TIPO:</strong> ${type || ''}<br>
          <strong>DATA:</strong> ${date || ''}<br>          
          <strong><a class='receipt-link' href='${receiptUrl || '#'}' target='_blank'>COMPROVANTE</a></strong><br>
          <strong><span class='nsu'>${orderNsu || ''}</span></strong>
        </p>
      `);
}

function renderInvalid() {
  render(`
        <div class="icon status-declined">❌</div>
        <h1 class="status-declined">Ingresso inválido</h1>
        <p>Ingresso inválido ou não reconhecido.</p>
      `);
}

function renderError() {
  render(`
        <div class="icon">⚠️</div>
        <h1>Erro na validação</h1>
        <p>Não foi possível verificar o ingresso.<br>Tente novamente.</p>
      `);
}

async function validateToken() {
  if (!token || !jwt || !action) return renderInvalid();

  try {
    const res = await fetch(`${API_ENDPOINT}?${params.toString()}`);
    if (!res.ok) throw new Error('Erro na resposta da API');
    const data = await res.json();

    if (data.status === 'validated') {
      renderValid(data);
    } else {
      renderInvalid();
    }
  } catch (e) {
    console.error('Erro na verificação do ingresso:', e);
    renderError();
  }
}

validateToken();
