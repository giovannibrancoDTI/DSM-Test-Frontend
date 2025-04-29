import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddPhotoForm from "../addPhotoForm";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import albumService from "@/services/albumService";
import photoService from "@/services/photoService";
import { configureStore, Store, UnknownAction } from "@reduxjs/toolkit";
import albumReducer from "@/shared/redux/slices/albumSlice";
import photoReducer from "@/shared/redux/slices/photoSlice";

const mockNavigate = jest.fn();

jest.mock("clsx", () => {
  return {
    __esModule: true,
    default: (...args: string[]) => args.filter(Boolean).join(" "),
  };
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ userId: "1" }),
}));

jest.mock("@/services/albumService", () => ({
  __esModule: true,
  default: {
    getAlbumsByUserId: jest.fn(),
    createAlbum: jest.fn(),
  },
}));

jest.mock("@/services/photoService", () => ({
  __esModule: true,
  default: {
    createPhoto: jest.fn(),
  },
}));

jest.mock("@/components/ui/alert", () => ({
  Alert: ({ variant, message }: { variant: string; message: string }) => (
    <div data-testid={`alert-${variant}`}>{message}</div>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    type,
    className,
    onClick,
  }: {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    className?: string;
    onClick?: () => void;
  }) => (
    <button
      type={type}
      className={className}
      onClick={onClick}
      data-testid="button"
    >
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: ({
    id,
    placeholder,
    value,
    onChange,
    onBlur,
    className,
    type,
    accept,
  }: {
    id: string;
    placeholder?: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    className?: string;
    type?: string;
    accept?: string;
  }) => (
    <input
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={className}
      type={type || "text"}
      accept={accept}
      data-testid={id}
    />
  ),
}));

jest.mock("@/components/ui/label", () => ({
  Label: ({
    htmlFor,
    children,
  }: {
    htmlFor: string;
    children: React.ReactNode;
  }) => (
    <label htmlFor={htmlFor} data-testid={`label-${htmlFor}`}>
      {children}
    </label>
  ),
}));

jest.mock("@/components/ui/select", () => ({
  Select: ({
    onValueChange,
    children,
  }: {
    onValueChange: (value: string) => void;
    children: React.ReactNode;
  }) => (
    <div
      data-testid="select"
      onChange={(e) => onValueChange((e.target as HTMLSelectElement).value)}
    >
      {children}
    </div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({
    value,
    children,
  }: {
    value: string;
    children: React.ReactNode;
  }) => (
    <option value={value} data-testid={`select-item-${value}`}>
      {children}
    </option>
  ),
  SelectTrigger: ({
    className,
    children,
  }: {
    className?: string;
    children: React.ReactNode;
  }) => (
    <div className={className} data-testid="select-trigger">
      {children}
    </div>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <span data-testid="select-value">{placeholder}</span>
  ),
}));

global.URL.createObjectURL = jest.fn(() => "mock-url");

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      albums: albumReducer,
      photos: photoReducer,
    },
    preloadedState,
  });
};

describe("AddPhotoForm Component", () => {
  const mockAlbums = [
    { id: 1, title: "Album 1", userId: 1 },
    { id: 2, title: "Album 2", userId: 1 },
  ];

  let store: Store<unknown, UnknownAction, unknown>;

  beforeEach(() => {
    jest.clearAllMocks();

    store = createTestStore({
      albums: {
        albums: [],
      },
      photos: {
        photos: [],
      },
    });

    (albumService.getAlbumsByUserId as jest.Mock).mockResolvedValue(mockAlbums);
    (albumService.createAlbum as jest.Mock).mockResolvedValue({
      id: 3,
      title: "New Album",
      userId: 1,
    });
    (photoService.createPhoto as jest.Mock).mockResolvedValue({
      id: 1,
      albumId: 1,
      title: "Test Photo",
      url: "mock-url",
      thumbnailUrl: "mock-url",
    });
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/1/photos/add"]}>
          <Routes>
            <Route path="/:userId/photos/add" element={<AddPhotoForm />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  test("renders the form correctly", async () => {
    renderComponent();

    expect(screen.getByText("Add New Photo")).toBeInTheDocument();
    expect(screen.getByTestId("title")).toBeInTheDocument();
    expect(screen.getByTestId("select")).toBeInTheDocument();
    expect(screen.getByTestId("new-album")).toBeInTheDocument();
    expect(screen.getByTestId("file")).toBeInTheDocument();
    expect(screen.getByTestId("button")).toBeInTheDocument();
  });

  test("fetches albums on component mount", async () => {
    renderComponent();

    await waitFor(() => {
      expect(albumService.getAlbumsByUserId).toHaveBeenCalledWith(1);
    });
  });

  test("shows validation errors when form is submitted with empty fields", async () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("button"));

    await waitFor(() => {
      expect(screen.getByTestId("alert-error")).toBeInTheDocument();
      expect(
        screen.getByText("Please fill in all required fields.")
      ).toBeInTheDocument();
    });
  });

  test("handles service errors correctly", async () => {
    (albumService.getAlbumsByUserId as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch albums")
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("alert-error")).toBeInTheDocument();
      expect(screen.getByText("Failed to fetch albums")).toBeInTheDocument();
    });
  });

  test("validates title field on blur", async () => {
    renderComponent();

    const titleInput = screen.getByTestId("title");
    fireEvent.blur(titleInput);

    await waitFor(() => {
      expect(screen.getByText("Title is required.")).toBeInTheDocument();
    });
  });

  test("validates file upload on blur", async () => {
    renderComponent();

    const fileInput = screen.getByTestId("file");
    fireEvent.blur(fileInput);

    await waitFor(() => {
      expect(screen.getByText("Photo upload is required.")).toBeInTheDocument();
    });
  });
});
