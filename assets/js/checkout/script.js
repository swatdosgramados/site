document.getElementById('year').textContent = new Date().getFullYear();

const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbylAV3oOLXvGxCNMTd3NaWstea_CAhjwvn6TTUBzqBDxlF03RyS3x7A0R2KVsRpExXO0A/exec';
const urlParams = new URLSearchParams(window.location.search);

const order_nsu = urlParams.get('order_nsu') || null;
const receipt_url= urlParams.get('receipt_url') || null;
const action = urlParams.get('action') || null;
const token = urlParams.get('token') || null;
const route = urlParams.get('route') || null;
const receiptUrl = urlParams.get('receipt_url') || '#';

const params = new URLSearchParams({
    order_nsu: order_nsu,
    receipt_url: receipt_url,
    token: token,
    route: route,
    action: action
});

async function fetchPaymentStatus() {
    const container = document.getElementById('payment-status');
    try {
        const response = await fetch(`${API_ENDPOINT}?${params.toString()}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        let html = '';

        if (data.status === 'confirmed') {
            html = `
            <div class="icon status-confirmed">✅</div>
            <h1 class="status-confirmed">Pagamento confirmado!</h1>
            <p>Obrigado por seu pagamento.<br>Seu ingresso foi gerado com sucesso.</p>
            <div class="dropdown">
              <button class="button">DOWNLOAD</button>
              <div class="dropdown-content">
                <a href="${data.payload.ticket || '#'}" target="_blank" download>Ingresso</a>
                <a href="${receiptUrl}" target="_blank">Recibo</a>
              </div>
            </div>
          `;
        } else if (data.status === 'declined') {
            html = `
            <div class="icon status-declined">❌</div>
            <h1 class="status-declined">Pagamento recusado!</h1>
            <p>O pagamento não foi aprovado.<br>Se o valor foi debitado, ele será estornado nas próximas horas.</p>
          `;
        } else {
            html = `
            <div class="icon">❓</div>
            <h1>Status desconhecido</h1>
            <p>Não foi possível determinar o status do pagamento.</p>
          `;
        }

        container.innerHTML = html;

    } catch (error) {
        container.innerHTML = `
          <div class="icon">⚠️</div>
          <h1>Erro na consulta</h1>
          <p>Não foi possível obter o status do pagamento.<br>Tente novamente mais tarde.</p>
        `;
        console.error('Erro ao buscar status do pagamento:', error);
    }
}

fetchPaymentStatus();
