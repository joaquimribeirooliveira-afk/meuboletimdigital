// ARRAY: uma lista organizada de dados. Aqui guardamos as 15 disciplinas.
// OBJETO: agrupa informações de um mesmo item usando { chave: valor }.
const disciplinas = [
  { disciplina: "Língua Portuguesa", tri1: 82, tri2: "7,8", tri3: 85, faltas: [2, 1, 1] },
  { disciplina: "Matemática", tri1: 52, tri2: "5,8", tri3: null, faltas: [3, 2, 1] },
  { disciplina: "Ciências", tri1: "8,1", tri2: 76, tri3: 8.0, faltas: [1, 2, 0] },
  { disciplina: "História", tri1: 7.0, tri2: 84, tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Geografia", tri1: 68, tri2: 7.3, tri3: "7,9", faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 86, tri2: "8,1", tri3: 8.7, faltas: [1, 0, 0] },
  { disciplina: "Arte", tri1: 9.0, tri2: 92, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 95, tri2: 9.0, tri3: "9,4", faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 88, tri2: 9.1, tri3: 93, faltas: [1, 0, 1] },
  { disciplina: "Educação Financeira", tri1: 74, tri2: "7,8", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Estudo Orientado", tri1: 8.0, tri2: 83, tri3: "8,5", faltas: [0, 1, 0] },
  { disciplina: "Redação e Leitura", tri1: 62, tri2: "6,8", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 48, tri2: 5.6, tri3: "6,0", faltas: [2, 2, 1] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,7", tri2: 80, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Práticas Experimentais", tri1: 58, tri2: "6,2", tri3: 6.4, faltas: [1, 1, 1] }
];

// FUNÇÃO: bloco de código que faz uma tarefa específica.
// Função responsável por converter qualquer formato de nota para a escala de 0 a 10.
function normalizarNota(valor) {
  // IF: estrutura de decisão ("se algo for verdade, faça isso").
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Trata vírgulas trocando por ponto decimal
  let strValor = String(valor).replace(',', '.');
  let numero = parseFloat(strValor);

  if (isNaN(numero)) {
    return null;
  }

  // Se a nota estiver entre 0 e 10, se mantém igual
  if (numero >= 0 && numero <= 10) {
    return numero;
  }
  // Se for maior que 10 e menor/igual a 100, divide por 10 (ex: 82 vira 8.2)
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  return null;
}

// Formata o número para exibir com vírgula ou "—" se não existir nota
function formatarNotaExibicao(nota) {
  if (nota === null) return "—";
  return nota.toFixed(1).replace('.', ',');
}

// Efeito sonoro ASMR sutil usando a sintese de áudio do próprio navegador
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
    // Navegadores que bloqueiam áudio automático não darão erro
  }
}

// Preenche a tabela e calcula os cards
function carregarBoletim() {
  // DOM: permite ao JavaScript alterar o HTML da página.
  // VARIÁVEL: lugar na memória para guardar valores.
  const tabela = document.getElementById("tabela-boletim");
  
  let somaTodasMedias = 0;
  let qtdDisciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let qtdBomDesempenho = 0;
  let qtdAtencao = 0;

  // FOREACH: passa por cada item da lista (array) de disciplinas.
  disciplinas.forEach(item => {
    // Normalizar as notas de cada trimestre
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    // Média calculada apenas com as notas existentes (ignora notas ausentes)
    const notasValidas = [n1, n2, n3].filter(n => n !== null);
    let mediaDisciplina = null;

    if (notasValidas.length > 0) {
      const soma = notasValidas.reduce((acc, curr) => acc + curr, 0);
      mediaDisciplina = soma / notasValidas.length;
      somaTodasMedias += mediaDisciplina;
      qtdDisciplinasComMedia++;
    }

    // Somar faltas da disciplina
    const totalFaltasDisciplina = item.faltas.reduce((acc, curr) => acc + curr, 0);
    totalFaltasGeral += totalFaltasDisciplina;

    // Situação da disciplina
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

    // Criar a linha da tabela no HTML
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

    // Adiciona o toque de som ASMR ao passar o mouse na linha
    tr.addEventListener("mouseenter", () => tocarSomASMR(320));

    tabela.appendChild(tr);
  });

  // Atualizar os Cards de Resumo via DOM
  const mediaGeralCalculada = qtdDisciplinasComMedia > 0 
    ? (somaTodasMedias / qtdDisciplinasComMedia).toFixed(1).replace('.', ',') 
    : "—";

  document.getElementById("card-media-geral").innerText = mediaGeralCalculada;
  document.getElementById("card-total-faltas").innerText = totalFaltasGeral;
  document.getElementById("card-bom-desempenho").innerText = qtdBomDesempenho;
  document.getElementById("card-atencao").innerText = qtdAtencao;

  // NOTA DE FREQUÊNCIA: O valor de 92% exibido na interface é apenas demonstrativo/fictício e será tratado dinamicamente no futuro.

  // Som ASMR nos cards
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("mouseenter", () => tocarSomASMR(520));
  });
}

// Executa a função assim que o HTML carregar completamente
document.addEventListener("DOMContentLoaded", carregarBoletim);