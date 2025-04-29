import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AlbumsList from "../albumList";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: function () {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

jest.mock("../customAlertDialog", () => ({
  __esModule: true,
  default: function MockCustomAlertDialog({
    open,
    title,
    description,
    onCancel,
    onConfirm,
  }: {
    open: boolean;
    title: string;
    description: string;
    onCancel: () => void;
    onConfirm: () => void;
  }) {
    return open ? (
      <div data-testid="mock-alert-dialog">
        <h2>{title}</h2>
        <p>{description}</p>
        <button onClick={onCancel} data-testid="cancel-button">
          Cancel
        </button>
        <button onClick={onConfirm} data-testid="confirm-button">
          Confirm
        </button>
      </div>
    ) : null;
  },
}));

describe("AlbumsList Component", () => {
  const mockAlbums = [
    { id: 1, title: "Album 1", userId: 1 },
    { id: 2, title: "Album 2", userId: 1 },
    { id: 3, title: "Album 3", userId: 2 },
  ];

  const mockOnDeleteAlbum = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders albums correctly", () => {
    render(
      <MemoryRouter>
        <AlbumsList
          albums={mockAlbums}
          canManager={false}
          onDeleteAlbum={mockOnDeleteAlbum}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Album 1")).toBeInTheDocument();
    expect(screen.getByText("Album 2")).toBeInTheDocument();
    expect(screen.getByText("Album 3")).toBeInTheDocument();
  });

  test('displays "No albums available" when there are no albums', () => {
    render(
      <MemoryRouter>
        <AlbumsList
          albums={[]}
          canManager={false}
          onDeleteAlbum={mockOnDeleteAlbum}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("No albums available.")).toBeInTheDocument();
  });

  test("navigates to album photos when album is clicked", () => {
    render(
      <MemoryRouter>
        <AlbumsList
          albums={mockAlbums}
          canManager={false}
          onDeleteAlbum={mockOnDeleteAlbum}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Album 1"));
    expect(mockNavigate).toHaveBeenCalledWith("1/photos");
  });

  test("shows edit and delete buttons when canManager is true", () => {
    render(
      <MemoryRouter>
        <AlbumsList
          albums={mockAlbums}
          canManager={true}
          onDeleteAlbum={mockOnDeleteAlbum}
        />
      </MemoryRouter>
    );

    // Verificamos se existem 3 botões de editar e 3 botões de excluir (um para cada álbum)
    const editButtons = screen
      .getAllByRole("button", { name: "" })
      .filter((button) => button.innerHTML.includes("svg"));

    expect(editButtons.length).toBe(6); // 3 edit + 3 delete buttons
  });

  test("does not show edit and delete buttons when canManager is false", () => {
    render(
      <MemoryRouter>
        <AlbumsList
          albums={mockAlbums}
          canManager={false}
          onDeleteAlbum={mockOnDeleteAlbum}
        />
      </MemoryRouter>
    );

    const editButtons = screen.queryAllByRole("button");
    expect(editButtons.length).toBe(0);
  });

  test("navigates to edit page when edit button is clicked", () => {
    render(
      <MemoryRouter>
        <AlbumsList
          albums={mockAlbums}
          canManager={true}
          onDeleteAlbum={mockOnDeleteAlbum}
        />
      </MemoryRouter>
    );

    // Pegamos todos os botões e selecionamos o primeiro botão de edição (índice 0, 2, 4)
    const editButtons = screen.getAllByRole("button", { name: "" });
    fireEvent.click(editButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/albums/edit/1");
  });

  test("shows confirmation dialog when delete button is clicked", () => {
    render(
      <MemoryRouter>
        <AlbumsList
          albums={mockAlbums}
          canManager={true}
          onDeleteAlbum={mockOnDeleteAlbum}
        />
      </MemoryRouter>
    );

    // Pegamos todos os botões e selecionamos o primeiro botão de exclusão (índice 1, 3, 5)
    const deleteButtons = screen.getAllByRole("button", { name: "" });
    fireEvent.click(deleteButtons[1]);

    expect(screen.getByTestId("mock-alert-dialog")).toBeInTheDocument();
    expect(screen.getByText("Delete Album")).toBeInTheDocument();
  });

  test("calls onDeleteAlbum when delete is confirmed", () => {
    render(
      <MemoryRouter>
        <AlbumsList
          albums={mockAlbums}
          canManager={true}
          onDeleteAlbum={mockOnDeleteAlbum}
        />
      </MemoryRouter>
    );

    // Clica no botão de exclusão do primeiro álbum
    const deleteButtons = screen.getAllByRole("button", { name: "" });
    fireEvent.click(deleteButtons[1]);

    // Confirma a exclusão
    fireEvent.click(screen.getByTestId("confirm-button"));

    expect(mockOnDeleteAlbum).toHaveBeenCalledWith(1);
    expect(localStorage.setItem).toHaveBeenCalledWith("deletedAlbums", "[1]");
  });

  test("closes dialog when cancel is clicked", () => {
    render(
      <MemoryRouter>
        <AlbumsList
          albums={mockAlbums}
          canManager={true}
          onDeleteAlbum={mockOnDeleteAlbum}
        />
      </MemoryRouter>
    );

    // Clica no botão de exclusão do primeiro álbum
    const deleteButtons = screen.getAllByRole("button", { name: "" });
    fireEvent.click(deleteButtons[1]);

    // Cancela a exclusão
    fireEvent.click(screen.getByTestId("cancel-button"));

    expect(mockOnDeleteAlbum).not.toHaveBeenCalled();
    expect(screen.queryByTestId("mock-alert-dialog")).not.toBeInTheDocument();
  });

  test("filters out deleted albums from localStorage", () => {
    // Simula álbuns excluídos no localStorage
    jest.spyOn(localStorage, "getItem").mockReturnValue("[2]");

    render(
      <MemoryRouter>
        <AlbumsList
          albums={mockAlbums}
          canManager={false}
          onDeleteAlbum={mockOnDeleteAlbum}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Album 1")).toBeInTheDocument();
    expect(screen.queryByText("Album 2")).not.toBeInTheDocument();
    expect(screen.getByText("Album 3")).toBeInTheDocument();
  });
});
