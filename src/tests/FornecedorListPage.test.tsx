import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FornecedorListPage from '../pages/FornecedorListPage';

// Mock para o useNavigate do react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('FornecedorListPage', () => {
  test('deve renderizar a listagem de fornecedores corretamente', () => {
    render(
      <BrowserRouter>
        <FornecedorListPage />
      </BrowserRouter>
    );
    
    // Verifica se os elementos principais estão presentes
    expect(screen.getByRole('heading', { name: 'Fornecedores' })).toBeInTheDocument();
    expect(screen.getByText('Novo Fornecedor')).toBeInTheDocument();
    expect(screen.getByText('Filtros')).toBeInTheDocument();
    
    // Verifica se a tabela está presente com cabeçalhos
    expect(screen.getByText('Nome Fantasia')).toBeInTheDocument();
    expect(screen.getByText('CNPJ')).toBeInTheDocument();
    expect(screen.getByText('Telefone')).toBeInTheDocument();
    expect(screen.getByText('Categoria')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    
    // Verifica se os dados dos fornecedores estão presentes
    expect(screen.getByText('Tecidos Premium')).toBeInTheDocument();
    expect(screen.getByText('Aviamentos Gerais')).toBeInTheDocument();
    expect(screen.getByText('12.345.678/0001-90')).toBeInTheDocument();
  });
  
  test('deve exibir e ocultar o painel de filtros ao clicar no botão', () => {
    render(
      <BrowserRouter>
        <FornecedorListPage />
      </BrowserRouter>
    );
    
    // Inicialmente o painel de filtros não deve estar visível
    expect(screen.queryByText('Filtrar Fornecedores')).not.toBeInTheDocument();
    
    // Clica no botão de filtros
    fireEvent.click(screen.getByText('Filtros'));
    
    // Verifica se o painel de filtros aparece
    expect(screen.getByText('Filtrar Fornecedores')).toBeInTheDocument();
    expect(screen.getByText('Aplicar Filtros')).toBeInTheDocument();
    
    // Clica novamente no botão de filtros
    fireEvent.click(screen.getByText('Filtros'));
    
    // Verifica se o painel de filtros desaparece
    expect(screen.queryByText('Filtrar Fornecedores')).not.toBeInTheDocument();
  });
  
  test('deve filtrar fornecedores ao aplicar filtros', async () => {
    render(
      <BrowserRouter>
        <FornecedorListPage />
      </BrowserRouter>
    );
    
    // Abre o painel de filtros
    fireEvent.click(screen.getByText('Filtros'));

    // Preenche o campo de busca
    const busca = screen.getByPlaceholderText('Nome, Razão Social ou CNPJ');
    fireEvent.change(busca, { target: { value: 'Tecidos' } });

    // Seleciona a categoria
    const categoria = await screen.findByLabelText('Categoria');
    fireEvent.change(categoria, { target: { value: 'Tecidos' } });
    
    // Marca a opção "Apenas ativos"
    const apenasAtivos = screen.getByLabelText('Apenas ativos');
    fireEvent.click(apenasAtivos);
    
    // Aplica os filtros
    fireEvent.click(screen.getByText('Aplicar Filtros'));
    
    // Verifica se apenas o fornecedor "Tecidos Premium" está visível
    await waitFor(() => {
      expect(screen.getByText('Tecidos Premium')).toBeInTheDocument();
      expect(screen.queryByText('Aviamentos Gerais')).not.toBeInTheDocument();
      expect(screen.queryByText('Embalagens Express')).not.toBeInTheDocument();
    });
  });
  
  test('deve mostrar mensagem quando nenhum fornecedor for encontrado', async () => {
    render(
      <BrowserRouter>
        <FornecedorListPage />
      </BrowserRouter>
    );
    
    // Abre o painel de filtros
    fireEvent.click(screen.getByText('Filtros'));
    
    // Preenche o campo de busca com um termo que não existe
    const busca = screen.getByPlaceholderText('Nome, Razão Social ou CNPJ');
    fireEvent.change(busca, { target: { value: 'XYZ123' } });
    
    // Aplica os filtros
    fireEvent.click(screen.getByText('Aplicar Filtros'));
    
    // Verifica se a mensagem de "nenhum fornecedor encontrado" aparece
    await waitFor(() => {
      expect(screen.getByText('Nenhum fornecedor encontrado com os filtros aplicados.')).toBeInTheDocument();
    });
  });
});
