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
        showToast('Por favor, insira seu nome completo.');
        return;
    }

    if (!isValidFullName(userName)) {
        showToast('Digite seu nome completo (nome e sobrenome).');
        return;
    }

    loader.style.display = 'block';
    generateBtn.disabled = true;
    generateBtn.textContent = 'Gerando...';

    const params = new URLSearchParams({
        token: '3cPpyjKKqrBQRHC0UfwlzpsfwcdLxr5YEhEd1eMdUgd0JPTbkBW0sA1y6VrMbKRo',
        route: 'generate-checkout-link',
        action: 'guest',
        name: userName,
    });

    fetch(`https://script.google.com/macros/s/AKfycbylAV3oOLXvGxCNMTd3NaWstea_CAhjwvn6TTUBzqBDxlF03RyS3x7A0R2KVsRpExXO0A/exec?${params.toString()}`)
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

function formatName(name) {
    return name
        .toLowerCase()
        .split(' ')
        .filter(word => word)
        .map(word => word[0].toUpperCase() + word.substring(1))
        .join(' ');
}
