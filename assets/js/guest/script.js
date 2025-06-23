const generateBtn = document.getElementById('generateBtn');
const loader = document.getElementById('loader');
const titleDate = document.getElementById('titleDate');
const nextSaturday = getNextSaturday();
const nextSaturdayStr = formatDateFull(nextSaturday);

titleDate.innerText = nextSaturdayStr;
document.getElementById('year').textContent = new Date().getFullYear();

generateBtn.onclick = () => {
    const userName = document.getElementById('userName').value.trim();
    if (!userName) {
        alert('Por favor, insira seu nome completo.');
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
        alert(data.message || 'Erro ao gerar o link de pagamento.');
        }
    })
    .catch(() => {
        loader.style.display = 'none';
        generateBtn.disabled = false;
        generateBtn.textContent = 'Gerar link de pagamento';
        alert('Erro na comunicação com o servidor.');
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
