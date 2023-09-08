const modalClose = document.querySelector('.modal-close');
const modal = document.querySelector('.modal');
const transictionsBtns = document.querySelectorAll('.transaction-buttons > button');
const recentTransactions = document.querySelector('#recent-transactions');
const transatctionsHome = document.querySelector('#transactions-home');


transatctionsHome.addEventListener('click', (e) => {
    e.preventDefault();
    recentTransactions.classList.remove('toggle-visibility');
    document.querySelectorAll('.transaction-menu').forEach(e => e.classList.add('toggle-visibility'));
});

transictionsBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const {toggle} = btn.dataset;
        if(!toggle)
            return;
        recentTransactions.classList.add('toggle-visibility');
        document.querySelectorAll('.transaction-menu').forEach(menu => menu.classList.add('toggle-visibility'));
        document.querySelector(`#${toggle}`).classList.remove('toggle-visibility');
    });
});

modalClose.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('hide');
});

const availableInputs = ['input', 'textarea']; 
availableInputs.forEach(inputName => {
    const inputs = document.querySelectorAll(inputName);
    inputs.forEach(input => {
        
        input.addEventListener("focus", () => {
            mp.trigger('ToggleChat', 1, true, false);
        });
        
        input.addEventListener("focusout", (e) => {
            mp.trigger('ToggleChat', 1, false, false);
        });
    });
}); 