// Configuração das etapas da rotina
const steps = [
  "Acordar",
  "Tomar banho",
  "Arrumar o cabelo",
  "Tomar café",
  "Trocar de roupa",
  "Ir para a escola",
  "Voltar da escola",
  "Arrumar a casa",
  "Assistir a um filme",
  "Fazer a janta",
  "Jantar",
  "Lavar a louça",
  "Tomar outro banho",
  "Fazer mais umas coisas",
  "Ir dormir"
];

let currentStep = -1;
let isBugged = false;
let bugResolved = false;
let autoInterval = null;

const statusBox = document.getElementById("status-box");
const logBox = document.getElementById("log");
const btnFix = document.getElementById("btn-fix");
const btnNext = document.getElementById("btn-next");
const btnAuto = document.getElementById("btn-auto");

function addLog(message, isError = false) {
  const p = document.createElement("p");
  p.className = isError ? "log-error" : "log-entry";
  p.textContent = `> ${message}`;
  logBox.appendChild(p);
  logBox.scrollTop = logBox.scrollHeight;
}

function nextStep() {
  // Se houver um bug ativo, impede de avançar
  if (isBugged) {
    addLog("ERRO 500: Loop Infinito detectado em 'Arrumar a casa'! Impossível prosseguir.", true);
    statusBox.textContent = "🚨 BUG DETECTADO! A casa nunca fica limpa. O sistema travou!";
    return;
  }

  // Final da rotina
  if (currentStep >= steps.length - 1) {
    statusBox.textContent = "🎉 Rotina concluída com sucesso! Boa noite!";
    addLog("Rotina finalizada. Sistema entrou em modo de repouso.");
    stopAuto();
    return;
  }

  // Atualiza nó anterior como concluído
  if (currentStep >= 0) {
    const prevNode = document.getElementById(`node-${currentStep}`);
    prevNode.classList.remove("active");
    prevNode.classList.add("completed");
  }

  currentStep++;

  const currentNode = document.getElementById(`node-${currentStep}`);
  currentNode.classList.add("active");
  currentNode.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // IMPLEMENTAÇÃO DO BUG (Etapa 7: Arrumar a casa)
  if (currentStep === 7 && !bugResolved) {
    triggerBug(currentNode);
    return;
  }

  statusBox.textContent = `Executando: ${steps[currentStep]}`;
  addLog(`Passo ${currentStep + 1} executado: ${steps[currentStep]}`);
}

function triggerBug(node) {
  isBugged = true;
  stopAuto();
  node.classList.add("bugged");
  
  btnFix.disabled = false;
  btnNext.disabled = true;

  statusBox.textContent = "🚨 BUG DETECTADO! 'Arrumar a casa' entrou em loop infinito!";
  addLog("CRITICAL ERROR: While(casaSuja) { arrumar(); } - Variavel de término ausente!", true);
}

function fixBug() {
  if (!isBugged) return;

  isBugged = false;
  bugResolved = true;

  const node = document.getElementById("node-7");
  node.classList.remove("bugged");

  btnFix.disabled = true;
  btnNext.disabled = false;

  statusBox.textContent = "✅ Bug corrigido! Condição de parada adicionada à faxina.";
  addLog("DEBUG: Patch aplicado com sucesso! Variável casaLimpa = true.");

  // Continua para a próxima etapa normalmente
  nextStep();
}

function toggleAuto() {
  if (autoInterval) {
    stopAuto();
  } else {
    btnAuto.textContent = "Pausar Automático";
    autoInterval = setInterval(() => {
      if (isBugged) {
        stopAuto();
      } else {
        nextStep();
      }
    }, 1500);
  }
}

function stopAuto() {
  clearInterval(autoInterval);
  autoInterval = null;
  btnAuto.textContent = "Modo Automático";
}

function resetRoutine() {
  stopAuto();
  currentStep = -1;
  isBugged = false;
  bugResolved = false;

  btnFix.disabled = true;
  btnNext.disabled = false;

  // Limpa classes dos elementos
  steps.forEach((_, index) => {
    const node = document.getElementById(`node-${index}`);
    node.className = "node";
  });

  logBox.innerHTML = "";
  statusBox.textContent = "Aguardando início...";
  addLog("Sistema reiniciado.");
}
