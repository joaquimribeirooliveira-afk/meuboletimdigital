// ARRAY: Lista com todas as 15 disciplinas, notas e faltas do 8º Ano
const disciplinas = [
  { disciplina: "Língua Portuguesa", tri1: "9,4", tri2: "9,0", tri3: null, faltas: [2, 4, 0] },
  { disciplina: "Matemática", tri1: "7,5", tri2: "6,1", tri3: null, faltas: [3, 5, 0] },
  { disciplina: "Ciências", tri1: "7,1", tri2: "9,4", tri3: null, faltas: [4, 6, 0] },
  { disciplina: "História", tri1: "8,3", tri2: "9,1", tri3: null, faltas: [4, 3, 0] },
  { disciplina: "Geografia", tri1: "6,2", tri2: "7,3", tri3: null, faltas: [3, 3, 0] },
  { disciplina: "Língua Inglesa", tri1: "9,4", tri2: "9,7", tri3: null, faltas: [4, 2, 0] },
  { disciplina: "Arte", tri1: "7,6", tri2: "8,7", tri3: null, faltas: [3, 2, 0] },
  { disciplina: "Educação Física", tri1: "10,0", tri2: "9,5", tri3: null, faltas: [0, 5, 0] },
  { disciplina: "Educação Digital", tri1: "9,0", tri2: "10,0", tri3: null, faltas: [1, 4, 0] },
  { disciplina: "Educação Financeira", tri1: "10,0", tri2: "9,5", tri3: null, faltas: [1, 4, 0] },
  { disciplina: "Estudo Orientado", tri1: "7,6", tri2: "9,0", tri3: null, faltas: [4, 2, 0] },
  { disciplina: "Redação e Leitura", tri1: "8,2", tri2: "8,8", tri3: null, faltas: [2, 3, 0] },
  { disciplina: "Pensamento Lógico", tri1: "10,0", tri2: "10,0", tri3: null, faltas: [1, 0, 0] },
  { disciplina: "Literatura Arte e Movimento", tri1: "8,4", tri2: "8,0", tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Práticas Experimentais", tri1: "7,2", tri2: "8,7", tri3: null, faltas: [2, 4, 0] }
];

// FUNÇÃO: Normaliza qualquer valor de nota para a escala de 0 a 10
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  let strValor = String(valor).replace(',', '.');
  let numero = parseFloat(strValor);

  if (isNaN(numero)) {
    return null;
  }

  if (numero >= 0 && numero <= 10) {
    return numero;
  }
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  return null;
}

// Formata a nota para exibição no padrão brasileiro com vírgula (ex: 9,4)
function formatarNotaExibicao(nota) {
  if (nota === null) return "—";
  return nota.toFixed(1).replace('.', ',');
}

// Som suave de hover para cards e linhas
function tocarSomASMR(frequencia = 400) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequencia;
    gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.06);
  } catch (e) {
    // Silencioso se o áudio estiver bloqueado
  }
}

// SOM DE CLIQUE SATISFATÓRIO (Estilo "Pop" Cristalino ASMR)
function tocarSomCliqueSatisfatorio() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    // Onda de som que desce rápido gera o tom de "pop" suave
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(350, audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (e) {
    // Silencioso caso o áudio não tenha permissão
  }
}

// FUNÇÃO DA EXPLOSÃO DOURADA: Cria partículas douradas + som no clique
function criarExplosaoDourada(e) {
  // Toca o som satisfatório de clique
  tocarSomCliqueSatisfatorio();

  const quantidadeParticulas = 16;
  
  for (let i = 0; i < quantidadeParticulas; i++) {
    const particula = document.createElement("div");
    particula.classList.add("particula-ouro");
    
    const tamanho = Math.random() * 8 + 4;
    particula.style.width = `${tamanho}px`;
    particula.style.height = `${tamanho}px`;

    const angulo = Math.random() * Math.PI * 2;
    const distancia = Math.random() * 80 + 20;
    const dx = Math.cos(angulo) * distancia;
    const dy = Math.sin(angulo) * distancia;

    particula.style.setProperty("--dx", `${dx}px`);
    particula.style.setProperty("--dy", `${dy}px`);

    particula.style.left = `${e.clientX}px`;
    particula.style.top = `${e.clientY}px`;

    document.body.appendChild(particula);

    setTimeout(() => particula.remove(), 600);
  }
}

// Carrega os dados na tabela e nos cards ao abrir o site
function carregarBoletim() {
  const tabela = document.getElementById("tabela-boletim");
  
  let somaTodasMedias = 0;
  let qtdDisciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let qtdBomDesempenho = 0;
  let qtdAtencao = 0;

  disciplinas.forEach(item => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const notasValidas = [n1, n2, n3].filter(n => n !== null);
    let mediaDisciplina = null;

    if (notasValidas.length > 0) {
      const soma = notasValidas.reduce((acc, curr) => acc + curr, 0);
      mediaDisciplina = soma / notasValidas.length;
      somaTodasMedias += mediaDisciplina;
      qtdDisciplinasComMedia++;
    }

    const totalFaltasDisciplina = item.faltas.reduce((acc, curr) => acc + curr, 0);
    totalFaltasGeral += totalFaltasDisciplina;

    let situacaoTexto = "";
    let situacaoClasse = "";

    if (mediaDisciplina === null) {
      situacaoTexto = "Nota ainda não disponível";
      situacaoClasse = "badge-indisponivel";
    } else if (mediaDisciplina >= 6.0) {
      situacaoTexto = "Bom desempenho";
      situacaoClasse = "badge-bom";
      qtdBomDesempenho++;
    } else {
      situacaoTexto = "Atenção";
      situacaoClasse = "badge-atencao";
      qtdAtencao++;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.disciplina}</strong></td>
      <td>${formatarNotaExibicao(n1)}</td>
      <td>${formatarNotaExibicao(n2)}</td>
      <td>${formatarNotaExibicao(n3)}</td>
      <td><strong>${formatarNotaExibicao(mediaDisciplina)}</strong></td>
      <td>${totalFaltasDisciplina}</td>
      <td><span class="badge ${situacaoClasse}">${situacaoTexto}</span></td>
    `;

    tr.addEventListener("mouseenter", () => tocarSomASMR(320));
    tabela.appendChild(tr);
  });

  const mediaGeralCalculada = qtdDisciplinasComMedia > 0 
    ? (somaTodasMedias / qtdDisciplinasComMedia).toFixed(1).replace('.', ',') 
    : "—";

  document.getElementById("card-media-geral").innerText = mediaGeralCalculada;
  document.getElementById("card-total-faltas").innerText = totalFaltasGeral;
  document.getElementById("card-bom-desempenho").innerText = qtdBomDesempenho;
  document.getElementById("card-atencao").innerText = qtdAtencao;

  // NOTA DE FREQUÊNCIA: O valor de 92% exibido na interface é apenas demonstrativo/fictício e será tratado dinamicamente no futuro.

  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("mouseenter", () => tocarSomASMR(520));
  });

  // Escuta os cliques na página para gerar a explosão dourada e o som satisfatório
  document.addEventListener("click", criarExplosaoDourada);
}

document.addEventListener("DOMContentLoaded", carregarBoletim);