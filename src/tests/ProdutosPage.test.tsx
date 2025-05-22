import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProdutosPage from '../pages/ProdutosPage';

// Mock do hook de navegação
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock do Supabase
jest.mock('../utils/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    then: jest.fn().mockImplementation(callback => callback({
      data: [
        {
          id: 1,
          nome: 'Produto Teste 1',
          categoria: 'Vestuário',
          preco: 99.90,
          estoque: 50,
          status: 'ativo'
        },
        {
          id: 2,
          nome: 'Produto Teste 2',
          categoria: 'Acessórios',
          preco: 49.90,
          estoque: 30,
          status: 'ativo'
        }
      ],
      error: null
    })),
  },
}));

describe('ProdutosPage', () => {
  test('renderiza a lista de produtos corretamente', async () => {
    render(
      <BrowserRouter>
        <ProdutosPage />
      </BrowserRouter>
    );
    
    // Verifica se o título da página está presente
    expect(screen.getByText('Produtos')).toBeInTheDocument();
    
    // Verifica se os produtos são exibidos após o carregamento
    await waitFor(() => {
      expect(screen.getByText('Produto Teste 1')).toBeInTheDocument();
      expect(screen.getByText('Produto Teste 2')).toBeInTheDocument();
    });
    
    // Verifica se as categorias estão presentes
    expect(screen.getByText('Vestuário')).toBeInTheDocument();
    expect(screen.getByText('Acessórios')).toBeInTheDocument();
    
    // Verifica se os preços estão formatados corretamente
    expect(screen.getByText('R$ 99,90')).toBeInTheDocument();
    expect(screen.getByText('R$ 49,90')).toBeInTheDocument();
  });

  test('filtra produtos por busca', async () => {
    render(
      <BrowserRouter>
        <ProdutosPage />
      </BrowserRouter>
    );
    
    // Aguarda o carregamento dos produtos
    await waitFor(() => {
      expect(screen.getByText('Produto Teste 1')).toBeInTheDocument();
    });
    
    // Encontra o campo de busca e digita um termo
    const searchInput = screen.getByPlaceholderText(/Buscar produto/i);
    fireEvent.change(searchInput, { target: { value: 'Teste 1' } });
    
    // Verifica se apenas o produto correspondente é exibido
    await waitFor(() => {
      expect(screen.getByText('Produto Teste 1')).toBeInTheDocument();
      expect(screen.queryByText('Produto Teste 2')).not.toBeInTheDocument();
    });
  });

  test('abre o formulário de novo produto', async () => {
    render(
      <BrowserRouter>
        <ProdutosPage />
      </BrowserRouter>
    );
    
    // Encontra o botão de novo produto e clica nele
    const newButton = screen.getByText(/Novo Produto/i);
    fireEvent.click(newButton);
    
    // Verifica se o modal ou redirecionamento para o formulário ocorreu
    await waitFor(() => {
      // Dependendo da implementação, pode verificar se o modal abriu ou se houve navegação
      // Esta verificação precisaria ser adaptada conforme a implementação real
      expect(screen.getByText(/Cadastro de Produto/i) || screen.getByText(/Novo Produto/i)).toBeInTheDocument();
    });
  });
});
