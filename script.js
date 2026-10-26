// CONFIGURAÇÃO FIXA DO ALUNO
const CONFIG_ALUNO = {
  turma: "8C",
  numeroChamada: 12,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// VARIAVEL DE SESSÃO DO PIN (permanece somente em memória durante a sessão)
let pinSessao = "";
let modoEdicao = false;

// INSTÂNCIAS DOS GRÁFICOS (ISOLADAS)
let graficoMedias = null;
let graficoEvolucao = null;
let graficoFaltas = null;

// ARRAY DE BACKUP: Lista com todas as disciplinas, notas e faltas do 8º Ano
let disciplinas = [
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

// FUNÇÃO: Normaliza qualquer valor de nota para a escala de 0 a 10 (Dados Antigos)
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
  if (nota === null || nota === undefined) return "—";
  return typeof nota === 'number' ? nota.toFixed(1).replace('.', ',') : String(nota);
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
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(350, audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (e) {
    // Silencioso
  }
}

// FUNÇÃO DA EXPLOSÃO DOURADA
function criarExplosaoDourada(e) {
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

// VALIDAÇÃO RIGOROSA PARA NOTAS DIGITADAS NO EDITOR
function validarNotaDigitada(str) {
  if (str === null || str === undefined) return { valida: true, valor: null };
  const limpo = String(str).trim();
  if (limpo === "") return { valida: true, valor: null };

  const normalizado = limpo.replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(normalizado)) {
    return { valida: false, valor: null };
  }

  const num = parseFloat(normalizado);
  if (isNaN(num) || num < 0 || num > 10) {
    return { valida: false, valor: null };
  }

  return { valida: true, valor: num };
}

// VALIDAÇÃO RIGOROSA PARA FALTAS DIGITADAS NO EDITOR
function validarFaltaDigitada(str) {
  if (str === null || str === undefined) return { valida: false, valor: null };
  const limpo = String(str).trim();
  if (limpo === "") return { valida: false, valor: null };

  if (!/^\d+$/.test(limpo)) {
    return { valida: false, valor: null };
  }

  const num = parseInt(limpo, 10);
  if (isNaN(num) || num < 0) {
    return { valida: false, valor: null };
  }

  return { valida: true, valor: num };
}

// ATUALIZA A TELA DO BOLETIM (MODO VISUALIZAÇÃO E MODO EDIÇÃO)
function carregarBoletim() {
  const tabela = document.getElementById("tabela-boletim");
  tabela.innerHTML = ""; // Limpeza antes de reconstruir para evitar duplicação

  let somaTodasMedias = 0;
  let qtdDisciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let qtdBomDesempenho = 0;
  let qtdAtencao = 0;

  disciplinas.forEach((item, index) => {
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

    const arrayFaltas = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];
    const totalFaltasDisciplina = arrayFaltas.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
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

    if (modoEdicao) {
      // Criação dos campos de input com tratamento seguro DOM
      const tdNome = document.createElement("td");
      const strongNome = document.createElement("strong");
      strongNome.textContent = item.disciplina;
      tdNome.appendChild(strongNome);

      const tdTri1 = document.createElement("td");
      const inTri1 = document.createElement("input");
      inTri1.type = "text";
      inTri1.className = "input-edicao input-edicao-nota input-tri1";
      inTri1.dataset.index = index;
      inTri1.value = item.tri1 !== null && item.tri1 !== undefined ? item.tri1 : "";
      tdTri1.appendChild(inTri1);

      const tdTri2 = document.createElement("td");
      const inTri2 = document.createElement("input");
      inTri2.type = "text";
      inTri2.className = "input-edicao input-edicao-nota input-tri2";
      inTri2.dataset.index = index;
      inTri2.value = item.tri2 !== null && item.tri2 !== undefined ? item.tri2 : "";
      tdTri2.appendChild(inTri2);

      const tdTri3 = document.createElement("td");
      const inTri3 = document.createElement("input");
      inTri3.type = "text";
      inTri3.className = "input-edicao input-edicao-nota input-tri3";
      inTri3.dataset.index = index;
      inTri3.value = item.tri3 !== null && item.tri3 !== undefined ? item.tri3 : "";
      tdTri3.appendChild(inTri3);

      const tdMedia = document.createElement("td");
      const strongMedia = document.createElement("strong");
      strongMedia.textContent = formatarNotaExibicao(mediaDisciplina);
      tdMedia.appendChild(strongMedia);

      const tdFaltas = document.createElement("td");
      const divFaltas = document.createElement("div");
      divFaltas.className = "grupo-faltas-edicao";

      [0, 1, 2].forEach(fIdx => {
        const inFalta = document.createElement("input");
        inFalta.type = "text";
        inFalta.className = `input-edicao input-edicao-falta input-falta-${fIdx}`;
        inFalta.dataset.index = index;
        inFalta.value = arrayFaltas[fIdx] !== undefined && arrayFaltas[fIdx] !== null ? arrayFaltas[fIdx] : 0;
        divFaltas.appendChild(inFalta);
      });
      tdFaltas.appendChild(divFaltas);

      const tdSit = document.createElement("td");
      const spanBadge = document.createElement("span");
      spanBadge.className = `badge ${situacaoClasse}`;
      spanBadge.textContent = situacaoTexto;
      tdSit.appendChild(spanBadge);

      tr.appendChild(tdNome);
      tr.appendChild(tdTri1);
      tr.appendChild(tdTri2);
      tr.appendChild(tdTri3);
      tr.appendChild(tdMedia);
      tr.appendChild(tdFaltas);
      tr.appendChild(tdSit);

    } else {
      // Modo de visualização normal seguro contra XSS
      const tdNome = document.createElement("td");
      const strongNome = document.createElement("strong");
      strongNome.textContent = item.disciplina;
      tdNome.appendChild(strongNome);

      const tdTri1 = document.createElement("td");
      tdTri1.textContent = formatarNotaExibicao(n1);

      const tdTri2 = document.createElement("td");
      tdTri2.textContent = formatarNotaExibicao(n2);

      const tdTri3 = document.createElement("td");
      tdTri3.textContent = formatarNotaExibicao(n3);

      const tdMedia = document.createElement("td");
      const strongMedia = document.createElement("strong");
      strongMedia.textContent = formatarNotaExibicao(mediaDisciplina);
      tdMedia.appendChild(strongMedia);

      const tdFaltas = document.createElement("td");
      tdFaltas.textContent = totalFaltasDisciplina;

      const tdSit = document.createElement("td");
      const spanBadge = document.createElement("span");
      spanBadge.className = `badge ${situacaoClasse}`;
      spanBadge.textContent = situacaoTexto;
      tdSit.appendChild(spanBadge);

      tr.appendChild(tdNome);
      tr.appendChild(tdTri1);
      tr.appendChild(tdTri2);
      tr.appendChild(tdTri3);
      tr.appendChild(tdMedia);
      tr.appendChild(tdFaltas);
      tr.appendChild(tdSit);
    }

    tr.addEventListener("mouseenter", () => tocarSomASMR(320));
    tabela.appendChild(tr);
  });

  const mediaGeralCalculada = qtdDisciplinasComMedia > 0 
    ? (somaTodasMedias / qtdDisciplinasComMedia).toFixed(1).replace('.', ',') 
    : "—";

  document.getElementById("card-media-geral").textContent = mediaGeralCalculada;
  document.getElementById("card-total-faltas").textContent = totalFaltasGeral;
  document.getElementById("card-bom-desempenho").textContent = qtdBomDesempenho;
  document.getElementById("card-atencao").textContent = qtdAtencao;

  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("mouseenter", () => tocarSomASMR(520));
  });

  // Atualização pontual da camada de gráficos após atualizar visualização da página
  atualizarGraficos();
}

// ABRIR BOLETIM PELA API
async function abrirBoletim() {
  const campoPin = document.getElementById("campo-pin");
  const msgLogin = document.getElementById("mensagem-login");
  const pinDigitado = campoPin.value.trim();

  if (!pinDigitado) {
    msgLogin.textContent = "Por favor, digite o PIN.";
    return;
  }

  msgLogin.textContent = "Conectando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      msgLogin.textContent = "Turma, chamada ou PIN inválidos.";
      return;
    }

    if (resposta.status === 429) {
      msgLogin.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      return;
    }

    if (!resposta.ok) {
      msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      return;
    }

    const resultado = await resposta.json();

    // Guarda o PIN em memória e limpa a interface por segurança
    pinSessao = pinDigitado;
    campoPin.value = "";

    // DADOS DA API > DADOS LOCAIS
    if (resultado && resultado.dados && Array.isArray(resultado.dados.disciplinas) && resultado.dados.disciplinas.length > 0) {
      disciplinas = resultado.dados.disciplinas;
    }

    document.getElementById("area-login").style.display = "none";
    document.getElementById("conteudo-boletim").style.display = "block";

    carregarBoletim();

  } catch (erro) {
    msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
  }
}

// SALVAR ALTERAÇÕES NA API
async function salvarAlteracoes() {
  const msgStatus = document.getElementById("mensagem-login");
  let existemErros = false;

  // Limpa estados visuais de erro anteriores
  document.querySelectorAll(".input-edicao").forEach(el => el.classList.remove("erro-validacao"));

  const novasDisciplinas = JSON.parse(JSON.stringify(disciplinas));

  novasDisciplinas.forEach((item, index) => {
    const inTri1 = document.querySelector(`.input-tri1[data-index="${index}"]`);
    const inTri2 = document.querySelector(`.input-tri2[data-index="${index}"]`);
    const inTri3 = document.querySelector(`.input-tri3[data-index="${index}"]`);

    const v1 = validarNotaDigitada(inTri1 ? inTri1.value : null);
    const v2 = validarNotaDigitada(inTri2 ? inTri2.value : null);
    const v3 = validarNotaDigitada(inTri3 ? inTri3.value : null);

    if (!v1.valida) { inTri1.classList.add("erro-validacao"); existemErros = true; }
    if (!v2.valida) { inTri2.classList.add("erro-validacao"); existemErros = true; }
    if (!v3.valida) { inTri3.classList.add("erro-validacao"); existemErros = true; }

    item.tri1 = v1.valida ? v1.valor : item.tri1;
    item.tri2 = v2.valida ? v2.valor : item.tri2;
    item.tri3 = v3.valida ? v3.valor : item.tri3;

    const novasFaltas = [0, 0, 0];
    [0, 1, 2].forEach(fIdx => {
      const inFalta = document.querySelector(`.input-falta-${fIdx}[data-index="${index}"]`);
      const vf = validarFaltaDigitada(inFalta ? inFalta.value : null);
      if (!vf.valida) {
        if (inFalta) inFalta.classList.add("erro-validacao");
        existemErros = true;
      } else {
        novasFaltas[fIdx] = vf.valor;
      }
    });

    item.faltas = novasFaltas;
  });

  if (existemErros) {
    alert("Existem campos com valores inválidos. Verifique os campos destacados em vermelho.");
    return;
  }

  const btnSalvar = document.getElementById("btn-alternar-edicao");
  const textoOriginal = btnSalvar.textContent;
  btnSalvar.textContent = "Salvando...";
  btnSalvar.disabled = true;

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: novasDisciplinas
        }
      })
    });

    if (!resposta.ok) {
      alert("Não foi possível salvar os dados no servidor. Mantenha os campos e tente novamente.");
      btnSalvar.textContent = textoOriginal;
      btnSalvar.disabled = false;
      return;
    }

    // Atualiza o estado global das disciplinas após sucesso
    disciplinas = novasDisciplinas;
    modoEdicao = false;
    btnSalvar.textContent = "Alterar dados";
    btnSalvar.disabled = false;

    carregarBoletim();
    alert("Dados salvos com sucesso.");

  } catch (erro) {
    alert("Falha de rede ao tentar salvar. Verifique sua conexão.");
    btnSalvar.textContent = textoOriginal;
    btnSalvar.disabled = false;
  }
}

// GERENCIA O BOTÃO ALTERAR DADOS / SALVAR ALTERAÇÕES
function alternarModoEdicao() {
  if (!modoEdicao) {
    modoEdicao = true;
    document.getElementById("btn-alternar-edicao").textContent = "Salvar alterações";
    carregarBoletim();
  } else {
    salvarAlteracoes();
  }
}

// --- FUNÇÕES DE CAMADA EXCLUSIVA DOS GRÁFICOS (SOMENTE LEITURA) ---

function atualizarGraficoMedias() {
  const canvas = document.getElementById("graficoMediasDisciplinas");
  if (!canvas) return;

  if (graficoMedias) {
    graficoMedias.destroy();
  }

  const rotulos = [];
  const valoresMedias = [];

  disciplinas.forEach(item => {
    rotulos.push(item.disciplina);

    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const notasValidas = [n1, n2, n3].filter(n => n !== null);

    if (notasValidas.length > 0) {
      const soma = notasValidas.reduce((acc, curr) => acc + curr, 0);
      valoresMedias.push(Number((soma / notasValidas.length).toFixed(1)));
    } else {
      valoresMedias.push(null);
    }
  });

  const ctx = canvas.getContext("2d");
  graficoMedias = new Chart(ctx, {
    type: "bar",
    data: {
      labels: rotulos,
      datasets: [{
        label: "Média",
        data: valoresMedias,
        backgroundColor: "#ffd700",
        borderColor: "#d4af37",
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              const val = context.raw;
              if (val === null || val === undefined) return " Sem nota";
              return ` Média: ${String(val.toFixed(1)).replace('.', ',')}`;
            }
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 10,
          ticks: { color: "#a0a0a0" },
          grid: { color: "rgba(255, 255, 255, 0.08)" }
        },
        y: {
          ticks: { color: "#f0f0f0", font: { size: 11 } },
          grid: { display: false }
        }
      }
    }
  });
}

function atualizarGraficoEvolucao() {
  const canvas = document.getElementById("graficoEvolucaoTrimestres");
  if (!canvas) return;

  if (graficoEvolucao) {
    graficoEvolucao.destroy();
  }

  const mediasTrimestres = [null, null, null];

  [0, 1, 2].forEach(idx => {
    const chaveTri = `tri${idx + 1}`;
    let somaTri = 0;
    let qtdTri = 0;

    disciplinas.forEach(item => {
      const n = normalizarNota(item[chaveTri]);
      if (n !== null) {
        somaTri += n;
        qtdTri++;
      }
    });

    if (qtdTri > 0) {
      mediasTrimestres[idx] = Number((somaTri / qtdTri).toFixed(1));
    }
  });

  const ctx = canvas.getContext("2d");
  graficoEvolucao = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["1º Tri", "2º Tri", "3º Tri"],
      datasets: [{
        label: "Média Geral",
        data: mediasTrimestres,
        borderColor: "#ffd700",
        backgroundColor: "rgba(255, 215, 0, 0.15)",
        borderWidth: 3,
        pointBackgroundColor: "#ffd700",
        pointBorderColor: "#d4af37",
        pointRadius: 6,
        fill: true,
        tension: 0.2,
        spanGaps: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              const val = context.raw;
              if (val === null || val === undefined) return " Sem notas";
              return ` Média: ${String(val.toFixed(1)).replace('.', ',')}`;
            }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 10,
          ticks: { color: "#a0a0a0" },
          grid: { color: "rgba(255, 255, 255, 0.08)" }
        },
        x: {
          ticks: { color: "#f0f0f0" },
          grid: { color: "rgba(255, 255, 255, 0.08)" }
        }
      }
    }
  });
}

function atualizarGraficoFaltas() {
  const canvas = document.getElementById("graficoFaltasTrimestres");
  const containerEstado = document.getElementById("estadoFaltas");
  if (!canvas) return;

  if (graficoFaltas) {
    graficoFaltas.destroy();
  }

  let faltasTri1 = 0;
  let faltasTri2 = 0;
  let faltasTri3 = 0;

  disciplinas.forEach(item => {
    const arr = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];
    faltasTri1 += Number(arr[0]) || 0;
    faltasTri2 += Number(arr[1]) || 0;
    faltasTri3 += Number(arr[2]) || 0;
  });

  const totalFaltasInterno = faltasTri1 + faltasTri2 + faltasTri3;
  const LIMITE_REFERENCIA_INTERNO = 350;

  const cardFaltas = canvas.closest(".grafico-card");

  if (containerEstado) {
    if (totalFaltasInterno >= LIMITE_REFERENCIA_INTERNO) {
      containerEstado.innerHTML = `<span class="badge-perigo">Perigo</span>`;
      if (cardFaltas) cardFaltas.classList.add("card-perigo");
    } else {
      containerEstado.innerHTML = "";
      if (cardFaltas) cardFaltas.classList.remove("card-perigo");
    }
  }

  const ctx = canvas.getContext("2d");
  graficoFaltas = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["1º Tri", "2º Tri", "3º Tri"],
      datasets: [{
        label: "Faltas",
        data: [faltasTri1, faltasTri2, faltasTri3],
        backgroundColor: ["#d4af37", "#ffd700", "#e6c200"],
        borderColor: "#ffd700",
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return ` ${context.raw} faltas`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: "#a0a0a0", precision: 0 },
          grid: { color: "rgba(255, 255, 255, 0.08)" }
        },
        x: {
          ticks: { color: "#f0f0f0" },
          grid: { display: false }
        }
      }
    }
  });
}

function atualizarGraficos() {
  atualizarGraficoMedias();
  atualizarGraficoEvolucao();
  atualizarGraficoFaltas();
}

// INICIALIZAÇÃO E EVENTOS
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-entrar").addEventListener("click", abrirBoletim);

  document.getElementById("campo-pin").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      abrirBoletim();
    }
  });

  document.getElementById("btn-alternar-edicao").addEventListener("click", alternarModoEdicao);

  document.addEventListener("click", criarExplosaoDourada);
});