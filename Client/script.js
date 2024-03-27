let ramais = [];

function initializePage() {
  console.log('Página inicializada com os dados da API.');
}

async function fetchDataFromAPI() {
  try {
    const response = await fetch('http://localhost:8802/ramalclient');
    if (!response.ok) {
      throw new Error(`Falha ao buscar dados da API. Status: ${response.status}`);
    }

    ramais = await response.json();

    initializePage();
  } catch (error) {
    console.error('Erro ao buscar dados da API:', error.message);
  }
}

fetchDataFromAPI();

function limparSelecoes() {
  const consultaPorSelect = document.getElementById('consultaPor');
  consultaPorSelect.value = ''; // Reseta a opção de seleção
  const campoPesquisa = document.getElementById('campoPesquisa');
  campoPesquisa.innerHTML = ''; // Limpa o campo de busca
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = ''; // Limpa o resultado
}

function atualizarPagina() {
  limparSelecoes();
  location.reload();
}

function removerAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function mostrarCampoPesquisa() {
  const consultaPorSelect = document.getElementById('consultaPor');
  const campoPesquisa = document.getElementById('campoPesquisa');
  const coordenadoriaSelect = document.getElementById('coordenadoriaSelect');

  const opcaoSelecionada = consultaPorSelect.value;

  resultado.innerHTML = '';

  // Limpa o campo de busca anterior, se houver
  campoPesquisa.innerHTML = '';
  // Adiciona a verificação para ocultar o input select de coordenadoria quando a opção for "nome"
  if (opcaoSelecionada === "nome") {
    coordenadoriaSelect.style.display = 'none';
  }

  if (opcaoSelecionada === "departamento") {
    limparResultados();
    coordenadoriaSelect.style.display = 'block';

    // Preencha o novo select com as opções de coordenadorias
    const coordenadorias = [...new Set(ramais.map(ramal => ramal.NomeCoordenadoria))];
    coordenadoriaSelect.innerHTML = '<option value="" selected disabled>Selecione uma coordenadoria</option>';
    coordenadorias.forEach(coordenadoria => {
      const option = document.createElement('option');
      option.value = coordenadoria;
      option.textContent = coordenadoria;
      coordenadoriaSelect.appendChild(option);
    });

    coordenadoriaSelect.addEventListener('change', () => {
      const coordenadoriaSelecionada = coordenadoriaSelect.value;

      // Adiciona um novo select para escolher a unidade
      const unidadeSelect = document.createElement('select');
      unidadeSelect.id = 'unidadeSelect';
      unidadeSelect.innerHTML = '<option value="" selected disabled>Selecione uma unidade</option>';

       // Adiciona a opção "Mostrar todos" à lista de unidades
       const optionTodos = document.createElement('option');
       optionTodos.value = 'MostrarTodos';
       optionTodos.textContent = 'Mostrar todos';
       unidadeSelect.appendChild(optionTodos);

      const unidadesCoordenadoria = [...new Set(ramais
        .filter(ramal => ramal.NomeCoordenadoria === coordenadoriaSelecionada)
        .map(ramal => ramal.NomeUnidade)
      )];

      unidadesCoordenadoria.forEach(unidade => {
        const option = document.createElement('option');
        option.value = unidade;
        option.textContent = unidade;
        unidadeSelect.appendChild(option);
      });

      // Adiciona o novo seletor de unidade e remove o seletor de coordenadoria
      campoPesquisa.innerHTML = '';
      campoPesquisa.appendChild(unidadeSelect);
      
      unidadeSelect.addEventListener('change', () => {
        const unidadeSelecionada = unidadeSelect.value;
        if (unidadeSelecionada === 'MostrarTodos') {
          // Exibir todos os registros da coordenadoria
          const ramaisCoordenadoria = ramais.filter(ramal => ramal.NomeCoordenadoria === coordenadoriaSelecionada);
          exibirResultados(ramaisCoordenadoria);
        } else {
          // Exibir registros da unidade selecionada
          const ramaisUnidade = ramais.filter(ramal => ramal.NomeCoordenadoria === coordenadoriaSelecionada && ramal.NomeUnidade === unidadeSelecionada);
          exibirResultados(ramaisUnidade);
        }
      });
    });
  } else if (opcaoSelecionada === "nome") {
    limparResultados();
    const inputNome = document.createElement('input');
    inputNome.type = 'text';
    inputNome.id = 'pesquisaNome';
    inputNome.placeholder = 'Digite o nome...';

    const sugestoes = document.createElement('div');
    sugestoes.id = 'sugestoes';

    campoPesquisa.appendChild(inputNome);
    campoPesquisa.appendChild(sugestoes);

    inputNome.addEventListener('input', () => {
      const valorInput = removerAcentos(inputNome.value.trim().toLowerCase());
      const sugestoesFiltradas = ramais.filter(ramal => removerAcentos(ramal.Nome.toLowerCase()).includes(valorInput));

      if (valorInput === '') {
        sugestoes.style.display = 'none'; // Esconde as sugestões quando o campo está vazio
      } else {
        sugestoes.style.display = 'block'; // Mostra as sugestões quando há texto no campo
      }

      sugestoes.innerHTML = '';
      exibirResultados(sugestoesFiltradas);
    });
  } else {
    coordenadoriaSelect.style.display = 'none';
    // ... (código existente)
  }
}

function exibirResultados(ramais) {
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = '';

  if (ramais.length > 0) {
    ramais.forEach(ramal => {
      const infoColaborador = document.createElement('p');
      infoColaborador.innerHTML = `
        <p><strong>Colaborador:</strong> ${ramal.Nome}</p>
        <p><strong>Coordenadoria:</strong> ${ramal.NomeCoordenadoria}</p>
        <p><strong>Unidade:</strong> ${ramal.NomeUnidade}</p>
        <p><strong>Cargo:</strong> ${ramal.NomeCargo}</p>
        <p><strong>Ramal:</strong> ${ramal.Numero}</p>
        `;
      resultado.appendChild(infoColaborador);

      // ... (outros detalhes do ramal)

      resultado.appendChild(document.createElement('hr'));
    });
  } else {
    resultado.textContent = `Nenhum ramal encontrado para a coordenadoria selecionada.`;
  }
}

function consultarRamal() {
  const consultaPorSelect = document.getElementById('consultaPor');
  const resultado = document.getElementById('resultado');

  const opcaoSelecionada = consultaPorSelect.value;

  let ramalEncontrado;

  if (opcaoSelecionada === "nome") {
    const pesquisaNome = document.getElementById('pesquisaNome').value.trim().toLowerCase();
    ramalEncontrado = ramais.find(ramal => ramal.Nome.toLowerCase() === pesquisaNome);
  }

  if (ramalEncontrado) {
    resultado.innerHTML = `
      <p><strong>Colaborador:</strong> ${ramalEncontrado.Nome}</p>
      <p><strong>Coordenadoria:</strong> ${ramalEncontrado.NomeCoordenadoria}</p>
      <p><strong>Unidade:</strong> ${ramalEncontrado.NomeUnidade}</p>
      <p><strong>Cargo:</strong> ${ramalEncontrado.NomeCargo}</p>
      <p><strong>Ramal/TEL:</strong> ${ramalEncontrado.Numero}</p>
    `;
  } else {
    resultado.textContent = `Nenhum ramal encontrado com os critérios de busca.`;
  }
}

document.getElementById('consultaPor').addEventListener('change', mostrarCampoPesquisa);
document.getElementById('btnNovaConsulta').addEventListener('click', atualizarPagina);
mostrarCampoPesquisa();

window.onbeforeunload = () => {
  limparSelecoes();
};

function limparResultados() {
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = ''; // Limpa o conteúdo do resultado
}
