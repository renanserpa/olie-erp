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
      expect(screen.getByText('Bolsa Personalizada')).toBeInTheDocument();
      expect(screen.getByText('Necessaire Floral')).toBeInTheDocument();
    });
    
    // Verifica se as categorias estão presentes
    expect(screen.getAllByText('Bolsas')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Necessaires')[0]).toBeInTheDocument();
    
    // Verifica se os preços estão formatados corretamente
    expect(screen.getAllByText(/150,00/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/45,00/)[0]).toBeInTheDocument();
  });

  test('filtra produtos por busca', async () => {
    render(
      <BrowserRouter>
        <ProdutosPage />
      </BrowserRouter>
    );
    
    // Aguarda o carregamento dos produtos
    await waitFor(() => {
      expect(screen.getByText('Bolsa Personalizada')).toBeInTheDocument();
    });
    
    // Encontra o campo de busca e digita um termo
    const searchInput = screen.getByPlaceholderText(/Buscar nome, código ou descrição/i);
    fireEvent.change(searchInput, { target: { value: 'Bolsa' } });
    
    // Verifica se apenas o produto correspondente é exibido
    await waitFor(() => {
      expect(screen.getByText('Bolsa Personalizada')).toBeInTheDocument();
      expect(screen.queryByText('Necessaire Floral')).not.toBeInTheDocument();
    });
  });

  test('possui botão para novo produto', () => {
    render(
      <BrowserRouter>
        <ProdutosPage />
      </BrowserRouter>
    );

    const newButton = screen.getByText(/Novo Produto/i);
    expect(newButton).toBeInTheDocument();
    fireEvent.click(newButton);
  });
});
