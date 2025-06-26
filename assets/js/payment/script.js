const generateBtn = document.getElementById('generateBtn');
const loader = document.getElementById('loader');
const titleDate = document.getElementById('titleDate');
const nextSaturday = getNextSaturday();
const nextSaturdayStr = formatDateFull(nextSaturday);

titleDate.innerText = nextSaturdayStr;
document.getElementById('year').textContent = new Date().getFullYear();

generateBtn.onclick = () => {
    const userNameInput = document.getElementById('userName').value.trim();
    const userName = formatName(userNameInput);

    if (!userName) {
        showToast('Informe seu nome.');
        return;
    }

    if (!isValidFullName(userName)) {
        showToast('Informe seu nome e sobrenome.');
        return;
    }

    loader.style.display = 'block';
    generateBtn.disabled = true;
    generateBtn.textContent = 'Gerando...';

    const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbylAV3oOLXvGxCNMTd3NaWstea_CAhjwvn6TTUBzqBDxlF03RyS3x7A0R2KVsRpExXO0A/exec';
    const urlParams = new URLSearchParams(window.location.search);

    const route = urlParams.get('route') || null;
    const action = urlParams.get('action') || null;
    const token = urlParams.get('token') || null;
    
    const params = new URLSearchParams({
        token: token,
        route: route,
        action: action,
        name: userName
    });

    fetch(`${API_ENDPOINT}?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
            loader.style.display = 'none';
            generateBtn.disabled = false;
            generateBtn.textContent = 'Gerar link de pagamento';

            if (data.status === 'success') {
                window.open(data.link, '_top');
            } else {
                showToast(data.message || 'Erro ao gerar o link de pagamento.');
            }
        })
        .catch(() => {
            loader.style.display = 'none';
            generateBtn.disabled = false;
            generateBtn.textContent = 'Gerar link de pagamento';
            showToast('Erro na comunicação com o servidor.');
        });
};

function formatDateFull(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('pt-BR', { month: 'long' });
    const year = date.getFullYear();
    return `${day} de ${month} de ${year}`;
}

function getNextSaturday() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + daysUntilSaturday);
    return nextSaturday;
}

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    toast.onclick = () => {
        toast.classList.remove('show');
        toast.onclick = null;
        clearTimeout(hideTimeout);
    };

    const hideTimeout = setTimeout(() => {
        toast.classList.remove('show');
        toast.onclick = null;
    }, duration);
}

function isValidFullName(name) {
    const parts = name.trim().split(' ').filter(part => part);
    return parts.length >= 2;
}

function formatName(fullName) {
  const words = fullName
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const firstTwo = words.slice(0, 2);

  const capitalized = firstTwo.map(word => word.charAt(0).toUpperCase() + word.slice(1));

  return capitalized.join(' ');
}
